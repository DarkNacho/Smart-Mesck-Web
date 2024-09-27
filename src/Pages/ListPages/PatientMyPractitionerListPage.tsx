import { useEffect, useState } from "react";
import FhirResourceService from "../../Services/FhirService";

import styles from "./ListPage.module.css";
import { List, ListItem } from "@mui/material";
import { Patient, Practitioner } from "fhir/r4";
import { useNavigate } from "react-router-dom";
import PersonUtil from "../../Services/Utils/PersonUtils";

function getDisplay(resource: Practitioner): string {
  const identifier = PersonUtil.getIdentifierByCode(resource, "RUT");
  return `  ${identifier.system} ${identifier.value}
  Nombre: ${PersonUtil.getPersonNameAsString(resource)}
  Género: ${PersonUtil.getGender(resource)}
  Teléfono: ${PersonUtil.getContactPointFirstOrDefaultAsString(
    resource,
    "phone"
  ).replace(/-/g, "")}`;
}

const fhirPatientService = new FhirResourceService<Patient>("Patient");
const fhirPractitionerService = new FhirResourceService<Practitioner>(
  "Practitioner"
);

export default function PatientMyPractitionerListPage() {
  const patientID = localStorage.getItem("id");
  const [practitionerData, setPractitionerData] = useState<Practitioner[]>([]);

  const navigate = useNavigate();

  const fetchPatient = async () => {
    const patientRes = await fhirPatientService.getById(patientID!);
    if (!patientRes.success) return;
    for (const gp of patientRes.data.generalPractitioner || []) {
      if (!gp.reference) continue;
      const practitionerRes = await fhirPractitionerService.getById(
        gp.reference.split("/")[1]
      );
      if (!practitionerRes.success) continue;
      setPractitionerData((prevPractitioners) => [
        ...prevPractitioners,
        practitionerRes.data,
      ]);
    }
  };

  useEffect(() => {
    fetchPatient();
  }, [patientID]);

  return (
    <div>
      <List className={styles.listContent}>
        {practitionerData.map((resource) => (
          <ListItem
            className={styles.listItem}
            key={resource.id}
            onClick={() => navigate(`/${resource.resourceType}/${resource.id}`)}
          >
            <pre>{getDisplay(resource)}</pre>
          </ListItem>
        ))}
      </List>
    </div>
  );
}
