import {
  Button,
  Container,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Close } from "@mui/icons-material";

import styles from "./PractitionerModal.module.css";
import MultipleAutoCompleteComponent from "../AutoCompleteComponents/MultipleAutoCompleteComponent";
import PersonUtil from "../../Services/Utils/PersonUtils";
import { Patient, Practitioner } from "fhir/r4";
import FhirResourceService from "../../Services/FhirService";
import { useForm, Controller } from "react-hook-form";
import HandleResult from "../HandleResult";

type FormData = {
  practitioners: Practitioner[];
};

export default function PractitionerReferComponent({
  onOpen,
  isOpen,
  patient,
}: {
  onOpen: (isOpen: boolean) => void;
  isOpen: boolean;
  patient: Patient;
}) {
  useEffect(() => {
    onOpen(isOpen);
    if (isOpen) handleRefer(patient);
  }, [isOpen]);

  const handleClose = () => {
    // setDefaultReferData([]);
    console.log("cerrando");
    onOpen(false);
  };

  const [defaultReferData, setDefaultReferData] = useState<Practitioner[]>([]); // [1

  const handleRefer = async (resource: Patient) => {
    const fhirPractitionerService = new FhirResourceService<Practitioner>(
      "Practitioner"
    );

    const defaultRefer: Practitioner[] = [];

    const promises = (resource.generalPractitioner || []).map((practitioner) =>
      fhirPractitionerService
        .getResource(practitioner.reference!)
        .then((res) => {
          if (res.success) defaultRefer.push(res.data);
        })
    );

    await Promise.all(promises);
    setDefaultReferData(defaultRefer);
    console.log("practitioner-general", defaultRefer);
  };

  const onSubmit = async (data: FormData) => {
    console.log(data); // This will log the selected practitioners
    const practitionersRef = data.practitioners.map((practitioner) => ({
      reference: `Practitioner/${practitioner.id}`,
    }));
    patient.generalPractitioner = practitionersRef;
    console.log("ref ", practitionersRef);
    console.log("new patient ", patient);
    const response = await HandleResult.handleOperation(
      () => new FhirResourceService<Patient>("Patient").updateResource(patient),
      "Actualizado",
      "Enviando..."
    );
    if (response.success) handleClose();
  };

  const { handleSubmit, control } = useForm<FormData>();

  return (
    <div>
      <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle className={styles.dialogTitle}>
          Seleccionar Profesionales
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
            <form
              id="referGeneralPractitioner"
              onSubmit={handleSubmit(onSubmit)}
            >
              {defaultReferData.length > 0 && (
                <Controller
                  name="practitioners"
                  control={control}
                  defaultValue={defaultReferData}
                  render={({ field }) => (
                    <MultipleAutoCompleteComponent<Practitioner>
                      defaultValues={field.value}
                      resourceType={"Practitioner"}
                      label={"Profesionales"}
                      getDisplay={PersonUtil.getPersonNameAsString}
                      onChange={(selectedObject) => {
                        field.onChange(selectedObject);
                      }}
                      searchParam={"name"}
                    />
                  )}
                />
              )}
            </form>
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
            form="referGeneralPractitioner"
          >
            Enviar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
