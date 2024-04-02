import PersonUtil from "./Services/Utils/PersonUtils";
import { DevTool } from "@hookform/devtools";

import TestAutoCompleteComponent from "./Components/AutoCompleteComponets/TestAutoCompleteComponent";

//Datos default de practicante
localStorage.setItem("userRol", "Admin");
localStorage.setItem("id", "204");

import { useForm, Controller } from "react-hook-form";
import dayjs, { Dayjs } from "dayjs";
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

interface FormValues {
  practitioner: {
    id: string;
    display: string;
  };
  patient: {
    id: string;
    display: string;
  };
  day: Dayjs;
  start: Dayjs;
  end: Dayjs;
}

function App() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    alert(JSON.stringify(data, null, 2));
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="practitioner"
          control={control}
          rules={{
            required: "selection is required",
          }}
          render={({ field }) => (
            <TestAutoCompleteComponent
              resourceType={"Practitioner"}
              label={"Una label"}
              getDisplay={PersonUtil.parsePersonName}
              searchParam={"name"}
              defaultResourceId="204"
              onChange={(selectedObject) => {
                if (selectedObject) {
                  alert(JSON.stringify(selectedObject, null, 2));
                  field.onChange({
                    id: selectedObject.id,
                    display: PersonUtil.parsePersonName(selectedObject),
                  });
                } else {
                  field.onChange(null);
                }
              }}
              textFieldProps={{
                error: Boolean(errors.practitioner),
                helperText: errors.practitioner && errors.practitioner.message,
              }}
            />
          )}
        />
        <Controller
          name="patient"
          control={control}
          rules={{
            required: "selection is required",
          }}
          render={({ field }) => (
            <TestAutoCompleteComponent
              resourceType={"Patient"}
              label={"Una label"}
              getDisplay={PersonUtil.parsePersonName}
              searchParam={"name"}
              defaultResourceId="4"
              defaultParams={{ "general-practitioner": "204" }}
              onChange={(selectedObject) => {
                if (selectedObject) {
                  alert(JSON.stringify(selectedObject, null, 2));
                  field.onChange({
                    id: selectedObject.id,
                    display: PersonUtil.parsePersonName(selectedObject),
                  });
                } else {
                  field.onChange(null);
                }
              }}
              textFieldProps={{
                error: Boolean(errors.practitioner),
                helperText: errors.practitioner && errors.practitioner.message,
              }}
            />
          )}
        />

        <Controller
          control={control}
          name="day"
          defaultValue={dayjs()}
          render={({ field }) => (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Fecha inicio test"
                onChange={field.onChange}
                value={field.value}
                inputRef={field.ref}
                sx={{ width: "100%" }}
              ></DatePicker>
            </LocalizationProvider>
          )}
        ></Controller>

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
        <button type="submit">test</button>
      </form>
      <DevTool control={control} />
    </>
  );
}

export default App;
