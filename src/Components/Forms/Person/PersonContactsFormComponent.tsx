import { DevTool } from "@hookform/devtools";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { useState } from "react";
import React from "react";
import { countryCodes, contactTypes } from "../Terminology";
import {
  Button,
  Grid,
  Link,
  MenuItem,
  Step,
  StepLabel,
  Stepper,
  TextField,
} from "@mui/material";

export interface PersonContact {
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

export default function PersonContactFormComponent({
  formId,
  submitForm,
}: {
  formId: string;
  submitForm: SubmitHandler<PersonContact>;
}) {
  const {
    control,
    trigger,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonContact>({
    defaultValues: {
      contact: [
        {
          nombre: "",
          segundoNombre: "",
          apellidoPaterno: "",
          apellidoMaterno: "",
          contactType: "N",
          email: "",
          countryCode: "+56",
          numeroTelefonico: "",
        },
      ],
    },
    mode: "onBlur",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "contact",
  });

  const [activeStep, setActiveStep] = useState(0);

  const addContact = async () => {
    const val = await trigger();
    if (val) {
      append({
        nombre: "",
        segundoNombre: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
        numeroTelefonico: "",
        contactType: "N",
        email: "",
        countryCode: "+56",
      });
      setActiveStep(fields.length);
    }
  };

  const handleNextStep = () => {
    if (activeStep < fields.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      addContact();
    }
  };

  const handlePreviousStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const removeContact = (index: number) => {
    remove(index);
  };

  return (
    <>
      <form id={formId} onSubmit={handleSubmit(submitForm)}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {fields.map((field, index) => (
            <Step key={index}>
              <StepLabel onClick={() => setActiveStep(index)}>
                <Link href="#" color="inherit">
                  {field.nombre ? field.nombre : `Contact ${index + 1}`}
                </Link>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        <React.Fragment key={activeStep}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nombre"
                {...register(`contact.${activeStep}.nombre`, {
                  required: "El Nombre de contacto es requerido",
                })}
                fullWidth
                error={Boolean(errors.contact?.[activeStep]?.nombre)}
                helperText={
                  errors.contact?.[activeStep]?.nombre &&
                  errors.contact?.[activeStep]?.nombre?.message
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Relación"
                defaultValue="N"
                {...register(`contact.${activeStep}.contactType`)}
                fullWidth
                error={Boolean(errors.contact?.[activeStep]?.contactType)}
                helperText={
                  errors.contact?.[activeStep]?.contactType &&
                  errors.contact?.[activeStep]?.contactType?.message
                }
              >
                {contactTypes.map((option) => (
                  <MenuItem key={option.code} value={option.code}>
                    {option.display}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                type="email"
                label="Email"
                {...register(`contact.${activeStep}.email`, {
                  required: "Correo electrónico requerido",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Correo electrónico inválido",
                  },
                })}
                error={Boolean(errors.contact?.[activeStep]?.email)}
                helperText={
                  errors.contact?.[activeStep]?.email &&
                  errors.contact?.[activeStep]?.email?.message
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={1.5}>
              <TextField
                select
                fullWidth
                label="Código"
                defaultValue="+56"
                {...register(`contact.${activeStep}.countryCode`, {
                  required: "Código de país requerido",
                })}
                error={Boolean(errors.contact?.[activeStep]?.countryCode)}
                helperText={
                  errors.contact?.[activeStep]?.countryCode &&
                  errors.contact?.[activeStep]?.countryCode?.message
                }
              >
                {countryCodes.map((option) => (
                  <MenuItem key={option.code} value={option.code}>
                    {option.display}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4.5}>
              <TextField
                label="Número Telefónico"
                type="number"
                {...register(`contact.${activeStep}.numeroTelefonico`, {
                  required: "Número telefónico requerido",
                  pattern: {
                    value: /^[0-9]+$/i,
                    message: "Número telefónico inválido",
                  },
                })}
                error={Boolean(errors.contact?.[activeStep]?.numeroTelefonico)}
                helperText={
                  errors.contact?.[activeStep]?.numeroTelefonico &&
                  errors.contact?.[activeStep]?.numeroTelefonico?.message
                }
                fullWidth
              />
            </Grid>
          </Grid>
        </React.Fragment>
        <Button
          variant="contained"
          color="error"
          onClick={() => removeContact(activeStep)}
        >
          Delete
        </Button>

        <Button variant="contained" onClick={handlePreviousStep}>
          Previous
        </Button>
        <Button variant="contained" onClick={handleNextStep}>
          {activeStep === fields.length - 1 ? "Add" : "Next"}
        </Button>
      </form>
      <DevTool control={control} />
    </>
  );
}
