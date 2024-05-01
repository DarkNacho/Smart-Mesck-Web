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
import { useEffect, useState } from "react";
import { Close } from "@mui/icons-material";

import styles from "./PatientCreateComponent.module.css";
import { FhirResource, Patient } from "fhir/r4";
import FhirResourceService from "../../Services/FhirService";
import { PatientFormData } from "../Forms/PatientFormComponent";
import HandleResult from "../HandleResult";
import PatientStepperForm from "../Forms/PatientStepperForm";

let formData: PatientFormData;
export default function PatientEditComponent({
  onOpen,
  isOpen,
  patientID,
}: {
  onOpen: (isOpen: boolean) => void;
  isOpen: boolean;
  patientID?: string;
}) {
  useEffect(() => {
    onOpen(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    onOpen(false);
    setActiveStep(0);
    setSteps((prevSteps) => {
      const updatedSteps = prevSteps.map((step) => {
        return { ...step, enable: false };
      });
      updatedSteps[0].enable = true;
      return updatedSteps;
    });
  };

  const sendPatient = async (
    newPatient: Patient
  ): Promise<Result<FhirResource>> => {
    const fhirService = new FhirResourceService("Patient");
    const response = await fhirService.sendResource(newPatient);
    return response;
  };

  const postPatient = async (newPatient: Patient) => {
    const response = await HandleResult.handleOperation(
      () => sendPatient(newPatient),
      "Paciente Guardado con éxito",
      "Enviando..."
    );

    if (response.success) handleClose();
  };

  // Función que se ejecuta al enviar el formulario
  const onSubmitForm: SubmitHandler<PatientFormData> = (data) => {
    const rut = data.rut.replace(/\./g, "").replace(/-/g, "").toUpperCase();
    const newPatient: Patient = {
      resourceType: "Patient",
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
      telecom: [
        { system: "phone", value: data.countryCode + data.numeroTelefonico },
        { system: "email", value: data.email },
      ],
      maritalStatus: {
        coding: data.maritalStatus ? [data.maritalStatus] : undefined,
      },
      photo: [{ url: data.photo }],
    };

    /*
    const newUser: any = {
      email: data.email,
      rut: rut,
      phone_number: data.numeroTelefonico,
      role: "Patient",
    };
    */

    console.log("posting patient....", newPatient);
    //console.log("posting user....", newUser);
    postPatient(newPatient);
    //postPatient(newPatient, newUser);
  };

  const onSubmit = (data: PatientFormData) => {
    console.log(data);
    formData = { ...formData, ...data };
    //setFormData((prevFormData) => ({ ...prevFormData, ...data }));
    handleNext();
  };

  const [activeStep, setActiveStep] = useState(0);
  const [steps, setSteps] = useState([
    { name: "Datos Personales", enable: true },
    { name: "Datos de Contacto", enable: false },
    { name: "Contactos de Emergencia", enable: false },
  ]);

  const handleNext = () => {
    setSteps((prevSteps) => {
      const updatedSteps = [...prevSteps];
      updatedSteps[activeStep].enable = true;
      return updatedSteps;
    });
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <div>
      <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle className={styles.dialogTitle}>
          Añadir Nuevo Paciente
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
            <PatientStepperForm
              steps={steps}
              activeStep={activeStep}
              setActiveStep={setActiveStep}
              onSubmit={onSubmit}
              patientID={patientID}
            ></PatientStepperForm>
          </Container>
        </DialogContent>
        <DialogActions className={styles.dialogActions}>
          <Button onClick={handleClose} variant="contained" color="error">
            Cancelar
          </Button>
          <div>
            <Button disabled={activeStep === 0} onClick={handleBack}>
              Atrás
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              form={`form${activeStep}`}
              hidden={activeStep >= steps.length - 1}
            >
              Siguiente
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => onSubmitForm(formData)}
              hidden={activeStep <= steps.length - 2}
            >
              Enviar
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
}
