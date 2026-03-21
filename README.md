# Loyverse Stock Checker

A free, shareable webpage that shows live stock levels pulled directly from your Loyverse account.

---

## Deploy in 5 Steps (Free)

### Step 1 — Get your Loyverse API Token
1. Log into your **Loyverse Back Office** at https://r.loyverse.com
2. Go to **Settings → Access Tokens**
3. Click **+ Add access token**, give it a name (e.g. "Stock Checker"), click **Save**
4. Copy the token — you'll need it in Step 4

### Step 2 — Upload to GitHub
1. Go to https://github.com and sign in (or create a free account)
2. Click **+ New repository**, name it `stock-checker`, set it to **Public**, click **Create**
3. Click **uploading an existing file**, drag in ALL 3 files/folders from this package:
   - `index.html`
   - `netlify.toml`
   - `netlify/functions/loyverse.js`
4. Click **Commit changes**

### Step 3 — Deploy on Netlify (Free)
1. Go to https://netlify.com and sign in with your GitHub account
2. Click **Add new site → Import an existing project**
3. Choose **GitHub**, select your `stock-checker` repository
4. Click **Deploy site** — Netlify builds it automatically

### Step 4 — Add your Loyverse Token (Secret)
1. In Netlify, go to **Site configuration → Environment variables**
2. Click **Add a variable**
3. Set Key: `LOYVERSE_TOKEN`  
   Set Value: *(paste your token from Step 1)*
4. Click **Save**, then go to **Deploys → Trigger deploy**

### Step 5 — Share the link!
Netlify gives you a free URL like `https://your-site-name.netlify.app`  
Share this with customers — it auto-refreshes every 5 minutes and always shows live Loyverse stock.

---

## Customise Your Store Name
The page auto-detects your store name from Loyverse.  
To change the page title, edit line 5 of `index.html`:
```html
<title>Stock Checker</title>
```

## Custom Domain (Optional, Free)
In Netlify → **Domain management → Add a domain** — you can connect your own domain for free.

---

## How It Works
- Your Loyverse token is kept **secret** on Netlify's servers — never exposed to customers
- A serverless function fetches live stock from Loyverse on each page load
- The page auto-refreshes every 5 minutes
- Items show as **In Stock**, **Low Stock** (≤5 units), or **Out of Stock**
- Variants (sizes, colours) are shown individually per item
