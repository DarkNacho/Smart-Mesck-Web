import React from "react";
import { DevTool } from "@hookform/devtools";
import {
  useForm,
  SubmitHandler,
  useFieldArray,
  Controller,
} from "react-hook-form";
import {
  TextField,
  Grid,
  MenuItem,
  IconButton,
  Autocomplete,
} from "@mui/material";
import {
  generoOptions,
  countryCodes,
  maritalOptions,
  contactTypes,
} from "./Terminology";
import PersonUtil from "../../Services/Utils/PersonUtils";
import { Add, Remove } from "@mui/icons-material";
import { Coding } from "fhir/r4";

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
  maritalStatus: Coding | undefined;
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
                validate: (value) =>
                  PersonUtil.RutValidation(value) || "Rut inválido",
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
          <Grid item xs={12} sm={6}>
            <Controller
              name="maritalStatus"
              control={control}
              defaultValue={maritalOptions[0]}
              render={({ field }) => (
                <Autocomplete
                  id="Autocomplete-marital"
                  options={maritalOptions}
                  defaultValue={maritalOptions[0]}
                  getOptionLabel={(option) =>
                    option.display || option.code || "unk"
                  }
                  isOptionEqualToValue={(option, value) =>
                    option.code === value.code
                  }
                  onChange={(_, newValue) => field.onChange(newValue)}
                  renderOption={(props, option) => (
                    <li {...props} key={option.code}>
                      {option.display}
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      label="Estado Civil"
                      variant="outlined"
                    />
                  )}
                />
              )}
            />
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
              <Grid item xs={12} sm={6}>
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
                  {...register(`contact.${index}.email`, {
                    required: "Correo electrónico requerido",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Correo electrónico inválido",
                    },
                  })}
                  error={Boolean(errors.contact?.[index]?.email)}
                  helperText={
                    errors.contact?.[index]?.email &&
                    errors.contact?.[index]?.email?.message
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
                  {...register(`contact.${index}.countryCode`, {
                    required: "Código de país requerido",
                  })}
                  error={Boolean(errors.contact?.[index]?.countryCode)}
                  helperText={
                    errors.contact?.[index]?.countryCode &&
                    errors.contact?.[index]?.countryCode?.message
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
                  {...register(`contact.${index}.numeroTelefonico`, {
                    required: "Número telefónico requerido",
                    pattern: {
                      value: /^[0-9]+$/i,
                      message: "Número telefónico inválido",
                    },
                  })}
                  error={Boolean(errors.contact?.[index]?.numeroTelefonico)}
                  helperText={
                    errors.contact?.[index]?.numeroTelefonico &&
                    errors.contact?.[index]?.numeroTelefonico?.message
                  }
                  fullWidth
                />
              </Grid>
              <IconButton
                onClick={() => remove(index)}
                color="primary"
                aria-label="remove"
              >
                <Remove />
              </IconButton>
            </React.Fragment>
          ))}
          <IconButton
            onClick={() =>
              append({
                nombre: "",
                segundoNombre: "",
                apellidoPaterno: "",
                apellidoMaterno: "",
                numeroTelefonico: "",
                contactType: "N",
                email: "",
                countryCode: "+56",
              })
            }
            color="primary"
            aria-label="add"
          >
            <Add />
          </IconButton>
        </Grid>
      </form>
      <DevTool control={control} />
    </>
  );
}
