import { useEffect, useState } from "react";
import { FhirResource } from "fhir/r4";

import {
  List,
  ListItem,
  //ListItemText,
  Button,
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
}

export default function ListResourceComponent<T extends FhirResource>({
  searchParam,
  getDisplay,
  fhirService,
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
            onClick={() => navigate(`/${resource.resourceType}/${resource.id}`)}
          >
            <pre>{getDisplay(resource)}</pre>
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
          Previous Page
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleNewResources("next")}
          disabled={!fhirService.hasNextPage}
        >
          Next Page
        </Button>
      </div>
    </div>
  );
}
