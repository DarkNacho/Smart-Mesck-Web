import { useState } from "react";

import { TextField, IconButton, InputAdornment, MenuItem } from "@mui/material";
import PatientCreateComponent from "../../Components/Patient/PatientCreateComponent";
import styles from "./ListPage.module.css";

import { Add, Search } from "@mui/icons-material";
import ListResourceComponent from "../../Components/ListResourceComponent";
import { Patient } from "fhir/r4";
import PersonUtil from "../../Services/Utils/PersonUtils";
import FhirResourceService from "../../Services/FhirService";
import { loadUserRoleFromLocalStorage } from "../../RolUser";
import { SearchParams } from "fhir-kit-client";
import PractitionerReferComponent from "../../Components/Practitioner/PractitionerReferComponent";

const fhirService = new FhirResourceService<Patient>("Patient");

function getDisplay(resource: Patient): string {
  return `  ${PersonUtil.getFirstIdentifierOrId(resource)}
  Nombre: ${PersonUtil.getPersonNameAsString(resource)}
  Género: ${PersonUtil.getGender(resource)}
  Edad: ${PersonUtil.calcularEdad(resource.birthDate!)}
  Teléfono: ${PersonUtil.getContactPointFirstOrDefaultAsString(
    resource,
    "phone"
  ).replace("/-/g", "")}`;
}

let selectedPatient = {} as Patient;

export default function PatientListPage() {
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("1");
  const [openRefer, setOpenRefer] = useState(false);

  const userRole = loadUserRoleFromLocalStorage();

  const [searchParams, setSearchParams] = useState<SearchParams>(
    userRole === "Practitioner"
      ? { "general-practitioner": `${localStorage.getItem("id")}` }
      : {}
  );

  //const [userRole, setUserRole] = useState<RolUser>();
  const handleIsOpen = (isOpen: boolean) => {
    setOpenDialog(isOpen);
  };

  const handleOpenRefer = (isOpen: boolean) => {
    setOpenRefer(isOpen);
  };

  const handleRefer = (resource: Patient) => {
    selectedPatient = resource;
    handleOpenRefer(true);
  };

  const handleSearch = () => {
    let search: SearchParams = {};
    switch (searchType) {
      case "0":
        search = { identifier: searchTerm };
        break;
      case "1":
        search = { name: searchTerm };
        break;
    }

    //! WARNING: quizás Practitioner/${id}
    if (userRole === "Practitioner") {
      setSearchParams({
        "general-practitioner": `${localStorage.getItem("id")}`,
        ...search,
      });
    } else {
      setSearchParams(search);
    }
  };

  if (userRole === "Patient") return <h1>SIN PERMISO</h1>;

  if (!userRole) return <h1>Loading...</h1>; //!Por el momento sólo por si acaso
  return (
    <div>
      <PractitionerReferComponent
        isOpen={openRefer}
        onOpen={handleOpenRefer}
        patient={selectedPatient}
      />
      <div className={styles.content}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h1>Lista de Pacientes</h1>
          <div>
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
            label="Modo de Búsqueda"
            onChange={(event) => setSearchType(event.target.value)}
            sx={{ m: 1, minWidth: 120 }}
          >
            <MenuItem value="0">Rut</MenuItem>
            <MenuItem value="1">Nombre</MenuItem>
          </TextField>
        </form>
        <div>
          <ListResourceComponent<Patient>
            searchParam={searchParams}
            getDisplay={getDisplay}
            fhirService={fhirService}
            onClick={(resource) => console.log(resource)}
            onDoubleClick={(resource) => handleRefer(resource)}
          ></ListResourceComponent>
        </div>
      </div>
    </div>
  );
}
