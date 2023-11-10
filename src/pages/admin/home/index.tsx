import axios from "axios";
import { observer } from "mobx-react-lite";
import { LOGOUT_ENDPOINT } from "src/shared/api/endpoints";
import { ContentWithHeaderLayout } from "src/features/layout/ui/ContentWithHeaderLayout/ContentWithHeaderLayout";
import { useEffect } from "react";
import { userStore } from "src/features/users/stores/userStore";
import styles from "./style.module.scss";
import { HomeContainer } from "src/features/home/HomeContainer/HomeContainer";
import { EmployeeCard } from "src/features/staff/staff/EmployeeCard/EmployeeCard";
import { IconButton } from "src/shared/ui/Button/IconButton/IconButton";
import { IconEducation } from "src/features/education/assets";
import { CircularProgress } from "@mui/material";
import { Button } from "src/shared/ui/Button/Button";
import { useNavigate } from "react-router-dom";
import { IconChat, IconDelete, IconMailing } from "src/shared/assets/img";

export const HomePage = observer(() => {
    useEffect(() => {
        userStore.fetchAllUsers();
    }, []);
    const navigate = useNavigate();
    const user = userStore.currentUser;
    const responsibleUser = userStore.allUsers.find((e) => e.id === user?.responsibleUserId);
    const employeeUsers = userStore.allUsers.filter((e) => e.responsibleUserId === user?.id);
    const employeeUsersArray = employeeUsers.map((user, index) => (
        <EmployeeCard
            key={index}
            role={user?.department}
            name={user?.fullName}
            tg={user?.telegram}
            link={`/users/${user?.id}`}
        />
    ));
    console.log(employeeUsersArray);
    return (
        <ContentWithHeaderLayout title={"Главная"}>
            <div className={styles.container}>
                <div className={styles.header}>Привет, {user?.firstName}!</div>
                {user?.role === "EMPLOYEE" ? (
                    <div className={styles.content}>
                        <div className={styles.leftContainer}>
                            <HomeContainer header={"Можно обратиться за помощью"}>
                                <EmployeeCard
                                    role={responsibleUser?.department}
                                    name={responsibleUser?.fullName}
                                    tg={responsibleUser?.telegram}
                                    link={`/users/${responsibleUser?.id}`}
                                />
                            </HomeContainer>
                            <HomeContainer header={"Текущие курсы"}>
                                <button className={styles.course} onClick={() => {}}>
                                    <IconEducation />
                                    {/* {c.name} */}Как устроена компания
                                    <div className={styles.deadLine}>Срок сдачи | 07.11</div>
                                </button>
                                <button className={styles.course} onClick={() => {}}>
                                    <IconEducation />
                                    {/* {c.name} */}Как устроена компания
                                    <div className={styles.deadLine}>Срок сдачи | 07.11</div>
                                </button>
                            </HomeContainer>
                        </div>
                        <div className={styles.rightContainer}>
                            <div className={styles.rightContainer}>
                                <HomeContainer header="Мой прогресс">
                                    <div className={styles.progressContainer}>
                                        <div className={styles.progress}>
                                            <CircularProgress
                                                variant="determinate"
                                                value={100}
                                                className={styles.circularBg}
                                                thickness={3}
                                            />
                                            <CircularProgress
                                                variant="determinate"
                                                value={52}
                                                className={styles.circular}
                                                thickness={3}
                                            />
                                            <div className={styles.value}>52%</div>
                                        </div>
                                        <div className={styles.progressText}>
                                            Прохождение <br /> текущего плана
                                            <br /> обучения
                                        </div>
                                    </div>
                                    <div className={styles.progressContainerSecond}>
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
                                        <div className={styles.progressText}>
                                            Количество правильных
                                            <br /> ответов за пройденные
                                            <br /> тесты
                                        </div>
                                    </div>
                                </HomeContainer>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className={styles.content}>
                        <div className={styles.leftContainer}>
                            <HomeContainer header={"Мои сотрудники"}>
                                {employeeUsersArray}
                                <div className={styles.button}>
                                    <Button
                                        onClick={() => navigate("/analytics")}
                                        isLoading={false}
                                        disabled={false}
                                        skinny={true}
                                    >
                                        Мои сотрудники
                                    </Button>
                                </div>
                            </HomeContainer>
                            <HomeContainer header={"Рассылка"}>
                                <div className={styles.analyticsSubname}>Шаблоны</div>
                                <div className={styles.mailingArray}>
                                    <button
                                        className={styles.courseMailing}
                                        onClick={() => {
                                            /* setEditingTemplate(mailing) */
                                        }}
                                    >
                                        <IconChat />
                                        {/* {mailing.name} */}Поздравление с Новым Годом
                                        <div className={styles.actions}>
                                            <IconButton
                                                onClick={(e) => {
                                                    /* 
                                                        e.stopPropagation();
                                                        setProcessingTemplate(mailing); */
                                                }}
                                                className={styles.deleteButton}
                                            >
                                                <IconMailing />
                                            </IconButton>
                                            <IconButton
                                                onClick={(e) => {
                                                    /* 
                                                        e.stopPropagation();
                                                        setDeletingMailing(mailing); */
                                                }}
                                                className={styles.deleteButton}
                                            >
                                                {/* <IconDelete /> */}
                                            </IconButton>
                                        </div>
                                    </button>
                                    <button
                                        className={styles.courseMailing}
                                        onClick={() => {
                                            /* setEditingTemplate(mailing) */
                                        }}
                                    >
                                        <IconChat />
                                        {/* {mailing.name} */}Поздравление с Новым Годом
                                        <div className={styles.actions}>
                                            <IconButton
                                                onClick={(e) => {
                                                    /* 
                                                        e.stopPropagation();
                                                        setProcessingTemplate(mailing); */
                                                }}
                                                className={styles.deleteButton}
                                            >
                                                <IconMailing />
                                            </IconButton>
                                            <IconButton
                                                onClick={(e) => {
                                                    /* 
                                                        e.stopPropagation();
                                                        setDeletingMailing(mailing); */
                                                }}
                                                className={styles.deleteButton}
                                            >
                                                {/* <IconDelete /> */}
                                            </IconButton>
                                        </div>
                                    </button>
                                </div>
                                <div className={styles.buttonMailing}>
                                    <Button
                                        onClick={() => navigate("/mailing")}
                                        isLoading={false}
                                        disabled={false}
                                        skinny={true}
                                    >
                                        Создать рассылку
                                    </Button>
                                </div>
                            </HomeContainer>
                        </div>
                        <div className={styles.rightContainer}>
                            <div className={styles.rightContainer}>
                                <HomeContainer header="Аналитика">
                                    <div className={styles.analyticsSubname}>Общая в компании</div>

                                    <div className={styles.progressContainerSecond}>
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
                                        <div className={styles.progressText}>
                                            Прохождение <br />
                                            текущего плана <br />
                                            обучения
                                        </div>
                                    </div>
                                    <div className={styles.buttonAnalytic}>
                                        <Button
                                            onClick={() => navigate("/users")}
                                            isLoading={false}
                                            disabled={false}
                                            skinny={true}
                                        >
                                            Аналитика
                                        </Button>
                                    </div>
                                </HomeContainer>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ContentWithHeaderLayout>
    );
});
