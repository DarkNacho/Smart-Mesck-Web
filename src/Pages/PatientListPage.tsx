import { useEffect, useState } from "react";
import { Patient } from "fhir/r4";

import {
  List,
  ListItem,
  ListItemText,
  Button,
  TextField,
  IconButton,
  InputAdornment,
  Alert,
  Snackbar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PatientCreateComponent from "../Components/Patient/PatientCreateComponent";
import styles from "./PatientListPage.module.css";

import PatientService from "../Services/PatientService";
import { Add, Search } from "@mui/icons-material";

const patienteService = PatientService.getInstance();

type AlertType = "success" | "info" | "warning" | "error";

export default function PatientListPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<AlertType>("success");

  const navigate = useNavigate();

  const handleIsOpen = (isOpen: boolean) => {
    setOpenDialog(isOpen);
  };

  const handleApiResponse = (
    res: Patient[],
    successMessage: string,
    infoMessage: string
  ) => {
    setPatients(res);
    console.log("fetched patients: ", res);

    if (res.length > 0) showAlert(successMessage, "success");
    else showAlert(infoMessage, "info");
  };

  const handleApiError = (error: any, errorMessage: string) => {
    console.error("Error fetching patients:", error);
    showAlert(errorMessage, "error");
  };

  const handleNextPage = async () => {
    patienteService
      .getNextPage()
      .then((res) =>
        handleApiResponse(
          res,
          "Pacientes cargados exitosamente",
          "No se encontraron pacientes"
        )
      )
      .catch((error) => handleApiError(error, "Error al cargar los pacientes"));
  };
  const handlePrevPage = async () => {
    patienteService
      .getPrevPage()
      .then((res) =>
        handleApiResponse(
          res,
          "Pacientes cargados exitosamente",
          "No se encontraron pacientes"
        )
      )
      .catch((error) => handleApiError(error, "Error al cargar los pacientes"));
  };
  const fetchPatients = async () => {
    patienteService
      .getPatients(7)
      .then((res) =>
        handleApiResponse(
          res,
          "Pacientes cargados exitosamente",
          "No se encontraron pacientes"
        )
      )
      .catch((error) => handleApiError(error, "Error al cargar los pacientes"));
  };

  const handleSearch = () => {
    patienteService
      .getPatients(7, searchTerm)
      .then((res) =>
        handleApiResponse(
          res,
          "Resultado de búsqueda de pacientes exitosa",
          "No se encontraron pacientes en la búsqueda, intente con otros parámetros"
        )
      )
      .catch((error) => handleApiError(error, "Error al cargar los pacientes"));
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {}, [patients]);

  const showAlert = (message: string, severity: AlertType) => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  return (
    <div>
      {alertOpen && (
        <Snackbar
          open={alertOpen}
          autoHideDuration={6000}
          onClose={() => setAlertOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={() => setAlertOpen(false)}
            variant="filled"
            severity={alertSeverity}
          >
            {alertMessage}
          </Alert>
        </Snackbar>
      )}

      <div className={styles.content}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h1>Lista de Pacientes</h1>
          <IconButton
            onClick={() => setOpenDialog(true)}
            color="primary"
            aria-label="add"
            sx={{
              marginLeft: "auto",
              backgroundColor: "white",
              "&:hover": { backgroundColor: "#1b2455" },
            }}
          >
            <Add />
          </IconButton>
          <PatientCreateComponent
            isOpen={openDialog}
            onOpen={handleIsOpen}
          ></PatientCreateComponent>
        </div>
        <form
          className={styles.searchContainer}
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
        >
          <TextField
            style={{ width: "100%" }}
            label="Buscar un paciente"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton type="submit">
                    <Search />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </form>
        <List className={styles.listContent}>
          {patients.map((patient) => (
            <ListItem
              className={styles.listItem}
              key={patient.id}
              onClick={() => navigate(`/Patient/${patient.id}`)}
            >
              <ListItemText
                primary={`ID: ${patient.id}`}
                secondary={`Name: ${patienteService.parsePatientName(
                  patient
                )}, Gender: ${patient.gender || "N/A"}`}
              />
            </ListItem>
          ))}
        </List>
        <div className={styles.pagesButton}>
          <Button
            variant="contained"
            color="primary"
            onClick={handlePrevPage}
            disabled={!patienteService.hasPrevPage}
          >
            Previous Page
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleNextPage}
            disabled={!patienteService.hasNextPage}
          >
            Next Page
          </Button>
        </div>
      </div>
    </div>
  );
}
