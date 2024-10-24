// src/Pages/NotFoundPage.tsx
import React from "react";
import { Link } from "react-router-dom";
import styles from "./style.module.css";
import SadFaceSVG from "../../../public/SadFace.svg";

const NotFoundPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <img src={SadFaceSVG} alt="Sad face" className={styles.sadFace} />
      <h1 className={styles.header}>¡Error 404!</h1>
      <div className={styles.messageContainer}>
        <p className={styles.paragraph}>¡Aquí no hay nada!</p>
        <p className={styles.paragraph2}>El enlace no está correcto</p>
      </div>
      <Link to="/" className={styles.link}>
        Volver a la página de inicio.
      </Link>
    </div>
  );
};

export default NotFoundPage;
