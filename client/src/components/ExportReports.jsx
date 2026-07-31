import api from "../api/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

function ExportReports() {
  const exportOrdersExcel = async () => {
    try {
      const response = await api.get("/reports/orders/excel", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", "Orders_Report.xlsx");

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

      toast.success("Orders Excel downloaded successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to download Orders Excel");
    }
  };

  return (
    <div className="card shadow mt-4">
      <div className="card-body">
        <h4 className="mb-3">Export Reports</h4>

        <button
          className="btn btn-success"
          onClick={exportOrdersExcel}
        >
          <FontAwesomeIcon icon={faFileExcel} className="me-2" />
          Export Orders Excel
        </button>
      </div>
    </div>
  );
}

export default ExportReports;