import { useForm, SubmitHandler } from "react-hook-form";
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
import { useState } from "react";
import { Close, Add  } from "@mui/icons-material";

import styles from "./PatientCreateComponent.module.css";
import { Patient } from "fhir/r4";
import PatientService from "../../Services/PatientService";

// Función para validar el Rut
const validarRut = (rut: string) => {
  // Eliminar puntos y guiones del RUT y convertir la letra a mayúscula
  rut = rut.replace(/\./g, "").replace(/-/g, "").toUpperCase();

  // Extraer dígito verificador y número
  const dv = rut.slice(-1);
  var rutNumerico = parseInt(rut.slice(0, -1), 10);

  // Calcular dígito verificador esperado
  var m = 0;
  let s = 1;
  for (; rutNumerico; rutNumerico = Math.floor(rutNumerico / 10)) {
    s = (s + (rutNumerico % 10) * (9 - (m++ % 6))) % 11;
  }

  const dvEsperado = (s ? s - 1 : "K").toString();

  // Verificar si el dígito verificador es correcto
  return dv === dvEsperado;
};

// Opciones para el campo de género
const generoOptions = [
  { value: "unknown", label: "No especificado" },
  { value: "male", label: "Masculino" },
  { value: "female", label: "Femenino" },
  { value: "other", label: "Otro" },
];

// Interfaz para los datos del formulario
interface FormData {
  nombre: string;
  segundoNombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento: string;
  genero: string;
  rut: string;
  numeroTelefonico: string;
  photo: string;
}

export default function PatientCreateComponent() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Función que se ejecuta al enviar el formulario
  const onSubmit: SubmitHandler<FormData> = (data) => {
    const rut = data.rut.replace(/\./g, "").replace(/-/g, "").toUpperCase();
    var newPatient: Patient = {
      resourceType: "Patient",
      identifier: [{ system: "RUT", value: rut }],
      name: [
        {
          family: data.apellidoPaterno,
          given: [data.nombre, data.segundoNombre],
          suffix: [data.apellidoMaterno],
          text: `${data.nombre} ${data.segundoNombre} ${data.apellidoPaterno} ${data.apellidoMaterno})`,
        },
      ],
      birthDate: data.fechaNacimiento,
      gender: data.genero as "male" | "female" | "other" | "unknown",
      telecom: [{ system: "phone", value: data.numeroTelefonico }],
      photo: [{ url: data.photo }],
    };
    PatientService.getInstance().postPatient(newPatient);
  };

  return (
    <div>
      <IconButton onClick={handleOpen} color="primary" aria-label="add"   sx={{backgroundColor: "white", "&:hover": { backgroundColor: "#1b2455"}}}>
        <Add/>
      </IconButton>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle className={styles.dialogTitle}>
          Formularios Disponibles
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ color: "white", backgroundColor: "#7e94ff", "&:hover": { backgroundColor: "red" } }}
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
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Número Telefónico"
                    {...register("numeroTelefonico")}
                    fullWidth
                  />
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
}
