import { useEffect, useState } from "react";
import { Questionnaire, QuestionnaireResponse } from "fhir/r4";
import QuestionnaireResponseService from "../../Services/QuestionnaireResponseService";
import QuestionnaireComponent from "../Questionnaire/QuestionnaireComponent";
import QuestionnaireListComponent from "../Questionnaire/QuestionnaireListDialogComponent";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import QuestionnaireService from "../../Services/QuestionnaireService";

const questionnaireResponseService = new QuestionnaireResponseService();
const questionnaireService = new QuestionnaireService();

export default function PatientQuestionnaireComponent({
  patientID,
  encounterID,
}: {
  patientID: string;
  encounterID?: string;
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
    try {
      var responseBundle = await questionnaireResponseService.getResources({
        subject: patientID,
        encounter: encounterID!,
      });
      if (!responseBundle.success) throw Error(responseBundle.error);

      console.log(responseBundle.data);
      setQuestionnaireResponses(responseBundle.data);
      const updatedQuestionnaires: Record<string, Questionnaire> = {};

      for (const quetionnaireResponse of responseBundle.data) {
        const quesR_id = quetionnaireResponse.questionnaire;
        if (!quesR_id) continue;

        const res = await questionnaireService.getById(quesR_id);
        if (res.success) updatedQuestionnaires[quesR_id] = res.data;
      }
      setQuestionnaires(updatedQuestionnaires);
    } catch {
      console.log("entro al catch");
    }
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
          <Accordion sx={{ backgroundColor: "transparent" }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content-new"
              id="panel1-header-new"
            >
              Nuevos formularios
            </AccordionSummary>
            <AccordionDetails>
              {newQuestionnaires.map((newQues, index) => (
                <div key={index}>
                  <QuestionnaireComponent
                    questionnaire={newQues}
                    subjectId={patientID}
                    encounterId={encounterID}
                  ></QuestionnaireComponent>
                </div>
              ))}
            </AccordionDetails>
          </Accordion>
        )}
      </div>
      <div>
        {Object.keys(questionnaires).length > 0 && (
          <Accordion defaultExpanded sx={{ backgroundColor: "transparent" }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content-old"
              id="panel1-header-old"
            >
              <h1>Formularios cargados del paciente</h1>
            </AccordionSummary>
            <AccordionDetails>
              {Object.keys(questionnaires).length > 0 && (
                <div>
                  {questionnaireResponses.map(
                    (quesRes, index) =>
                      quesRes.questionnaire && (
                        <div style={{ paddingBottom: "50px" }} key={index}>
                          <QuestionnaireComponent
                            questionnaire={
                              questionnaires[quesRes.questionnaire]
                            }
                            questionnaireResponse={quesRes}
                            subjectId={patientID}
                            encounterId={encounterID}
                          ></QuestionnaireComponent>
                        </div>
                      )
                  )}
                </div>
              )}
            </AccordionDetails>
          </Accordion>
        )}
      </div>
    </div>
  );
}
