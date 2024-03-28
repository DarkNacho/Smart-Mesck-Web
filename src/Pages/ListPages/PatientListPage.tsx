import { useEffect, useState } from "react";

import { TextField, IconButton, InputAdornment, MenuItem } from "@mui/material";
import PatientCreateComponent from "../../Components/Patient/PatientCreateComponent";
import styles from "./ListPage.module.css";

import { Add, Search } from "@mui/icons-material";
import ListResourceComponent from "../../Components/ListResourceComponent";
import { FhirResource, Patient } from "fhir/r4";
import PersonUtil from "../../Services/Utils/PersonUtils";
import FhirResourceService from "../../Services/FhirService";
import { loadUserRoleFromLocalStorage, RolUser } from "../../RolUser";

const fhirService = new FhirResourceService("Patient");

function getDisplay(resource: FhirResource): string {
  return `ID: ${resource.id}\nName: ${PersonUtil.parsePersonName(
    resource
  )}\nGender: ${(resource as Patient).gender || "N/A"}`;
}

export default function PatientListPage() {
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("1");
  const [searchParam, setSeachParam] = useState({});
  const [userRole, setUserRole] = useState<RolUser>();

  useEffect(() => {
    const storedUserRole = loadUserRoleFromLocalStorage();

    if (storedUserRole === "Practitioner") {
      setSeachParam({
        "general-practitioner": `${localStorage.getItem("id")}`,
      }); // WARNING: quizás Practitioner/${id}
    }
    if (storedUserRole !== "Patient") setUserRole(storedUserRole);
  }, []);

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
      {userRole && (
        <div className={styles.content}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h1>Lista de Pacientes</h1>
            {userRole !== "Patient" && (
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
                ></PatientCreateComponent>{" "}
              </div>
            )}
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
              onChange={(event) => setSearchType(event.target.value)}
              sx={{ m: 1, minWidth: 120 }}
            >
              <MenuItem value="0">Rut</MenuItem>
              <MenuItem value="1">Nombre</MenuItem>
            </TextField>
          </form>
          <div>
            <ListResourceComponent
              searchParam={searchParam}
              getDisplay={getDisplay}
              fhirService={fhirService}
            ></ListResourceComponent>
          </div>
        </div>
      )}
    </div>
  );
}