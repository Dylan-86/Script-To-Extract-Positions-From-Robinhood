# Script-To-Extract-Positions-From-Robinhood

# Stock Data Extractor (Browser Console CSV Export)

This simple JavaScript utility script lets you extract stock position data from Robinhood Legend (It works only with Legend!) and download it as a CSV file directly from your browser console.

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

1. Open the web page containing your stock data https://robinhood.com/us/en/legend/
2. Zoom out until all the stocks are visible on the left side of the screen. The script needs to read the stocks list, which is usually dynamically populated. If you zoom out, all stocks are visible at once.
3. Open your browser's developer tools (`F12` or right-click → Inspect).
4. Go to the **Console** tab.
5. Paste the script in **code.js** and press **Enter**.
6. A file named `stocks.csv` will be automatically downloaded.

---

