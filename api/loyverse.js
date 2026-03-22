const https = require("https");

function httpsGet(url, token) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { Authorization: "Bearer " + token } }, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch (e) { reject(new Error("Invalid JSON")); }
      });
    }).on("error", reject);
  });
}

export default async function handler(req, res) {
  const TOKEN = process.env.LOYVERSE_TOKEN;

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");

  if (!TOKEN) {
    return res.status(500).json({ error: "LOYVERSE_TOKEN not set." });
  }

  const path = req.query.path || "items";
  const storeId = req.query.store_id || "";

  let url = "";
  if (path === "inventory") {
    url = `https://api.loyverse.com/v1.0/inventory${storeId ? "?store_id=" + storeId : ""}`;
  } else if (path === "stores") {
    url = "https://api.loyverse.com/v1.0/stores";
  } else if (path === "categories") {
    url = "https://api.loyverse.com/v1.0/categories?limit=250";
  } else {
    url = "https://api.loyverse.com/v1.0/items?limit=250";
  }

  try {
    const result = await httpsGet(url, TOKEN);
    return res.status(result.status).json(result.body);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
