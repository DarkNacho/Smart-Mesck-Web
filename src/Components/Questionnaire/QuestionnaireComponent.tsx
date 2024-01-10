import { Questionnaire, QuestionnaireResponse } from 'fhir/r4';
import React, { useEffect, useRef } from 'react';
//import "./QuestionnaireComponent.css";

export default function QuestionnaireComponent({ formDef = {} as Questionnaire, quesResponse = {} as QuestionnaireResponse}: {formDef: Questionnaire, quesResponse?: QuestionnaireResponse})
{
  const formContainerRef = useRef(null);

  useEffect(() => {
    const formContainer = formContainerRef.current;
    const formOptions = {
      addCancelButton: false,
      addBackButton: false,
      formReadOnly: false
      //formStatus: readonly ? 'display' : 'preview'
    };

    
    var lformsQ = window.LForms.Util.convertFHIRQuestionnaireToLForms(formDef, 'R4');
    var formWithUserData = window.LForms.Util.mergeFHIRDataIntoLForms("QuestionnaireResponse", quesResponse, lformsQ, "R4");
    window.LForms.Util.addFormToPage(formWithUserData, formContainer, formOptions);
    //window.LForms.Util.addFormToPage(formDef, formContainer, formOptions);
    
  }, [formDef]);


  const showQR = () => {
    const formContainer = formContainerRef.current;
    //const qr = window.LForms.Util.getFormFHIRData('QuestionnaireResponse', 'R4', formContainer)
    const qr = window.LForms.Util.getFormFHIRData('DiagnosticReport', 'R4', formContainer)
    
    console.log(JSON.stringify(qr, null, 2));
    //TODO: Agregar el subject , es decir referencia al paciente correspondiente al formulario.
    //const qr = LForms.Util.getFormData(formContainer);
    //console.log(qr);
  };

  return (
    <div>
      <div ref={formContainerRef}></div>
      <button onClick={showQR}>Mostrar Respuestas</button>
    </div>
  );
};
