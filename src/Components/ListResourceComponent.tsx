import { ReactNode, useEffect, useState } from "react";
import { FhirResource } from "fhir/r4";

import {
  List,
  ListItem,
  //ListItemText,
  Button,
  Box,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import styles from "./ListResourceComponent.module.css";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import WarningIcon from "@mui/icons-material/Warning";

import FhirService from "../Services/FhirService";
import HandleResult from "./HandleResult";
import { SearchParams } from "fhir-kit-client";
import { isAdmin } from "../RolUser";

interface ListResourceProps<T extends FhirResource> {
  searchParam?: SearchParams;
  getDisplay: (value: T) => string;
  fhirService: FhirService<T>;
  onClick?: (resource: T) => void;
  onDoubleClick?: (resource: T) => void;
  onEdit?: (resource: T) => void;
  chields?: (resource: T) => ReactNode;
}

export default function ListResourceComponent<T extends FhirResource>({
  searchParam,
  getDisplay,
  fhirService,
  onClick,
  onDoubleClick,
  onEdit,
  chields,
}: ListResourceProps<T>) {
  const [resources, setResources] = useState<T[]>([]);

  const [open, setOpen] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState<T | null>(null);

  const navigate = useNavigate();

  const handleNewResources = async (direction: "next" | "prev") => {
    HandleResult.handleOperation(
      () => fhirService.getNewResources(direction),
      "Recibidos exitosamente",
      "Obteniendo...",
      setResources
    );
  };

  const fetchResources = async () => {
    HandleResult.handleOperation(
      () => fhirService.getResources(searchParam),
      "Recibidos exitosamente",
      "Obteniendo...",
      setResources
    );
  };

  useEffect(() => {
    fetchResources();
  }, [searchParam]);

  const handleClickOpen = (resource: T) => {
    setResourceToDelete(resource);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setResourceToDelete(null);
  };

  const handleDelete = async () => {
    if (!resourceToDelete || !resourceToDelete.id) {
      handleClose();
      return;
    }

    console.log(`Deleting resource with ID: ${resourceToDelete.id}`);
    const result = await HandleResult.handleOperation(
      () => fhirService.deleteResource(resourceToDelete.id!),
      "Recurso eliminado exitosamente",
      "Eliminando..."
    );

    if (result.success) {
      setResources((prevResources) =>
        prevResources.filter((r) => r.id !== resourceToDelete.id)
      );
    }

    handleClose();
  };

  return (
    <div>
      <List className={styles.listContent}>
        {resources.map((resource) => (
          <ListItem
            className={styles.listItem}
            key={resource.id}
            onClick={() =>
              onClick
                ? onClick(resource)
                : navigate(`/${resource.resourceType}/${resource.id}`)
            }
            onDoubleClick={() => onDoubleClick && onDoubleClick(resource)}
          >
            <Stack direction="row">
              <pre>{getDisplay(resource)}</pre>
              <Box>{chields && chields(resource)}</Box>
              <Box>
                <IconButton
                  sx={{ color: "blue" }}
                  hidden={!onEdit}
                  aria-label="edit"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit && onEdit(resource);
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  sx={{ color: "red" }}
                  hidden={!isAdmin()}
                  aria-label="delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClickOpen(resource);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Stack>
          </ListItem>
        ))}
      </List>
      <div className={styles.pagesButton}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleNewResources("prev")}
          disabled={!fhirService.hasPrevPage}
        >
          Atrás
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleNewResources("next")}
          disabled={!fhirService.hasNextPage}
        >
          Siguiente
        </Button>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <WarningIcon style={{ color: "red", marginRight: "8px" }} />
          <Typography variant="h6" style={{ color: "red", display: "inline" }}>
            Confirmar
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            style={{ color: "red" }}
          >
            ¿Estás seguro que quieres eliminar este ítem?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="primary" autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
