/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";

import { TextField, IconButton, InputAdornment, MenuItem } from "@mui/material";
import styles from "./ListPage.module.css";

import { Add, Search } from "@mui/icons-material";
import ListResourceComponent from "../../Components/ListResourceComponent";
import { Encounter, FhirResource } from "fhir/r4";

import FhirResourceService from "../../Services/FhirService";
import EncounterUtils from "../../Services/Utils/EncounterUtils";
import EncounterCreateComponent from "../../Components/Encounter/EncounterCreateComponent";

const fhirService = new FhirResourceService("Encounter");

function getDisplay(resource: FhirResource): string {
  const encounter = resource as Encounter;
  return `Paciente: ${EncounterUtils.getSubjectDisplayOrID(
    encounter.subject!
  )}\nPeriod: ${EncounterUtils.getFormatPeriod(encounter.period!)}`;
}

export default function Encounter2ListPage() {
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("1");
  const [searchParam, setSeachParam] = useState({ _count: 5 });

  const handleIsOpen = (isOpen: boolean) => {
    setOpenDialog(isOpen);
  };

  const handleSearch = async () => {
    let search;
    switch (searchType) {
      case "0":
        search = { identifier: searchTerm };
        break;
      case "1":
        search = { name: searchTerm };
        break;
    }
    search = { ...searchParam, ...search };
    setSeachParam(search);
    return search;
  };

  return (
    <div>
      <div className={styles.content}>
        <div
          className="titleandBtn"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h1>Encuentros</h1>
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
            onOpen={handleIsOpen}
            isOpen={openDialog}
          ></EncounterCreateComponent>
        </div>
        {/* <form
          className={styles.searchContainer}
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
        >
          <TextField
            fullWidth
            label="Buscar un encuentro"
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
            onChange={(event) => setSearchType(event.target.value)}
            sx={{ m: 1, minWidth: 120 }}
          >
            <MenuItem value="0">Rut</MenuItem>
            <MenuItem value="1">Nombre</MenuItem>
          </TextField>
          </form>*/}
        <div>
          <ListResourceComponent
            searchParam={searchParam}
            getDisplay={getDisplay}
            fhirService={fhirService}
          ></ListResourceComponent>
        </div>
      </div>
    </div>
  );
}
