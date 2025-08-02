(function () {
  const rows = [["Symbol", "Side", "Qty", "Fill Price", "Commission", "Closing Time"]];
  const closingTime = "2024-09-17 0:00:00";

  document.querySelectorAll("a.rh-hyperlink").forEach(a => {
    try {
      const cells = a.querySelectorAll("._1bZB-iudENk38jTXhs7BIB");
      const symbol = a.querySelector("._2-4BkMtIykh6hAhu1CkOAi")?.innerText?.trim();
      const qty = cells[2]?.innerText?.trim().replace(",", "");
      const priceRaw = cells[3]?.innerText?.replace(/[^0-9.]/g, "");
      const fillPrice = parseFloat(priceRaw || "0").toFixed(2);

      if (symbol && qty && fillPrice) {
        rows.push([
          symbol,
          "Buy",
          qty,
          fillPrice,
          "0",
          closingTime
        ]);
      }
    } catch (e) {
      console.error("Error parsing a row", e);
    }
  });

  const csv = rows.map(r => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "stocks.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
})();
