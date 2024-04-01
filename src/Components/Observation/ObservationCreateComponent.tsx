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
import dayjs from "dayjs";
import { checkPatientRol } from "../../RolUser";
import HandleResult from "../HandleResult";

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

  const onSubmitForm: SubmitHandler<ObservationFormData> = (data) => {
    const newObservation: Observation = {
      valueString: data.valueString,

      subject: { reference: `Patient/${data.subject}` },
      //encounter: { reference: `Encounter/${data.encounter}` },
      performer: [{ reference: `Practitioner/${data.performer}` }],
      category: [{ coding: data.category }], //TODO: cardinalidad a muchos, por lo que debería cambiarlo a lista en vez de sólo un item
      code: { coding: [data.code] },
      interpretation: [{ coding: data.interpretation }],
      issued: dayjs(data.issued).toISOString(),
      note: [{ text: data.note }],

      resourceType: "Observation",
      status: "unknown",
    };
    //alert(JSON.stringify(newObservation))
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
              observation={{} as Observation}
              patientId={patientId}
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
