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

async function fetchAllInventory(token, storeId) {
  let allLevels = [];
  let cursor = null;
  do {
    let url = "https://api.loyverse.com/v1.0/inventory?limit=250";
    if (storeId) url += "&store_id=" + storeId;
    if (cursor) url += "&cursor=" + cursor;
    const result = await httpsGet(url, token);
    const levels = result.body.inventory_levels || [];
    allLevels = allLevels.concat(levels);
    cursor = result.body.cursor || null;
  } while (cursor);
  return allLevels;
}

async function fetchAllItems(token) {
  let allItems = [];
  let cursor = null;
  do {
    let url = "https://api.loyverse.com/v1.0/items?limit=250";
    if (cursor) url += "&cursor=" + cursor;
    const result = await httpsGet(url, token);
    const items = result.body.items || [];
    allItems = allItems.concat(items);
    cursor = result.body.cursor || null;
  } while (cursor);
  return allItems;
}

export default async function handler(req, res) {
  const TOKEN = process.env.LOYVERSE_TOKEN;
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");
  if (!TOKEN) return res.status(500).json({ error: "LOYVERSE_TOKEN not set." });

  const path = req.query.path || "items";
  const storeId = req.query.store_id || "";

  try {
    if (path === "inventory") {
      const levels = await fetchAllInventory(TOKEN, storeId);
      return res.status(200).json({ inventory_levels: levels });
    } else if (path === "items") {
      const items = await fetchAllItems(TOKEN);
      return res.status(200).json({ items });
    } else if (path === "stores") {
      const result = await httpsGet("https://api.loyverse.com/v1.0/stores", TOKEN);
      return res.status(result.status).json(result.body);
    } else if (path === "categories") {
      const result = await httpsGet("https://api.loyverse.com/v1.0/categories?limit=250", TOKEN);
      return res.status(result.status).json(result.body);
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
