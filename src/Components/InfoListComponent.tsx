import { useNavigate } from "react-router-dom";
import styles from "./InfoListComponent.module.css";
import { IconButton } from "@mui/material";

import { Add } from "@mui/icons-material";
import { useState } from "react";
import ObservationCreateComponent from "./Observation/ObservationCreateComponent";
import { isAdminOrPractitioner } from "../RolUser";
import ConditionCreateComponent from "./Condition/ConditionCreateComponent";

export interface InfoListData {
  id?: string;
  name: string;
  value: string;
}

export default function InfoListComponent({
  data,
  title,
  icon,
  resourceType,
  patientId,
}: {
  resourceType: string;
  data: InfoListData[];
  title: string;
  icon: string;
  patientId?: string;
}) {
  const navigate = useNavigate();

  const [openDialog, setOpenDialog] = useState(false);

  const handleIsOpen = (isOpen: boolean) => {
    setOpenDialog(isOpen);
  };

  return (
    <>
      <div>
        <ConditionCreateComponent
          onOpen={handleIsOpen}
          isOpen={resourceType === "Condition" ? openDialog : false}
          patientId={patientId!}
        ></ConditionCreateComponent>
        <ObservationCreateComponent
          onOpen={handleIsOpen}
          isOpen={resourceType === "Observation" ? openDialog : false}
          patientId={patientId!}
        ></ObservationCreateComponent>
      </div>
      <div className={styles.infolist}>
        <div className={styles.title}>
          <div className={styles.icon}>
            <div className={styles.ellipse} />
            <img className={styles["contacts-icon"]} alt="" src={icon} />
          </div>
          <b className={styles.title1}>{title}</b>
          {isAdminOrPractitioner() && (
            <IconButton
              onClick={() => setOpenDialog(true)}
              color="primary"
              aria-label="add"
              sx={{
                marginLeft: "auto",
                backgroundColor: "white",
                "&:hover": { backgroundColor: "#1b2455" },
              }}
            >
              <Add />
            </IconButton>
          )}
        </div>
        <div className={styles.table}>
          <ul className={styles["text-wrapper"]}>
            {data.length > 0 ? (
              data.map((dato, index) => (
                <div
                  className={`${styles.item} ${dato.id ? styles.item2 : ""}`}
                  key={index}
                  onClick={() => {
                    if (dato.id) navigate(`${resourceType}/${dato.id}`);
                  }}
                >
                  <div className={styles.text1}>{dato.name}</div>
                  <div className={styles.text2}>{dato.value}</div>
                </div>
              ))
            ) : (
              <div>
                <div className={styles.emptyMessage}>
                  No hay datos disponibles
                </div>
              </div>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}
