import { DevTool } from "@hookform/devtools";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { TextField, Autocomplete, Stack } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Observation, Patient, Practitioner, Encounter, Coding } from "fhir/r4";

import { category, interpretation } from "./Terminology";
import ObservationUtils from "../../Services/Utils/ObservationUtils";
import AutoCompleteFromLHCComponentComponent from "../AutoCompleteComponents/AutoCompleteFromLHCComponent";
import AutoCompleteComponent from "../AutoCompleteComponents/AutoCompleteComponent";
import PersonUtil from "../../Services/Utils/PersonUtils";
import EncounterUtils from "../../Services/Utils/EncounterUtils";
import { loadUserRoleFromLocalStorage } from "../../RolUser";

function getEncounterDisplay(resource: Encounter): string {
  return `Profesional: ${EncounterUtils.getPrimaryPractitioner(
    resource
  )} -- ${EncounterUtils.getFormatPeriod(resource.period!)}`;
}

// Interfaz para los datos del formulario
export interface ObservationFormData {
  performer: {
    id: string;
    display: string;
  };
  subject: {
    id: string;
    display: string;
  };
  encounter: {
    id: string;
    display: string;
  };

  code: Coding;
  category: Coding[]; // https://hl7.org/fhir/valueset-observation-category.html
  interpretation: Coding[]; // https://hl7.org/fhir/valueset-observation-interpretation.html
  note: string; // https://hl7.org/fhir/datatypes.html#Annotation
  issued: Dayjs;
  valueString: string;
}

export default function ObservationFormComponent({
  formId,
  patientId,
  submitForm,
  observation,
  practitionerId,
  readOnly = false,
}: {
  formId: string;
  patientId?: string;
  submitForm: SubmitHandler<ObservationFormData>;
  observation?: Observation;
  practitionerId?: string;
  readOnly?: boolean;
}) {
  const {
    control,
    register,
    trigger,
    handleSubmit,
    formState: { errors },
  } = useForm<ObservationFormData>();

  const roleUser = loadUserRoleFromLocalStorage();
  const encounterId = ObservationUtils.getEncounterId(observation!);
  console.log("EncounterId", encounterId);
  return (
    <>
      <form id={formId} onSubmit={handleSubmit(submitForm)}>
        <Stack spacing={2}>
          <Controller
            name="performer"
            control={control}
            rules={{
              required: "Es necesario seleccionar un Profesional",
            }}
            render={({ field }) => (
              <AutoCompleteComponent<Practitioner>
                resourceType={"Practitioner"}
                label={"Selecciona Profesional"}
                getDisplay={PersonUtil.getPersonNameAsString}
                searchParam={"name"}
                defaultResourceId={practitionerId}
                onChange={(selectedObject) => {
                  if (selectedObject) {
                    field.onChange({
                      id: selectedObject.id,
                      display: PersonUtil.getPersonNameAsString(selectedObject),
                    });
                  } else {
                    field.onChange(null);
                  }
                }}
                readOnly={
                  readOnly || !(roleUser === "Admin") || Boolean(encounterId)
                }
                textFieldProps={{
                  error: Boolean(errors.performer),
                  helperText: errors.performer && errors.performer.message,
                }}
              />
            )}
          />
          <Controller
            name="subject"
            control={control}
            rules={{
              required: "Es necesario seleccionar un Paciente",
            }}
            render={({ field }) => (
              <AutoCompleteComponent<Patient>
                resourceType={"Patient"}
                label={"Selecciona Paciente"}
                getDisplay={PersonUtil.getPersonNameAsString}
                searchParam={"name"}
                defaultResourceId={patientId}
                defaultParams={
                  roleUser === "Practitioner"
                    ? { "general-practitioner": practitionerId! }
                    : {}
                }
                onChange={(selectedObject) => {
                  if (selectedObject) {
                    field.onChange({
                      id: selectedObject.id,
                      display: PersonUtil.getPersonNameAsString(selectedObject),
                    });
                  } else {
                    field.onChange(null);
                  }
                }}
                readOnly={readOnly || Boolean(patientId)}
                textFieldProps={{
                  error: Boolean(errors.subject),
                  helperText: errors.subject && errors.subject.message,
                }}
              />
            )}
          />
          <Controller
            name="code"
            control={control}
            defaultValue={observation ? observation.code?.coding?.[0] : {}}
            render={({ field: { onChange } }) => (
              <AutoCompleteFromLHCComponentComponent
                label="loinc"
                table="loinc-items"
                onChange={onChange}
                defaultResource={observation?.code?.coding?.[0]}
                readOnly={!!observation?.code?.coding || false || readOnly}
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
          <Controller
            name="category"
            control={control}
            defaultValue={observation?.category?.[0].coding || []}
            render={({ field }) => (
              <Autocomplete
                id="Autocomplete-category"
                multiple
                options={category}
                defaultValue={observation?.category?.[0].coding || []}
                getOptionLabel={(option) =>
                  option.display || option.code || "UNKNOWN"
                }
                isOptionEqualToValue={(option, value) =>
                  option.code === value.code
                }
                readOnly={readOnly}
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
                    label="Categoría"
                    variant="outlined"
                  />
                )}
              />
            )}
          />
          <Controller
            name="interpretation"
            control={control}
            defaultValue={observation?.interpretation?.[0].coding || []}
            render={({ field }) => (
              <Autocomplete
                id="Autocomplete-interpretation"
                multiple
                options={interpretation}
                defaultValue={observation?.interpretation?.[0].coding || []}
                getOptionLabel={(option) =>
                  option.display || option.code || "UNKNOWN"
                }
                isOptionEqualToValue={(option, value) =>
                  option.code === value.code
                }
                readOnly={readOnly}
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
                    label="Interpretación"
                    variant="outlined"
                  />
                )}
              />
            )}
          />
          <Controller
            name="encounter"
            control={control}
            rules={{
              required: "Es necesario seleccionar un Paciente",
            }}
            render={({ field }) => (
              <AutoCompleteComponent<Encounter>
                resourceType={"Encounter"}
                label={"Selecciona Encuentro"}
                getDisplay={getEncounterDisplay}
                defaultResourceId={encounterId}
                defaultParams={{ subject: patientId!, _count: 99999 }}
                searchParam={""}
                onChange={(selectedObject) => {
                  if (selectedObject) {
                    field.onChange({
                      id: selectedObject.id,
                      display: getEncounterDisplay(selectedObject),
                    });
                  } else {
                    field.onChange(null);
                  }
                }}
                readOnly={
                  readOnly || Boolean(encounterId) || roleUser === "Patient"
                }
                textFieldProps={{
                  error: Boolean(errors.encounter),
                  helperText: errors.encounter && errors.encounter.message,
                }}
              />
            )}
          />
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
          <TextField
            fullWidth
            defaultValue={ObservationUtils.getValue(observation!)}
            label="Valor"
            {...register("valueString")}
            error={Boolean(errors.valueString)}
            helperText={errors.valueString && errors.valueString.message}
            onBlur={() => trigger("valueString")}
            inputProps={{ readOnly: readOnly }}
          ></TextField>
        </Stack>
      </form>
      <DevTool control={control} />
    </>
  );
}
