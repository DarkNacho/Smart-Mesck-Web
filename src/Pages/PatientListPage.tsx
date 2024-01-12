import { useEffect, useState } from "react";
import { Patient } from "fhir/r4";

import { List, ListItem, ListItemText, Button } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import PatientCreateComponent from "../Components/Patient/PatientCreateComponent";
import styles from "./PatientListPage.module.css";


import PatientService from "../Services/PatientService";

const patienteService = PatientService.getInstance();

export default function PatientListPage() {
  const [patients, setPatients] = useState<Patient[]>([]);

  const navigate = useNavigate();

  const handleNextPage = async () => {
    patienteService.getNextPage().then((res) => setPatients(res));
  };
  const handlePrevPage = async () => {
    patienteService.getPrevPage().then((res) => setPatients(res));
  };
  const fetchPatients = async () => {
    patienteService.getPatients(8).then((res) => setPatients(res));
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    console.log("Pacientes: ", patients);
  }, [patients]);

  return (
    <div>
      <div style={{ display: 'flex', gap: "10px", alignItems: "center" }}>
      <h1>Lista de Pacientes</h1>
      <PatientCreateComponent></PatientCreateComponent>
      </div>
      <List>
        {patients.map((patient) => (
          <ListItem className={styles.listItem} key={patient.id} onClick={() => navigate(`/Patient/${patient.id}`)}>
            <ListItemText
              primary={`ID: ${patient.id}`}
              secondary={`Name: ${patienteService.parsePatientName(
                patient
              )}, Gender: ${patient.gender || "N/A"}`}
            />
          </ListItem>
        ))}
      </List>
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
  );
}
