import { useEffect, useState } from "react";

import {
  TextField,
  IconButton,
  InputAdornment,
  MenuItem,
  Autocomplete,
} from "@mui/material";
import styles from "./ListPage.module.css";

import { Add, Search } from "@mui/icons-material";
import ListResourceComponent from "../../Components/ListResourceComponent";
import { Coding, Practitioner, ValueSet } from "fhir/r4";
import PersonUtil from "../../Services/Utils/PersonUtils";
import FhirResourceService from "../../Services/FhirService";
import PractitionerCreateComponent from "../../Components/Practitioner/PractitionerCreateComponent";
import { SearchParams } from "fhir-kit-client";
import { isAdminOrPractitioner } from "../../RolUser";
import ValueSetUtils from "../../Services/Utils/ValueSetUtils";

const fhirService = new FhirResourceService<Practitioner>("Practitioner");

function getDisplay(resource: Practitioner): string {
  return `ID: ${resource.id}\nName: ${PersonUtil.getPersonNameAsString(
    resource
  )}\nGender: ${resource.gender || "N/A"}`;
}

export default function PractitionerListPage() {
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("1");
  const [searchParam, setSearchParam] = useState<SearchParams>({});

  let specialty: Coding | undefined;
  //const [specialty, setSpecialty] = useState<Coding>();
  const [specialtyOptions, setSpecialtyOptions] = useState<Coding[]>([]);
  const [loadingSpecialty, setLoadingSpecialty] = useState<boolean>(true);

  //const [role, setRole] = useState<Coding>();
  let role: Coding | undefined;
  const [roleOptions, setRoleOptions] = useState<Coding[]>([]);
  const [loadingRole, setLoadingRole] = useState<boolean>(true);

  const fetchSpecialty = async () => {
    try {
      const response = await new FhirResourceService<ValueSet>(
        "ValueSet"
      ).getById("257");
      if (!response.success) throw new Error(response.error);
      setSpecialtyOptions(
        ValueSetUtils.convertValueSetToCodingArray(response.data)
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingSpecialty(false);
    }
  };

  const fetchRole = async () => {
    try {
      const response = await new FhirResourceService<ValueSet>(
        "ValueSet"
      ).getById("232");
      if (!response.success) throw new Error(response.error);
      setRoleOptions(ValueSetUtils.convertValueSetToCodingArray(response.data));
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingRole(false);
    }
  };

  const handleIsOpen = (isOpen: boolean) => {
    setOpenDialog(isOpen);
  };

  const handleSearch = async () => {
    let search: SearchParams = {};
    switch (searchType) {
      case "0":
        search = { identifier: searchTerm };
        break;
      case "1":
        search = { name: searchTerm };
        break;
    }
    if (role && role.code)
      search["_has:PractitionerRole:practitioner:role"] = role.code;
    if (specialty && specialty.code)
      search["_has:PractitionerRole:practitioner:specialty"] = specialty.code;
    setSearchParam(search);
    return search;
  };

  useEffect(() => {
    fetchSpecialty();
    fetchRole();
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
          <h1>Lista de practicantes</h1>
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

              <PractitionerCreateComponent
                isOpen={openDialog}
                onOpen={handleIsOpen}
              ></PractitionerCreateComponent>
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
            label="Buscar profesional"
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

          <Autocomplete
            id="Autocomplete-role"
            options={roleOptions}
            loading={loadingRole}
            getOptionLabel={(option) =>
              option.display || option.code || "UNKNOWN"
            }
            isOptionEqualToValue={(option, value) => option.code === value.code}
            onChange={(_, newValue) => {
              role = newValue!;
              //setRole(newValue!);
              handleSearch();
            }}
            renderOption={(props, option) => (
              <li {...props} key={option.code}>
                {option.display}
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                label="Roles"
                variant="outlined"
              />
            )}
          />
          <Autocomplete
            id="Autocomplete-specialty"
            options={specialtyOptions}
            loading={loadingSpecialty}
            getOptionLabel={(option) =>
              option.display || option.code || "UNKNOWN"
            }
            isOptionEqualToValue={(option, value) => option.code === value.code}
            onChange={(_, newValue) => {
              specialty = newValue!;
              //setSpecialty(newValue!);
              handleSearch();
            }}
            renderOption={(props, option) => (
              <li {...props} key={option.code}>
                {option.display}
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                label="Especialidad"
                variant="outlined"
              />
            )}
          />
        </form>
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
