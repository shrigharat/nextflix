import styles from "./loader.module.css";

export const Loader = ({ width = "24px", height = "24px", color = "white" }) => {
    return <div className={styles.loaderWrapper}>
        <div className={styles.loader} style={{ width, height, color }}></div>
    </div>
}