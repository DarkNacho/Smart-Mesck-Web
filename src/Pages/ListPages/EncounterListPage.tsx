import { useEffect, useState } from "react";
import { Encounter } from "fhir/r4";

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
import styles from "./EncounterListPage.module.css";
import FhirResourceService from "../../Services/FhirService";
import { Add, Search } from "@mui/icons-material";
import EncounterCreateComponent from "../../Components/Encounter/EncounterCreateComponent";
import EncounterUtils from "../../Services/Utils/EncounterUtils";
import HandleResult from "../../Components/HandleResult";

const encounterService = new FhirResourceService<Encounter>("Encounter");

export default function EncounterListPage() {
  const [encounters, setEncounters] = useState<Encounter[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const handleIsOpen = (isOpen: boolean) => {
    setOpenDialog(isOpen);
  };

  const handleNewEncounters = async (direction: "next" | "prev") => {
    HandleResult.handleOperation(
      () => encounterService.getNewResources(direction),
      "Encuentros Obtenidos exitosamente",
      "Obteniendo...",
      setEncounters
    );
  };

  const fetchEncounters = async () => {
    HandleResult.handleOperation(
      () => encounterService.getResources({ _count: 5 }),
      "Encuentros Obtenidos exitosamente",
      "Obteniendo...",
      setEncounters
    );
  };

  const handleSearch = async () => {
    HandleResult.handleOperation(
      () => encounterService.getResources({ _content: searchTerm, _count: 5 }),
      "Encuentros Obtenidos exitosamente",
      "Obteniendo...",
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
          <EncounterCreateComponent
            isOpen={openDialog}
            onOpen={handleIsOpen}
          ></EncounterCreateComponent>
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
          {encounters.map((encounter) => (
            <ListItem
              className={styles.listItem}
              key={encounter.id}
              onClick={() =>
                navigate(
                  `/Patient/${EncounterUtils.getSubjectID(encounter.subject!)}`
                )
              }
            >
              <ListItemText
                primary={`Paciente: ${EncounterUtils.getSubjectDisplayOrID(
                  encounter.subject!
                )}`}
                secondary={`Period: ${EncounterUtils.getFormatPeriod(
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
