import styles from "./EmployeeCard.module.scss";
import kotik from "./46d1b6f32d022d8c6788067c3f38cfe7.png";
import { useNavigate } from "react-router-dom";
import { domain } from "src/shared/constants/config";
export const EmployeeCard = ({
    img,
    role,
    name,
    link,
}: {
    img?: string | null;
    role: string;
    name: string;
    link: string;
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
        </div>
    );
};
