import { useEffect, useState } from "react";
import { Questionnaire, QuestionnaireResponse } from "fhir/r4";
import QuestionnaireService from "../../Services/QuestionnaireService";
import QuestionnaireComponent from "../Questionnaire/QuestionnaireComponent";
import QuestionnaireListComponent from "../Questionnaire/QuestionnaireListDialogComponent";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const questionnaireService = QuestionnaireService.getInstance();

export default function PatientQuestionnaireComponent({
  patientID,
}: {
  patientID: string;
}) {
  const [questionnaireResponses, setQuestionnaireResponses] = useState<
    QuestionnaireResponse[]
  >([]);
  const [questionnaires, setQuestionnaires] = useState<
    Record<string, Questionnaire>
  >({});
  const [newQuestionnaires, setNewQuestionnaires] = useState<Questionnaire[]>(
    []
  );

  const handleQuesSelect = (ques: Questionnaire) => {
    setNewQuestionnaires((prevQuestionnaires) => [ques, ...prevQuestionnaires]);
    console.log("Questionario seleccionado", ques);
  };

  const fetchQuestionnaireResponses = async () => {
    const res = await questionnaireService.getResponseByPatientId(patientID);
    setQuestionnaireResponses(res);
    const updatedQuestionnaires: Record<string, Questionnaire> = {};

    for (const quetionnaireResponse of res) {
      const quesR_id = quetionnaireResponse.questionnaire;
      if (!quesR_id) continue;
      updatedQuestionnaires[quesR_id] = await questionnaireService.getById(
        quesR_id
      );
    }
    setQuestionnaires(updatedQuestionnaires);
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchQuestionnaireResponses();
    };
    fetchData();
  }, [patientID]);

  return (
    <div>
      <div>
        <QuestionnaireListComponent
          onQuestionnaireSelect={handleQuesSelect}
        ></QuestionnaireListComponent>
      </div>
      <h1>Lista de cuestionarios:</h1>
      <div>
        {newQuestionnaires.length > 0 && (
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              Nuevos formularios
            </AccordionSummary>
            <AccordionDetails>
              {newQuestionnaires.map((newQues, index) => (
                <div key={index}>
                  <QuestionnaireComponent
                    formDef={newQues}
                    subjectId={patientID}
                  ></QuestionnaireComponent>
                </div>
              ))}
            </AccordionDetails>
          </Accordion>
        )}
      </div>
      <div>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            Formularios cargados del paciente
          </AccordionSummary>
          <AccordionDetails>
            {Object.keys(questionnaires).length > 0 && (
              <div>
                {questionnaireResponses.map(
                  (quesRes, index) =>
                    quesRes.questionnaire && (
                      <div style={{paddingBottom: "50px"}} key={index}>
                        <QuestionnaireComponent
                          formDef={questionnaires[quesRes.questionnaire]}
                          quesResponse={quesRes}
                          subjectId={patientID}
                        ></QuestionnaireComponent>
                      </div>
                    )
                )}
              </div>
            )}
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  );
}
