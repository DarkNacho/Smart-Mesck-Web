import { SubmitHandler, useForm } from "react-hook-form";
import { Grid, MenuItem, TextField } from "@mui/material";
import { countryCodes } from "../Terminology";
import { DevTool } from "@hookform/devtools";

export interface PersonContactDetails {
  countryCode: string;
  numeroTelefonico: string;
  email: string;
}

export default function PersonContactDetailsFormComponent({
  formId,
  submitForm,
}: {
  formId: string;
  submitForm: SubmitHandler<PersonContactDetails>;
}) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonContactDetails>({ mode: "onBlur" });

  return (
    <>
      <form id={formId} onSubmit={handleSubmit(submitForm)}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={1.5}>
            <TextField
              select
              fullWidth
              label="Código"
              defaultValue="+56"
              {...register("countryCode", {
                required: "Código de país requerido",
              })}
              error={Boolean(errors.countryCode)}
              helperText={errors.countryCode && errors.countryCode.message}
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
              {...register("numeroTelefonico", {
                required: "Número telefónico requerido",
                pattern: {
                  value: /^[0-9]+$/i,
                  message: "Número telefónico inválido",
                },
              })}
              error={Boolean(errors.numeroTelefonico)}
              helperText={
                errors.numeroTelefonico && errors.numeroTelefonico.message
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              type="email"
              label="Email"
              {...register("email", {
                required: "Correo electrónico requerido",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Correo electrónico inválido",
                },
              })}
              error={Boolean(errors.email)}
              helperText={errors.email && errors.email.message}
              fullWidth
            />
          </Grid>
        </Grid>
      </form>
      <DevTool control={control} />
    </>
  );
}
