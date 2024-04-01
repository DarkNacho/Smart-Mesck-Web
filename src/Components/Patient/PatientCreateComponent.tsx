import { SubmitHandler } from "react-hook-form";
import {
  Button,
  Container,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useEffect } from "react";
import { Close } from "@mui/icons-material";

import styles from "./PatientCreateComponent.module.css";
import { Patient } from "fhir/r4";
import FhirResourceService from "../../Services/FhirService";
import PatientFormComponent, {
  PatientFormData,
} from "../Forms/PatientFormComponent";
import HandleResult from "../HandleResult";
export default function PatientCreateComponent({
  onOpen,
  isOpen,
}: {
  onOpen: (isOpen: boolean) => void;
  isOpen: boolean;
}) {
  useEffect(() => {
    onOpen(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    onOpen(false);
  };

  const postPatient = async (newPatient: Patient) => {
    HandleResult.handleOperation(
      () => new FhirResourceService("Patient").postResource(newPatient),
      "Paciente Guardado con éxito",
      "Enviando..."
    );
  };

  // Función que se ejecuta al enviar el formulario
  const onSubmitForm: SubmitHandler<PatientFormData> = (data) => {
    const rut = data.rut.replace(/\./g, "").replace(/-/g, "").toUpperCase();
    const newPatient: Patient = {
      resourceType: "Patient",
      identifier: [{ system: "RUT", value: rut }],
      name: [
        {
          family: data.apellidoPaterno,
          given: [data.nombre, data.segundoNombre],
          suffix: [data.apellidoMaterno],
          text: `${data.nombre} ${data.segundoNombre} ${data.apellidoPaterno} ${data.apellidoMaterno}`,
        },
      ],
      birthDate: data.fechaNacimiento,
      gender: data.genero as "male" | "female" | "other" | "unknown",
      telecom: [{ system: "phone", value: data.numeroTelefonico }],
      photo: [{ url: data.photo }],
    };
    postPatient(newPatient);
  };

  return (
    <div>
      <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle className={styles.dialogTitle}>
          Añadir Nuevo Paciente
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              color: "white",
              backgroundColor: "#7e94ff",
              "&:hover": { backgroundColor: "red" },
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Container className={styles.container}>
            <PatientFormComponent
              formId="pacienteForm"
              submitForm={onSubmitForm}
            ></PatientFormComponent>
          </Container>
        </DialogContent>
        <DialogActions className={styles.dialogActions}>
          <Button onClick={handleClose} variant="contained" color="error">
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            form="pacienteForm"
          >
            Enviar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
