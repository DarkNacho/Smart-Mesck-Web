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

import toast from "react-hot-toast";
import FhirService from "../Services/FhirService";


interface ListResourceProps {
  searchParam?: any;
  getDisplay: (value: FhirResource) => string;
  fhirService: FhirService<FhirResource>;
}


export default function ListResourceComponent({ searchParam, getDisplay, fhirService }: ListResourceProps) {

  const [resources, setResources] = useState<FhirResource[]>([]);

  const navigate = useNavigate();

  const handleOperation = async (
    operation: () => Promise<Result<FhirResource[]>>,
    successMessage: string
  ) => {
    const response = await toast.promise(operation(), {
      loading: "Obteniendo...",
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
      setResources(response.data);
      console.log(response.data);
    } else {
      console.error(response.error);
    }
  };

  const handleNewResources = async (direction: "next" | "prev") => {
    handleOperation(
      () => fhirService.getNewResources(direction),
      "Obtenidos exitosamente"
    );
  };

  const fetchResources = async () => {
    handleOperation(
      () => fhirService.getResources(searchParam),
      "Obtenidos exitosamente"
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
