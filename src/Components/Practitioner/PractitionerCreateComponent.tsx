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

import styles from "./PractitionerCreateComponent.module.css";
import FhirResourceService from "../../Services/FhirService";
import { Practitioner, PractitionerRole } from "fhir/r4";
import PractitionerFormComponent, {
  PractitionerFormData,
} from "../Forms/PractitionerFormComponent";
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

  const sendPractitioner = async (
    newPractitioner: Practitioner,
    newPractitionerRole: PractitionerRole,
    user: any
  ) => {
    const fhirService = new FhirResourceService("Practitioner");
    let response = await fhirService.sendResource(newPractitioner);
    if (!response.success) return response;

    user.id = response.data.id;
    response = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/register`, {
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

    if (!response.success) return response;

    const role = {
      ...newPractitionerRole,
      practitioner: { reference: `Practitioner/${user.id}` },
    };

    response = await new FhirResourceService("PractitionerRole").postResource(
      role
    );
    return response;

    /*const response = await HandleResult.handleOperation(
      () =>  
        new FhirResourceService("Practitioner")
          .postResource(newPractitioner)
          .then((response) => {
            if (response.success) {
              const role = {
                ...newPractitionerRole,
                practitioner: { reference: `Practitioner/${response.data.id}` },
              };
              return new FhirResourceService("PractitionerRole").postResource(
                role
              );
            }
            return response;
          }),
      "Profesional Guardado exitosamente",
      "Enviando..."
    );
    if (response.success) handleClose();
    */
  };

  const postPractitioner = async (
    newPractitioner: Practitioner,
    newPractitionerRole: PractitionerRole,
    user: any
  ) => {
    const response = await HandleResult.handleOperation(
      () => sendPractitioner(newPractitioner, newPractitionerRole, user),
      "Profesional Guardado con éxito",
      "Enviando..."
    );

    if (response.success) handleClose();
  };

  // Función que se ejecuta al enviar el formulario
  const onSubmitForm: SubmitHandler<PractitionerFormData> = (data) => {
    const rut = data.rut.replace(/\./g, "").replace(/-/g, "").toUpperCase();
    const newPractitioner: Practitioner = {
      resourceType: "Practitioner",
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

    const practitionerRole: PractitionerRole = {
      resourceType: "PractitionerRole",
      code: [{ coding: data.role }],
      specialty: [{ coding: data.specialty }],
      //code: data.role.map((role) => ({ coding: [role] })),
      //specialty: data.specialty.map((role) => ({ coding: [role] })),
    };

    const newUser: any = {
      email: data.email,
      rut: rut,
      phone_number: data.numeroTelefonico,
      name: `${data.nombre} ${data.apellidoPaterno}`,
      role: "Practitioner",
      secondaryRoles: data.role?.map((role) => role.code).join(","),
    };

    console.log("posting practitioner....", newUser);
    postPractitioner(newPractitioner, practitionerRole, newUser);
  };

  return (
    <div>
      <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle className={styles.dialogTitle}>
          Añadir Nuevo Profesional
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
            <PractitionerFormComponent
              formId="pacienteForm"
              submitForm={onSubmitForm}
            ></PractitionerFormComponent>
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
