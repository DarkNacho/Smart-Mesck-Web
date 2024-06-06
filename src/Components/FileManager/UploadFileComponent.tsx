import { useState } from "react";
import { DocumentReference, Binary, Reference } from "fhir/r4";

//import HandleResult from "../HandleResult";
import FhirResourceService from "../../Services/FhirService";
import getFileIconInfo from "./getFileIconInfo";
import CircularProgress from "@mui/material/CircularProgress";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ErrorIcon from "@mui/icons-material/Error";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import {
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useDropzone } from "react-dropzone";

import styles from "./FileManager.module.css";
import { loadUserRoleFromLocalStorage } from "../../RolUser";
import ListDocumentReferenceComponent from "./ListDocumentReferenceComponent";

function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

async function calculateFileHash(file: File) {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(""); // convert bytes to hex string
  return btoa(`sha256-${hashHex}`);
}

export default function UploadFileComponent({
  subject,
}: {
  subject?: Reference;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});
  const [successUpload, setSuccessUpload] = useState<{
    [key: string]: boolean;
  }>({});
  const [errorUpload, setErrorUpload] = useState<{
    [key: string]: string;
  }>({});

  const handleFileChange = (files: File[]) => {
    setFiles(files);
  };

  const handleFileUpload = async (file: File, index: number) => {
    setUploading((prev) => ({ ...prev, [index]: true }));
    /*await HandleResult.handleOperation(
      () => HandleUpload(file),
      "Archivo subido y documento guardado correctamente",
      "Subiendo..."
    );*/
    //await new Promise((resolve) => setTimeout(resolve, 2000));
    const response = await HandleUpload(file);
    if (!response.success)
      setErrorUpload((prev) => ({ ...prev, [index]: response.error }));

    setUploading((prev) => ({ ...prev, [index]: false }));
    setSuccessUpload((prev) => ({ ...prev, [index]: response.success }));
  };

  const uploadBinary = async (
    file: File,
    docRefId: string
  ): Promise<Result<Binary>> => {
    const contentType = file.type;
    const fileContent = await file.arrayBuffer();
    const binaryResource: Binary = {
      resourceType: "Binary",
      contentType: contentType,
      data: btoa(String.fromCharCode(...new Uint8Array(fileContent))),
      securityContext: { reference: `DocumentReference/${docRefId}` },
    };

    return new FhirResourceService<Binary>("Binary").postResource(
      binaryResource
    );
  };

  const sendDocumentReference = async (
    fileName: string,
    filetype: string,
    fileSize: number,
    hash: string
  ): Promise<Result<DocumentReference>> => {
    const role = loadUserRoleFromLocalStorage();
    const userId = localStorage.getItem("id");
    if (!role) {
      return {
        success: false,
        error: "No se pudo obtener el rol del usuario",
      };
    }
    if (!userId) {
      return {
        success: false,
        error: "No se pudo obtener el id del usuario",
      };
    }

    let author: { reference: string } = { reference: "" };

    if (role === "Patient") {
      author = { reference: `Patient/${userId}` };
    }
    if (role === "Practitioner" || role === "Admin") {
      author = { reference: `Practitioner/${userId}` };
    }

    const documentReference: DocumentReference = {
      resourceType: "DocumentReference",
      status: "current",
      author: [author],
      subject: subject,
      content: [
        {
          attachment: {
            contentType: filetype,
            title: fileName,
            hash: hash,
            size: fileSize,
            creation: new Date().toISOString(),
          },
        },
      ],
    };

    return new FhirResourceService<DocumentReference>(
      "DocumentReference"
    ).postResource(documentReference);
  };

  const HandleUpload = async (file: File): Promise<Result<any>> => {
    if (!file) {
      return {
        success: false,
        error: "Por favor selecciona un archivo primero",
      };
    }

    const hash = await calculateFileHash(file);
    const responseDocument = await sendDocumentReference(
      file.name,
      file.type,
      file.size,
      hash
    );
    console.log("documentResponse: ", responseDocument);
    if (!responseDocument.success) return responseDocument;
    if (!responseDocument.data.id) {
      return {
        success: false,
        error: "Error al crear el DocumentReference",
      };
    }

    const responseBinary = await uploadBinary(file, responseDocument.data.id);
    //console.log("binaryResponse: ", responseBinary);
    if (!responseBinary.success) {
      return responseBinary;
    }
    if (!responseBinary.data.id) {
      return {
        success: false,
        error: "Error al subir el archivo binario",
      };
    }

    const updateDocumentReference = responseDocument.data;
    updateDocumentReference.content[0].attachment.url = `Binary/${responseBinary.data.id}`;

    const responseUpdateDocumentRef =
      await new FhirResourceService<DocumentReference>(
        "DocumentReference"
      ).updateResource(updateDocumentReference);
    console.log("updateDocumentReference: ", responseUpdateDocumentRef);
    return responseUpdateDocumentRef;
  };

  const handleFileRemove = (event: React.MouseEvent, index: number) => {
    event.stopPropagation();
    setFiles(files.filter((_, i) => i !== index));
  };

  const uploadAllFiles = async () => {
    setErrorUpload({});
    setSuccessUpload({});
    files.forEach((file, index) => handleFileUpload(file, index));
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleFileChange,
  });
  return (
    <Box p={10}>
      <section {...getRootProps()} className={styles.dropzone}>
        <Stack>
          <input {...getInputProps()} />
          <Button variant="outlined">
            <CloudUploadIcon />
          </Button>
        </Stack>
        <Stack className="filesContainer">
          <Grid container spacing={2}>
            {files.map((file, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Card key={index} className={styles.card}>
                  <CardContent className={styles.cardContent}>
                    {uploading[index] && (
                      <Box className={styles.uploading}>
                        <CircularProgress />
                      </Box>
                    )}
                    {errorUpload[index] && (
                      <Box>
                        <ErrorIcon color="error" />
                        <Typography color="error">
                          {errorUpload[index]}
                        </Typography>
                      </Box>
                    )}
                    {successUpload[index] && (
                      <Box>
                        <CheckCircleIcon color="primary" />
                        <Typography color="primary">
                          Subido exitosamente
                        </Typography>
                      </Box>
                    )}

                    <Box className={styles.box}>
                      <Typography variant="body1" component="div">
                        {file.name}
                      </Typography>
                      <Typography variant="body2" component="div">
                        {formatBytes(file.size)}
                      </Typography>

                      {getFileIconInfo(file.type).icon}
                    </Box>
                    <Box className={`options ${styles.options}`}>
                      <IconButton
                        onClick={(event) => handleFileRemove(event, index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                      <IconButton
                        onClick={() =>
                          window.open(
                            URL.createObjectURL(file),
                            "_blank",
                            "noopener,noreferrer"
                          )
                        }
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </section>
      <Stack>
        <Button variant="contained" onClick={uploadAllFiles}>
          Subir Archivos y Guardar Documentos
        </Button>
      </Stack>
      <ListDocumentReferenceComponent></ListDocumentReferenceComponent>
    </Box>
  );
}
