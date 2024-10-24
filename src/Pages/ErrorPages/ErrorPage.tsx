// src/Pages/NotFoundPage.tsx
import React from "react";
import { Link } from "react-router-dom";
import styles from "./style.module.css";
import SadFaceSVG from "../../../public/SadFace.svg";

const ErrorPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <img src={SadFaceSVG} alt="Sad face" className={styles.sadFace} />
      <h1 className={styles.header}>¡Error inesperado!</h1>
      <div className={styles.messageContainer}>
        <p className={styles.paragraph}>Un error ha ocurrido</p>
        <p className={styles.paragraph2}>
          Por favor repórtelo al equipo de matención y vuelva a la página de
          inicio.
        </p>
        <p className={styles.paragraph2}>Lamentamos los inconvenietes.</p>
      </div>
      <Link to="/" className={styles.link}>
        Volver a la página de inicio.
      </Link>
    </div>
  );
};

export default ErrorPage;
