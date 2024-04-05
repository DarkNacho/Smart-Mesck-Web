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

import { Close } from "@mui/icons-material";

import styles from "./ObservationCreateComponent.module.css";
import { Observation } from "fhir/r4";
import ObservationService from "../../Services/ObservationService";
import ObservationFormComponent, {
  ObservationFormData,
} from "../Forms/ObservationFormComponent";
import HandleResult from "../HandleResult";
import { isAdminOrPractitioner } from "../../RolUser";
import ObservationUtils from "../../Services/Utils/ObservationUtils";

export default function ObservationCreateComponent({
  patientId,
  onOpen,
  isOpen,
}: {
  patientId: string;
  onOpen: (isOpen: boolean) => void;
  isOpen: boolean;
}) {
  const handleClose = () => {
    onOpen(false);
  };

  const practitionerId = isAdminOrPractitioner()
    ? localStorage.getItem("id") || undefined
    : undefined;

  const onSubmitForm: SubmitHandler<ObservationFormData> = (data) => {
    const newObservation =
      ObservationUtils.ObservationFormDataToObservation(data);
    console.log(newObservation);
    sendObservation(newObservation);
  };

  const sendObservation = async (newObservation: Observation) => {
    HandleResult.handleOperation(
      () => new ObservationService().sendResource(newObservation),
      "Observación guardada de forma exitosa",
      "Enviando..."
    );
  };

  return (
    <div>
      <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle className={styles.dialogTitle}>
          Crear nuevo encuentro
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
            <ObservationFormComponent
              formId="form"
              patientId={patientId}
              practitionerId={practitionerId}
              submitForm={onSubmitForm}
              readOnly={false}
            ></ObservationFormComponent>
          </Container>
        </DialogContent>
        <DialogActions className={styles.dialogActions}>
          <Button onClick={handleClose} variant="contained" color="error">
            Cancelar
          </Button>
          <Button type="submit" variant="contained" color="primary" form="form">
            Enviar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
