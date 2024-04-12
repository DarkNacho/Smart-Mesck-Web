import { DevTool } from "@hookform/devtools";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { TextField, Grid, MenuItem, Autocomplete } from "@mui/material";
import { generoOptions } from "./Terminology";
import PersonUtil from "../../Services/Utils/PersonUtils";

import { Coding, ValueSet } from "fhir/r4";
import FhirResourceService from "../../Services/FhirService";
import ValueSetUtils from "../../Services/Utils/ValueSetUtils";
import { useEffect, useState } from "react";

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
  specialty: Coding[];
  role: Coding[];
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
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PractitionerFormData>({ mode: "onBlur" });

  const [specialtyOptions, setSpecialtyOptions] = useState<Coding[]>([]);
  const [loadingSpecialty, setLoadingSpecialty] = useState<boolean>(true);

  const [roleOptions, setRoleOptions] = useState<Coding[]>([]);
  const [loadingRole, setLoadingRole] = useState<boolean>(true);

  const fetchSpecialty = async () => {
    try {
      const response = await new FhirResourceService<ValueSet>(
        "ValueSet"
      ).getById("257");
      if (!response.success) throw new Error(response.error);
      setSpecialtyOptions(
        ValueSetUtils.convertValueSetToCodingArray(response.data)
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingSpecialty(false);
    }
  };

  const fetchRole = async () => {
    try {
      const response = await new FhirResourceService<ValueSet>(
        "ValueSet"
      ).getById("232");
      if (!response.success) throw new Error(response.error);
      setRoleOptions(ValueSetUtils.convertValueSetToCodingArray(response.data));
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingRole(false);
    }
  };

  useEffect(() => {
    fetchSpecialty();
    fetchRole();
  }, []);

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
          <Grid item xs={12} sm={6}>
            <TextField
              label="Número Telefónico"
              {...register("numeroTelefonico")}
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
          <Grid item xs={12} sm={12}>
            <TextField label="Foto" {...register("photo")} fullWidth />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  id="Autocomplete-role"
                  multiple
                  options={roleOptions}
                  loading={loadingRole}
                  getOptionLabel={(option) =>
                    option.display || option.code || "UNKNOWN"
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
                  options={specialtyOptions}
                  loading={loadingSpecialty}
                  getOptionLabel={(option) =>
                    option.display || option.code || "UNKNOWN"
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
                      label="Especialidad"
                      variant="outlined"
                    />
                  )}
                />
              )}
            />
          </Grid>
        </Grid>
      </form>
      <DevTool control={control} />
    </>
  );
}
