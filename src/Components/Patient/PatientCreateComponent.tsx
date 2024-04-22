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
import { FhirResource, Patient } from "fhir/r4";
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

  const sendPatient = async (
    newPatient: Patient,
    user: any
  ): Promise<Result<FhirResource>> => {
    const fhirService = new FhirResourceService("Patient");
    let response = await fhirService.sendResource(newPatient);
    if (!response.success) return response;

    user.id = response.data.id;
    response = await fetch("http://localhost:8000/auth/register", {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        return response;
      })
      .catch(async (error) => {
        const response = await fhirService.deleteResource(user.id);
        if (!response.success) return response;
        return { success: false, error: error }; //TODO: mejorar mensaje de error probablemente desde el server
      });

    return response;
  };

  const postPatient = async (newPatient: Patient, user: any) => {
    const response = await HandleResult.handleOperation(
      () => sendPatient(newPatient, user),
      "Paciente Guardado con éxito",
      "Enviando..."
    );

    if (response.success) handleClose();
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
      telecom: [
        { system: "phone", value: data.countryCode + data.numeroTelefonico },
        { system: "email", value: data.email },
      ],
      maritalStatus: {
        coding: [data.maritalStatus],
      },
      photo: [{ url: data.photo }],
    };

    const newUser: any = {
      email: data.email,
      rut: rut,
      phone_number: data.numeroTelefonico,
      role: "Patient",
    };

    postPatient(newPatient, newUser);
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
