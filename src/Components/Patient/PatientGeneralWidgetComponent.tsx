import PersonUtil from "../../Services/Utils/PersonUtils";
import styles from "./PatientGeneralWidgetComponent.module.css";
import { Patient } from "fhir/r4";

export default function PatientGeneralWidgetComponent({
  patient,
  edit = false,
}: {
  patient: Patient;
  edit?: boolean;
}) {
  return (
    <div className={styles.generalwidget}>
      <div className={styles.title}>
        <div className={styles.icon}>
          <div className={styles.ellipse} />
          <img className={styles["contacts-icon"]} alt="" src="/contacts.svg" />
        </div>
        <b className={styles.title1}>Antecedentes Personales</b>
        {edit && <b className={styles.text}>Edit</b>}
      </div>
      <div className={styles.table}>
        <ul className={styles["text-wrapper"]}>
          <div className={styles.item}>
            <div className={styles.text1}>ID</div>
            <div className={styles.text2}>
              {PersonUtil.getFirstIdentifierOrId(patient)}
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.text1}>E-Mail</div>
            <div className={styles.text2}>
              {PersonUtil.getContactPointFirstOrDefaultAsString(
                patient,
                "email"
              )}
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.text1}>Número Telefónico</div>
            <div className={styles.text2}>
              {PersonUtil.getContactPointFirstOrDefaultAsString(
                patient,
                "phone"
              )}
            </div>
          </div>
        </ul>
      </div>
      <div className={styles.table}>
        <ul className={styles["text-wrapper"]}>
          <div className={styles.item}>
            <div className={styles.text1}>Fecha de Nacimiento</div>
            <div className={styles.text2}>
              {" "}
              {patient.birthDate && (
                <>
                  {patient.birthDate} •{" "}
                  {PersonUtil.calcularEdad(patient.birthDate)} y.o.
                </>
              )}{" "}
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.text1}>Sexo</div>
            <div className={styles.text2}>{patient.gender}</div>
          </div>
          <div className={styles.item}>
            <div className={styles.text1}>Estado Civil</div>
            <div className={styles.text2}>
              {PersonUtil.getMaritalStatus(patient)}
            </div>
          </div>
        </ul>
      </div>
    </div>
  );
}
