import { Stepper, Step, StepLabel, Button } from "@mui/material";
import PersonContactDetailsFormComponent from "./Person/PersonContactDetailsComponent";
import PersonDetailsFormComponent from "./Person/PersonDetailsFormComponent";
import PersonContactFormComponent from "./Person/PersonContactsFormComponent";
import { Coding, Patient } from "fhir/r4";
import FhirResourceService from "../../Services/FhirService";
import { useEffect, useState } from "react";
import PersonUtil from "../../Services/Utils/PersonUtils";
import { Dayjs } from "dayjs";

export interface PatientFormData {
  id?: string;
  nombre: string;
  segundoNombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento: Dayjs;
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

let patientFormData: PatientFormData;

export default function PatientStepperForm({
  patientID,
  steps,
  activeStep,
  setActiveStep,
  onSubmit,
}: {
  steps: { name: string; enable: boolean }[];
  activeStep: number;
  setActiveStep: (step: number) => void;
  onSubmit: (data: any) => void;
  patientID?: string;
}) {
  const [loading, setLoading] = useState(true);

  const fetchDefaultResource = async () => {
    if (!patientID) {
      setLoading(false);
      return;
    }
    try {
      const result = await new FhirResourceService<Patient>("Patient").getById(
        patientID
      );

      if (!result.success) throw new Error(result.error);
      patientFormData = PersonUtil.PatientToPatientForm(result.data);
      console.log("patient:", result.data);
      console.log("patientFormData", patientFormData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStepContent = (step: number) => {
    return (
      <>
        <div style={{ display: step === 0 ? "block" : "none" }}>
          <PersonDetailsFormComponent
            formId={"form0"}
            submitForm={onSubmit}
            person={patientFormData}
          />
        </div>
        <div style={{ display: step === 1 ? "block" : "none" }}>
          <PersonContactDetailsFormComponent
            formId={"form1"}
            submitForm={onSubmit}
            person={patientFormData}
          />
        </div>
        <div style={{ display: step === 2 ? "block" : "none" }}>
          <PersonContactFormComponent
            formId="form2"
            submitForm={onSubmit}
            person={patientFormData}
          />
        </div>
      </>
    );
  };

  useEffect(() => {
    fetchDefaultResource();
  }, [patientID]);

  if (loading) return <div>Loading...</div>;

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
