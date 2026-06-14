# 💄 Monika Makeovers — Quotation Builder

A beautiful, print-ready quotation builder for **Monika Makeovers** makeup studio.  
Built with pure HTML, CSS, and vanilla JavaScript — no frameworks, no dependencies, works offline.

---

## ✨ Features

- Add multiple **dates**, each with multiple **events** (Mehendi, Sangeet, Wedding, etc.)
- Per-event **package checkboxes**: Bridal, HD Guest, Basic Guest, Special Price, Salon Package, Per Artist Rate
- **Custom pricing** per client — override any default rate
- **Quantity / guest count** fields where applicable
- **Discount** field per package
- Auto-calculated **subtotals, event totals & grand total**
- Branded **PDF receipt** with logo, colours, and contact details — just click Print

---

## 📁 File Structure

```
monika-makeovers-quotation/
├── index.html   — Main page & receipt template
├── style.css    — All screen + print styles
├── app.js       — State management, rendering, PDF logic
├── data.js      — Package definitions & pricing defaults
├── logo.png     — Monika Makeovers logo (circular)
└── README.md    — This file
```

---

## 🚀 Getting Started

### Option 1 — Open locally
Just double-click `index.html` — it works in any modern browser with no server needed.

### Option 2 — GitHub Pages
1. Push this folder to a GitHub repository
2. Go to **Settings → Pages**
3. Set source to **main branch / root**
4. Your quotation builder will be live at `https://yourusername.github.io/repo-name/`

---

## 🖨 Saving as PDF

1. Fill in client details and add events
2. Click **✦ Generate Quotation**
3. Click **Save as PDF / Print**
4. In the browser print dialog:
   - Set destination → **Save as PDF**
   - Paper size → **A4**
   - Margins → **Default**
   - Enable **Background graphics** (to preserve pink/teal colours)
5. Click **Save**

> **Tip:** In Chrome, tick "Background graphics" under More settings for full colour output.

---

## ✏️ Customising

### Change prices / services
Edit **`data.js`** — each package has a `fields` array with default prices (`d:`).

### Change contact info
Edit the `CONTACT` object at the bottom of **`data.js`**:
```js
const CONTACT = {
  phone1: "+91-8107654303",
  phone2: "+91-9886008604",
  tagline: "Thank you for choosing us ✦",
};
```

### Change colours
Edit the CSS variables at the top of **`style.css`**:
```css
:root {
  --rose:       #e8a0b0;
  --teal:       #3a7d8c;
  --teal-dark:  #2b6070;
}
```

### Replace the logo
Replace **`logo.png`** with your own image (ideally square / circular, at least 150×150 px).

---

## 🛠 Tech Stack

| Layer      | Technology            |
|------------|-----------------------|
| Markup     | HTML5                 |
| Styles     | CSS3 (custom properties, grid, print media) |
| Logic      | Vanilla JavaScript (ES6+) |
| Fonts      | Google Fonts — Playfair Display + Cormorant Garamond |
| No build   | ✅ Works without npm, webpack, or any build tool |

---

## 📄 License

For personal / business use by Monika Makeovers. Not for redistribution.
