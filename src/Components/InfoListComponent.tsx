import { useEffect, useState } from "react";
import { FhirResource } from "fhir/r4";
import styles from "./InfoListComponent.module.css";
import Pair from "../Interfaces/Pair";


export default function InfoListComponent({
  data,
  title,
  icon,
  edit = false,
}: {
  data: Pair<String,String>[];
  title: string;
  icon: string;
  edit?: Boolean;
}) {
  useEffect(() => {
    console.log("data", data);
    console.log("title", title);
    console.log("data", icon);
  }, []);

  let content;

  if (!data || data.length === 0) {
    content = <div className={styles.emptyMessage}>No hay datos disponibles</div>;
  } else {
    content = data.map((dato, index) => (
      <div className={styles.item} key={index}>
        <div className={styles.text1}>{dato.first}</div>
        <div className={styles.text2}>{dato.second}</div>
      </div>
    ));
  }

return (
    <div className={styles.infolist}>
      <div className={styles.title}>
        <div className={styles.icon}>
          <div className={styles.ellipse} />
          <img
            className={styles["contacts-icon"]}
            alt=""
            src={icon}
          />
        </div>
        <b className={styles.title1}>{title}</b>
        { edit && <b className={styles.text}>Edit</b> }
      </div>
      <div className={styles.table}>
        <ul className={styles["text-wrapper"]}>{content}</ul>
      </div>
    </div>
  );
}