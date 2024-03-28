import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { TextField, Grid, MenuItem } from "@mui/material";

import dayjs, { Dayjs } from "dayjs";
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Patient, Practitioner } from "fhir/r4";
import AutocompleteFromFhirComponent from "../AutoCompleteComponets/AutocompleteFromFhirComponent";
import PersonUtil from "../../Services/Utils/PersonUtils";

// Interfaz para los datos del formulario
export interface EncounterFormData {
  patientId: string;
  patient: Patient;
  practitioner: Practitioner;
  day: Dayjs;
  start: Dayjs;
  end: Dayjs;
  type: string;
}

const userRol = localStorage.getItem("userRol");
const practitionerId = localStorage.getItem("id");

export default function EncounterFormComponent({
  formId,
  patientId,
  submitForm,
}: {
  formId: string;
  patientId?: string;
  submitForm: SubmitHandler<EncounterFormData>;
}) {
  const {
    control,
    register,
    trigger,
    handleSubmit,
    formState: { errors },
  } = useForm<EncounterFormData>();

  const encounterType = [
    { value: "UKN", label: "No especificado" },
    { value: "A", label: "Ambulatorio" },
    { value: "otro1", label: "adsada" },
    { value: "other", label: "Otro" },
  ];

  return (
    <form id={formId} onSubmit={handleSubmit(submitForm)}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Controller
            control={control}
            name="patient"
            render={({ field: { onChange, value } }) => (
              <AutocompleteFromFhirComponent<Patient>
                label="Seleccione Paciente"
                onChange={onChange}
                getDispay={PersonUtil.parsePersonName}
                resourceType={"Patient"}
                searchParam="name"
                defaultResourceId={patientId}
                readOnly={!!patientId}
                defaultParams={
                  userRol === "Practitioner"
                    ? { "general-practitioner": `${practitionerId}` }
                    : {}
                }
                textFieldProps={{
                  ...register("patient", {
                    required: "paciente requerido",
                  }),
                  error: Boolean(errors.patient),
                  helperText: errors.patient && errors.patient.message,
                  onBlur: () => trigger("patient"),
                }}
              ></AutocompleteFromFhirComponent>
            )}
          ></Controller>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            control={control}
            name="practitioner"
            render={({ field: { onChange, value } }) => (
              <AutocompleteFromFhirComponent<Practitioner>
                label="Seleccione Profesional"
                onChange={onChange}
                getDispay={PersonUtil.parsePersonName}
                resourceType={"Practitioner"}
                searchParam="name"
                defaultResourceId={localStorage.getItem("id")!}
                readOnly={userRol === "Practitioner"}
                textFieldProps={{
                  ...register("practitioner", {
                    required: "profesional requerido",
                  }),
                  error: Boolean(errors.practitioner),
                  helperText:
                    errors.practitioner && errors.practitioner.message,
                  onBlur: () => trigger("practitioner"),
                }}
              ></AutocompleteFromFhirComponent>
            )}
          ></Controller>
        </Grid>
        <Grid item xs={12} sm={2.8}>
          <Controller
            control={control}
            name="day"
            defaultValue={dayjs()}
            render={({ field: { onChange, value, ref } }) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Fecha inicio test"
                  onChange={onChange}
                  value={value}
                  inputRef={ref}
                  sx={{ width: "100%" }}
                ></DatePicker>
              </LocalizationProvider>
            )}
          ></Controller>
        </Grid>
        <Grid item xs={12} sm={2.6}>
          <Controller
            control={control}
            name="start"
            defaultValue={dayjs()}
            render={({ field: { onChange, value, ref } }) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker
                  label="start"
                  onChange={onChange}
                  value={value}
                  inputRef={ref}
                  sx={{ width: "100%" }}
                ></TimePicker>
              </LocalizationProvider>
            )}
          ></Controller>
        </Grid>
        <Grid item xs={12} sm={2.6}>
          <Controller
            control={control}
            defaultValue={dayjs().add(30, "minutes")}
            name="end"
            render={({ field: { onChange, value, ref } }) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker
                  label="end"
                  onChange={onChange}
                  value={value}
                  inputRef={ref}
                  sx={{ width: "100%" }}
                ></TimePicker>
              </LocalizationProvider>
            )}
          ></Controller>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            select
            label="Tipo"
            defaultValue="A"
            {...register("type", {
              required: "Tipo de consulta requerida",
            })}
            fullWidth
            error={Boolean(errors.type)}
            helperText={errors.type && errors.type.message}
            onBlur={() => trigger("type")}
          >
            {encounterType.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
    </form>
  );
}
