import { observer } from "mobx-react-lite";
import { ContentWithHeaderLayout } from "src/features/layout/ui/ContentWithHeaderLayout/ContentWithHeaderLayout";
import { useEffect, useState } from "react";
import { userStore } from "src/features/users/stores/userStore";
import styles from "./style.module.scss";
import { HomeContainer } from "src/features/home/HomeContainer/HomeContainer";
import { EmployeeCard } from "src/features/staff/staff/EmployeeCard/EmployeeCard";
import { IconButton } from "src/shared/ui/Button/IconButton/IconButton";
import { IconCheckmark, IconEducation } from "src/features/education/assets";
import { CircularProgress, Drawer, TextareaAutosize } from "@mui/material";
import { Button } from "src/shared/ui/Button/Button";
import { useNavigate } from "react-router-dom";
import { IconChat, IconClose, IconMailing, IconSuccess } from "src/shared/assets/img";
import { educationStore } from "src/features/education/stores/educationStore";
import { IMailing, mailingStore } from "src/features/mailing/stores/mailingStore";
import classNames from "classnames";
import { Checkbox } from "src/shared/ui/Checkbox/Checkbox";
import { USER_DEPARTMENT_FILTER_OPTIONS } from "src/features/users/constants/userDepartments";
import { Input } from "src/shared/ui/Inputs/Input/Input";
import { HeaderActionButton } from "src/features/layout/ui/Header/HeaderActionButton/HeaderActionButton";
import { fileStore } from "src/features/education/stores/fileStore";
import { USER_DEPARTMENTS } from "src/features/users/constants/userFilters";

