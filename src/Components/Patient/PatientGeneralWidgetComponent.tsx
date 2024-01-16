import styles from "./PatientGeneralWidgetComponent.module.css";
import PatientService from "../../Services/PatientService";
import { Patient } from "fhir/r4";

const patientService = new PatientService();

export default function PatientGeneralWidgetComponent({
  patient,
  edit = false,
}: {
  patient: Patient;
  edit?: Boolean;
}) {
  return (
    <div className={styles.generalwidget}>
      <div className={styles.title}>
        <div className={styles.icon}>
          <div className={styles.ellipse} />
          <img className={styles["contacts-icon"]} alt="" src="/contacts.svg" />
        </div>
        <b className={styles.title1}>Información General</b>
        {edit && <b className={styles.text}>Edit</b>}
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
                  {patientService.calcularEdad(patient.birthDate)} y.o.
                </>
              )}{" "}
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.text1}>Sexo</div>
            <div className={styles.text2}>{patient.gender}</div>
          </div>
          <div className={styles.item}>
            <div className={styles.text1}>Número Telefónico</div>
            <div className={styles.text2}>
              {patientService.obtenerPrimerNumeroTelefono(patient)}
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.text1}>ID</div>
            <div className={styles.text2}>{patient.id}</div>
          </div>
        </ul>
      </div>
    </div>
  );
}
