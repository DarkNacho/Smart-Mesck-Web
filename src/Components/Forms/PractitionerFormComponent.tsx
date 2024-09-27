import { DevTool } from "@hookform/devtools";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { TextField, Grid, MenuItem, Autocomplete } from "@mui/material";
import {
  generoOptions,
  practitionerRole,
  practitionerSpecialty,
  countryCodes,
} from "./Terminology";
import PersonUtil from "../../Services/Utils/PersonUtils";

import { Coding, Practitioner, PractitionerRole } from "fhir/r4";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import FhirResourceService from "../../Services/FhirService";
import { useEffect, useState } from "react";

// Interfaz para los datos del formulario
export interface PractitionerFormData {
  practitionerId?: string;
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
  specialty: Coding[];
  role: Coding[];
  practitionerRoleId?: string;
  agendaUrl?: string; //TODO: hacerlo obligatorio
}

export default function PractitionerFormComponent({
  formId,
  submitForm,
  practitionerId,
}: {
  formId: string;
  submitForm: SubmitHandler<PractitionerFormData>;
  practitionerId?: string;
}) {
  const [loading, setLoading] = useState(true);

  const fetchDefaultResource = async () => {
    if (!practitionerId) {
      setLoading(false);
      return;
    }
    try {
      const resultPractitioner = await new FhirResourceService<Practitioner>(
        "Practitioner"
      ).getById(practitionerId);
      if (!resultPractitioner.success)
        throw new Error(resultPractitioner.error);

      const resultPractitionerRole =
        await new FhirResourceService<PractitionerRole>(
          "PractitionerRole"
        ).getResources({ practitioner: practitionerId });

      if (!resultPractitionerRole.success)
        throw new Error(resultPractitionerRole.error);

      const practitionerFormData = PersonUtil.PractitionerToPractitionerForm(
        resultPractitioner.data,
        resultPractitionerRole.data[0]
      );

      reset(practitionerFormData);
      console.log("Practitioner:", resultPractitioner.data);
      console.log("PractitionerRole:", resultPractitionerRole.data);
      console.log("PractitionerFormData:", practitionerFormData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PractitionerFormData>({
    mode: "onBlur",
    defaultValues: {
      nombre: "",
      segundoNombre: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      genero: "unknown",
      rut: "",
      countryCode: "+56",
      fechaNacimiento: dayjs().subtract(18, "year"),
      numeroTelefonico: "",
      email: "",
      photo: "",
      specialty: [],
      role: [],
    },
  });

  useEffect(() => {
    fetchDefaultResource();
  }, [practitionerId]);

  if (loading) return <div>Loading...</div>;

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
            <Controller
              control={control}
              name="fechaNacimiento"
              render={({ field: { onChange, value, ref } }) => (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    maxDate={dayjs().year(dayjs().year() - 18)}
                    label="Fecha de Nacimiento"
                    onChange={onChange}
                    value={value}
                    inputRef={ref}
                    sx={{ width: "100%" }}
                  ></DatePicker>
                </LocalizationProvider>
              )}
            ></Controller>
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
              disabled={Boolean(practitionerId)}
            />
          </Grid>
          <Grid item xs={12} sm={1.5}>
            <TextField
              select
              fullWidth
              defaultValue="+56"
              label="Código"
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
              {...register("numeroTelefonico")}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={12}>
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

          <Grid item xs={12} sm={12}>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  id="Autocomplete-role"
                  multiple
                  options={practitionerRole}
                  getOptionLabel={(option) =>
                    option.display || option.code || "UNKNOWN"
                  }
                  isOptionEqualToValue={(option, value) =>
                    option.code === value.code
                  }
                  value={field.value}
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
                      label="Roles"
                      variant="outlined"
                    />
                  )}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Controller
              name="specialty"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  id="Autocomplete-specialty"
                  multiple
                  options={practitionerSpecialty}
                  getOptionLabel={(option) =>
                    option.display || option.code || "UNKNOWN"
                  }
                  isOptionEqualToValue={(option, value) =>
                    option.code === value.code
                  }
                  onChange={(_, newValue) => field.onChange(newValue)}
                  value={field.value}
                  renderOption={(props, option) => (
                    <li {...props} key={option.code}>
                      {option.display}
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      label="Especialidad"
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
          <Grid item xs={12} sm={12}>
            <TextField label="Agenda" {...register("agendaUrl")} fullWidth />
          </Grid>
        </Grid>
      </form>
      <DevTool control={control} />
    </>
  );
}
