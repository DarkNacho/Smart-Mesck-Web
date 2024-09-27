import { useState } from "react";

import { IconButton } from "@mui/material";
import styles from "./PatientEncounterListComponent.module.css";

import { Add, Search } from "@mui/icons-material";
import ListResourceComponent from "../../Components/ListResourceComponent";
import { Encounter } from "fhir/r4";
import FhirResourceService from "../../Services/FhirService";
import { SearchParams } from "fhir-kit-client";
import EncounterUtils from "../../Services/Utils/EncounterUtils";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import EncounterCreateComponent from "../../Components/Encounter/EncounterCreateComponent";
import { isAdminOrPractitioner } from "../../RolUser";

const fhirService = new FhirResourceService<Encounter>("Encounter");

function getDisplay(resource: Encounter): string {
  //const rol = loadUserRoleFromLocalStorage();
  //let display = "";
  //if (rol === "Admin" || rol == "Patient")
  //  display = `\nProfesional: ${EncounterUtils.getPrimaryPractitioner(
  //    resource
  //  )} `;
  return `${EncounterUtils.getPrimaryPractitioner(
    resource
  )}\n${EncounterUtils.getFormatPeriod(resource.period!)}`;
}

export default function PatientEncounterListComponent({
  patientId,
}: {
  patientId: string;
}) {
  const [openDialog, setOpenDialog] = useState(false);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  const [searchParams, setSearchParams] = useState<SearchParams>({
    subject: patientId,
    //participant: localStorage.getItem("id")!,
  });

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
      subject: patientId,
      date: date,
    };

    setSearchParams(search);
  };

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
                patientId={patientId}
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
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Fecha inicio"
                value={startDate}
                onChange={(value) => setStartDate(value)}
                //sx={{ width: "100%" }}
              ></DatePicker>
              <DatePicker
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
