import { useNavigate } from "react-router-dom";
import styles from "./InfoListComponent.module.css";

export interface InfoListData {
  id?: string;
  name: string;
  value: string;
}

export default function InfoListComponent({
  data,
  title,
  icon,
  edit = false,
  resourceType,
}: {
  resourceType: string;
  data: InfoListData[];
  title: string;
  icon: string;
  edit?: Boolean;
}) {
  const navigate = useNavigate();
  return (
    <div className={styles.infolist}>
      <div className={styles.title}>
        <div className={styles.icon}>
          <div className={styles.ellipse} />
          <img className={styles["contacts-icon"]} alt="" src={icon} />
        </div>
        <b className={styles.title1}>{title}</b>
        {edit && <b className={styles.text}>Edit</b>}
      </div>
      <div>
        <div className={styles.table}>
          <ul className={styles["text-wrapper"]}>
            {data.length > 0 ? (
              data.map((dato, index) => (
                <div
                  className={`${styles.item} ${dato.id ? styles.item2 : ""}`}
                  key={index}
                  onClick={() => {
                    if (dato.id) navigate(`/${resourceType}/${dato.id}`);
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
    </div>
  );
}
