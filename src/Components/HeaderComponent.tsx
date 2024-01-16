import { Button } from "@mui/material";
import styles from "./HeaderComponent.module.css";
import { useState } from "react";

export default function HeaderComponent() {
  const [selectedTab, setSelectedTab] = useState<string>( localStorage.getItem("selectedTab") || "Patient");

  const handleSelectedTab = (tab: string) => {
    setSelectedTab(tab);
    localStorage.setItem("selectedTab", tab);
  };



  const sxStyleActive = {
    fontSize: "18px",
    color: "white",
    cursor: "pointer",
    textDecoration: "underline",
    textDecorationThickness: "0.3em",
    textUnderlineOffset: "1.3em",
    transition: "color 0.3s ease",
    "&:hover": {
      textDecorationSkipInk: "auto",
      textDecoration: "underline",
      textDecorationThickness: "0.3em",
      textUnderlineOffset: "1.3em",
      transition: "color 0.3s ease",
      color: "rgba(255, 255, 255, 0.6)",
    },
  };
  const sxStyle = {
    fontSize: "18px",
    color: "white",
    cursor: "pointer",
    "&:hover": {
      color: "rgba(255, 255, 255, 0.6)",
    },
  };

  const tabs = {
    Patient: "Pacientes",
    op2: "Opción2",
    op3: "Opción3",
    op4: "Opción4",
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
      {Object.entries(tabs).map(([tabKey, tabText]) => (
        <Button
          key={tabKey}
          variant="text"
          color="error"
          onClick={() => handleSelectedTab(tabKey)}
          sx={selectedTab === tabKey ? sxStyleActive : sxStyle}
          href={`/${tabKey}`}
        >
          {tabText}
        </Button>
      ))}
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
