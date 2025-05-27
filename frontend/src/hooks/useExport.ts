export function useExport() {
  const exportCSV = (cols: string[], data: any[]) => {
    const csvContent =
      cols.join(",") +
      "\n" +
      data.map((row) => cols.map((col) => row[col]).join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDF = async (cols: string[], data: any[]) => {
    const jsPDF = (await import("jspdf")).default;
    const autoTable = (await import("jspdf-autotable")).default;

    const doc = new jsPDF();
    const tableData = data.map((row) => cols.map((col) => row[col]));

    autoTable(doc, {
      head: [cols],
      body: tableData,
    });

    doc.save("export.pdf");
  };

  return { exportCSV, exportPDF };
}
