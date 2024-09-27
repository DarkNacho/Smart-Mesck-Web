import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import HandleResult from "../HandleResult";

export default function PatientReportComponent({
  patientId,
  encounterId,
}: {
  patientId: string;
  encounterId?: string;
}) {
  const [open, setOpen] = useState(false);
  const [reportOptions, setReportOptions] = useState({
    obs: false,
    sensor: false,
    med: false,
    cond: false,
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setReportOptions((prev) => ({ ...prev, [name]: checked }));
  };

  const downloadReport = async (): Promise<Result<any>> => {
    // Convert boolean values to strings
    const stringifiedOptions = Object.entries(reportOptions).reduce(
      (acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      },
      {} as Record<string, string>
    );
    if (encounterId) stringifiedOptions.encounter_id = encounterId;

    const queryParams = new URLSearchParams(stringifiedOptions).toString();
    const downloadUrl = `${
      import.meta.env.VITE_SERVER_URL
    }/report/${patientId}?${queryParams}`;

    console.log("Download URL:", downloadUrl);
    try {
      const response = await fetch(downloadUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`, // Replace yourJWTTokenHere with the actual token
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
        return { success: false, error: "Error generating report" };
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      // Obtener el nombre del archivo desde el encabezado Content-Disposition
      const contentDisposition = response.headers.get("Content-Disposition");
      let fileName = "downloaded_file.pdf"; // Nombre por defecto
      console.log("Content-Disposition:", contentDisposition);
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(
          /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
        );
        if (fileNameMatch && fileNameMatch[1]) {
          fileName = fileNameMatch[1].replace(/['"]/g, "");
        }
      }

      const link = document.createElement("a");
      link.href = blobUrl;
      //const currentDate = new Date().toISOString().split("T")[0];
      //link.setAttribute("download", `Report_${patientId}_${currentDate}.pdf`);
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      //link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
      return { success: false, error: "Error downloading report" };
    }

    return { success: true, data: null };
  };

  const handleDownload = async () => {
    const response = await HandleResult.handleOperation(
      () => downloadReport(),
      "Reporte generado con éxito",
      "Generando reporte..."
    );

    if (response.success) handleClose();
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Descargar Reporte
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Seleccione las opciones para el informe</DialogTitle>
        <DialogContent>
          <FormControlLabel
            control={
              <Checkbox
                checked={reportOptions.obs}
                onChange={handleCheckboxChange}
                name="obs"
              />
            }
            label="Observaciones"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={reportOptions.sensor}
                onChange={handleCheckboxChange}
                name="sensor"
              />
            }
            label="Sensor"
          />
          {!encounterId && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={reportOptions.med}
                  onChange={handleCheckboxChange}
                  name="med"
                />
              }
              label="Medicación"
            />
          )}
          <FormControlLabel
            control={
              <Checkbox
                checked={reportOptions.cond}
                onChange={handleCheckboxChange}
                name="cond"
              />
            }
            label="Condición"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleDownload}>Descargar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