export const HomePage = observer(() => {
    const [processingTemplate, setProcessingTemplate] = useState<IMailing | null>(null);
    const [showSuccessMailing, setShowSuccessMailing] = useState(false);
    const [showAddMailing, setShowAddMailing] = useState(false);

    useEffect(() => {
        userStore.fetchAllUsers();
    }, []);
    const navigate = useNavigate();
    const user = userStore.currentUser;
    const responsibleUser = userStore.allUsers.find((e) => e.id === user?.responsibleUserId);
    const employeeUsers = userStore.allUsers.filter((e) => e.responsibleUserId === user?.id);
    const employeeUsersArray = employeeUsers
        .slice(0, 2)
        .map((user, index) => (
            <EmployeeCard
                key={index}
                role={USER_DEPARTMENTS[user?.department]}
                name={user?.fullName}
                tg={user?.telegram}
                link={`/users/${user?.id}`}
            />
        ));

    useEffect(() => {
        if (showAddMailing) {
            mailingStore.nameInput = "";
            mailingStore.textInput = "";
            fileStore.selectedFile = null;
            fileStore.uploadedFile = null;
            mailingStore.selectedDepartments = [];
        }
    }, [showAddMailing]);

    useEffect(() => {
        if (processingTemplate) {
            mailingStore.nameInput = processingTemplate.name;
            mailingStore.textInput = processingTemplate.text;
            fileStore.uploadedFile = processingTemplate.file;
        }
    }, [processingTemplate]);
    return (
        <ContentWithHeaderLayout title={"Главная"}>
            <div className={styles.container}>
                <div className={styles.header}>Привет, {user?.firstName || "Администратор"}!</div>
                {user?.role === "EMPLOYEE" ? (
                    <div className={styles.content}>
                        <div className={styles.leftContainer}>
                            <HomeContainer header={"Можно обратиться за помощью"}>
                                <EmployeeCard
                                    img={responsibleUser?.photoFile?.url}
                                    role={USER_DEPARTMENTS[responsibleUser?.department ?? "ADMIN"]}
                                    name={responsibleUser?.fullName ?? ""}
                                    tg={responsibleUser?.telegram ?? ""}
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
                            {userStore.currentUser?.role === "MANAGER" && (
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
                            )}
                            <HomeContainer header={"Рассылка"}>
                                <div className={styles.analyticsSubname}>Шаблоны</div>
                                <div className={styles.mailingArray}>
                                    {mailingStore.mailings
                                        .filter((m) => m.isTemplate)
                                        .slice(0, 2)
                                        .map((m) => (
                                            <button
                                                className={styles.courseMailing}
                                                onClick={() => {
                                                    setProcessingTemplate(m);
                                                }}
                                            >
                                                <IconChat />
                                                {m.name}
                                                <div className={styles.actions}>
                                                    <IconButton
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setProcessingTemplate(m);
                                                        }}
                                                        className={styles.deleteButton}
                                                    >
                                                        <IconMailing />
                                                    </IconButton>
                                                </div>
                                            </button>
                                        ))}
                                </div>
                                <div className={styles.buttonMailing}>
                                    <Button
                                        onClick={() => setShowAddMailing(true)}
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

                                    <div className={styles.progressContainerSecondAnalytics}>
                                        <div className={styles.progress}>
                                            <CircularProgress
                                                variant="determinate"
                                                value={100}
                                                className={styles.circularBg}
                                                thickness={3}
                                            />
                                            <CircularProgress
                                                variant="determinate"
                                                value={Math.round(
                                                    (educationStore.userCourses.filter(
                                                        (uc) => uc.finishTimestamp,
                                                    ).length /
                                                        (educationStore.userCourses.length || 1)) *
                                                        100,
                                                )}
                                                className={styles.circular}
                                                thickness={3}
                                            />
                                            <div className={styles.value}>
                                                {Math.round(
                                                    (educationStore.userCourses.filter(
                                                        (uc) => uc.finishTimestamp,
                                                    ).length /
                                                        (educationStore.userCourses.length || 1)) *
                                                        100,
                                                )}
                                                %
                                            </div>
                                        </div>
                                        <div className={styles.progressText}>
                                            Прохождение <br />
                                            текущего плана <br />
                                            обучения
                                        </div>
                                    </div>
                                    <div className={styles.buttonAnalytic}>
                                        <Button
                                            onClick={() => navigate("/analytics")}
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

            <Drawer open={!!processingTemplate} anchor={"right"} elevation={0}>
                <div className={styles.drawer}>
                    <div className={styles.header}>
                        Рассылка шаблона
                        <button
                            className={styles.close}
                            onClick={() => setProcessingTemplate(null)}
                        >
                            <IconClose />
                        </button>
                    </div>
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>Выбранный шаблон</div>
                        <div className={styles.selectedTemplate}>
                            <IconChat />
                            {processingTemplate?.name}
                        </div>
                    </div>
                    <div className={classNames(styles.section, styles.withoutBottomBorder)}>
                        <div className={styles.sectionHeader}>Для кого предназначена программа</div>
                        <div className={styles.checkboxGrid}>
                            <Checkbox
                                checkboxChange={(value) => {
                                    mailingStore.selectedDepartments = [];
                                }}
                                isChecked={!mailingStore.selectedDepartments.length}
                            >
                                Выбрать все
                            </Checkbox>
                            {USER_DEPARTMENT_FILTER_OPTIONS.map((option) => (
                                <Checkbox
                                    checkboxChange={(value) => {
                                        if (value) {
                                            mailingStore.selectedDepartments.push(
                                                option.department,
                                            );
                                        } else {
                                            mailingStore.selectedDepartments =
                                                mailingStore.selectedDepartments.filter(
                                                    (d) => d !== option.department,
                                                );
                                        }
                                    }}
                                    isChecked={mailingStore.selectedDepartments.includes(
                                        option.department,
                                    )}
                                >
                                    {option.name}
                                </Checkbox>
                            ))}
                        </div>
                    </div>

                    <div className={styles.actionButton}>
                        <Button
                            onClick={() => {
                                mailingStore.addMailing();
                                setProcessingTemplate(null);
                                setShowSuccessMailing(true);
                            }}
                            isLoading={false}
                            disabled={false}
                            icon={<IconCheckmark />}
                        >
                            Провести рассылку
                        </Button>
                    </div>
                </div>
            </Drawer>

            <Drawer open={showAddMailing} anchor={"right"} elevation={0}>
                <div className={styles.drawer}>
                    <div className={styles.header}>
                        Создать новую рассылку
                        <button className={styles.close} onClick={() => setShowAddMailing(false)}>
                            <IconClose />
                        </button>
                    </div>
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>Основная информация</div>
                        <Input
                            onChange={(value) => (mailingStore.nameInput = value)}
                            inputValue={mailingStore.nameInput}
                            labelName={"Название рассылки"}
                        />
                    </div>
                    <div className={styles.section}>
                        <div className={styles.row}>
                            <div>
                                <div className={styles.sectionHeader}>Прикрепить вложения</div>
                                <div className={styles.fileRow}>
                                    <HeaderActionButton
                                        onClick={() => {
                                            const input = document.createElement("input");
                                            input.type = "file";

                                            input.onchange = (e: any) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    fileStore.selectedFile = file;
                                                }
                                            };

                                            input.click();
                                        }}
                                    >
                                        Загрузить файл
                                    </HeaderActionButton>
                                    <div className={styles.extensions}>
                                        {fileStore.selectedFile ? (
                                            <div className={styles.selectedFile}>
                                                <div className={styles.fileName}>
                                                    {fileStore.selectedFile.name}
                                                </div>
                                                <IconButton
                                                    onClick={() => (fileStore.selectedFile = null)}
                                                >
                                                    <IconClose />
                                                </IconButton>
                                            </div>
                                        ) : fileStore.uploadedFile ? (
                                            <div className={styles.selectedFile}>
                                                <div className={styles.fileName}>
                                                    {fileStore.uploadedFile.name}
                                                </div>
                                                <IconButton
                                                    onClick={() => (fileStore.uploadedFile = null)}
                                                >
                                                    <IconClose />
                                                </IconButton>
                                            </div>
                                        ) : (
                                            <>DOCX, PDF, JPG, PNG, WEBP, MP4, MP3</>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>Сообщение</div>
                        <TextareaAutosize
                            className={styles.textArea}
                            onChange={(e) => (mailingStore.textInput = e.target.value)}
                            value={mailingStore.textInput}
                            minRows={5}
                        />
                    </div>
                    <div className={classNames(styles.section, styles.withoutBottomBorder)}>
                        <div className={styles.sectionHeader}>Для кого предназначена программа</div>
                        <div className={styles.checkboxGrid}>
                            <Checkbox
                                checkboxChange={(value) => {
                                    mailingStore.selectedDepartments = [];
                                }}
                                isChecked={!mailingStore.selectedDepartments.length}
                            >
                                Выбрать все
                            </Checkbox>
                            {USER_DEPARTMENT_FILTER_OPTIONS.map((option) => (
                                <Checkbox
                                    checkboxChange={(value) => {
                                        if (value) {
                                            mailingStore.selectedDepartments.push(
                                                option.department,
                                            );
                                        } else {
                                            mailingStore.selectedDepartments =
                                                mailingStore.selectedDepartments.filter(
                                                    (d) => d !== option.department,
                                                );
                                        }
                                    }}
                                    isChecked={mailingStore.selectedDepartments.includes(
                                        option.department,
                                    )}
                                >
                                    {option.name}
                                </Checkbox>
                            ))}
                        </div>
                    </div>

                    <div className={styles.actionButton}>
                        <Button
                            onClick={() => {
                                mailingStore.addMailing();
                                setShowAddMailing(false);
                                setShowSuccessMailing(true);
                            }}
                            isLoading={false}
                            disabled={!mailingStore.isAddMailingValid}
                            icon={<IconCheckmark />}
                        >
                            Провести рассылку
                        </Button>
                    </div>
                </div>
            </Drawer>

            <Drawer open={showSuccessMailing} anchor={"right"} elevation={0}>
                <div className={styles.drawer}>
                    <div className={styles.header}>
                        Создать новую рассылку
                        <button
                            className={styles.close}
                            onClick={() => setShowSuccessMailing(false)}
                        >
                            <IconClose />
                        </button>
                    </div>
                    <div className={styles.successMailing}>
                        <IconSuccess />
                        Рассылка успешно проведена
                    </div>
                    <div className={styles.actionButton}>
                        <Button
                            onClick={() => {
                                setShowSuccessMailing(false);
                            }}
                            isLoading={false}
                            disabled={false}
                        >
                            Закрыть
                        </Button>
                    </div>
                </div>
            </Drawer>
        </ContentWithHeaderLayout>
    );
});
