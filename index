import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

// CAMBIA ESTA CLAVE
const API_KEY = "MI_CLAVE_SECRETA_123";

app.get("/gamepasses/:userId", async (req, res) => {
	if (req.headers["x-api-key"] !== API_KEY) {
		return res.status(403).json({ error: "Forbidden" });
	}

	const userId = req.params.userId;
	const url = `https://games.roblox.com/v1/users/${userId}/game-passes?limit=100&sortOrder=Asc`;

	try {
		const r = await fetch(url);
		const data = await r.json();

		const passes = data.data
			.filter(p => p.price && p.price > 0)
			.map(p => ({
				id: p.id,
				name: p.name,
				price: p.price,
				icon: p.iconImageId
			}));

		res.json(passes);
	} catch {
		res.status(500).json({ error: "Proxy error" });
	}
});

app.listen(PORT, () => {
	console.log("Proxy running");
});
