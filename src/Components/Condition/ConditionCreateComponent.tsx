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
import ConditionUtils from "../../Services/Utils/ConditionUtils";

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
    const newCondition = ConditionUtils.ConditionFormDataToCondition(data);
    sendCondition(newCondition);
  };

  const sendCondition = async (newCondition: Condition) => {
    const response = await HandleResult.handleOperation(
      () => new ConditionService().sendResource(newCondition),
      "Condición guardada de forma exitosa",
      "Enviando..."
    );
    if (response.success) handleClose();
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
