import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { TextField, Grid, MenuItem } from "@mui/material";

import dayjs, { Dayjs } from "dayjs";
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

// Interfaz para los datos del formulario
export interface EncounterFormData {
  patientId: string;
  profesionalId: string;
  day: Dayjs;
  start: Dayjs;
  end: Dayjs;
  type: string;
}

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
          <TextField
            defaultValue={patientId}
            label="Paciente"
            {...register("patientId", {
              required: "Es necesario ingresar el paciente",
            })}
            fullWidth
            error={Boolean(errors.patientId)}
            helperText={errors.patientId && errors.patientId.message}
            onBlur={() => trigger("patientId")}
            inputProps={{ readOnly: !!patientId }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            defaultValue={"204"} //profesional de prueba
            label="Profesional"
            {...register("profesionalId", {
              required: "Es necesario ingresar el profesional",
            })}
            fullWidth
            error={Boolean(errors.profesionalId)}
            helperText={errors.profesionalId && errors.profesionalId.message}
            onBlur={() => trigger("profesionalId")}
            inputProps={{ readOnly: true }}
          />
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
