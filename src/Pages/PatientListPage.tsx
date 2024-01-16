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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PatientCreateComponent from "../Components/Patient/PatientCreateComponent";
import styles from "./PatientListPage.module.css";

import PatientService from "../Services/PatientService";
import { Add, Search } from "@mui/icons-material";
import toast from "react-hot-toast";

const patientService = new PatientService();


export default function PatientListPage() {

  const parsePatientName = (patient: Patient) => {
    let name = "";

    // Intenta obtener el nombre usando patient.name[0].text
    if (patient.name && patient.name[0] && patient.name[0].text) {
      name = patient.name[0].text;
    } else if (patient.name && patient.name[0]) {
      // Intenta obtener el nombre usando patient.name[0].given y patient.name[0].family
      const givenNames = patient.name[0].given
        ? patient.name[0].given.join(" ")
        : "";
      const familyName = patient.name[0].family ? patient.name[0].family : "";
      name = `${givenNames} ${familyName}`;
    } else if (
      patient.name &&
      patient.name[0] &&
      patient.name[0].use === "official"
    ) {
      // Intenta obtener el nombre usando patient.name[0].prefix, patient.name[0].given y patient.name[0].family
      const prefix = patient.name[0].prefix
        ? patient.name[0].prefix.join(" ")
        : "";
      const givenNames = patient.name[0].given
        ? patient.name[0].given.join(" ")
        : "";
      const familyName = patient.name[0].family ? patient.name[0].family : "";
      name = `${prefix} ${givenNames} ${familyName}`;
    }

    return name;
  }

  const [patients, setPatients] = useState<Patient[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const handleIsOpen = (isOpen: boolean) => {
    setOpenDialog(isOpen);
  };

  const handleOperation = async (
    operation: () => Promise<Result<Patient[]>>,
    successMessage: string
  ) => {
    const response = await toast.promise(operation(), {
      loading: "Obteniendo Pacientes",
      success: (result) => {
        if (result.success) {
          return successMessage;
        } else {
          throw Error(result.error);
        }
      },
      error: (result) => result.toString(),
    });
  
    if (response.success) {
      setPatients(response.data);
      console.log(response.data);
    } else {
      console.error(response.error);
    }
  };

  const handleNewPatients = async (direction: "next" | "prev") => {
    handleOperation(
      () => patientService.getNewResources(direction),
      "Pacientes Obtenidos exitosamente"
    );
  };
  
  const fetchPatients = async () => {
    handleOperation(
      () => patientService.getResources(7),
      "Pacientes Obtenidos exitosamente"
    );
  };
  
  const handleSearch = async () => {
    handleOperation(
      () => patientService.getResources(7, searchTerm),
      "Pacientes buscados obtenidos exitosamente"
    );
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <div>
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
                secondary={`Name: ${parsePatientName(
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
            onClick={() => handleNewPatients("prev")}
            disabled={!patientService.hasPrevPage}
          >
            Previous Page
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleNewPatients("next")}
            disabled={!patientService.hasNextPage}
          >
            Next Page
          </Button>
        </div>
      </div>
    </div>
  );
}
