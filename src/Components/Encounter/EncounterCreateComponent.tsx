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

import styles from "./EncounterCreateComponent.module.css";
import { Encounter } from "fhir/r4";

import EncounterFormComponent, {
  EncounterFormData,
} from "../Forms/EncounterFormComponent";
import HandleResult from "../HandleResult";
import FhirResourceService from "../../Services/FhirService";

export default function EncounterCreateComponent({
  onOpen,
  isOpen,
  patientId,
}: {
  onOpen: (isOpen: boolean) => void;
  isOpen: boolean;
  patientId?: string;
}) {
  useEffect(() => {
    onOpen(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    onOpen(false);
  };

  const practitionerId = localStorage.getItem("id");

  const postEncounter = async (newEncounter: Encounter) => {
    const response = await HandleResult.handleOperation(
      () =>
        new FhirResourceService<Encounter>("Encounter").postResource(
          newEncounter
        ),
      "Encuentro guardado de forma exitosa",
      "Enviando..."
    );
    if (response.success) handleClose();
  };

  // Función que se ejecuta al enviar el formulario
  const onSubmitForm: SubmitHandler<EncounterFormData> = (data) => {
    console.log("send form");
    console.log(data);

    const newEncounter: Encounter = {
      resourceType: "Encounter",
      subject: {
        reference: `Patient/${data.patient.id}`,
        display: data.patient.display,
      },
      participant: [
        {
          individual: {
            reference: `Practitioner/${data.practitioner.id}`,
            display: data.practitioner.display,
          },
        },
      ],
      period: {
        start: data.start.toISOString(),
        end: data.end.toISOString(),
      },
      partOf: {
        reference: `Encounter/${data.seguimiento?.id}`,
        display: data.seguimiento?.display,
      },
      status: "finished",
      class: {
        code: data.type,
        system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
      },
    };
    //alert(JSON.stringify(newEncounter, null, 2));
    postEncounter(newEncounter);
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
            <EncounterFormComponent
              formId="encounterForm"
              submitForm={onSubmitForm}
              practitionerId={practitionerId!}
              patientId={patientId}
            ></EncounterFormComponent>
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
            form="encounterForm"
          >
            Enviar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
