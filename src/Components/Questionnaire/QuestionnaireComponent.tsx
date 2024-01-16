import { Questionnaire, QuestionnaireResponse } from "fhir/r4";
import { useEffect, useRef } from "react";
import QuestionnaireService from "../../Services/QuestionnaireService";
import Button from "@mui/material/Button";
//import "./QuestionnaireComponent.css";

const questionnaireService = new QuestionnaireService();

export default function QuestionnaireComponent({
  formDef = {} as Questionnaire,
  quesResponse = {} as QuestionnaireResponse,
  subjectId,
}: {
  formDef: Questionnaire;
  quesResponse?: QuestionnaireResponse;
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
      formDef,
      "R4"
    );
    var formWithUserData = window.LForms.Util.mergeFHIRDataIntoLForms(
      "QuestionnaireResponse",
      quesResponse,
      lformsQ,
      "R4"
    );
    window.LForms.Util.addFormToPage(
      formWithUserData,
      formContainer,
      formOptions
    );
    //window.LForms.Util.addFormToPage(formDef, formContainer, formOptions);
  }, [formDef]);

  const showQR = () => {
    const formContainer = formContainerRef.current;

    const val = window.LForms.Util.checkValidity(formContainer);
    if (val) return;

    const qr = window.LForms.Util.getFormFHIRData(
      "QuestionnaireResponse",
      "R4",
      formContainer
    ) as QuestionnaireResponse;

    if (!quesResponse.id) {
      quesResponse.questionnaire = formDef.id;
      quesResponse.item = qr.item;
      quesResponse.subject = {
        reference: `Patient/${subjectId}`,
        display: "holi",
      };
    }

    const nuevaRespuesta = { ...quesResponse, ...qr };
    console.log("res actualizado", nuevaRespuesta);

    questionnaireService
      .postResponse(nuevaRespuesta)
      .then((res) => console.log("responsed post form", res));
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
          onClick={showQR}
          sx={{ marginLeft: "auto" }}
        >
          Guardar
        </Button>
      </div>
    </div>
  );
}
