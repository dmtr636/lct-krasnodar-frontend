import styles from "./style.module.scss";
import { observer } from "mobx-react-lite";
import { ContentWithHeaderLayout } from "src/features/layout/ui/ContentWithHeaderLayout/ContentWithHeaderLayout";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { userStore } from "src/features/users/stores/userStore";
import { url } from "src/shared/helpers/url";
import { USER_DEPARTMENTS } from "src/features/users/constants/userFilters";
import { CalendarIcon, EducationIcon, SuccessIcon, TelegramIcon } from "src/features/users/assets";
import { HeaderActionButton } from "src/features/layout/ui/Header/HeaderActionButton/HeaderActionButton";
import { IconDelete, IconEdit } from "src/shared/assets/img";
import { MOCKED_USER_COURSES } from "src/features/education/constants/mockCources";
import { Dialog } from "src/features/users/ui/Dialog/Dialog";
import { IUser } from "src/features/users/interfaces/user";
import { CircularProgress } from "@mui/material";
import generatePDF from "react-to-pdf";

export function declOfNum(number: any, titles: { [x: string]: any }) {
    const cases = [2, 0, 1, 1, 1, 2];
    return titles[
        number % 100 > 4 && number % 100 < 20 ? 2 : cases[number % 10 < 5 ? number % 10 : 5]
    ];
}

const tabs = ["Основная информация", "Задачи", "Аналитика обучения сотрудника"];

