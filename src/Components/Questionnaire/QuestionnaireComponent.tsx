import {
  Observation,
  Questionnaire,
  QuestionnaireItem,
  QuestionnaireResponse,
} from "fhir/r4";
import { useEffect, useRef } from "react";

import Button from "@mui/material/Button";
import QuestionnaireResponseService from "../../Services/QuestionnaireResponseService";
import FhirResourceService from "../../Services/FhirService";
import ObservationService from "../../Services/ObservationService";
//import "./QuestionnaireComponent.css";

const fhirService = new FhirResourceService("Observation");
const questionnaireResponseService = new QuestionnaireResponseService();
const observationService = new ObservationService();

export default function QuestionnaireComponent({
  questionnaire = {} as Questionnaire,
  questionnaireResponse = {} as QuestionnaireResponse,
  subjectId,
}: {
  questionnaire: Questionnaire;
  questionnaireResponse?: QuestionnaireResponse;
  subjectId?: string;
}) {
  const formContainerRef = useRef(null);

  useEffect(() => {
    const formContainer = formContainerRef.current;
    const formOptions = {
      addCancelButton: false,
      addBackButton: false,
      formReadOnly: false,
      //formStatus: readonly ? 'display' : 'preview'
    };

    var lformsQ = window.LForms.Util.convertFHIRQuestionnaireToLForms(
      questionnaire,
      "R4"
    );
    var formWithUserData = window.LForms.Util.mergeFHIRDataIntoLForms(
      "QuestionnaireResponse",
      questionnaireResponse,
      lformsQ,
      "R4"
    );
    window.LForms.Util.addFormToPage(
      formWithUserData,
      formContainer,
      formOptions
    );
    //window.LForms.Util.addFormToPage(questionnaire, formContainer, formOptions);
  }, [questionnaire, questionnaireResponse]);

  // Función para actualizar las observaciones originales con las nuevas
  const generateUpdateObservations = (
    originalObservations: Observation[],
    newObservations: Observation[]
  ) => {
    // Crear una copia profunda de las observaciones originales
    const updatedObservations = originalObservations;

    // Iterar sobre las nuevas observaciones
    newObservations.forEach((newObservation) => {
      // Buscar el valor deseado dentro de la propiedad extension
      const newValueString = newObservation.extension?.find(
        (ext) =>
          ext.url ===
          "http://hl7.org/fhir/StructureDefinition/observation-questionnaireLinkId"
      )?.valueString;

      // Buscar la observación correspondiente en las observaciones originales por el valor deseado
      const index = updatedObservations.findIndex((originalObservation) =>
        originalObservation.extension?.some(
          (ext) =>
            ext.url ===
              "http://hl7.org/fhir/StructureDefinition/observation-questionnaireLinkId" &&
            ext.valueString === newValueString
        )
      );

      if (index !== -1) {
        // Si la observación existe en las observaciones originales, actualizarla
        newObservation.id = updatedObservations[index].id;
        updatedObservations[index] = newObservation;
      } else {
        // Si la observación no existe en las observaciones originales, agregarla
        updatedObservations.push(newObservation);
      }
    });

    /*
    // Identificar observaciones eliminadas
    const deletedObservations = originalObservations.filter(
      (originalObservation) =>
        !newObservations.some((newObservation) =>
          newObservation.extension?.some(
            (ext) =>
              ext.url ===
                "http://hl7.org/fhir/StructureDefinition/observation-questionnaireLinkId" &&
              ext.valueString ===
                originalObservation.extension?.find(
                  (origExt) =>
                    origExt.url ===
                    "http://hl7.org/fhir/StructureDefinition/observation-questionnaireLinkId"
                )?.valueString
          )
        )
    );
    console.log("eliminar:", deletedObservations);
    */

    // Modificar las observaciones eliminadas en updatedObservations
    updatedObservations.forEach((observation, index) => {
      const shouldDelete = !newObservations.some((newObservation) =>
        newObservation.extension?.some(
          (ext) =>
            ext.url ===
              "http://hl7.org/fhir/StructureDefinition/observation-questionnaireLinkId" &&
            ext.valueString ===
              observation.extension?.find(
                (origExt) =>
                  origExt.url ===
                  "http://hl7.org/fhir/StructureDefinition/observation-questionnaireLinkId"
              )?.valueString
        )
      );

      if (shouldDelete) {
        // Establecer la propiedad id en undefined
        //observation.id = undefined;
        updatedObservations[index] = {
          id: observation.id,
          resourceType: "Observation",
        } as Observation;
      }
    });

    return updatedObservations;

    //TODO: existe un bug al momento de eliminar, no sé en que ocación hay que hacer bien el testing.
  };

  const getObservations = async (): Promise<Observation[]> => {
    if (!questionnaireResponse.id) return [];
    const result =
      await observationService.getObservationsOfQuestionnaireResponse(
        questionnaireResponse.id
      );
    return result.success ? result.data : [];
  };

  const responseAsObservations = (responses: QuestionnaireResponse) => {
    const formContainer = formContainerRef.current;
    const diagnosticReport = window.LForms.Util.getFormFHIRData(
      "DiagnosticReport",
      "R4",
      formContainer
    ) as QuestionnaireResponse;

    var newObservations: Observation[] = [];

    const contained = diagnosticReport.contained;
    const items = responses.item;

    if (contained && items && contained.length === items.length) {
      for (let i = 0; i < contained.length; i++) {
        const observation = contained[i] as Observation;
        const item = items[i] as QuestionnaireItem;

        observation.id = undefined;
        observation.meta = undefined;
        observation.subject = questionnaireResponse.subject;
        observation.hasMember = [
          {
            reference: `QuestionnaireResponse/${questionnaireResponse.id}`,
          },
        ];

        observation.extension = [
          {
            url: "http://hl7.org/fhir/StructureDefinition/observation-questionnaireLinkId",
            valueString: item.linkId,
          },
        ];

        newObservations.push(observation);
      }
    }
    return newObservations;
  };

  const sendQuestionnaireResponse = async (qr: QuestionnaireResponse) => {
    //Añade referencias al QuestionnaireResponse

    if (!questionnaireResponse.id) {
      questionnaireResponse.questionnaire = questionnaire.id;
      questionnaireResponse.item = qr.item;
      questionnaireResponse.subject = {
        reference: `Patient/${subjectId}`,
      };
    }

    const nuevaRespuesta = { ...questionnaireResponse, ...qr };

    return questionnaireResponseService.sendResource(nuevaRespuesta);
    /*
    var response = await questionnaireResponseService.sendResource(
      nuevaRespuesta
    );
    
    if (response.success) {
      questionnaireResponse = response.data;
      console.log(questionnaireResponse);
    }*/
  };

  const sendObservations = async (observations: Observation[]) => {
    fhirService
      .sendArray(observations)
      .then((res) =>
        res.success ? console.log("Observaciones enviadas") : res.error
      );
  };

  const postData = async () => {
    const formContainer = formContainerRef.current;

    const val = window.LForms.Util.checkValidity(formContainer);
    if (val) return; //TODO: show message

    const qr = window.LForms.Util.getFormFHIRData(
      "QuestionnaireResponse",
      "R4",
      formContainer
    ) as QuestionnaireResponse;

    const originalObservation = await getObservations(); //quizás llamar al inicio
    sendQuestionnaireResponse(qr).then((res) => {
      if (res.success) {
        questionnaireResponse = res.data;
        const newObservation = responseAsObservations(qr);
        const finalObservation = generateUpdateObservations(
          originalObservation,
          newObservation
        );
        sendObservations(finalObservation);
      } else console.error(res.error);
    });

    /*
    const originalObservation = await getObservations();
    const newObservation = responseAsObservations(qr);
    const finalObservation = generateUpdateObservations(
      originalObservation,
      newObservation
    );

    sendQuestionnaireResponse(qr).then(res => res.success ? sendObservations(finalObservation): console.error(res.error));
    */
  };

  return (
    <div>
      <div ref={formContainerRef}></div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={postData}
          sx={{ marginLeft: "auto" }}
        >
          Guardar
        </Button>
      </div>
    </div>
  );
}
