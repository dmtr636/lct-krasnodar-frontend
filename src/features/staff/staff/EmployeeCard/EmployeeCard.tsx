import styles from "./EmployeeCard.module.scss";
import kotik from "./46d1b6f32d022d8c6788067c3f38cfe7.png";
import { useNavigate } from "react-router-dom";
import { domain } from "src/shared/constants/config";
import telegram from "src/shared/assets/img/logos_telegram.svg";
export const EmployeeCard = ({
    img,
    role,
    name,
    link,
    tg,
}: {
    img?: string | null;
    role: string;
    name: string;
    link: string;
    tg: string;
}) => {
    const navigate = useNavigate();

    return (
        <div className={styles.container} onClick={() => navigate(link)}>
            <div className={styles.imgBlock}>
                <img className={styles.img} src={img ? `${domain}${img}` : kotik} alt="" />
            </div>
            <div className={styles.text}>
                <div className={styles.role}>{role}</div>
                <div className={styles.name}>{name}</div>
            </div>
            <div className={styles.tg} onClick={(e) => e.stopPropagation()}>
                <a href={`https://t.me/${tg}`} target="_blank" rel="noreferrer">
                    <img src={telegram} alt="" />
                </a>
            </div>
        </div>
    );
};
