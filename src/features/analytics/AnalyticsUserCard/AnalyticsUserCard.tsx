import classNames from "classnames";
import styles from "./style.module.scss";
/* import kotik from "./46d1b6f32d022d8c6788067c3f38cfe7.png";
 */
import { useNavigate } from "react-router-dom";
import { domain } from "src/shared/constants/config";
import { observer } from "mobx-react-lite";
import { educationStore } from "src/features/education/stores/educationStore";
import { IUser } from "src/features/users/interfaces/user";
import { addDays } from "src/features/users/pages/UserPage/UserPage";

export const AnalyticsUserCard = observer(
    ({
        img,
        role,
        name,
        link,
        error,
        user,
    }: {
        img?: string | null;
        role: string;
        name: string;
        link: string;
        error: boolean;
        user: IUser;
        tg?: string;
    }) => {
        const navigate = useNavigate();

        const getDeadline = () => {
            const uc = educationStore.userCourses
                .filter((uc) => uc.userId === user.id)
                .find((uc) => uc.startTimestamp && !uc.finishTimestamp);
            const c = educationStore.getCourseByUserCourse(uc);
            if (uc?.startTimestamp && c) {
                return addDays(uc.startTimestamp, c.duration);
            }
        };

        return (
            <div className={styles.container} onClick={() => navigate(link)}>
                <div className={styles.imgBlock}>
                    <img className={styles.img} src={`${domain}${img}`} alt="" />
                </div>
                <div className={styles.text}>
                    <div className={styles.role}>{role}</div>
                    <div className={styles.name}>{name}</div>
                </div>
                <div className={styles.progres}>
                    {Math.round(
                        (educationStore.userCourses
                            .filter((uc) => uc.userId === user.id)
                            .filter((c) => c.finishTimestamp).length /
                            (educationStore.userCourses.filter((uc) => uc.userId === user.id)
                                .length || 1)) *
                            100,
                    )}
                    %
                </div>
                <div className={classNames(styles.date, { [styles.error]: error })}>
                    {getDeadline()?.toLocaleDateString(undefined, {
                        day: "2-digit",
                        month: "2-digit",
                        year: "2-digit",
                    })}
                </div>
            </div>
        );
    },
);
