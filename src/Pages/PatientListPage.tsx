import { useEffect, useState } from "react";
import { Patient } from "fhir/r4";

import { List, ListItem, ListItemText, Button } from "@mui/material";

import PatientService from "../Services/PatientService";

const patienteService = PatientService.getInstance();

export default function PatientListPage() {
  const [patients, setPatients] = useState<Patient[]>([]);

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
      <h1>Patient List</h1>
      <List>
        {patients.map((patient) => (
          <ListItem key={patient.id}>
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
