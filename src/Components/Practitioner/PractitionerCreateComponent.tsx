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

  const postPractitioner = async (
    newPractitioner: Practitioner,
    newPractitionerRole: PractitionerRole
  ) => {
    const response = await HandleResult.handleOperation(
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
    postPractitioner(newPractitioner, practitionerRole);
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
