import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { Autocomplete, Grid, MenuItem, TextField } from "@mui/material";
import { generoOptions, maritalOptions } from "../Terminology";
import PersonUtil from "../../../Services/Utils/PersonUtils";
import { Coding } from "fhir/r4";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export interface PersonDetails {
  nombre: string;
  segundoNombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento: Dayjs;
  genero: string;
  maritalStatus: Coding;
  rut: string;
}

export default function PersonDetailsFormComponent({
  formId,
  submitForm,
  person,
}: {
  formId: string;
  submitForm: SubmitHandler<PersonDetails>;
  person?: PersonDetails;
}) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonDetails>({
    defaultValues: {
      nombre: person?.nombre || "",
      segundoNombre: person?.segundoNombre || "",
      apellidoPaterno: person?.apellidoPaterno || "",
      apellidoMaterno: person?.apellidoMaterno || "",
      fechaNacimiento: person?.fechaNacimiento
        ? dayjs(person?.fechaNacimiento)
        : dayjs().subtract(18, "years"),
      genero: person?.genero || "unknown",
      maritalStatus: person?.maritalStatus || maritalOptions[0],
      rut: person?.rut || "",
    },
    mode: "onBlur",
  });

  console.log("Person:", person);
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
                    format="DD-MM-YYYY"
                    views={["year", "month", "day"]}
                    maxDate={dayjs()}
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
            <Controller
              name="maritalStatus"
              control={control}
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
              disabled={Boolean(person)}
            />
          </Grid>
        </Grid>
      </form>
      <DevTool control={control} />
    </>
  );
}
