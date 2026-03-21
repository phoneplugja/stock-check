exports.handler = async (event) => {
  const TOKEN = process.env.LOYVERSE_TOKEN;

  if (!TOKEN) {
    return { statusCode: 500, body: JSON.stringify({ error: "LOYVERSE_TOKEN not set in environment variables." }) };
  }

  const headers = { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" };

  const path = event.queryStringParameters?.path || "items";
  const storeId = event.queryStringParameters?.store_id || "";

  let url = "";
  if (path === "inventory") {
    url = `https://api.loyverse.com/v1.0/inventory${storeId ? "?store_id=" + storeId : ""}`;
  } else if (path === "stores") {
    url = "https://api.loyverse.com/v1.0/stores";
  } else {
    url = "https://api.loyverse.com/v1.0/items?limit=250";
  }

  try {
    const res = await fetch(url, {
      headers: { Authorization: "Bearer " + TOKEN }
    });
    const data = await res.json();
    return { statusCode: res.status, headers, body: JSON.stringify(data) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
