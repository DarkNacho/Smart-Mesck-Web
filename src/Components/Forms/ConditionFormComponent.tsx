import { DevTool } from "@hookform/devtools";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { MenuItem, TextField } from "@mui/material";
import {
  Condition,
  Encounter,
  Patient,
  Practitioner,
  ValueSetExpansionContains,
} from "fhir/r4";
import AutocompleteFromServerComponent from "../AutoCompleteComponents/AutocompleteFromServerComponent";
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
export interface ConditionFormData {
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
  encounterId: string;
  code: ValueSetExpansionContains;
  note: string; // https://hl7.org/fhir/datatypes.html#Annotation
  clinicalStatus: string;
}

const clinicalStatus = [
  { value: "active", label: "Activo" },
  { value: "recurrence", label: "Reaparición" },
  { value: "relapse", label: "Recaída" },
  { value: "inactive", label: "Inactivo" },
  { value: "remission", label: "Remisión" },
  { value: "resolved", label: "Resuelto" },
];

export default function ConditionFormComponent({
  formId,
  submitForm,
  practitionerId,
  patientId,
  encounterId,
  readOnly = false,
}: {
  formId: string;
  submitForm: SubmitHandler<ConditionFormData>;
  practitionerId: string;
  patientId?: string;
  encounterId?: string;
  readOnly?: boolean;
}) {
  const {
    control,
    register,
    trigger,
    handleSubmit,
    formState: { errors },
  } = useForm<ConditionFormData>();

  const roleUser = loadUserRoleFromLocalStorage();
  const condition = {} as Condition;

  return (
    <>
      <form id={formId} onSubmit={handleSubmit(submitForm)}>
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
              readOnly={readOnly || !(roleUser === "Admin")}
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
                error: Boolean(errors.performer),
                helperText: errors.performer && errors.performer.message,
              }}
            />
          )}
        />

        <Controller
          name="code"
          control={control}
          defaultValue={condition ? condition.code?.coding?.[0] : {}}
          render={({ field }) => (
            <AutocompleteFromServerComponent
              name="loinct"
              table="hpo"
              onChange={field.onChange}
              value={field.value}
              readOnly={!!condition.code?.coding || false || readOnly}
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
          defaultValue={condition?.note?.[0].text || ""}
          rows={3}
          label="Notas"
          {...register("note")}
          error={Boolean(errors.note)}
          helperText={errors.note && errors.note.message}
          onBlur={() => trigger("note")}
          inputProps={{ readOnly: readOnly }}
        ></TextField>
        <TextField
          select
          label="Estado"
          defaultValue="active"
          {...register("clinicalStatus", {
            required: "Estado clínico requerido",
          })}
          fullWidth
          error={Boolean(errors.clinicalStatus)}
          helperText={errors.clinicalStatus && errors.clinicalStatus.message}
          inputProps={{ readOnly: readOnly }}
        >
          {clinicalStatus.map((item) => (
            <MenuItem key={item.value} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </TextField>
      </form>
      <DevTool control={control} />
    </>
  );
}
