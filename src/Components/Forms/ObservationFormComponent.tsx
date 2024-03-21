import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { TextField, Grid, MenuItem } from "@mui/material";

import dayjs, { Dayjs } from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ValueSetExpansionContains } from "fhir/r4";
import AutocompleteFromServerComponent from "../AutocompleteFromServerComponent";
// Interfaz para los datos del formulario
export interface ObservationFormData {
  subject: string;
  encounter: string;
  performer: string;
  code: ValueSetExpansionContains;
  category: ValueSetExpansionContains; // https://hl7.org/fhir/valueset-observation-category.html
  interpretation: ValueSetExpansionContains; // https://hl7.org/fhir/valueset-observation-interpretation.html
  note: string; // https://hl7.org/fhir/datatypes.html#Annotation
  issued: Dayjs;
}

export default function ObservationFormComponent({
  formId,
  patientId,
  submitForm,
}: {
  formId: string;
  patientId: string;
  submitForm: SubmitHandler<ObservationFormData>;
}) {
  const category: ValueSetExpansionContains[] = [
    {
      code: "social-history",
      display: "Social History",
      system: "http://terminology.hl7.org/CodeSystem/observation-category",
    },
    {
      code: "vital-signs",
      display: "Vital Sings",
      system: "http://terminology.hl7.org/CodeSystem/observation-category",
    },
    {
      code: "imaging",
      display: "Imaging",
      system: "http://terminology.hl7.org/CodeSystem/observation-category",
    },
    {
      code: "laboratory",
      display: "Laboratory",
      system: "http://terminology.hl7.org/CodeSystem/observation-category",
    },
    {
      code: "procedure",
      display: "Procedure",
      system: "http://terminology.hl7.org/CodeSystem/observation-category",
    },
    {
      code: "survey",
      display: "Survery",
      system: "http://terminology.hl7.org/CodeSystem/observation-category",
    },
    {
      code: "exam",
      display: "Exam",
      system: "http://terminology.hl7.org/CodeSystem/observation-category",
    },
    {
      code: "therapy",
      display: "Therapy",
      system: "http://terminology.hl7.org/CodeSystem/observation-category",
    },
    {
      code: "activity",
      display: "Activity",
      system: "http://terminology.hl7.org/CodeSystem/observation-category",
    },
  ];

  const {
    control,
    register,
    trigger,
    handleSubmit,
    formState: { errors },
  } = useForm<ObservationFormData>();

  return (
    <form id={formId} onSubmit={handleSubmit(submitForm)}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12}>
          <TextField
            defaultValue={patientId}
            label="Paciente"
            {...register("subject", {
              required: "Es necesario ingresar el paciente",
            })}
            fullWidth
            error={Boolean(errors.subject)}
            helperText={errors.subject && errors.subject.message}
            onBlur={() => trigger("subject")}
            inputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            defaultValue={"204"}
            label="Profesional"
            {...register("performer", {
              required: "Es necesario ingresar el profesional",
            })}
            fullWidth
            error={Boolean(errors.performer)}
            helperText={errors.performer && errors.performer.message}
            onBlur={() => trigger("performer")}
            inputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <Controller
            name="code"
            control={control}
            render={({ field: { onChange, value } }) => (
              <AutocompleteFromServerComponent
                name="loinct"
                table="loinc-items"
                onChange={onChange}
                value={value}
                textFieldProps={{
                  ...register("code", {
                    required: "Código requerido",
                  }),
                  error: Boolean(errors.code),
                  helperText: errors.code && errors.code.message,
                  onBlur: () => trigger("code"),
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <Controller
            control={control}
            name="issued"
            defaultValue={dayjs()}
            render={({ field: { onChange, value, ref } }) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Fecha de registro"
                  onChange={onChange}
                  value={value}
                  inputRef={ref}
                  sx={{ width: "100%" }}
                ></DatePicker>
              </LocalizationProvider>
            )}
          ></Controller>
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            select
            label="Categoría"
            defaultValue="vital-signs"
            {...register("category", {
              required: "Tipo de consulta requerida",
            })}
            fullWidth
            error={Boolean(errors.category)}
            helperText={errors.category && errors.category.message}
            onBlur={() => trigger("category")}
          >
            {category.map((item) => (
              <MenuItem key={item.code} value={item.code}>
                {item.display}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            multiline
            fullWidth
            rows={3}
            label="Notas"
            {...register("note")}
            error={Boolean(errors.note)}
            helperText={errors.note && errors.note.message}
            onBlur={() => trigger("note")}
          ></TextField>
        </Grid>
      </Grid>
    </form>
  );
}
