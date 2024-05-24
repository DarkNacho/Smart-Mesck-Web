import { ReactNode, useEffect, useState } from "react";
import { FhirResource } from "fhir/r4";

import {
  List,
  ListItem,
  //ListItemText,
  Button,
  Box,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import styles from "./ListResourceComponent.module.css";

import FhirService from "../Services/FhirService";
import HandleResult from "./HandleResult";
import { SearchParams } from "fhir-kit-client";

interface ListResourceProps<T extends FhirResource> {
  searchParam?: SearchParams;
  getDisplay: (value: T) => string;
  fhirService: FhirService<T>;
  onClick?: (resource: T) => void;
  onDoubleClick?: (resource: T) => void;
  chields?: ReactNode;
}

export default function ListResourceComponent<T extends FhirResource>({
  searchParam,
  getDisplay,
  fhirService,
  onClick,
  onDoubleClick,
  chields: chields,
}: ListResourceProps<T>) {
  const [resources, setResources] = useState<T[]>([]);

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
              <Box>{chields}</Box>
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
    </div>
  );
}
