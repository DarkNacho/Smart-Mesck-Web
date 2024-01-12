import { useEffect, useState } from "react";
import { Questionnaire } from "fhir/r4";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  TextField,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import styles from "./QuestionnaireListComponent.module.css";
import QuestionnaireService from "../../Services/QuestionnaireService";

const questionnaireService = QuestionnaireService.getInstance();

export default function QuestionnaireListComponent({
  onQuestionnaireSelect,
}: {
  onQuestionnaireSelect: (ques: Questionnaire) => void;
}) {
  const [showModal, setShowModal] = useState(false);
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);

  const handleNextPage = async () => {
    questionnaireService.getNextPage().then((res) => setQuestionnaires(res));
  };
  const handlePrevPage = async () => {
    questionnaireService.getPrevPage().then((res) => setQuestionnaires(res));
  };
  const fetchQuestionnaires = async () => {
    questionnaireService
      .getQuestionnaires(8)
      .then((res) => setQuestionnaires(res));
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
      <Button
        variant="contained"
        color="primary"
        onClick={() => setShowModal(true)}
      >
        Mostrar Cuestionarios
      </Button>
      <Dialog open={showModal} onClose={closeModal} maxWidth="md" fullWidth >
        <DialogTitle className={styles.dialogTitle}>
          Formularios Disponibles
          <IconButton
            aria-label="close"
            onClick={closeModal}
            sx={{color: "white", "&:hover": { backgroundColor: "red"}}}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent className={styles.dialog}>
          <div className={styles.dialogContent}>
            <div className={styles.searchContainer}>
              <TextField label="Buscar Por título" />
              <Button variant="contained" color="primary">
                Buscar
              </Button>
            </div>
            <List className={styles.listContent}>
              {questionnaires.map((ques) => (
                <ListItem
                  className={styles.listItem}
                  key={ques.id}
                  onClick={() => {
                    onQuestionnaireSelect(ques);
                    closeModal();
                  }}
                >
                  <ListItemText
                    primary={`${ques.title}`}
                    secondary={`${ques.description}`}
                  />
                </ListItem>
              ))}
            </List>
          </div>
        </DialogContent>
        <DialogActions className={styles.dialogActions}>
        <Button
            style={{ marginRight: 'auto'}}
            variant="contained"
            color="error"
            onClick={closeModal}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handlePrevPage}
            disabled={!questionnaireService.hasPrevPage}
          >
            Página anterior
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleNextPage}
            disabled={!questionnaireService.hasNextPage}
          >
            Siguiente página
          </Button>
        </DialogActions>
      </Dialog>
      </div>
  );
}
