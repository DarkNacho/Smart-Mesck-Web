import { Button } from "@mui/material";
import styles from "./HeaderComponent.module.css";
import { useState } from "react";

export default function HeaderComponent() {
  const [selectedTab, setSelectedTab] = useState<string>("Pacientes");

  const handleSelectedTab = (tab: string) => {
    setSelectedTab(tab);
  };

  return (
    <div>
      <img
        className={styles.smImage}
        alt=""
        src="/smart-mesck-blanco-6@2x.png"
      />
      <ul className={styles.items}>
        <ul className={styles.menulegacy}>
          <h2
            className={`${styles.tab} ${
              selectedTab === "Pacientes" ? styles.active : ""
            }`}
            onClick={() => handleSelectedTab("Pacientes")}
          >
            Pacientes
          </h2>
          <h2
            className={`${styles.tab} ${
              selectedTab === "Opción2" ? styles.active : ""
            }`}
            onClick={() => handleSelectedTab("Opción2")}
          >
            Opción2
          </h2>
          <h2
            className={`${styles.tab} ${
              selectedTab === "Opción3" ? styles.active : ""
            }`}
            onClick={() => handleSelectedTab("Opción3")}
          >
            Opción3
          </h2>
          <h2
            className={`${styles.tab} ${
              selectedTab === "Opción4" ? styles.active : ""
            }`}
            onClick={() => handleSelectedTab("Opción4")}
          >
            Opción4
          </h2>
        </ul>
        <ul className={styles.salir}>
          <Button
            sx={{ width: 64 }}
            color="primary"
            variant="contained"
            href="https://www.google.com"
          >
            Salir
          </Button>
          <div className={styles.user}>
            <div className={styles.user1}>
              <img
                className={styles.avatarimageIcon}
                alt=""
                src="/avatarimage.svg"
              />
              UsuarioNoRegistrado
            </div>
          </div>
        </ul>
      </ul>
    </div>
  );
}
