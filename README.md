# Script-To-Extract-Positions-From-Robinhood

# Stock Data Extractor (Browser Console CSV Export)

This simple JavaScript utility script lets you extract stock position data from a web page (with a specific DOM structure) and download it as a CSV file directly from your browser console.

---

## 📌 Features

- Extracts:
  - Ticker Symbol (e.g., `AAPL`, `GOOG`)
  - Side (`Buy`)
  - Quantity
  - Fill Price (formatted to 2 decimals)
  - Commission (`0`)
  - Closing Time (fixed to `2024-09-17 0:00:00`)
- Exports data as a `.csv` file
- No external dependencies
- No browser extensions required

---

## ⚙️ How to Use

1. Open the web page containing your stock data.
2. Open your browser's developer tools (`F12` or right-click → Inspect).
3. Go to the **Console** tab.
4. Paste the script in **code.js** and press **Enter**.
5. A file named `stocks.csv` will be automatically downloaded.

---

