import { SubmitHandler, useForm } from "react-hook-form";
import { Grid, TextField } from "@mui/material";
import { DevTool } from "@hookform/devtools";

export interface PersonConfirmPassword {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function PersonConfirmPasswordComponent({
  formId,
  submitForm,
  changePassword = false,
}: {
  formId: string;
  submitForm: SubmitHandler<PersonConfirmPassword>;
  changePassword?: boolean;
}) {
  const {
    control,
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonConfirmPassword>({ mode: "onBlur" });

  return (
    <>
      <form id={formId} onSubmit={handleSubmit(submitForm)}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12}>
            <TextField
              hidden={!changePassword}
              label="Contraseña actual"
              type="password"
              {...register("currentPassword", {
                required: changePassword ? "Contraseña requerida" : false,
              })}
              error={Boolean(errors.currentPassword)}
              helperText={
                errors.currentPassword && errors.currentPassword.message
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              label="Nueva Contraseña"
              type="password"
              {...register("newPassword", {
                required: "Contraseña requerida",
              })}
              error={Boolean(errors.newPassword)}
              helperText={errors.newPassword && errors.newPassword.message}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              label="Confirmar contraseña"
              type="password"
              {...register("confirmPassword", {
                required: "Contraseña requerida",
                validate: (value) =>
                  value === getValues("newPassword") ||
                  "Las contraseñas no coinciden",
              })}
              error={Boolean(errors.confirmPassword)}
              helperText={
                errors.confirmPassword && errors.confirmPassword.message
              }
              fullWidth
            />
          </Grid>
        </Grid>
      </form>
      <DevTool control={control} />
    </>
  );
}
