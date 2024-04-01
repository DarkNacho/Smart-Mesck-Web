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

import styles from "./EncounterCreateComponent.module.css";
import { Encounter } from "fhir/r4";

import PersonUtil from "../../Services/Utils/PersonUtils";

import { EncounterFormData } from "../Forms/EncounterFormComponent";
import ResourceService from "../../Services/FhirService";

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

  const postEncounter = async (newEncounter: Encounter) => {
    const response = await toast.promise(
      new ResourceService("Encounter").postResource(newEncounter),
      {
        loading: "Enviado...",
        success: (result) => {
          if (result.success) {
            return "Encuentro guardado de forma exitosa";
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
  const onSubmitForm: SubmitHandler<EncounterFormData> = (data) => {
    console.log("send form");
    console.log(data);

    const newEncounter: Encounter = {
      resourceType: "Encounter",
      subject: { reference: `Patient/${data.patient.id}` },
      participant: [
        {
          individual: {
            reference: `Practitioner/${data.practitioner.id}`,
            display: PersonUtil.parsePersonName(data.patient),
          },
        },
      ],
      period: {
        start: data.start.toISOString(),
        end: data.end.toISOString(),
      },
      status: "finished",
      class: {
        code: data.type,
        system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
      },
    };
    alert(JSON.stringify(newEncounter, null, 2));
    //postEncounter(newEncounter);
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
            <h1>
              EncounterFormComponent quitado por problemas en su implementación
            </h1>
            {/*<EncounterFormComponent
              formId="encounterForm"
              patientId={patientId}
              submitForm={onSubmitForm}
          ></EncounterFormComponent>*/}
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
