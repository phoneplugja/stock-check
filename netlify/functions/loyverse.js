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

exports.handler = async (event) => {
  const TOKEN = process.env.LOYVERSE_TOKEN;
  const headers = { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" };

  if (!TOKEN) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: "LOYVERSE_TOKEN not set." }) };
  }

  const path = event.queryStringParameters?.path || "items";
  const storeId = event.queryStringParameters?.store_id || "";

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
    return { statusCode: result.status, headers, body: JSON.stringify(result.body) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
