import { DevTool } from "@hookform/devtools";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { TextField } from "@mui/material";
import {
  Condition,
  Patient,
  Practitioner,
  ValueSetExpansionContains,
} from "fhir/r4";
import AutocompleteFromServerComponent from "../AutoCompleteComponents/AutocompleteFromServerComponent";
import AutoCompleteComponent from "../AutoCompleteComponents/AutoCompleteComponent";
import PersonUtil from "../../Services/Utils/PersonUtils";
import { loadUserRoleFromLocalStorage } from "../../RolUser";

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
  encounterId: string;
  code: ValueSetExpansionContains;
  note: string; // https://hl7.org/fhir/datatypes.html#Annotation
}

export default function ConditionFormComponent({
  formId,
  submitForm,
  practitionerId,
  patientId,
  readOnly = false,
}: {
  formId: string;
  submitForm: SubmitHandler<ConditionFormData>;
  practitionerId: string;
  patientId?: string;
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
                  ? { "general-practitioner": practitionerId }
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
      </form>
      <DevTool control={control} />
    </>
  );
}
