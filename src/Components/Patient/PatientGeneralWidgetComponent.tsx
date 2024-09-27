import { Container, Grid, Typography } from "@mui/material";
import PersonUtil from "../../Services/Utils/PersonUtils";
import styles from "./PatientGeneralWidgetComponent.module.css";
import { Patient } from "fhir/r4";

function formatDate(dateString: string | undefined): string {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
export default function PatientGeneralWidgetComponent({
  patient,
  edit = false,
}: {
  patient: Patient;
  edit?: boolean;
}) {
  const identifier = PersonUtil.getIdentifierByCode(patient, "RUT");
  return (
    <div className={styles.generalWidget}>
      <div className={styles.title}>
        <div className={styles.icon}>
          <div className={styles.ellipse} />
          <img className={styles["contacts-icon"]} alt="" src="/contacts.svg" />
        </div>
        <b className={styles.title1}>Antecedentes Personales</b>
        {edit && <b className={styles.text}>Edit</b>}
      </div>
      <Container maxWidth="xl">
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6">
              {identifier.system}: {identifier.value}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6">
              E-Mail:{" "}
              {PersonUtil.getContactPointFirstOrDefaultAsString(
                patient,
                "email"
              )}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6">
              Número Telefónico:{" "}
              {PersonUtil.getContactPointFirstOrDefaultAsString(
                patient,
                "phone"
              )}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6">
              Fecha Nacimiento: {formatDate(patient.birthDate)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4} md={2}>
            <Typography variant="h6">
              Edad: {PersonUtil.calcularEdad(patient.birthDate!)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4} md={2}>
            <Typography variant="h6">
              Sexo: {PersonUtil.getGender(patient)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6">
              Estado Civil: {PersonUtil.getMaritalStatus(patient)}
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
