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

import EncounterService from "../../Services/EncounterService";
import { Add, Search } from "@mui/icons-material";
import toast from "react-hot-toast";
import EncounterCreateComponent from "../Encounter/EncounterCreateComponent";
import dayjs from "dayjs";

const encounterService = new EncounterService();

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

  const handleOperation = async (
    operation: () => Promise<Result<Encounter[]>>,
    successMessage: string
  ) => {
    const response = await toast.promise(operation(), {
      loading: "Obteniendo Encuentros",
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
      setEncounters(response.data);
      console.log(response.data);
    } else {
      console.error(response.error);
    }
  };

  const handleNewEncounters = async (direction: "next" | "prev") => {
    handleOperation(
      () => encounterService.getNewResources(direction),
      "Encuentros Obtenidos exitosamente"
    );
  };

  const fetchEncounters = async () => {
    handleOperation(
      () => encounterService.getResources({ _count: 5, subject: patientID }),
      "Encuentros Obtenidos exitosamente"
    );
  };

  const handleSearch = async () => {
    handleOperation(
      () =>
        encounterService.getResources({
          _count: 5,
          subject: patientID,
          date: searchTerm.toISOString(),
        }),
      "Encuentros buscados obtenidos exitosamente"
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
                primary={`${encounterService.getPrimaryPractitioner(
                  encounter
                )}`}
                secondary={`${encounterService.getFormatPeriod(
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
