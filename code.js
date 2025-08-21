(async function () {
  const HEADER = ["Symbol", "Side", "Qty", "Fill Price", "Commission", "Closing Time"];
  const closingTime = "2024-09-17 0:00:00";

  // 1) Find one row and then its nearest vertically scrollable ancestor (the table scroller)
  const firstRow = document.querySelector('[role="row"]');
  if (!firstRow) {
    console.error("No rows found. Open the positions table first.");
    return;
  }

  function getScrollableAncestor(el) {
    let node = el.parentElement;
    while (node) {
      const style = getComputedStyle(node);
      const canScrollY =
        (style.overflowY === "auto" || style.overflowY === "scroll") &&
        node.scrollHeight > node.clientHeight;
      if (canScrollY) return node;
      node = node.parentElement;
    }
    // Fallback to window if nothing obvious (shouldn’t happen here, but just in case)
    return document.scrollingElement || document.body;
  }

  const scroller = getScrollableAncestor(firstRow);
  const isWindow = (scroller === document.scrollingElement || scroller === document.body);

  // 2) Auto-scroll until stable (no scroll movement AND no new rows)
  async function autoScrollUntilStable(maxIdleCycles = 6, stepPx = 800, delayMs = 300) {
    const seen = new Set();
    let idle = 0;
    let lastScrollTop = isWindow ? window.scrollY : scroller.scrollTop;

    function countRows() {
      // Only rows inside the same scroller subtree
      return (isWindow ? document : scroller).querySelectorAll('[role="row"]').length;
    }

    let lastCount = countRows();

    while (idle < maxIdleCycles) {
      // Scroll down
      if (isWindow) {
        window.scrollBy(0, stepPx);
      } else {
        scroller.scrollBy(0, stepPx);
      }

      await new Promise(r => setTimeout(r, delayMs));

      // Track scroll change
      const nowTop = isWindow ? window.scrollY : scroller.scrollTop;
      const scrolled = nowTop !== lastScrollTop;
      lastScrollTop = nowTop;

      // Track row-count change
      const newCount = countRows();
      const grew = newCount > lastCount;
      lastCount = newCount;

      if (!scrolled && !grew) {
        idle++;
      } else {
        idle = 0;
      }

      // Stop if at bottom
      const atBottom = isWindow
        ? (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2)
        : (Math.ceil(scroller.scrollTop + scroller.clientHeight) >= scroller.scrollHeight - 2);
      if (atBottom && !grew) {
        idle = maxIdleCycles; // force exit
      }
    }
  }

  await autoScrollUntilStable();

  // 3) Extract rows from the same subtree as the scroller
  const root = isWindow ? document : scroller;
  const rows = [HEADER];

  root.querySelectorAll('[role="row"]').forEach(row => {
    try {
      const getCellText = (colId) =>
        row.querySelector(`[data-cell-column-id="${colId}"]`)?.innerText?.trim() || "";

      const symbol = getCellText("POSITION_COLUMN_NAME_INSTRUMENT") || "";
      const qtyTxt = getCellText("POSITION_COLUMN_NAME_QUANTITY");
      const qty = qtyTxt.replace(/[^\d]/g, "");

      // Prefer LAST_PRICE, fallback to MARK_PRICE
      let priceTxt = getCellText("POSITION_COLUMN_NAME_LAST_PRICE");
      if (!priceTxt) priceTxt = getCellText("POSITION_COLUMN_NAME_MARK_PRICE");
      const fillPrice = priceTxt ? parseFloat(priceTxt.replace(/[^0-9.]/g, "")).toFixed(2) : "";

      if (symbol && qty && fillPrice) {
        rows.push([symbol, "Buy", qty, fillPrice, "0", closingTime]);
      }
    } catch (e) {
      console.error("Error parsing a row", e);
    }
  });

  // 4) Download CSV
  const csv = rows.map(r => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "stocks.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Optional: scroll back to top of the table
  if (!isWindow) scroller.scrollTo(0, 0);
})();
