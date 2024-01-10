import { useEffect, useState } from "react";
import { Questionnaire, QuestionnaireResponse } from "fhir/r4";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, List, ListItem, ListItemText, IconButton, TextField } from "@mui/material";
import { Close } from "@mui/icons-material";
import styles from "./QuestionnaireListComponent.module.css";
import QuestionnaireService from "../../Services/QuestionnaireService";

import QuestionnaireComponent from "./QuestionnaireComponent";

const questionnaireService = QuestionnaireService.getInstance();

export default function QuestionnaireListComponent({onQuestionnaireSelect}: {onQuestionnaireSelect: (ques: Questionnaire)=> void}) {
  const [showModal, setShowModal] = useState(false);  
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [quesDefPrueba, setQuesDefPrueba] = useState<Questionnaire>({} as Questionnaire);
  const [quesResPrueba, setQuesResPrueba] = useState<QuestionnaireResponse>({} as QuestionnaireResponse);


  const handleNextPage = async () => {
    questionnaireService.getNextPage().then((res) => setQuestionnaires(res));
  };
  const handlePrevPage = async () => {
    questionnaireService.getPrevPage().then((res) => setQuestionnaires(res));
  };
  const fetchQuestionnaires = async () => {
    questionnaireService.getQuestionnaires(8).then((res) => setQuestionnaires(res));
    questionnaireService.getById("44315366").then(res => setQuesDefPrueba(res));
    questionnaireService.getResponseById("44315403").then(res => setQuesResPrueba(res));
    questionnaireService.getResponseByPatientId("42029285").then(res => console.log("pas ques res:", res));
  };

  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    fetchQuestionnaires();
  }, []);

  useEffect(() => {
    console.log("questionarios: ", questionnaires);
  }, [questionnaires]);

  return (
    <div>
      <Button variant="contained" color="primary" onClick={() => setShowModal(true)}>Mostrar Cuestionarios</Button>
      <Dialog open={showModal} onClose={closeModal} maxWidth="md" fullWidth>
        <DialogTitle  className={styles.dialogTitle}>
            Formularios Disponibles
            <IconButton aria-label="close" onClick={closeModal} className={styles.closeButton}>
                <Close />
            </IconButton>
        </DialogTitle>
        <DialogContent>
          
          <div className={styles.searchContainer}>
            <TextField
              label="Buscar Por título"
              
            />
            <Button variant="contained" color="primary" >
              Buscar
            </Button>
          </div>
          <List>
            {questionnaires.map((ques) => (
              <ListItem className={styles.listItem} key={ques.id} onClick={() => {onQuestionnaireSelect(ques); closeModal()}}>
                <ListItemText primary={`${ques.title}`} secondary={`${ques.description}`} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions className={styles.dialogActions }>
          <Button variant="contained" color="primary" onClick={handlePrevPage} disabled={!questionnaireService.hasPrevPage}>
            Página anterior
          </Button>
          <Button variant="contained" color="primary" onClick={handleNextPage} disabled={!questionnaireService.hasNextPage}>
            Siguiente página
          </Button>
        </DialogActions>
        <QuestionnaireComponent formDef={quesDefPrueba} ></QuestionnaireComponent>
      </Dialog>
    </div>
  );
}
