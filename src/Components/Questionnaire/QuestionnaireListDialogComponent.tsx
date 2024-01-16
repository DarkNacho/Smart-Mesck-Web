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
  InputAdornment,
} from "@mui/material";
import toast from "react-hot-toast";
import { Close, Search } from "@mui/icons-material";
import styles from "./QuestionnaireListDialogComponent.module.css";
import QuestionnaireService from "../../Services/QuestionnaireService";


const questionnaireService = new QuestionnaireService();

export default function QuestionnaireListDialogComponent({
  onQuestionnaireSelect,
}: {
  onQuestionnaireSelect: (ques: Questionnaire) => void;
}) {
  const [showModal, setShowModal] = useState(false);
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const closeModal = () => {
    setShowModal(false);
  };

  const handleOperation = async (
    operation: () => Promise<Result<Questionnaire[]>>,
    successMessage: string
  ) => {
    const response = await toast.promise(operation(), {
      loading: "Obteniendo Formularios",
      success: (result) => {
        if (result.success) {
          return successMessage;
        } else {
          throw Error(result.error);
        }
      },
      error: (result) => result.toString(),
    });
  
    if (response.success) {
      setQuestionnaires(response.data);
      console.log(response.data);
    } else {
      console.error(response.error);
    }
  };

  const handleNewQuestionnaires = async (direction: "next" | "prev") => {
    handleOperation(
      () => questionnaireService.getNewResources(direction),
      "Formularios Obtenidos exitosamente"
    );
  };
  
  const fetchQuestionnaires = async () => {
    handleOperation(
      () => questionnaireService.getResources(7),
      "Forumularios Obtenidos exitosamente"
    );
  };
  
  const handleSearch = async () => {
    handleOperation(
      () => questionnaireService.getResources(7, searchTerm),
      "Questionnaires buscados obtenidos exitosamente"
    );
  };


  useEffect(() => {
    if(showModal)
      fetchQuestionnaires();
  }, [showModal]);



  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setShowModal(true)}
      >
        Mostrar Cuestionarios
      </Button>
      <Dialog open={showModal} onClose={closeModal} maxWidth="md" fullWidth>
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
          <form
          className={styles.searchContainer}
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
        >
          <TextField
            style={{ width: "100%" }}
            label="Buscar un paciente"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton type="submit">
                    <Search />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </form>
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
            onClick={() => handleNewQuestionnaires("prev")}
            disabled={!questionnaireService.hasPrevPage}
          >
            Página anterior
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleNewQuestionnaires("next")}
            disabled={!questionnaireService.hasNextPage}
          >
            Siguiente página
          </Button>
        </DialogActions>
      </Dialog>
      </div>
  );
}
