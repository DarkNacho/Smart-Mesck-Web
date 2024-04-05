import { DevTool } from "@hookform/devtools";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { TextField, Grid, MenuItem } from "@mui/material";
import React from "react";

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

// Opciones para el campo de género
const generoOptions = [
  { value: "unknown", label: "No especificado" },
  { value: "male", label: "Masculino" },
  { value: "female", label: "Femenino" },
  { value: "other", label: "Otro" },
];

const maritalOptions = [
  { value: "A", label: "Annulled" },
  { value: "D", label: "Divorced" },
  { value: "I", label: "Interlocutory" },
  { value: "L", label: "Legally Separated" },
  { value: "M", label: "Married" },
  { value: "C", label: "Common Law" },
  { value: "S", label: "Never Married" },
  { value: "UNK", label: "unknown" },
];

const contactTypes = [
  { value: "C", label: "Contacto de Emergencia" },
  { value: "E", label: "Empleador" },
  { value: "F", label: "Agencia Federal" },
  { value: "I", label: "Compañía de Seguros" },
  { value: "N", label: "Familiar más Cercano" },
  { value: "S", label: "Agencia Estatal" },
  { value: "U", label: "Desconocido" },
];

const countryCodes = [
  // América
  { value: "+1", label: "Estados Unidos / Canadá" },
  { value: "+52", label: "México" },
  { value: "+55", label: "Brasil" },
  { value: "+54", label: "Argentina" },
  { value: "+57", label: "Colombia" },
  { value: "+56", label: "Chile" },
  { value: "+58", label: "Venezuela" },
  { value: "+51", label: "Perú" },
  { value: "+593", label: "Ecuador" },
  { value: "+53", label: "Cuba" },
  { value: "+591", label: "Bolivia" },
  { value: "+506", label: "Costa Rica" },
  { value: "+507", label: "Panamá" },
  { value: "+598", label: "Uruguay" },
  // Europa
  { value: "+34", label: "España" },
  { value: "+49", label: "Alemania" },
  { value: "+33", label: "Francia" },
  { value: "+39", label: "Italia" },
  { value: "+44", label: "Reino Unido" },
  { value: "+7", label: "Rusia" },
  { value: "+380", label: "Ucrania" },
  { value: "+48", label: "Polonia" },
  { value: "+40", label: "Rumania" },
  { value: "+31", label: "Países Bajos" },
  { value: "+32", label: "Bélgica" },
  { value: "+30", label: "Grecia" },
  { value: "+351", label: "Portugal" },
  { value: "+46", label: "Suecia" },
  { value: "+47", label: "Noruega" },
  // Asia
  { value: "+86", label: "China" },
  { value: "+91", label: "India" },
  { value: "+81", label: "Japón" },
  { value: "+82", label: "Corea del Sur" },
  { value: "+62", label: "Indonesia" },
  { value: "+90", label: "Turquía" },
  { value: "+63", label: "Filipinas" },
  { value: "+66", label: "Tailandia" },
  { value: "+84", label: "Vietnam" },
  { value: "+972", label: "Israel" },
  { value: "+60", label: "Malasia" },
  { value: "+65", label: "Singapur" },
  { value: "+92", label: "Pakistán" },
  { value: "+880", label: "Bangladés" },
  { value: "+966", label: "Arabia Saudita" },
  // África
  { value: "+20", label: "Egipto" },
  { value: "+27", label: "Sudáfrica" },
  { value: "+234", label: "Nigeria" },
  { value: "+254", label: "Kenia" },
  { value: "+212", label: "Marruecos" },
  { value: "+213", label: "Argelia" },
  { value: "+256", label: "Uganda" },
  { value: "+233", label: "Ghana" },
  { value: "+237", label: "Camerún" },
  { value: "+225", label: "Costa de Marfil" },
  { value: "+221", label: "Senegal" },
  { value: "+255", label: "Tanzania" },
  { value: "+249", label: "Sudán" },
  { value: "+218", label: "Libia" },
  { value: "+216", label: "Túnez" },
  // Oceanía
  { value: "+61", label: "Australia" },
  { value: "+64", label: "Nueva Zelanda" },
  { value: "+679", label: "Fiji" },
  { value: "+675", label: "Papúa Nueva Guinea" },
  { value: "+676", label: "Tonga" },
  // Medio Oriente
  { value: "+98", label: "Irán" },
  { value: "+964", label: "Iraq" },
  { value: "+962", label: "Jordania" },
  { value: "+961", label: "Líbano" },
  { value: "+965", label: "Kuwait" },
  { value: "+971", label: "Emiratos Árabes Unidos" },
  { value: "+968", label: "Omán" },
  { value: "+974", label: "Catar" },
  { value: "+973", label: "Bahrein" },
  { value: "+967", label: "Yemen" },
];

// Interfaz para los datos del formulario
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
  maritalStatus: string;
  contact: {
    nombre: string;
    segundoNombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    numeroTelefonico: string;
    contactType: string;
  }[];
}

export default function PatientFormComponent({
  formId,
  submitForm,
}: {
  formId: string;
  submitForm: SubmitHandler<PatientFormData>;
}) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PatientFormData>({
    defaultValues: {
      contact: [
        {
          nombre: "",
          segundoNombre: "",
          apellidoPaterno: "",
          apellidoMaterno: "",
          numeroTelefonico: "",
          contactType: "N",
        },
      ],
    },
    mode: "onBlur",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "contact",
  });

  return (
    <>
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
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Segundo Nombre"
              {...register("segundoNombre")}
              fullWidth
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
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Apellido Materno"
              {...register("apellidoMaterno")}
              fullWidth
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
            >
              {generoOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
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
            />
          </Grid>
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
                <MenuItem key={option.value} value={option.value}>
                  {option.value}
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
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Estado Civil"
              defaultValue="S"
              {...register("maritalStatus")}
              fullWidth
              error={Boolean(errors.genero)}
              helperText={errors.genero && errors.genero.message}
            >
              {maritalOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField label="Foto" {...register("photo")} fullWidth />
          </Grid>
          {/* Contactos de emergencia */}
          <Grid item xs={12} sm={12}>
            <h1>Contactos:</h1>
          </Grid>
          {fields.map((field, index) => (
            <React.Fragment key={field.id}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Nombre"
                  {...register(`contact.${index}.nombre`, {
                    required: "El Nombre de contacto es requerido",
                  })}
                  fullWidth
                  error={Boolean(errors.contact?.[index]?.nombre)}
                  helperText={
                    errors.contact?.[index]?.nombre &&
                    errors.contact?.[index]?.nombre?.message
                  }
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  select
                  label="Relación"
                  defaultValue="N"
                  {...register(`contact.${index}.contactType`)}
                  fullWidth
                  error={Boolean(errors.contact?.[index]?.contactType)}
                  helperText={
                    errors.contact?.[index]?.contactType &&
                    errors.contact?.[index]?.contactType?.message
                  }
                >
                  {contactTypes.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <button type="button" onClick={() => remove(index)}>
                Delete
              </button>
            </React.Fragment>
          ))}
          <button
            type="button"
            onClick={() =>
              append({
                nombre: "",
                segundoNombre: "",
                apellidoPaterno: "",
                apellidoMaterno: "",
                numeroTelefonico: "",
                contactType: "N",
              })
            }
          >
            Agregar
          </button>
        </Grid>
      </form>
      <DevTool control={control} />
    </>
  );
}