export const UserPage = observer(() => {
    const navigate = useNavigate();
    const [selectedTab, setSelectedTab] = useState(tabs[0]);
    const params = useParams<{ id: string }>();
    const [showDelete, setShowDelete] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [deletedUser, setDeletedUser] = useState<IUser | null>(null);

    const user = userStore.allUsers.find((u) => u.id.toString() === params.id) ?? deletedUser;

    useEffect(() => {
        userStore.fetchAllUsers();
    }, []);

    const componentRef = useRef<HTMLDivElement>(null);
    const handleDownloadImage = async () => {
        generatePDF(componentRef, { filename: `Аналитика: ${user?.fullName}.pdf` });
    };

    const renderUserInfo = () => {
        if (!user) {
            return <h1>Загрузка ...</h1>;
        }

        return (
            <div className={styles.userInfo}>
                <div className={classNames(styles.row, styles.row1)}>
                    <div className={styles.left}>
                        <img src={url(user.photoFileUrl ?? "")} className={styles.avatar} />
                        <div>
                            <div className={styles.department}>
                                {USER_DEPARTMENTS[user.department]}
                            </div>
                            <div className={styles.name}>{user.fullName}</div>
                        </div>
                    </div>
                    <a
                        className={styles.tg}
                        href={"https://t.me/" + user.telegram}
                        target={"_blank"}
                    >
                        <TelegramIcon />
                    </a>
                </div>
                <div className={classNames(styles.row, styles.row2)}>
                    <div className={styles.header}>Контактные данные</div>
                    <div className={styles.contacts}>
                        <div>
                            <div className={styles.name}>Почта</div>
                            <div className={styles.value}>{user.email}</div>
                        </div>
                        <div>
                            <div className={styles.name}>Телеграм</div>
                            <div className={styles.value}>{user.telegram}</div>
                        </div>
                        <div>
                            <div className={styles.name}>Телефон</div>
                            <div className={styles.value}>{user.phone}</div>
                        </div>
                    </div>
                </div>
                <div className={classNames(styles.row, styles.row3)}>
                    <div className={styles.header}>Навыки</div>
                    <div className={styles.skills}>
                        {["Jira", "React", "Figma"].map((skill) => (
                            <div className={styles.skill}>{skill}</div>
                        ))}
                    </div>
                </div>
                <div className={classNames(styles.row, styles.row4)}>
                    <div className={styles.header}>Ответсвенное лицо</div>
                    <div className={styles.responsiblePerson}>
                        {userStore.allUsers.find((u) => u.id === user.responsibleUserId)?.fullName}
                    </div>
                </div>
            </div>
        );
    };

    const renderTasks = () => {
        const currentCourse = MOCKED_USER_COURSES.find(
            (c) => c.userId === user?.id && c.startDate !== null && c.finishDate === null,
        );

        return (
            <div className={styles.tasks}>
                <div className={styles.row}>
                    <div className={styles.header}>Текущее обучение</div>
                    <div className={styles.item}>
                        <EducationIcon />
                        <div>{currentCourse?.course.name}</div>
                    </div>
                    <div className={styles.item}>
                        <CalendarIcon />
                        <div>
                            {new Date(currentCourse?.deadlineDate ?? "").toLocaleDateString()}
                            <span className={styles.remainingDays}>
                                Осталось ({currentCourse?.remainingDays}{" "}
                                {declOfNum(currentCourse?.remainingDays, ["день", "дня", "дней"])})
                            </span>
                        </div>
                    </div>
                </div>
                <div className={styles.row}>
                    <div className={styles.header}>План обучения</div>
                    {MOCKED_USER_COURSES.filter((c) => !c.startDate).map((c) => (
                        <div className={styles.item}>
                            <EducationIcon />
                            <div>{c.course.name}</div>
                        </div>
                    ))}
                </div>
                <div className={styles.row}>
                    <div className={styles.header}>Завершённые курсы</div>
                    {MOCKED_USER_COURSES.filter((c) => c.isFinished).map((c) => (
                        <div className={classNames(styles.item, styles.finished)}>
                            <EducationIcon />
                            <div>
                                {c.course.name}
                                <span className={styles.score}>({c.testScore} / 10)</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderAnalytics = () => {
        return (
            <div className={styles.analytics} ref={componentRef}>
                <div className={styles.row}>
                    <div className={styles.header}>Текущее обучение</div>
                    <div className={styles.stats}>
                        <div className={styles.item}>
                            <div className={styles.progress}>
                                <CircularProgress
                                    variant="determinate"
                                    value={100}
                                    className={styles.circularBg}
                                    thickness={3}
                                />
                                <CircularProgress
                                    variant="determinate"
                                    value={45}
                                    className={styles.circular}
                                    thickness={3}
                                />
                                <div className={styles.value}>45%</div>
                            </div>
                            <div className={classNames(styles.label, styles.label1)}>
                                Прохождение текущего плана обучения
                            </div>
                        </div>
                        <div className={styles.item}>
                            <div className={styles.progress}>
                                <CircularProgress
                                    variant="determinate"
                                    value={100}
                                    className={styles.circularBg}
                                    thickness={3}
                                />
                                <CircularProgress
                                    variant="determinate"
                                    value={100}
                                    className={styles.circular}
                                    thickness={3}
                                />
                                <div className={styles.value}>100%</div>
                            </div>
                            <div className={classNames(styles.label, styles.label2)}>
                                Количество правильных ответов за пройденные тесты
                            </div>
                        </div>
                        <div className={styles.item}>
                            <div className={styles.progress}>
                                <CircularProgress
                                    variant="determinate"
                                    value={100}
                                    className={styles.circularBg}
                                    thickness={3}
                                />
                                <CircularProgress
                                    variant="determinate"
                                    value={83}
                                    className={styles.circular}
                                    thickness={3}
                                />
                                <div className={styles.value}>83%</div>
                            </div>
                            <div className={classNames(styles.label, styles.label3)}>
                                Курсов пройденных в срок
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.row}>
                    <div className={styles.header}>Завершённые курсы</div>
                    <div className={styles.table}>
                        <div className={styles.tableRow}>
                            <div className={styles.colHeader}>Название курса</div>
                            <div className={styles.colHeader}>Назначен</div>
                            <div className={styles.colHeader}>Дата сдачи</div>
                            <div className={styles.colHeader}>Ответы</div>
                        </div>
                        <div className={styles.tableRow}>
                            <div className={styles.name}>
                                <SuccessIcon /> Как устроена компания
                            </div>
                            <div className={styles.date}>23.03</div>
                            <div className={styles.date}>
                                <span className={styles.success}>23.03</span>
                            </div>
                            <div className={styles.date}>
                                <span className={styles.success}>4</span>&nbsp;/ 5
                            </div>
                        </div>
                        <div className={styles.tableRow}>
                            <div className={styles.name}>
                                <SuccessIcon /> Как устроена компания
                            </div>
                            <div className={styles.date}>23.03</div>
                            <div className={styles.date}>
                                <span className={styles.success}>23.03</span>
                            </div>
                            <div className={styles.date}>
                                <span className={styles.error}>2</span>&nbsp;/ 5
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const getStartActions = () => {
        if (selectedTab === tabs[0]) {
            return [
                <HeaderActionButton onClick={() => {}} icon={<IconEdit />}>
                    Редактировать
                </HeaderActionButton>,
            ];
        }
        if (selectedTab === tabs[1]) {
            return [
                <HeaderActionButton onClick={() => {}} icon={<IconEdit />}>
                    Редактировать план обучения
                </HeaderActionButton>,
            ];
        }
        if (selectedTab === tabs[2]) {
            return [
                <HeaderActionButton onClick={handleDownloadImage}>
                    Скачать в PDF
                </HeaderActionButton>,
            ];
        }
    };

    return (
        <ContentWithHeaderLayout
            title={"Сотрудники"}
            onBack={() => navigate("/users")}
            startActions={getStartActions()}
            endActions={[
                <HeaderActionButton
                    onClick={() => setShowDelete(true)}
                    icon={<IconDelete />}
                    color={"delete"}
                >
                    Удалить сотрудника
                </HeaderActionButton>,
            ]}
        >
            <div className={styles.content}>
                <div className={styles.tabs}>
                    {tabs.map((tab) => (
                        <button
                            className={classNames(styles.tab, {
                                [styles.active]: selectedTab === tab,
                            })}
                            onClick={() => setSelectedTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                {selectedTab === tabs[0] && renderUserInfo()}
                {selectedTab === tabs[1] && renderTasks()}
                {selectedTab === tabs[2] && renderAnalytics()}
            </div>

            <Dialog
                open={showDelete}
                title={"Подтверждение удаления"}
                onClose={() => setShowDelete(false)}
                onCancel={() => setShowDelete(false)}
                description={"Будет удалён доступ: " + user?.email}
                onDelete={() => {
                    if (user) {
                        setDeletedUser({ ...user });
                        userStore.deleteUser(user);
                        setShowDelete(false);
                        setShowSuccess(true);
                    }
                }}
            />
            <Dialog
                open={showSuccess}
                title={"Сотрудник успешно удалён"}
                titleIcon={<SuccessIcon />}
                onClose={() => setShowSuccess(false)}
                onCancel={() => {
                    setShowSuccess(false);
                    navigate("/users");
                }}
                description={"Был утрачен доступ: " + deletedUser?.email}
                cancelButtonText={"Закрыть"}
            />
        </ContentWithHeaderLayout>
    );
});
