import { Stepper, Step, StepLabel, Button } from "@mui/material";
import PersonContactDetailsFormComponent from "./Person/PersonContactDetailsComponent";
import PersonDetailsFormComponent from "./Person/PersonDetailsFormComponent";
import PersonContactFormComponent from "./Person/PersonContactsFormComponent";
import { Coding } from "fhir/r4";

export interface PatientFormData {
  nombre: string;
  segundoNombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento: string;
  genero: string;
  rut: string;
  countryCode: string;
  numeroTelefonico: string;
  email: string;
  photo: string;
  maritalStatus: Coding;
  contact: {
    nombre: string;
    segundoNombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    contactType: string;
    email: string;
    countryCode: string;
    numeroTelefonico: string;
  }[];
}

export default function PatientStepperForm({
  steps,
  activeStep,
  setActiveStep,
  onSubmit,
}) {
  const getStepContent = (step: number) => {
    return (
      <>
        <div style={{ display: step === 0 ? "block" : "none" }}>
          <PersonDetailsFormComponent formId={"form0"} submitForm={onSubmit} />
        </div>
        <div style={{ display: step === 1 ? "block" : "none" }}>
          <PersonContactDetailsFormComponent
            formId={"form1"}
            submitForm={onSubmit}
          />
        </div>
        <div style={{ display: step === 2 ? "block" : "none" }}>
          <PersonContactFormComponent formId="form2" submitForm={onSubmit} />
        </div>
      </>
    );
  };

  return (
    <div>
      <Stepper activeStep={activeStep}>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepLabel>
              <Button
                color="inherit"
                disabled={!step.enable}
                onClick={() => setActiveStep(index)}
              >
                {step.name}
              </Button>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <div>
            <p>All steps completed</p>
          </div>
        ) : (
          <div>{getStepContent(activeStep)}</div>
        )}
      </div>
    </div>
  );
}
