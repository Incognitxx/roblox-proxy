import express from "express";
import fetch from "node-fetch";

const app = express();

const API_KEY = process.env.API_KEY;

app.get("/gamepasses/:userId", async (req, res) => {
	try {
		const apiKey = req.headers["x-api-key"];
		if (apiKey !== API_KEY) {
			return res.status(403).json({ error: "Forbidden" });
		}

		const userId = Number(req.params.userId);
		if (!Number.isInteger(userId)) {
			return res.status(400).json({ error: "Invalid userId" });
		}

		const universeRes = await fetch(
			`https://games.roblox.com/v2/users/${userId}/games?accessFilter=Public&limit=50`
		);

		if (!universeRes.ok) {
			throw new Error("Failed to fetch universes");
		}

		const universes = await universeRes.json();
		const universeId = universes.data?.[0]?.id;

		if (!universeId) {
			return res.json([]);
		}

		const passesRes = await fetch(
			`https://games.roblox.com/v1/games/${universeId}/game-passes?limit=100`
		);

		if (!passesRes.ok) {
			throw new Error("Failed to fetch gamepasses");
		}

		const passes = await passesRes.json();

		const result = passes.data.map(p => ({
			id: p.id,
			price: p.price ?? 0,
			icon: p.iconImageAssetId ?? 0
		}));

		res.json(result);

	} catch (err) {
		console.error("PROXY ERROR:", err);
		res.status(500).json({
			error: "Internal Server Error",
			detail: err.message
		});
	}
});

app.listen(process.env.PORT || 3000, () => {
	console.log("Proxy running");
});
