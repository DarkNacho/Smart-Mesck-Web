import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { TextField, Grid, Autocomplete, Checkbox } from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Observation, ValueSetExpansionContains } from "fhir/r4";
import AutocompleteFromServerComponent from "../AutoCompleteComponets/AutocompleteFromServerComponent";
import ObservationService from "../../Services/ObservationService";

// Interfaz para los datos del formulario
export interface ObservationFormData {
  subject: string;
  encounter: string;
  performer: string;
  code: ValueSetExpansionContains;
  category: ValueSetExpansionContains[]; // https://hl7.org/fhir/valueset-observation-category.html
  interpretation: ValueSetExpansionContains[]; // https://hl7.org/fhir/valueset-observation-interpretation.html
  note: string; // https://hl7.org/fhir/datatypes.html#Annotation
  issued: Dayjs;
  valueString: string;
}

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function ObservationFormComponent({
  formId,
  patientId,
  submitForm,
  observation,
  readOnly = true,
}: {
  formId: string;
  patientId: string;
  submitForm: SubmitHandler<ObservationFormData>;
  observation: Observation;
  readOnly?: boolean;
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

  const interpretation: ValueSetExpansionContains[] = [
    {
      code: "N",
      display: "Normal",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "_GeneticObservationInterpretation icon",
      display: "GeneticObservationInterpretation",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "CAR",
      display: "Carrier",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "B",
      display: "Better",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "D",
      display: "Significant change down",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "U",
      display: "Significant change up",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "W",
      display: "Worse",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "<",
      display: "Off scale low",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: ">",
      display: "Off scale high",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "IE",
      display: "Insufficient evidence",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "A",
      display: "Abnormal",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "AA",
      display: "Critical abnormal",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "HH",
      display: "Critical high",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "LL",
      display: "Critical low",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "H",
      display: "High",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "HU",
      display: "Significantly high",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "L",
      display: "Low",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "LU",
      display: "Significantly low",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "I",
      display: "Intermediate",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "NCL",
      display: "No CLSI defined breakpoint",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "NS",
      display: "Non-susceptible",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "R",
      display: "Resistant",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "SYN-R",
      display: "Synergy - resistant",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "S",
      display: "Susceptible",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "SSD",
      display: "Susceptible-dose dependent",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "SYN-S",
      display: "Synergy - susceptibl",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "EX",
      display: "outside threshold",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "HX",
      display: "above high threshold",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "LX",
      display: "below low threshold",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "ObservationInterpretationDetection",
      display: "ObservationInterpretationDetection",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "IND",
      display: "Indeterminate",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "E",
      display: "Equivocal",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "NEG",
      display: "Negative",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "ND",
      display: "Not detected",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "POS",
      display: "Positive",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "DET",
      display: "Detected",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "EXP",
      display: "Expected",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "UNE",
      display: "Unexpected",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "NR",
      display: "Non-reactive",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "RR",
      display: "Reactive",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "WR",
      display: "Weakly reactive",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
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
            defaultValue={observation ? observation.code?.coding?.[0] : {}}
            render={({ field: { onChange, value } }) => (
              <AutocompleteFromServerComponent
                name="loinct"
                table="loinc-items"
                onChange={onChange}
                value={value}
                readOnly={!!observation.code?.coding || false || readOnly}
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
                  readOnly={readOnly}
                ></DatePicker>
              </LocalizationProvider>
            )}
          ></Controller>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Controller
            name="category"
            control={control}
            defaultValue={observation.category?.[0].coding || []}
            render={({ field: { onChange, value } }) => (
              <Autocomplete
                multiple
                id="checkboxes-category-demo"
                options={category}
                disableCloseOnSelect
                getOptionLabel={(option) => option.display || "UNKNOW"}
                value={value}
                onChange={(_, newValue) => onChange(newValue)}
                readOnly={readOnly}
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox
                      icon={icon}
                      checkedIcon={checkedIcon}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    {option.display}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField {...params} label="Categorias" />
                )}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <Controller
            name="interpretation"
            control={control}
            defaultValue={observation.interpretation?.[0].coding || []}
            render={({ field: { onChange, value } }) => (
              <Autocomplete
                multiple
                id="checkboxes-tags-demo"
                options={interpretation}
                disableCloseOnSelect
                getOptionLabel={(option) => option.display || "UNKNOW"}
                value={value}
                onChange={(_, newValue) => onChange(newValue)}
                readOnly={readOnly}
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox
                      icon={icon}
                      checkedIcon={checkedIcon}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    {option.display}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField {...params} label="Interpretación" />
                )}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            multiline
            fullWidth
            defaultValue={observation?.note?.[0].text || ""}
            rows={3}
            label="Notas"
            {...register("note")}
            error={Boolean(errors.note)}
            helperText={errors.note && errors.note.message}
            onBlur={() => trigger("note")}
            inputProps={{ readOnly: readOnly }}
          ></TextField>
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            fullWidth
            defaultValue={new ObservationService().getValue(observation)}
            label="Valor"
            {...register("valueString")}
            error={Boolean(errors.valueString)}
            helperText={errors.valueString && errors.valueString.message}
            onBlur={() => trigger("valueString")}
            inputProps={{ readOnly: readOnly }}
          ></TextField>
        </Grid>
      </Grid>
    </form>
  );
}
