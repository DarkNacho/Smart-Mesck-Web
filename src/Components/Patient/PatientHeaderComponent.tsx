import { Patient } from "fhir/r4";
import { useState } from "react";
import styles from "./PatientHeaderComponent.module.css";
import PersonUtil from "../../Services/Utils/PersonUtils";
import { loadUserRoleFromLocalStorage } from "../../RolUser";

export default function PatientHeaderComponent({
  patient,
  onOptionSelect,
}: {
  patient: Patient;
  onOptionSelect: (nuevaOpcion: string) => void;
}) {
  const [selectedOption, setSelectedOption] = useState<string>("Overview");
  const name = PersonUtil.getPersonNameAsString(patient);
  const avatar = patient.photo?.[0]?.url || "/avatar.JPG";

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    onOptionSelect(option);
  };

  return (
    <div className={styles.patienheader}>
      <div className={styles.icon}>
        <div
          className={styles["icon-child"]}
          style={{ backgroundImage: `url(${avatar})` }}
        ></div>
      </div>
      <div className={styles.navlocation}>
        <div className={styles.location}>
          <div className={styles.item}>
            <div className={styles.item}>
              <div className={styles.text}>Pacientes</div>
            </div>
            <div className={styles.item1}>
              <div className={styles.text}>{`>`}</div>
            </div>
            <div className={styles.item}>
              <div className={styles.text}>{name}</div>
            </div>
            <div className={styles.item1}>
              <div className={styles.text}>{`>`}</div>
            </div>
            <div className={styles.item}>
              <div className={styles.label1}>{selectedOption}</div>
            </div>
          </div>
        </div>
        <b className={styles.user}>{name}</b>
        <div className={styles.tabstop}>
          <div className={styles.location}>
            {loadUserRoleFromLocalStorage() !== "Patient" && (
              <div className={styles["tabs-group"]}>
                <div
                  className={`${styles.item5} ${
                    selectedOption === "Overview" ? styles.active : ""
                  }`}
                  onClick={() => handleOptionSelect("Overview")}
                >
                  <div className={styles.title}>
                    <div className={styles.text1}>Descripción General</div>
                  </div>
                </div>
                <div
                  className={`${styles.item5} ${
                    selectedOption === "Formularios" ? styles.active : ""
                  }`}
                  onClick={() => handleOptionSelect("Formularios")}
                >
                  <div className={styles.title}>
                    <div className={styles.text1}>Formularios</div>
                  </div>
                </div>
                <div
                  className={`${styles.item5} ${
                    selectedOption === "Encounters" ? styles.active : ""
                  }`}
                  onClick={() => handleOptionSelect("Encounters")}
                >
                  <div className={styles.title}>
                    <div className={styles.text1}>Encuentros</div>
                  </div>
                </div>
                <div
                  className={`${styles.item5} ${
                    selectedOption === "Sensor" ? styles.active : ""
                  }`}
                  onClick={() => handleOptionSelect("Sensor")}
                >
                  <div className={styles.title}>
                    <div className={styles.text1}>Sensor</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <img
        className={styles["mask-group-icon1"]}
        alt=""
        src="/mask-group@2x.png"
      />
    </div>
  );
}
