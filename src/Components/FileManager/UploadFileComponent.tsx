import React, { useState } from "react";
import { DocumentReference, Binary } from "fhir/r4";

import HandleResult from "../HandleResult";
import FhirResourceService from "../../Services/FhirService";
import getFileIconInfo from "./getFileIconInfo";

export default function UploadFileComponent() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleFileUpload = async () => {
    return await HandleResult.handleOperation(
      () => HandleUpload(),
      "Archivo subido y documento guardado correctamente",
      "Subiendo..."
    );
  };

  const uploadBinary = async (file: File): Promise<Result<Binary>> => {
    const contentType = file.type;
    const fileContent = await file.arrayBuffer();
    const binaryResource: Binary = {
      resourceType: "Binary",
      contentType: contentType,
      data: btoa(String.fromCharCode(...new Uint8Array(fileContent))),
    };

    return new FhirResourceService<Binary>("Binary").postResource(
      binaryResource
    );
  };

  const sendDocumentReference = async (
    binaryId: string,
    fileName: string,
    hash: string
  ): Promise<Result<DocumentReference>> => {
    const documentReference: DocumentReference = {
      resourceType: "DocumentReference",
      status: "current",
      type: {
        coding: [
          {
            system: "http://loinc.org",
            code: "34108-1",
            display: "Outpatient Note",
          },
        ],
      },
      content: [
        {
          attachment: {
            contentType: file?.type || "",
            url: `Binary/${binaryId}`,
            title: fileName,
            hash: hash,
          },
        },
      ],
    };

    return new FhirResourceService<DocumentReference>(
      "DocumentReference"
    ).postResource(documentReference);
  };

  const HandleUpload = async (): Promise<Result<any>> => {
    if (!file) {
      return {
        success: false,
        error: "Por favor selecciona un archivo primero",
      };
    }

    const responseBinary = await uploadBinary(file);
    console.log("binaryResponse: ", responseBinary);
    if (!responseBinary.success) {
      return responseBinary;
    }
    if (!responseBinary.data.id) {
      return {
        success: false,
        error: "Error al subir el archivo binario",
      };
    }

    const hash = await calculateFileHash(file);
    const responseDocument = await sendDocumentReference(
      responseBinary.data.id,
      file.name,
      hash
    );
    console.log("documentResponse: ", responseDocument);
    return responseDocument;
  };

  const calculateFileHash = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    return btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />

      <button onClick={handleFileUpload}>
        Subir Archivo y Guardar Documento
      </button>
      {file && (
        <div onClick={() => window.open(URL.createObjectURL(file!), "_blank")}>
          {file.name}
          {getFileIconInfo(file.type).icon}{" "}
        </div>
      )}
    </div>
  );
}
