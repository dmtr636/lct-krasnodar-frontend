import styles from "./EmployeeCard.module.scss";
import kotik from "./46d1b6f32d022d8c6788067c3f38cfe7.png";
export const EmployeeCard = ({
    img,
    role,
    name,
    link,
}: {
    img?: string;
    role: string;
    name: string;
    link: string;
}) => {
    return (
        <div className={styles.container} onClick={() => console.log(link)}>
            <div className={styles.imgBlock}>
                <img className={styles.img} src={img || kotik} alt="" />
            </div>
            <div className={styles.text}>
                <div className={styles.role}>{role}</div>
                <div className={styles.name}>{name}</div>
            </div>
        </div>
    );
};
