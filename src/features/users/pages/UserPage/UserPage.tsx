import styles from "./style.module.scss";
import { observer } from "mobx-react-lite";
import { ContentWithHeaderLayout } from "src/features/layout/ui/ContentWithHeaderLayout/ContentWithHeaderLayout";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { userStore } from "src/features/users/stores/userStore";
import { url } from "src/shared/helpers/url";
import { USER_DEPARTMENTS } from "src/features/users/constants/userFilters";
import { CalendarIcon, EducationIcon, SuccessIcon, TelegramIcon } from "src/features/users/assets";
import { HeaderActionButton } from "src/features/layout/ui/Header/HeaderActionButton/HeaderActionButton";
import { IconAdd, IconClose, IconDelete, IconEdit } from "src/shared/assets/img";
import { Dialog } from "src/features/users/ui/Dialog/Dialog";
import { IUser } from "src/features/users/interfaces/user";
import { CircularProgress, Drawer, Menu, MenuItem } from "@mui/material";
import generatePDF from "react-to-pdf";
import { auditStore } from "src/features/education/stores/auditStore";
import { educationStore } from "src/features/education/stores/educationStore";
import { IconButton } from "src/shared/ui/Button/IconButton/IconButton";
import { LinkButton } from "src/shared/ui/Button/LinkButton/LinkButton";
import { IconCheckmark, IconEducation } from "src/features/education/assets";
import { Button } from "src/shared/ui/Button/Button";
import { EditUser } from "src/features/staff/staff/EditUser/EditUser";

export function declOfNum(number: any, titles: { [x: string]: any }) {
    const cases = [2, 0, 1, 1, 1, 2];
    return titles[
        number % 100 > 4 && number % 100 < 20 ? 2 : cases[number % 10 < 5 ? number % 10 : 5]
    ];
}

const tabs = [
    "Основная информация",
    "Задачи",
    "Аналитика обучения сотрудника",
    "Действия сотрудника",
];

const skills = ["React", "Angular", "Spring", "Django", "Jira", "Figma", "LoL", "Dota"];

export function addDays(date: string | number | Date, days: number) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

export function datediff(startDate: string | Date, endDate: string | Date) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const diffInMs = new Date(endDate) - new Date(startDate);
    return Math.round(diffInMs / (1000 * 60 * 60 * 24));
}

