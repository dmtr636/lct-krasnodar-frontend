import classNames from "classnames";
import styles from "./style.module.scss";
/* import kotik from "./46d1b6f32d022d8c6788067c3f38cfe7.png";
 */ import { useNavigate } from "react-router-dom";
import { domain } from "src/shared/constants/config";
import { USER_DEPARTMENTS } from "src/features/users/constants/userFilters";

export const AnalyticsUserCard = ({
    img,
    role,
    name,
    link,
    error,
}: {
    img?: string | null;
    role: string;
    name: string;
    link: string;
    error: boolean;
}) => {
    const navigate = useNavigate();

    return (
        <div className={styles.container} onClick={() => navigate(link)}>
            <div className={styles.imgBlock}>
                <img className={styles.img} src={`${domain}${img}`} alt="" />
            </div>
            <div className={styles.text}>
                <div className={styles.role}>{role}</div>
                <div className={styles.name}>{name}</div>
            </div>
            <div className={styles.progres}>78%</div>
            <div className={classNames(styles.date, { [styles.error]: error })}>07.11</div>
        </div>
    );
};
