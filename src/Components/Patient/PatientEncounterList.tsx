import { useEffect, useState } from "react";
import { Encounter } from "fhir/r4";

import {
  List,
  ListItem,
  ListItemText,
  Button,
  IconButton,
} from "@mui/material";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";

import { useNavigate } from "react-router-dom";
import styles from "./PatientEncounterList.module.css";

import { Add, Search } from "@mui/icons-material";

import EncounterCreateComponent from "../Encounter/EncounterCreateComponent";
import dayjs from "dayjs";
import { checkPatientRol } from "../../RolUser";
import FhirResourceService from "../../Services/FhirService";
import EncounterUtils from "../../Services/Utils/EncounterUtils";
import HandleResult from "../HandleResult";

const encounterService = new FhirResourceService("Encounter");

export default function PatientEncounterList({
  patientID,
}: {
  patientID: string;
}) {
  const [encounters, setEncounters] = useState<Encounter[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState(dayjs());

  const navigate = useNavigate();

  const handleIsOpen = (isOpen: boolean) => {
    setOpenDialog(isOpen);
  };

  const handleNewEncounters = async (direction: "next" | "prev") => {
    HandleResult.handleOperation(
      () => encounterService.getNewResources(direction),
      "Encuentros Obtenidos exitosamente",
      "Cargando...",
      setEncounters
    );
  };

  const fetchEncounters = async () => {
    HandleResult.handleOperation(
      () => encounterService.getResources({ _count: 5, subject: patientID }),
      "Encuentros Obtenidos exitosamente",
      "Cargando...",
      setEncounters
    );
  };

  const handleSearch = async () => {
    HandleResult.handleOperation(
      () =>
        encounterService.getResources({
          _count: 5,
          subject: patientID,
          date: searchTerm.toISOString(),
        }),
      "Encuentros Obtenidos exitosamente",
      "Cargando...",
      setEncounters
    );
  };

  useEffect(() => {
    fetchEncounters();
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
          <h1>Lista de Encuentros paciente</h1>
          {!checkPatientRol() && (
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
          )}
          <EncounterCreateComponent
            patientId={patientID}
            isOpen={openDialog}
            onOpen={handleIsOpen}
          ></EncounterCreateComponent>
        </div>
        {/*
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
          */}

        <form
          className={styles.searchContainer}
          onSubmit={(e) => {
            alert(searchTerm);
            e.preventDefault();
            handleSearch();
          }}
        >
          <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                defaultValue={searchTerm}
                onChange={(value) => setSearchTerm(dayjs(value))}
              ></DatePicker>
            </LocalizationProvider>

            <IconButton type="submit" size="large">
              <Search />
            </IconButton>
          </div>
        </form>

        <List className={styles.listContent}>
          {encounters.map((encounter) => (
            <ListItem
              className={styles.listItem}
              key={encounter.id}
              onClick={() => navigate(`Encounter/${encounter.id}`)}
            >
              <ListItemText
                primary={`${EncounterUtils.getPrimaryPractitioner(encounter)}`}
                secondary={`${EncounterUtils.getFormatPeriod(
                  encounter.period!
                )}`}
              />
            </ListItem>
          ))}
        </List>
        <div className={styles.pagesButton}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleNewEncounters("prev")}
            disabled={!encounterService.hasPrevPage}
          >
            Previous Page
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleNewEncounters("next")}
            disabled={!encounterService.hasNextPage}
          >
            Next Page
          </Button>
        </div>
      </div>
    </div>
  );
}
