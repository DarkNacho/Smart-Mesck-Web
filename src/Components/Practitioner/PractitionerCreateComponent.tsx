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
import toast from "react-hot-toast";
import { Close } from "@mui/icons-material";

import styles from "./PractitionerCreateComponent.module.css";
import FhirResourceService from "../../Services/FhirService";
import { Practitioner } from "fhir/r4";
import PractitionerFormComponent, {
  PractitionerFormData,
} from "../Forms/PractitionerFormComponent";

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

  const postPractitioner = async (newPractitioner: Practitioner) => {
    const response = await toast.promise(
      new FhirResourceService("Practitioner").postResource(newPractitioner),
      {
        loading: "Enviado Profesional",
        success: (result) => {
          if (result.success) {
            handleClose();
            return "Profesional enviado de forma exitosa";
          } else {
            throw Error(result.error);
          }
        },
        error: (result) => result.toString(),
      }
    );

    if (response.success) {
      console.log(response.data);
    } else {
      console.error(response.error);
    }
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
    postPractitioner(newPractitioner);
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