export const UserPage = observer(() => {
    const navigate = useNavigate();
    const [selectedTab, setSelectedTab] = useState(tabs[0]);
    const params = useParams<{ id: string }>();
    const [showDelete, setShowDelete] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showEditPlan, setShowEditPlan] = useState(false);
    const [deletedUser, setDeletedUser] = useState<IUser | null>(null);
    const [selectCourseAnchorEl, setSelectCourseAnchorEl] = useState<any>(null);
    const [addSkillAnchorEl, setAddSkillAnchorEl] = useState<any>(null);

    const [showAddUser, setShowAddUser] = useState(false);
    const [ShowSuccefullWindow, setShowSuccefull] = useState(false);
    const [showFale, setShowFale] = useState(false);

    const user = userStore.allUsers.find((u) => u.id.toString() === params.id) ?? deletedUser;

    useEffect(() => {
        userStore.fetchAllUsers();
    }, []);

    const componentRef = useRef<HTMLDivElement>(null);
    const handleDownloadImage = async () => {
        generatePDF(componentRef, { filename: `Аналитика: ${user?.fullName}.pdf` });
    };

    useEffect(() => {
        if (showEditPlan) {
            educationStore.userCoursesToAdd = [];
            educationStore.userCoursesToDelete = [];
        }
    }, [showEditPlan]);

    const renderUserInfo = () => {
        if (!user) {
            return <h1>Загрузка ...</h1>;
        }

        const canEditSkills = () => {
            return !(
                userStore.currentUser?.role === "EMPLOYEE" && user.id !== userStore.currentUser.id
            );
        };

        return (
            <div
                className={classNames(styles.userInfo, {
                    [styles.withoutTabs]: userStore.currentUser?.role === "EMPLOYEE",
                })}
            >
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
                        {user.skills?.map((skill) => (
                            <div className={styles.skill}>
                                {skill}
                                {canEditSkills() && (
                                    <IconButton
                                        onClick={() => {
                                            user.skills = user?.skills.filter((s) => s !== skill);
                                            userStore.updateUser(user);
                                        }}
                                    >
                                        <IconClose />
                                    </IconButton>
                                )}
                            </div>
                        ))}
                        {!!skills.filter((skill) => !user?.skills?.includes(skill)).length &&
                            canEditSkills() && (
                                <div className={styles.addSkillButton}>
                                    <IconButton
                                        onClick={(e) => setAddSkillAnchorEl(e.currentTarget)}
                                    >
                                        <IconAdd />
                                    </IconButton>
                                </div>
                            )}
                        {!canEditSkills() && !user.skills.length && <div>Навыки не добавлены</div>}
                    </div>
                </div>
                {user.responsibleUserId && (
                    <div className={classNames(styles.row, styles.row4)}>
                        <div className={styles.header}>Ответственное лицо</div>
                        <div className={styles.responsiblePerson}>
                            {
                                userStore.allUsers.find((u) => u.id === user.responsibleUserId)
                                    ?.fullName
                            }
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderTasks = () => {
        const currentCourse = educationStore.userCourses
            .filter((uc) => uc.userId === user?.id)
            .filter((c) => c.startTimestamp && !c.finishTimestamp)[0];

        const plannedCourses = educationStore.userCourses
            .filter((uc) => uc.userId === user?.id)
            .filter((c) => !c.startTimestamp && !c.finishTimestamp);

        const finishedCourses = educationStore.userCourses
            .filter((uc) => uc.userId === user?.id)
            .filter((c) => c.startTimestamp && c.finishTimestamp);

        return (
            <div className={styles.tasks}>
                <div className={styles.row}>
                    <div className={styles.header}>Текущее обучение</div>
                    {currentCourse ? (
                        <>
                            <div className={styles.item}>
                                <EducationIcon />
                                <div>
                                    {
                                        educationStore.courses.find(
                                            (c) => c.id === currentCourse.courseId,
                                        )?.name
                                    }
                                </div>
                            </div>
                            <div className={styles.item}>
                                <CalendarIcon />
                                <div>
                                    {addDays(
                                        currentCourse.startTimestamp!,
                                        educationStore.courses.find(
                                            (c) => c.id === currentCourse.courseId,
                                        )!.duration,
                                    ).toLocaleDateString()}
                                    <span className={styles.remainingDays}>
                                        (Осталось&nbsp;
                                        {datediff(
                                            new Date(),
                                            addDays(
                                                currentCourse.startTimestamp!,
                                                educationStore.courses.find(
                                                    (c) => c.id === currentCourse.courseId,
                                                )!.duration,
                                            ),
                                        )}{" "}
                                        {declOfNum(
                                            datediff(
                                                new Date(),
                                                addDays(
                                                    currentCourse.startTimestamp!,
                                                    educationStore.courses.find(
                                                        (c) => c.id === currentCourse.courseId,
                                                    )!.duration,
                                                ),
                                            ),
                                            ["день", "дня", "дней"],
                                        )}
                                        )
                                    </span>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div>Текущие курсы отсутствуют</div>
                    )}
                </div>
                <div className={styles.row}>
                    <div className={styles.header}>План обучения</div>

                    {plannedCourses.map((c) => (
                        <div className={styles.item}>
                            <EducationIcon />
                            <div>
                                {educationStore.courses.find((_c) => _c.id === c.courseId)!.name}
                            </div>
                        </div>
                    ))}

                    {!plannedCourses.length && <div>Запланированные курсы отсутсвуют</div>}
                </div>
                <div className={styles.row}>
                    <div className={styles.header}>Завершённые курсы</div>
                    {finishedCourses.map((c) => (
                        <div className={classNames(styles.item, styles.finished)}>
                            <SuccessIcon />
                            <div>
                                {educationStore.courses.find((_c) => _c.id === c.courseId)!.name}
                            </div>
                            {c.testScore !== null && (
                                <span className={styles.score}>
                                    ({c.testScore} /{" "}
                                    {
                                        educationStore.tests.filter(
                                            (t) => t.courseId === c.courseId,
                                        ).length
                                    }
                                    )
                                </span>
                            )}
                        </div>
                    ))}
                    {!finishedCourses.length && <div>Завершённые курсы отсутствуют</div>}
                </div>
            </div>
        );
    };

    const renderAnalytics = () => {
        const finishedCourses = educationStore.userCourses
            .filter((uc) => uc.userId === user?.id)
            .filter((c) => c.finishTimestamp);

        function addDays(date: string | number | Date, days: number) {
            const result = new Date(date);
            result.setDate(result.getDate() + days);
            return result;
        }

        function datediff(startDate: string | Date, endDate: string | Date) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const diffInMs = new Date(endDate) - new Date(startDate);
            return diffInMs / (1000 * 60 * 60 * 24);
        }

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
                                    value={Math.round(
                                        (finishedCourses.length /
                                            (educationStore.userCourses.filter(
                                                (uc) => uc.userId === user?.id,
                                            ).length || 1)) *
                                            100,
                                    )}
                                    className={styles.circular}
                                    thickness={3}
                                />
                                <div className={styles.value}>
                                    {Math.round(
                                        (finishedCourses.length /
                                            (educationStore.userCourses.filter(
                                                (uc) => uc.userId === user?.id,
                                            ).length || 1)) *
                                            100,
                                    )}
                                    %
                                </div>
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
                                    value={Math.round(
                                        (finishedCourses.reduce(
                                            (a, b) => a + (b.testScore ?? 0),
                                            0,
                                        ) /
                                            (finishedCourses
                                                .map((c) =>
                                                    educationStore.tests.filter(
                                                        (t) => t.courseId === c?.courseId,
                                                    ),
                                                )
                                                .reduce((a, b) => a + b.length, 0) || 1)) *
                                            100,
                                    )}
                                    className={styles.circular}
                                    thickness={3}
                                />
                                <div className={styles.value}>
                                    {Math.round(
                                        finishedCourses.reduce(
                                            (a, b) => a + (b.testScore ?? 0),
                                            0,
                                        ) /
                                            (finishedCourses
                                                .map((c) =>
                                                    educationStore.tests.filter(
                                                        (t) => t.courseId === c?.courseId,
                                                    ),
                                                )
                                                .reduce((a, b) => a + b.length, 0) || 1),
                                    ) * 100}
                                    %
                                </div>
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
                                    value={Math.round(
                                        (finishedCourses
                                            .filter((fc) => fc.finishTimestamp)
                                            .filter(
                                                (fc) =>
                                                    datediff(
                                                        fc.finishTimestamp!,
                                                        fc.startTimestamp!,
                                                    ) <=
                                                    educationStore.courses.find(
                                                        (c) => c.id === fc.courseId,
                                                    )!.duration!,
                                            ).length /
                                            (finishedCourses.filter((fc) => fc.finishTimestamp)
                                                .length || 1)) *
                                            100,
                                    )}
                                    className={styles.circular}
                                    thickness={3}
                                />
                                <div className={styles.value}>
                                    {Math.round(
                                        (finishedCourses
                                            .filter((fc) => fc.finishTimestamp)
                                            .filter(
                                                (fc) =>
                                                    datediff(
                                                        fc.finishTimestamp!,
                                                        fc.startTimestamp!,
                                                    ) <=
                                                    educationStore.courses.find(
                                                        (c) => c.id === fc.courseId,
                                                    )!.duration!,
                                            ).length /
                                            (finishedCourses.filter((fc) => fc.finishTimestamp)
                                                .length || 1)) *
                                            100,
                                    )}
                                    %
                                </div>
                            </div>
                            <div className={classNames(styles.label, styles.label3)}>
                                Курсов пройденных в срок
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.row}>
                    <div className={styles.header}>Завершённые курсы</div>
                    {finishedCourses.length ? (
                        <div className={styles.table}>
                            <div className={styles.tableRow}>
                                <div className={styles.colHeader}>Название курса</div>
                                <div className={styles.colHeader}>Назначен</div>
                                <div className={styles.colHeader}>Дата сдачи</div>
                                <div className={styles.colHeader}>Ответы</div>
                            </div>
                            {finishedCourses.map((fc) => (
                                <div className={styles.tableRow}>
                                    <div className={styles.name}>
                                        <SuccessIcon />{" "}
                                        {
                                            educationStore.courses.find(
                                                (c) => c.id === fc.courseId,
                                            )!.name!
                                        }
                                    </div>
                                    <div className={styles.date}>
                                        {new Date(fc.startTimestamp!).toLocaleDateString(
                                            undefined,
                                            { day: "2-digit", month: "2-digit", year: "2-digit" },
                                        )}
                                    </div>
                                    <div className={styles.date}>
                                        <span
                                            className={classNames({
                                                [styles.success]:
                                                    datediff(
                                                        fc.finishTimestamp!,
                                                        fc.startTimestamp!,
                                                    ) <=
                                                    educationStore.courses.find(
                                                        (c) => c.id === fc.courseId,
                                                    )!.duration!,
                                                [styles.error]:
                                                    datediff(
                                                        fc.finishTimestamp!,
                                                        fc.startTimestamp!,
                                                    ) >
                                                    educationStore.courses.find(
                                                        (c) => c.id === fc.courseId,
                                                    )!.duration!,
                                            })}
                                        >
                                            {new Date(fc.startTimestamp!).toLocaleDateString(
                                                undefined,
                                                {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "2-digit",
                                                },
                                            )}
                                        </span>
                                    </div>
                                    {fc.testScore !== null && (
                                        <div className={styles.date}>
                                            <span
                                                className={classNames({
                                                    [styles.success]:
                                                        fc.testScore! /
                                                            (educationStore.tests.filter(
                                                                (t) => t.courseId === fc?.courseId,
                                                            ).length || 1) >
                                                        0.6,
                                                    [styles.error]:
                                                        fc.testScore! /
                                                            (educationStore.tests.filter(
                                                                (t) => t.courseId === fc?.courseId,
                                                            ).length || 1) <=
                                                        0.6,
                                                })}
                                            >
                                                {fc.testScore}
                                            </span>
                                            &nbsp;/{" "}
                                            {educationStore.tests.filter(
                                                (t) => t.courseId === fc?.courseId,
                                            ).length || 1}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div>Завершённые курсы отсутствуют</div>
                    )}
                </div>
            </div>
        );
    };

    const renderEvents = () => {
        return (
            <div className={styles.events}>
                <div className={styles.row}>
                    <div className={styles.header}>Действия сотрудника</div>
                    {!auditStore.events.filter((e) => e.userId === user?.id).length && (
                        <div>События отсутствуют</div>
                    )}
                    {!!auditStore.events.filter((e) => e.userId === user?.id).length && (
                        <div className={styles.table}>
                            <div className={styles.tableRow}>
                                <div className={styles.colHeader}>Действие</div>
                                <div className={styles.colHeader}>Дата</div>
                                <div className={styles.colHeader}>Время</div>
                            </div>
                            {auditStore.events
                                .filter((e) => e.userId === user?.id)
                                .map((e) => (
                                    <div className={styles.tableRow}>
                                        <div className={styles.name}>
                                            {e.eventType === "LOGIN" && "Вход в систему"}
                                            {e.eventType === "LOGOUT" && "Выход из системы"}
                                            {e.eventType === "COURSE_FINISHED" && e.text}
                                        </div>
                                        <div className={styles.date}>
                                            {new Date(e.timestamp).toLocaleDateString()}
                                        </div>
                                        <div className={styles.date}>
                                            {new Date(e.timestamp).toLocaleTimeString()}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const getStartActions = () => {
        if (userStore.currentUser?.role === "EMPLOYEE") {
            return [];
        }
        if (selectedTab === tabs[0]) {
            return [
                <HeaderActionButton
                    onClick={() => {
                        setShowAddUser(true);
                    }}
                    icon={<IconEdit />}
                >
                    Редактировать
                </HeaderActionButton>,
            ];
        }
        if (selectedTab === tabs[1]) {
            return [
                <HeaderActionButton onClick={() => setShowEditPlan(true)} icon={<IconEdit />}>
                    Редактировать индивидуальный план обучения
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

    const location = useLocation();
    useEffect(() => {
        if (location.search.includes("analytics")) {
            setSelectedTab(tabs[2]);
        }
    }, []);

    return (
        <ContentWithHeaderLayout
            title={"Сотрудники"}
            onBack={() => navigate(-1)}
            startActions={getStartActions()}
            endActions={
                userStore.currentUser?.role === "EMPLOYEE"
                    ? []
                    : [
                          <HeaderActionButton
                              onClick={() => setShowDelete(true)}
                              icon={<IconDelete />}
                              color={"delete"}
                          >
                              Удалить сотрудника
                          </HeaderActionButton>,
                      ]
            }
        >
            <div className={styles.content}>
                {userStore.currentUser?.role !== "EMPLOYEE" && (
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
                )}
                {selectedTab === tabs[0] && renderUserInfo()}
                {selectedTab === tabs[1] && renderTasks()}
                {selectedTab === tabs[2] && renderAnalytics()}
                {selectedTab === tabs[3] && renderEvents()}
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

            <Drawer open={showEditPlan} anchor={"right"} elevation={0}>
                <div className={styles.drawer}>
                    <div className={styles.header}>
                        Редактировать план обучения
                        <button
                            className={styles.close}
                            onClick={() => {
                                setShowEditPlan(false);
                                educationStore.fetchAllUserCourses();
                            }}
                        >
                            <IconClose />
                        </button>
                    </div>
                    {!!educationStore.programs
                        .filter((p) => educationStore.courses.some((c) => c.programId === p.id))
                        .filter(
                            (p) =>
                                educationStore.userCourses
                                    .filter((uc) => uc.userId === user?.id)
                                    .map((uc) =>
                                        educationStore.courses.find((c) => c.id === uc.courseId),
                                    )
                                    .filter((c) => c?.programId === p.id).length !==
                                educationStore.courses.filter((c) => c.programId === p.id).length,
                        ).length && (
                        <div className={styles.section}>
                            <div className={styles.sectionHeader}>Функции</div>
                            <LinkButton
                                onClick={(event) => setSelectCourseAnchorEl(event.currentTarget)}
                                icon={<IconAdd />}
                            >
                                {educationStore.selectedProgram
                                    ? educationStore.selectedProgram.name
                                    : "Выбрать"}
                            </LinkButton>
                        </div>
                    )}

                    <div className={classNames(styles.section, styles.withoutBottomBorder)}>
                        <div className={styles.sectionHeader}>План обучения</div>
                        <div className={styles.courses}>
                            {educationStore.userCourses
                                .filter((uc) => uc.userId == user?.id)
                                .map((c) => (
                                    <div className={styles.course}>
                                        <IconEducation />
                                        {
                                            educationStore.courses.find(
                                                (_c) => _c.id === c.courseId,
                                            )?.name
                                        }
                                        <IconButton
                                            onClick={() => {
                                                educationStore.userCourses =
                                                    educationStore.userCourses.filter(
                                                        (_c) =>
                                                            _c.userId !== user?.id ||
                                                            (_c.userId === user?.id &&
                                                                _c.id !== c.id),
                                                    );
                                                educationStore.userCoursesToDelete.push(c);
                                            }}
                                            className={styles.deleteButton}
                                        >
                                            <IconDelete />
                                        </IconButton>
                                    </div>
                                ))}
                        </div>
                    </div>

                    <div className={styles.actionButton}>
                        <Button
                            onClick={async () => {
                                setShowEditPlan(false);
                                await educationStore.handleSaveUserCourses();
                                educationStore.fetchAllUserCourses();
                            }}
                            isLoading={false}
                            disabled={false}
                            icon={<IconCheckmark />}
                        >
                            Сохранить изменения
                        </Button>
                    </div>
                </div>
            </Drawer>

            <Menu
                open={!!selectCourseAnchorEl}
                onClose={() => setSelectCourseAnchorEl(null)}
                anchorEl={selectCourseAnchorEl}
                classes={{
                    paper: styles.selectProgramMenu,
                }}
            >
                {educationStore.programs
                    .filter((p) => educationStore.courses.some((c) => c.programId === p.id))
                    .filter(
                        (p) =>
                            educationStore.userCourses
                                .filter((uc) => uc.userId === user?.id)
                                .map((uc) =>
                                    educationStore.courses.find((c) => c.id === uc.courseId),
                                )
                                .filter((c) => c?.programId === p.id).length !==
                            educationStore.courses.filter((c) => c.programId === p.id).length,
                    )
                    .map((p) => (
                        <>
                            <MenuItem
                                className={styles.menuItem}
                                onClick={() => {
                                    educationStore.userCourses.push(
                                        ...educationStore.courses
                                            .filter((c) => c.programId === p.id)
                                            .map((c) => ({
                                                id: 0,
                                                courseId: c.id,
                                                userId: user!.id!,
                                                startTimestamp: null,
                                                finishTimestamp: null,
                                                rating: null,
                                                testScore: null,
                                            })),
                                    );
                                    educationStore.userCoursesToAdd.push(
                                        ...educationStore.courses
                                            .filter((c) => c.programId === p.id)
                                            .map((c) => ({
                                                id: 0,
                                                courseId: c.id,
                                                userId: user!.id!,
                                                startTimestamp: null,
                                                finishTimestamp: null,
                                                rating: null,
                                                testScore: null,
                                            })),
                                    );
                                    setSelectCourseAnchorEl(null);
                                }}
                            >
                                {p.name}
                            </MenuItem>
                            {educationStore.courses
                                .filter((c) => c.programId === p.id)
                                .map((c) => (
                                    <MenuItem
                                        className={styles.subMenuItem}
                                        onClick={() => {
                                            educationStore.userCourses.push({
                                                id: 0,
                                                courseId: c.id,
                                                userId: user!.id!,
                                                startTimestamp: null,
                                                finishTimestamp: null,
                                                rating: null,
                                                testScore: null,
                                            });
                                            educationStore.userCoursesToAdd.push({
                                                id: 0,
                                                courseId: c.id,
                                                userId: user!.id!,
                                                startTimestamp: null,
                                                finishTimestamp: null,
                                                rating: null,
                                                testScore: null,
                                            });
                                            setSelectCourseAnchorEl(null);
                                        }}
                                    >
                                        {c.name}
                                    </MenuItem>
                                ))}
                        </>
                    ))}
            </Menu>

            <Menu
                open={!!addSkillAnchorEl}
                onClose={() => setAddSkillAnchorEl(null)}
                anchorEl={addSkillAnchorEl}
                classes={{
                    paper: styles.addSkillMenu,
                }}
            >
                {skills
                    .filter((skill) => !user?.skills?.includes(skill))
                    .map((skill) => (
                        <MenuItem
                            className={styles.menuItem}
                            onClick={() => {
                                user?.skills?.push(skill);
                                setAddSkillAnchorEl(null);
                                userStore.updateUser(user!);
                            }}
                        >
                            {skill}
                        </MenuItem>
                    ))}
            </Menu>
            <Drawer open={showAddUser} anchor="right" onClose={() => setShowAddUser(false)}>
                <EditUser setShowAddUser={setShowAddUser} userData={user!} />
            </Drawer>
        </ContentWithHeaderLayout>
    );
});
