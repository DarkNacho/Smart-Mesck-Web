import { useEffect, useState } from "react";
import { Questionnaire, QuestionnaireResponse } from "fhir/r4";
import QuestionnaireService from "../../Services/QuestionnaireService";
import QuestionnaireComponent from "../Questionnaire/QuestionnaireComponent";

const questionnaireService = QuestionnaireService.getInstance();

export default function PatientQuestionnaireComponent({
  patientID,
}: {
  patientID: string;
}) {
  const [questionnaireResponses, setQuestionnaireResponses] = useState<QuestionnaireResponse[]>([]);
  const [questionnaires, setQuestionnaires] =  useState<Record<string, Questionnaire>>({});

  const fetchQuestionnaireResponses = async () => {
    const res = await questionnaireService.getResponseByPatientId(patientID);
    setQuestionnaireResponses(res);
    const updatedQuestionnaires: Record<string, Questionnaire> = {};

    for (const quetionnaireResponse of res) {
      const quesR_id = quetionnaireResponse.questionnaire;
      if (!quesR_id) continue;
      updatedQuestionnaires[quesR_id] = await questionnaireService.getById(quesR_id);
    }
    setQuestionnaires(updatedQuestionnaires);
  };

  useEffect(() => {
    const fetchData =async () => {
      await fetchQuestionnaireResponses();    
  }
    fetchData();
  }, [patientID]);

  return (
    <div>
      {Object.keys(questionnaires).length > 0 && (
        <div>
          <h1>Lista de cuestionarios:</h1>
          {questionnaireResponses.map((quesRes, index) => (
            quesRes.questionnaire && (
            <div key={index}>
             <QuestionnaireComponent formDef={questionnaires[quesRes.questionnaire]} quesResponse={quesRes}></QuestionnaireComponent>
            </div>
            )
          ))}
        </div>
      )
      }
    </div>
  );
}
