import { useForm, SubmitHandler } from "react-hook-form";
import { TextField, Grid, MenuItem } from "@mui/material";
import { generoOptions } from "./Terminology";

// Función para validar el Rut
const validarRut = (rut: string) => {
  // Eliminar puntos y guiones del RUT y convertir la letra a mayúscula
  rut = rut.replace(/\./g, "").replace(/-/g, "").toUpperCase();

  // Extraer dígito verificador y número
  const dv = rut.slice(-1);
  let rutNumerico = parseInt(rut.slice(0, -1), 10);

  // Calcular dígito verificador esperado
  let m = 0;
  let s = 1;
  for (; rutNumerico; rutNumerico = Math.floor(rutNumerico / 10)) {
    s = (s + (rutNumerico % 10) * (9 - (m++ % 6))) % 11;
  }

  const dvEsperado = (s ? s - 1 : "K").toString();

  // Verificar si el dígito verificador es correcto
  return dv === dvEsperado;
};

// Interfaz para los datos del formulario
export interface PractitionerFormData {
  nombre: string;
  segundoNombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento: string;
  genero: string;
  rut: string;
  numeroTelefonico: string;
  email: string;
  photo: string;
}

export default function PractitionerFormComponent({
  formId,
  submitForm,
}: {
  formId: string;
  submitForm: SubmitHandler<PractitionerFormData>;
}) {
  const {
    register,
    trigger,
    handleSubmit,
    formState: { errors },
  } = useForm<PractitionerFormData>();

  return (
    <form id={formId} onSubmit={handleSubmit(submitForm)}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Nombre"
            {...register("nombre", {
              required: "El Nombre es necesario",
            })}
            fullWidth
            error={Boolean(errors.nombre)}
            helperText={errors.nombre && errors.nombre.message}
            onBlur={() => trigger("nombre")}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Segundo Nombre"
            {...register("segundoNombre")}
            fullWidth
            onBlur={() => trigger("segundoNombre")}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Apellido Paterno"
            {...register("apellidoPaterno", {
              required: "El Apellido Paterno es necesario",
            })}
            fullWidth
            error={Boolean(errors.apellidoPaterno)}
            helperText={
              errors.apellidoPaterno && errors.apellidoPaterno.message
            }
            onBlur={() => trigger("apellidoPaterno")}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Apellido Materno"
            {...register("apellidoMaterno")}
            fullWidth
            onBlur={() => trigger("apellidoMaterno")}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Fecha de Nacimiento"
            type="date"
            {...register("fechaNacimiento", {
              required: "La Fecha de Nacimiento es necesaria",
            })}
            InputLabelProps={{ shrink: true }}
            fullWidth
            error={Boolean(errors.fechaNacimiento)}
            helperText={
              errors.fechaNacimiento && errors.fechaNacimiento.message
            }
            onBlur={() => trigger("fechaNacimiento")}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            label="Género"
            defaultValue="unknown"
            {...register("genero", {
              required: "El Género es necesario",
            })}
            fullWidth
            error={Boolean(errors.genero)}
            helperText={errors.genero && errors.genero.message}
            onBlur={() => trigger("genero")}
          >
            {generoOptions.map((option) => (
              <MenuItem key={option.code} value={option.code}>
                {option.display}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Rut"
            {...register("rut", {
              required: "El Rut es necesario",
              validate: (value) => validarRut(value) || "Rut inválido",
            })}
            fullWidth
            error={Boolean(errors.rut)}
            helperText={errors.rut && errors.rut.message}
            onBlur={() => trigger("rut")}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Número Telefónico"
            {...register("numeroTelefonico")}
            fullWidth
            onBlur={() => trigger("numeroTelefonico")}
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
            onBlur={() => trigger("email")}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField label="Foto" {...register("photo")} fullWidth />
        </Grid>
      </Grid>
    </form>
  );
}
