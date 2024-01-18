
import styles from "./InfoListComponent.module.css";

export default function InfoListComponent({
  data,
  title,
  icon,
  edit = false,
}: {
  data: { name: string; value: string }[];
  title: string;
  icon: string;
  edit?: Boolean;
}) {
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
                <div className={styles.item} key={index}>
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
