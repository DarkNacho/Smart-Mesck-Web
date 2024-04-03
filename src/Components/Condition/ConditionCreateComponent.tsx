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

import styles from "./ConditionCreateComponent.module.css";

import HandleResult from "../HandleResult";
import { isAdminOrPractitioner } from "../../RolUser";
import ConditionFormComponent, {
  ConditionFormData,
} from "../Forms/ConditionFormComponent";
import { Condition } from "fhir/r4";
import ConditionService from "../../Services/ConditionService";

export default function ConditionCreateComponent({
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

  const onSubmitForm: SubmitHandler<ConditionFormData> = (data) => {
    const newCondition: Condition = {
      resourceType: "Condition",
      code: {
        coding: [
          {
            code: data.code.code,
            system: data.code.system,
            display: data.code.display,
          },
        ],
      },
      subject: {
        reference: `Patient/${data.subject.id}`,
        display: data.subject.display,
      },
      encounter: {
        reference: `Encounter/${data.encounter.id}`,
        display: data.encounter.display,
      },
      recorder: {
        //! WARNING: quizás pueda cambiar a asserter o tener ambos
        reference: `Practitioner/${data.performer.id}`,
        display: data.performer.display,
      },

      note: [{ text: data.note }],
      clinicalStatus: {
        coding: [
          {
            code: data.clinicalStatus,
            system: "http://terminology.hl7.org/CodeSystem/condition-clinical",
          },
        ],
      },
    };
    sendCondition(newCondition);
  };

  const sendCondition = async (newCondition: Condition) => {
    HandleResult.handleOperation(
      () => new ConditionService().sendResource(newCondition),
      "Condición guardada de forma exitosa",
      "Enviando..."
    );
  };

  return (
    <div>
      <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle className={styles.dialogTitle}>
          Condición
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
            <ConditionFormComponent
              formId="conditionForm"
              patientId={patientId}
              practitionerId={practitionerId!}
              submitForm={onSubmitForm}
            ></ConditionFormComponent>
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
            form="conditionForm"
          >
            Enviar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
