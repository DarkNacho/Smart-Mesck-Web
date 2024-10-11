import { useState } from "react";

import { IconButton } from "@mui/material";
import styles from "./ListPage.module.css";

import { Add, Search } from "@mui/icons-material";
import ListResourceComponent from "../../Components/ListResourceComponent";
import { Encounter } from "fhir/r4";
import FhirResourceService from "../../Services/FhirService";
import {
  isAdminOrPractitioner,
  loadUserRoleFromLocalStorage,
  RolUser,
} from "../../RolUser";
import { SearchParams } from "fhir-kit-client";
import EncounterUtils from "../../Services/Utils/EncounterUtils";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import "dayjs/locale/es";

import EncounterCreateComponent from "../../Components/Encounter/EncounterCreateComponent";

const fhirService = new FhirResourceService<Encounter>("Encounter");

function getDisplay(resource: Encounter): string {
  const roleUser = loadUserRoleFromLocalStorage();
  let display = "";

  if (roleUser === "Admin")
    display = `Paciente: ${EncounterUtils.getSubjectDisplayOrID(
      resource.subject!
    )}
  Profesional: ${EncounterUtils.getPrimaryPractitioner(resource)}`;

  if (roleUser == "Patient")
    display = `Profesional: ${EncounterUtils.getPrimaryPractitioner(resource)}`;
  if (roleUser == "Practitioner")
    display = `Paciente: ${EncounterUtils.getSubjectDisplayOrID(
      resource.subject!
    )}`;

  return `  ${display}
  ${EncounterUtils.getFormatPeriod(resource.period!)}`;
}

function getSearchPatientOrPractitioner(
  roleUser: RolUser,
  id: string
): SearchParams {
  if (roleUser === "Practitioner") return { participant: id };

  if (roleUser === "Patient") return { subject: id };

  return {};
}

export default function PatientListPage() {
  const userRole = loadUserRoleFromLocalStorage();
  const userId = localStorage.getItem("id") || undefined;

  const [openDialog, setOpenDialog] = useState(false);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  const [searchParams, setSearchParams] = useState<SearchParams>(
    getSearchPatientOrPractitioner(userRole!, userId!)
  );

  //const [userRole, setUserRole] = useState<RolUser>();
  const handleIsOpen = (isOpen: boolean) => {
    setOpenDialog(isOpen);
  };

  const handleSearch = () => {
    const date: string[] = [];
    if (startDate) date.push(`ge${startDate.startOf("day").toISOString()}`);
    if (endDate)
      date.push(`lt${endDate.add(1, "day").startOf("day").toISOString()}`);

    const search: SearchParams = {
      date: date,
    };

    //! WARNING: quizás Practitioner/${id}
    if (userRole === "Practitioner") {
      setSearchParams({
        participant: `${localStorage.getItem("id")}`,
        ...search,
      });
    } else {
      setSearchParams(search);
    }
  };

  if (!userRole) return <h1>Loading...</h1>; //!Por el momento sólo por si acaso
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
          <h1>Lista de Encuentros</h1>
          {isAdminOrPractitioner() && (
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
              <EncounterCreateComponent
                patientId={userRole === "Patient" ? userId : undefined}
                isOpen={openDialog}
                onOpen={handleIsOpen}
              ></EncounterCreateComponent>
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
          <div style={{ display: "flex", gap: "10px" }}>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
              <DatePicker
                format="DD-MM-YYYY"
                views={["year", "month", "day"]}
                label="Fecha inicio"
                value={startDate}
                onChange={(value) => setStartDate(value)}
                //sx={{ width: "100%" }}
              ></DatePicker>
              <DatePicker
                format="DD-MM-YYYY"
                views={["year", "month", "day"]}
                label="Fecha Fin"
                value={endDate}
                onChange={(value) => setEndDate(value)}
                //sx={{ width: "100%" }}
              ></DatePicker>
            </LocalizationProvider>
            <IconButton
              color="primary"
              aria-label="search"
              type="submit"
              sx={{
                "&:hover": { backgroundColor: "#1b2455" },
              }}
            >
              <Search />
            </IconButton>
          </div>
        </form>
        <div>
          <ListResourceComponent<Encounter>
            searchParam={searchParams}
            getDisplay={getDisplay}
            fhirService={fhirService}
          ></ListResourceComponent>
        </div>
      </div>
    </div>
  );
}
