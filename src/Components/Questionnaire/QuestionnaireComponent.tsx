import {Observation, Questionnaire, QuestionnaireItem, QuestionnaireResponse } from "fhir/r4";
import { useEffect, useRef } from "react";

import Button from "@mui/material/Button";
import QuestionnaireResponseService from "../../Services/QuestionnaireResponseService";
import FhirResourceService from "../../Services/FhirService";
//import "./QuestionnaireComponent.css";


const fhirService = new FhirResourceService("Observation")
const questionnaireResponseService = new QuestionnaireResponseService();

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
  }, [questionnaire,questionnaireResponse]);

  const postAsObservations = () =>
  {

    const formContainer = formContainerRef.current;
    const diagnosticReport = window.LForms.Util.getFormFHIRData(
      "DiagnosticReport",
      "R4",
      formContainer
    ) as QuestionnaireResponse;
    
    var newObservations : Observation[] = [];

    const contained = diagnosticReport.contained;
    const items = questionnaireResponse.item;
    
    if (contained && items && contained.length === items.length) 
    {
      for (let i = 0; i < contained.length; i++) {
        const observation = contained[i] as Observation;
        const item = items[i] as QuestionnaireItem;
        
        observation.id = undefined;
        observation.meta = undefined;
        observation.subject = questionnaireResponse.subject;
        observation.hasMember = [{
          reference: `QuestionnaireResponse/${questionnaireResponse.id}`
        }]
       
        observation.extension = [
          { 
            url: "http://hl7.org/fhir/StructureDefinition/observation-questionnaireLinkId",
            valueString: item.linkId
          }
        ]
      
        newObservations.push(observation);
      }
    }
    fhirService.postArray(newObservations).then(res => console.log(res.success? "Colección enviada" : res.error));
    //TODO: hacer que al momento enviar la colección de newObservatiom, verifique si es UPDATE o POST, debido a que el método es sólo de post
    //TODO: también flata verificar para los casos de que no se respondiera alguna pregunta, por lo que veo simplemente se ignora , creo que debería hacer uqe almenos le asigne un valor vacio.
    //console.log(newObservations);

  }
  const postQuestionnaireResponse = async () => {
    const formContainer = formContainerRef.current;

    const val = window.LForms.Util.checkValidity(formContainer);
    if (val) return;

    const qr = window.LForms.Util.getFormFHIRData(
      "QuestionnaireResponse",
      "R4",
      formContainer
    ) as QuestionnaireResponse;
     
    //Añade referencias al QuestionnaireResponse
    
    
    if (!questionnaireResponse.id) {
      questionnaireResponse.questionnaire = questionnaire.id;
      questionnaireResponse.item = qr.item;
      questionnaireResponse.subject = {
        reference: `Patient/${subjectId}`,
      };
    }

    const nuevaRespuesta = { ...questionnaireResponse, ...qr };
    

    var response = await questionnaireResponseService.sendResource(nuevaRespuesta);
    
    if(response.success)
    {
      questionnaireResponse = response.data;
      console.log(questionnaireResponse);
    }
  };

  const report = () =>
  {
    console

  }

  const postData = async () =>
  {
    postQuestionnaireResponse();
    postAsObservations();
  }

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
        <Button onClick={report}>reporte</Button>
      </div>
    </div>
  );
}
