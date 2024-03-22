import { useEffect, useState } from "react";
import { FhirResource, Patient } from "fhir/r4";

import {
  List,
  ListItem,
  ListItemText,
  Button,
  TextField,
  IconButton,
  InputAdornment,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PatientCreateComponent from "../Components/Patient/PatientCreateComponent";
import styles from "./PatientListPage.module.css";

import { Add, Search } from "@mui/icons-material";
import toast from "react-hot-toast";
import FhirResourceService from "../Services/FhirService";
import PersonUtil from "../Utils/PersonUtil";

const fhirService = new FhirResourceService('Patient');

export default function PatientListPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState('1');


  const navigate = useNavigate();

  const handleIsOpen = (isOpen: boolean) => {
    setOpenDialog(isOpen);
  };

  const handleOperation = async (
    operation: () => Promise<Result<FhirResource[]>>,
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
      setPatients(response.data as Patient[]);
      console.log(response.data);
    } else {
      console.error(response.error);
    }
  };

  const handleNewPatients = async (direction: "next" | "prev") => {
    handleOperation(
      () => fhirService.getNewResources(direction),
      "Pacientes Obtenidos exitosamente"
    );
  };

  const fetchPatients = async () => {
    handleOperation(
      () => fhirService.getResources({ _count: 5 }),
      "Pacientes Obtenidos exitosamente"
    );
  };

  const handleSearch = async () => {
    let searchParams;
    switch (searchType) {
      case '0':
        searchParams = { identifier: searchTerm };
        break;
      case '1':
        searchParams = { name: searchTerm };
        break;
    }
    searchParams = { ...searchParams, _count: 5 };
    handleOperation(
      () => fhirService.getResources(searchParams),
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
          <TextField
            select
            value={searchType}
            variant="standard"
            label="Modo de Busqueda"
            onChange={event => setSearchType(event.target.value)}
            sx={{ m: 1, minWidth: 120 }}
          >
            <MenuItem value='0'>Rut</MenuItem>
            <MenuItem value='1'>Nombre</MenuItem>
          </TextField>
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
                secondary={`Name: ${PersonUtil.parsePersonName(
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
            disabled={!fhirService.hasPrevPage}
          >
            Previous Page
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleNewPatients("next")}
            disabled={!fhirService.hasNextPage}
          >
            Next Page
          </Button>
        </div>
      </div>
    </div>
  );
}
