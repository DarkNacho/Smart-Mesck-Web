import {
  Condition,
  FhirResource,
  Observation,
  Questionnaire,
  QuestionnaireItem,
  QuestionnaireResponse,
} from "fhir/r4";
import { useEffect, useRef } from "react";

import Button from "@mui/material/Button";

import FhirResourceService from "../../Services/FhirService";
import ObservationService from "../../Services/ObservationService";
import ConditionService from "../../Services/ConditionService";
import { isAdminOrPractitioner } from "../../RolUser";
import ObservationUtils from "../../Services/Utils/ObservationUtils";
import HandleResult from "../HandleResult";
//import "./QuestionnaireComponent.css";

const fhirService = new FhirResourceService("FhirResource");
const questionnaireResponseService = new FhirResourceService(
  "QuestionnaireResponse"
);
const observationService = new ObservationService();
const conditionService = new ConditionService();

export default function QuestionnaireComponent({
  questionnaire = {} as Questionnaire,
  questionnaireResponse = {} as QuestionnaireResponse,
  subjectId,
  encounterId,
}: {
  questionnaire: Questionnaire;
  questionnaireResponse?: QuestionnaireResponse;
  subjectId?: string;
  encounterId?: string;
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

    const lformsQ = window.LForms.Util.convertFHIRQuestionnaireToLForms(
      questionnaire,
      "R4"
    );
    const formWithUserData = window.LForms.Util.mergeFHIRDataIntoLForms(
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
  const generateUpdateResources = (
    originalObservations: FhirResource[],
    newObservations: FhirResource[]
  ) => {
    // Crear una copia profunda de las observaciones originales
    const updatedObservations = originalObservations;

    // Iterar sobre las nuevas observaciones
    newObservations.forEach((newObservation: any) => {
      // Buscar el valor deseado dentro de la propiedad extension
      const newValueString = newObservation.extension?.find(
        (ext: any) =>
          ext.url ===
          "http://hl7.org/fhir/StructureDefinition/observation-questionnaireLinkId"
      )?.valueString;

      // Buscar la observación correspondiente en las observaciones originales por el valor deseado
      const index = updatedObservations.findIndex((originalObservation: any) =>
        originalObservation.extension?.some(
          (ext: any) =>
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
    updatedObservations.forEach((observation: any, index) => {
      const shouldDelete = !newObservations.some((newObservation: any) =>
        newObservation.extension?.some(
          (ext: any) =>
            ext.url ===
              "http://hl7.org/fhir/StructureDefinition/observation-questionnaireLinkId" &&
            ext.valueString ===
              observation.extension?.find(
                (origExt: any) =>
                  origExt.url ===
                  "http://hl7.org/fhir/StructureDefinition/observation-questionnaireLinkId"
              )?.valueString
        )
      );

      if (shouldDelete) {
        // Establecer la propiedad id en undefined
        //observation.id = undefined;
        updatedObservations[index] = { id: "delete" } as Observation;
      }
    });

    return updatedObservations;

    //TODO: existe un bug al momento de eliminar, no sé en que ocación hay que hacer bien el testing.
  };

  const getConditions = async (): Promise<Condition[]> => {
    if (!questionnaireResponse.id) return [];
    const result =
      await conditionService.getConditionsWithQuestionnaireResponse(
        subjectId!,
        questionnaireResponse.id!
      );
    return result.success ? result.data : [];
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

    const newObservations: Observation[] = [];

    const contained = diagnosticReport.contained;
    const items = responses.item;

    if (contained && items && contained.length === items.length) {
      for (let i = 0; i < contained.length; i++) {
        const observation = contained[i] as Observation;
        const item = items[i] as QuestionnaireItem;

        observation.id = undefined;
        observation.meta = undefined;
        observation.subject = questionnaireResponse.subject;
        observation.encounter = questionnaireResponse.encounter;
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
    console.log("response as observation: ", newObservations);
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
      if (encounterId)
        questionnaireResponse.encounter = {
          reference: `Encounter/${encounterId}`,
        };
    }

    const nuevaRespuesta = { ...questionnaireResponse, ...qr };
    console.log(nuevaRespuesta);

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

  const sendResources = async (resources: FhirResource[]) => {
    HandleResult.handleOperation(
      () => fhirService.sendArray(resources),
      "Formulario Guardado Exitosamente",
      "Enviado..."
    );
  };

  /* TODO: descomentar, solo esta comentado para compilar
  const observationAsConditions = (observations: Observation[]) =>
  {
    //const observations = responseAsObservations(response); //Asumir que el cuestionario ya fue guardado en el servidor
    var conditions = [] as Condition[];
    observations.forEach(item => 
      {
        const coding = fhirService.getCodingBySystem(item.code, "SM");
        //if(!coding || !coding.code) return;
        if(coding && coding.code === "CON")  
          conditions.push(observationService.convertirObservacionACondicion(item));      
      });
    return conditions;
  }
  */

  /* TODO: descomentar, solo esta comentado para compilar
  const getFinalObservation = (observations: Observation[]) =>
  {
    var obs = [] as Observation[];
    observations.forEach(item => 
      {
        const coding = fhirService.getCodingBySystem(item.code, "SM");
        //if(!coding || !coding.code) return;
        if(coding && coding.code === "OBS")  
          obs.push(item);      
      });
    return obs;
  }
  */

  const getFinalArray = (resources: FhirResource[]) => {
    const res = [] as FhirResource[];
    resources.forEach((item: any) => {
      if (!item.code) return;
      const coding = fhirService.getCodingBySystem(item.code, "SM");
      if (coding && coding.code) {
        if (coding.code === "OBS") res.push(item);
        else if (coding.code === "CON")
          res.push(ObservationUtils.ObservationToCondition(item));
      }

      //if(coding && coding.code === "OBS")  res.push(item);
    });
    return res;
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

    const originalObservation = (await getObservations()) as FhirResource[]; //obtiene obsevaciones desde Observation,  quizás llamar al inicio
    const origianlCondition = (await getConditions()) as FhirResource[];

    const originalResources = [...origianlCondition, ...originalObservation];

    console.log("original resource: ", originalResources);

    HandleResult.handleOperation(
      () => sendQuestionnaireResponse(qr),
      "Formulario Guardado Exitosamente",
      "Enviado..."
    );

    /*sendQuestionnaireResponse(qr).then((res) => {
      if (res.success) {
        questionnaireResponse = res.data as QuestionnaireResponse;
        const responsesObservation = responseAsObservations(qr);

        const updatedResource = generateUpdateResources(
          originalResources,
          responsesObservation
        );

        //const finalObservation = getFinalObservation(updatedObservation)
        //const conditions = observationAsConditions(updatedObservation);

        const final = getFinalArray(updatedResource); //Convierte a su tipo indicado (Observation | Condition)
        console.log("bla final: ", final);

        sendResources(final); //TODO: Problema al querer eliminar, y conditions genera duplicado al querer actualizar
      } //  ! Si en el questionario un elemento que e respondio y se guardó. Luego si lo dejo vacio. Este no cambia en Conditions pero si luego lo vuelvo a editar este cambia.
      else console.error(res.error);
    });
    */

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
      {isAdminOrPractitioner() && (
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
      )}
    </div>
  );
}
