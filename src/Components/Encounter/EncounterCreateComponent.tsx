import { useForm, SubmitHandler, Controller } from "react-hook-form";
import {
  TextField,
  Button,
  Container,
  Grid,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import { useEffect } from "react";
import toast from "react-hot-toast";
import { Close } from "@mui/icons-material";

import styles from "./EncounterCreateComponent.module.css";
import { Encounter } from "fhir/r4";

import dayjs, { Dayjs } from "dayjs";
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import EncounterService from "../../Services/EncounterService";

// Interfaz para los datos del formulario
interface FormData {
  patientId: string;
  profesionalId: string;
  day: Dayjs;
  start: Dayjs;
  end: Dayjs;
  type: string;
}

export default function EncounterCreateComponent({
  onOpen,
  isOpen,
}: {
  onOpen: (isOpen: boolean) => void;
  isOpen: boolean;
}) {
  const {
    control,
    register,
    trigger,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    onOpen(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    onOpen(false);
  };

  const encounterType = [
    { value: "UKN", label: "No especificado" },
    { value: "A", label: "Ambulatorio" },
    { value: "otro1", label: "adsada" },
    { value: "other", label: "Otro" },
  ];

  const postEncounter = async (newEncounter: Encounter) => {
    const response = await toast.promise(
      new EncounterService().postResource(newEncounter),
      {
        loading: "Enviado...",
        success: (result) => {
          if (result.success) {
            return "Encuentro guardado de forma exitosa";
          } else {
            throw Error(result.error);
          }
        },
        error: (result) => result.toString(),
      }
    );

    if (response.success) {
      console.log(response.data);
    } else {
      console.error(response.error);
    }
  };

  // Función que se ejecuta al enviar el formulario
  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log("send form");
    console.log(data);

    const newEncounter: Encounter = {
      resourceType: "Encounter",
      subject: { reference: `Patient/${data.patientId}` },
      participant: [
        {
          individual: {
            reference: `Practitioner/${data.profesionalId}`,
            display: "prueba nacho",
          },
        },
      ],
      period: {
        start: data.start.toISOString(),
        end: data.end.toISOString(),
      },
      status: "finished",
      class: {
        code: data.type,
        system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
      },
    };
    postEncounter(newEncounter);
  };

  return (
    <div>
      <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle className={styles.dialogTitle}>
          Crear nuevo encuentro
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              color: "white",
              backgroundColor: "#7e94ff",
              "&:hover": { backgroundColor: "red" },
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Container className={styles.container}>
            <form id="encounterForm" onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Paciente"
                    {...register("patientId", {
                      required: "Es necesario ingresar el paciente",
                    })}
                    fullWidth
                    error={Boolean(errors.patientId)}
                    helperText={errors.patientId && errors.patientId.message}
                    onBlur={() => trigger("patientId")}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Profesional"
                    {...register("profesionalId", {
                      //required: "Es necesario ingresar el profesional",
                    })}
                    fullWidth
                    error={Boolean(errors.profesionalId)}
                    helperText={
                      errors.profesionalId && errors.profesionalId.message
                    }
                    onBlur={() => trigger("profesionalId")}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
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
                <Grid item xs={12} sm={2.5}>
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
                <Grid item xs={12} sm={2.5}>
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
          </Container>
        </DialogContent>
        <DialogActions className={styles.dialogActions}>
          <Button onClick={handleClose} variant="contained" color="error">
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            form="encounterForm"
          >
            Enviar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );

  {
    /*
  return (
    <div>
      <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle className={styles.dialogTitle}>
          Crear nuevo encuentro
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              color: "white",
              backgroundColor: "#7e94ff",
              "&:hover": { backgroundColor: "red" },
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Container className={styles.container}>
            <form id="pacienteForm" onSubmit={handleSubmit(onSubmit)}>
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
                    onBlur={() => trigger("nombre")}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Segundo Nombre"
                    {...register("segundoNombre")}
                    fullWidth
                    onBlur={() => trigger("segundoNombre")}
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
                    onBlur={() => trigger("apellidoPaterno")}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Apellido Materno"
                    {...register("apellidoMaterno")}
                    fullWidth
                    onBlur={() => trigger("apellidoMaterno")}
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
                    onBlur={() => trigger("fechaNacimiento")}
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
                    onBlur={() => trigger("genero")}
                  >
                    {generoOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Rut"
                    {...register("rut", {
                      required: "El Rut es necesario",
                      validate: (value) => validarRut(value) || "Rut inválido",
                    })}
                    fullWidth
                    error={Boolean(errors.rut)}
                    helperText={errors.rut && errors.rut.message}
                    onBlur={() => trigger("rut")}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Número Telefónico"
                    {...register("numeroTelefonico")}
                    fullWidth
                    onBlur={() => trigger("numeroTelefonico")}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    type="email"
                    label="Email"
                    {...register("email", {
                      required: "Correo electronico requerido",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Correo electrónico inválido",
                      },
                    })}
                    error={Boolean(errors.email)}
                    helperText={errors.email && errors.email.message}
                    fullWidth
                    onBlur={() => trigger("email")}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    label="Estado Civil"
                    defaultValue="S"
                    {...register("maritalStatus")}
                    fullWidth
                    error={Boolean(errors.genero)}
                    helperText={errors.genero && errors.genero.message}
                    onBlur={() => trigger("maritalStatus")}
                  >
                    {maritalOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField label="Foto" {...register("photo")} fullWidth />
                </Grid>
              </Grid>
            </form>
          </Container>
        </DialogContent>
        <DialogActions className={styles.dialogActions}>
          <Button onClick={handleClose} variant="contained" color="error">
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            form="pacienteForm"
          >
            Enviar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
                    */
  }
}
