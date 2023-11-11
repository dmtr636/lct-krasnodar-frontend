import { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import styles from "./styles.module.scss";
import { SearchInput } from "src/shared/ui/Inputs/SearchInput/SearchIntup";
import sort from "src/shared/assets/img/Sort.svg";
import filter from "src/shared/assets/img/Filter.svg";
import classNames from "classnames";
import close from "src/shared/assets/img/Close.svg";
import { Checkbox } from "src/shared/ui/Checkbox/Checkbox";
import { ContentWithHeaderLayout } from "src/features/layout/ui/ContentWithHeaderLayout/ContentWithHeaderLayout";
import { HeaderActionButton } from "src/features/layout/ui/Header/HeaderActionButton/HeaderActionButton";
import { useLocation, useNavigate } from "react-router-dom";
import { departmentsStore } from "src/features/users/stores/departamentStore";
import { tasksStore } from "src/features/users/stores/tasksStore";
import { userStore } from "src/features/users/stores/userStore";
import { sortedStore } from "src/features/users/stores/sortedStore";
import { IconAdd } from "src/shared/assets/img";
import { AnalyticsUserArray } from "../../AnalyticsUserArray/AnalyticsUserArray";
import { educationStore } from "src/features/education/stores/educationStore";
import { CircularProgress } from "@mui/material";
import generatePDF from "react-to-pdf";
import { IconEducation } from "src/features/education/assets";

export const AnalyticPage = observer(() => {
    const [inputValue, setInputValue] = useState("");
    const [showSort, setShowSort] = useState(false);
    const [showFilter, setShowFilter] = useState(false);
    const [responsibilityUser, setResponsibilityUser] = useState(false);
    const [showCard, setShowCard] = useState(1);
    const [userNumber, setUserNumber] = useState(userStore.users.length);

    const navigate = useNavigate();

    const deportamentArray = departmentsStore.allDepartments.map((option) => (
        <Checkbox
            key={option.department}
            isChecked={departmentsStore.selectedDepartments.includes(option)}
            checkboxChange={() => departmentsStore.toggleDepartment(option)}
        >
            {option.name}
        </Checkbox>
    ));
    const optionsArray = tasksStore.allTasks.map((option) => (
        <>
            <Checkbox
                key={option.task}
                isChecked={tasksStore.selectedTasks.includes(option)}
                checkboxChange={() => tasksStore.toggleTask(option)}
            >
                {option.name}
            </Checkbox>
        </>
    ));
    const cloudArrayTask = tasksStore.selectedTasks.map((option) => (
        <div key={option.name} className={styles.cloudContainer}>
            <div className={styles.cloud}>{option.name}</div>
            <div onClick={() => tasksStore.toggleTask(option)} className={styles.cloudClose}>
                <img className={styles.cloudCloseImg} src={close} alt="" />
            </div>
        </div>
    ));
    const cloudArrayDep = departmentsStore.selectedDepartments.map((option) => (
        <div key={option.name} className={styles.cloudContainer}>
            <div className={styles.cloud}>{option.name}</div>
            <div
                onClick={() => departmentsStore.toggleDepartment(option)}
                className={styles.cloudClose}
            >
                <img className={styles.cloudCloseImg} src={close} alt="" />
            </div>
        </div>
    ));

    function declOfNum(number: number, titles: string[]) {
        const cases = [2, 0, 1, 1, 1, 2];
        const index =
            number % 100 > 4 && number % 100 < 20 ? 2 : cases[number % 10 < 5 ? number % 10 : 5];
        return `${number} ${titles[index]}`;
    }

    useEffect(() => {
        userStore.fetchAllUsers();
        document.addEventListener("click", hideSort);
        return () => document.addEventListener("click", hideSort);
    }, []);
    userStore.searchInput = inputValue;
    const hideSort = () => {
        setShowSort(false);
    };
    const user = userStore.currentUser;

    const componentRef = useRef<HTMLDivElement>(null);
    const handleDownloadImage = async () => {
        generatePDF(componentRef, { filename: `Аналитика.pdf` });
    };

    const renderAnalytics = () => {
        const courses = educationStore.courses;

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
                    <div className={styles.header}>Аналитика обучения в компании</div>
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
                                        (educationStore.userCourses
                                            .filter((uc) => uc.testScore !== null)
                                            .reduce((a, b) => a + b.testScore!, 0) /
                                            (educationStore.userCourses
                                                .filter((uc) => uc.testScore !== null)
                                                .reduce(
                                                    (a, b) =>
                                                        a +
                                                        (educationStore.tests.filter(
                                                            (t) => t.courseId === b.courseId,
                                                        ).length ?? 0),
                                                    0,
                                                ) || 1)) *
                                            100,
                                    )}
                                    className={styles.circular}
                                    thickness={3}
                                />
                                <div className={styles.value}>
                                    {Math.round(
                                        (educationStore.userCourses
                                            .filter((uc) => uc.testScore !== null)
                                            .reduce((a, b) => a + b.testScore!, 0) /
                                            (educationStore.userCourses
                                                .filter((uc) => uc.testScore !== null)
                                                .reduce(
                                                    (a, b) =>
                                                        a +
                                                        (educationStore.tests.filter(
                                                            (t) => t.courseId === b.courseId,
                                                        ).length ?? 0),
                                                    0,
                                                ) || 1)) *
                                            100,
                                    )}
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
                                        (educationStore.userCourses
                                            .filter((uc) => uc.finishTimestamp)
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
                                            (educationStore.userCourses.filter(
                                                (uc) => uc.finishTimestamp,
                                            ).length || 1)) *
                                            100,
                                    )}
                                    className={styles.circular}
                                    thickness={3}
                                />
                                <div className={styles.value}>
                                    {Math.round(
                                        (educationStore.userCourses
                                            .filter((uc) => uc.finishTimestamp)
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
                                            (educationStore.userCourses.filter(
                                                (uc) => uc.finishTimestamp,
                                            ).length || 1)) *
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
                    <div className={styles.header}>
                        Средняя количество правильных ответов по курсам
                        <br />и обратная связь по качеству материала
                    </div>
                    {courses.length ? (
                        <div className={styles.table}>
                            <div className={styles.tableRow}>
                                <div className={styles.colHeader}>Название курса</div>
                                <div className={styles.colHeader}>Ответы в среднем</div>
                                <div className={styles.colHeader}>Обратная связь</div>
                            </div>
                            {courses.map((c) => (
                                <div className={styles.tableRow}>
                                    <div className={styles.name}>
                                        <IconEducation /> {c.name}
                                    </div>
                                    <div className={styles.date}>
                                        {!!educationStore.userCourses
                                            .filter((uc) => uc.testScore !== null)
                                            .filter((uc) => uc.courseId === c.id).length && (
                                            <>
                                                <span
                                                    className={classNames({
                                                        [styles.success]:
                                                            educationStore.userCourses
                                                                .filter(
                                                                    (uc) => uc.testScore !== null,
                                                                )
                                                                .filter(
                                                                    (uc) => uc.courseId === c.id,
                                                                )
                                                                .reduce(
                                                                    (a, b) => a + b.testScore!,
                                                                    0,
                                                                ) /
                                                                educationStore.userCourses
                                                                    .filter(
                                                                        (uc) =>
                                                                            uc.testScore !== null,
                                                                    )
                                                                    .filter(
                                                                        (uc) =>
                                                                            uc.courseId === c.id,
                                                                    ).length /
                                                                educationStore.tests.filter(
                                                                    (t) => t.courseId === c.id,
                                                                ).length >
                                                            0.6,
                                                        [styles.error]:
                                                            educationStore.userCourses
                                                                .filter(
                                                                    (uc) => uc.testScore !== null,
                                                                )
                                                                .filter(
                                                                    (uc) => uc.courseId === c.id,
                                                                )
                                                                .reduce(
                                                                    (a, b) => a + b.testScore!,
                                                                    0,
                                                                ) /
                                                                educationStore.userCourses
                                                                    .filter(
                                                                        (uc) =>
                                                                            uc.testScore !== null,
                                                                    )
                                                                    .filter(
                                                                        (uc) =>
                                                                            uc.courseId === c.id,
                                                                    ).length /
                                                                educationStore.tests.filter(
                                                                    (t) => t.courseId === c.id,
                                                                ).length <=
                                                            0.6,
                                                    })}
                                                >
                                                    {educationStore.userCourses
                                                        .filter((uc) => uc.testScore !== null)
                                                        .filter((uc) => uc.courseId === c.id)
                                                        .reduce((a, b) => a + b.testScore!, 0) /
                                                        educationStore.userCourses
                                                            .filter((uc) => uc.testScore !== null)
                                                            .filter((uc) => uc.courseId === c.id)
                                                            .length}
                                                    &nbsp;
                                                </span>
                                                /&nbsp;
                                                {
                                                    educationStore.tests.filter(
                                                        (t) => t.courseId === c.id,
                                                    ).length
                                                }
                                            </>
                                        )}
                                    </div>
                                    <div className={styles.date}>
                                        {!!educationStore.userCourses
                                            .filter((uc) => uc.rating !== null)
                                            .filter((uc) => uc.courseId === c.id).length && (
                                            <span
                                                className={classNames({
                                                    [styles.success]:
                                                        educationStore.userCourses
                                                            .filter((uc) => uc.courseId === c.id)
                                                            .filter((uc) => uc.rating !== null)
                                                            .reduce((a, b) => a + b.rating!, 0) /
                                                            educationStore.userCourses
                                                                .filter(
                                                                    (uc) => uc.courseId === c.id,
                                                                )
                                                                .filter((uc) => uc.rating !== null)
                                                                .length >=
                                                        3.5,
                                                    [styles.error]:
                                                        educationStore.userCourses
                                                            .filter((uc) => uc.courseId === c.id)
                                                            .filter((uc) => uc.rating !== null)
                                                            .reduce((a, b) => a + b.rating!, 0) /
                                                            educationStore.userCourses
                                                                .filter(
                                                                    (uc) => uc.courseId === c.id,
                                                                )
                                                                .filter((uc) => uc.rating !== null)
                                                                .length <
                                                        3.5,
                                                })}
                                            >
                                                {educationStore.userCourses
                                                    .filter((uc) => uc.courseId === c.id)
                                                    .filter((uc) => uc.rating !== null)
                                                    .reduce((a, b) => a + b.rating!, 0) /
                                                    educationStore.userCourses
                                                        .filter((uc) => uc.courseId === c.id)
                                                        .filter((uc) => uc.rating !== null).length}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div>Курсы отсутствуют</div>
                    )}
                </div>
            </div>
        );
    };

    const location = useLocation();

    useEffect(() => {
        navigate("/analytics?tab=" + showCard);
    }, [showCard]);

    useEffect(() => {
        if (location.search.includes("tab=2")) {
            setShowCard(2);
        }
    }, []);

    return (
        <ContentWithHeaderLayout
            title={"Аналитика"}
            onBack={() => navigate("/")}
            startActions={
                showCard === 1
                    ? [
                          <HeaderActionButton icon={<IconAdd />} onClick={handleDownloadImage}>
                              Скачать в PDF
                          </HeaderActionButton>,
                      ]
                    : []
            }
        >
            <div className={styles.container}>
                {showCard === 2 && (
                    <>
                        <div className={styles.headBlock}>
                            <div className={styles.input}>
                                <SearchInput onChange={setInputValue} inputValue={inputValue} />
                            </div>
                            <div
                                className={classNames(styles.sortedBlock, {
                                    [styles.active]: showSort,
                                })}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div onClick={() => setShowSort(!showSort)} className={styles.sort}>
                                    <img src={sort} alt="" />
                                    Сортировка
                                </div>

                                {showSort && (
                                    <div className={styles.sortedBy}>
                                        <div
                                            onClick={() => {
                                                sortedStore.setSortedBy("name");
                                                sortedStore.sortedEmployees;
                                                setShowSort(!showSort);
                                            }}
                                            className={classNames(styles.sortedItem, {
                                                [styles.active]: sortedStore.sortedBy === "name",
                                            })}
                                        >
                                            По алфавиту
                                        </div>
                                        <div
                                            onClick={() => {
                                                sortedStore.setSortedBy("date");
                                                sortedStore.sortedEmployees;
                                                setShowSort(!showSort);
                                            }}
                                            className={classNames(styles.sortedItem, {
                                                [styles.active]: sortedStore.sortedBy === "date",
                                            })}
                                        >
                                            По дате добавления
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className={styles.sortedBlock}>
                                <div
                                    onClick={() => setShowFilter(!showFilter)}
                                    className={styles.sort}
                                >
                                    <img src={filter} alt="" />
                                    Фильтры
                                </div>
                                {cloudArrayTask.length + cloudArrayDep.length > 0 && (
                                    <div
                                        onClick={() => setShowFilter(!showFilter)}
                                        className={styles.fiterCount}
                                    >
                                        {cloudArrayTask.length + cloudArrayDep.length}
                                    </div>
                                )}
                            </div>
                        </div>
                        {cloudArrayTask.length + cloudArrayDep.length > 0 && (
                            <div className={styles.cloudArray}>
                                {cloudArrayDep}
                                {cloudArrayTask}
                            </div>
                        )}
                        <div className={styles.userCount}>
                            {userNumber === 0 ? (
                                <div className={styles.text}>
                                    Сотрудников с выбранными фильтрами не найдено
                                </div>
                            ) : (
                                <>
                                    <div className={styles.text}>
                                        Отображается{" "}
                                        {responsibilityUser
                                            ? declOfNum(userNumber, [
                                                  "сотрудник",
                                                  "сотрудника",
                                                  "сотрудников",
                                              ])
                                            : declOfNum(userNumber, [
                                                  "сотрудник",
                                                  "сотрудника",
                                                  "сотрудников",
                                              ])}
                                    </div>
                                </>
                            )}
                        </div>
                    </>
                )}
                <div className={styles.changeBlock}>
                    <div
                        onClick={() => setShowCard(1)}
                        className={classNames(styles.changeBlockitem, {
                            [styles.active]: showCard === 1,
                        })}
                    >
                        Общая
                    </div>{" "}
                    <div
                        onClick={() => setShowCard(2)}
                        className={classNames(styles.changeBlockitem, {
                            [styles.active]: showCard === 2,
                        })}
                    >
                        Сотрудники
                    </div>
                </div>
                {showCard === 1 && renderAnalytics()}
                {showCard === 2 && (
                    <AnalyticsUserArray
                        setUserNumber={setUserNumber}
                        responsibilityUser={responsibilityUser}
                    />
                )}
                {showFilter && (
                    <div
                        className={styles.filterContainer}
                        onClick={() => setShowFilter(!showFilter)}
                    >
                        <div className={styles.filterContent} onClick={(e) => e.stopPropagation()}>
                            <div className={styles.filterHeader}>
                                <div className={styles.filterH1}>
                                    Фильтры
                                    <div
                                        className=""
                                        onClick={() => {
                                            tasksStore.clearSelection();
                                            departmentsStore.clearSelection();
                                        }}
                                    >
                                        <HeaderActionButton onClick={() => {}}>
                                            Очистить выбор
                                        </HeaderActionButton>
                                    </div>
                                </div>

                                <div
                                    onClick={() => setShowFilter(false)}
                                    className={styles.filterClose}
                                >
                                    <img className={styles.filterCloseImg} src={close} alt="" />
                                </div>
                            </div>

                            <div className={styles.filterType}>
                                <div className={styles.filterDeportament}>
                                    <div className={styles.filterText}>Отдел</div>
                                    <div>
                                        <Checkbox
                                            checkboxChange={() => {
                                                departmentsStore.selectedDepartments = [];
                                            }}
                                            isChecked={!departmentsStore.selectedDepartments.length}
                                        >
                                            Выбрать все
                                        </Checkbox>
                                        {deportamentArray}
                                    </div>
                                </div>
                                {!(user?.role === "EMPLOYEE") && (
                                    <div className={styles.filterTasks}>
                                        <div className={styles.filterText}>Статус задач</div>
                                        <div>
                                            <Checkbox
                                                checkboxChange={() => {
                                                    tasksStore.selectedTasks = [];
                                                }}
                                                isChecked={!tasksStore.selectedTasks.length}
                                            >
                                                Выбрать все
                                            </Checkbox>
                                            {optionsArray}
                                        </div>
                                    </div>
                                )}
                                {!(user?.role === "EMPLOYEE") && (
                                    <div className={styles.responsibilityUser}>
                                        <div className={styles.filterText}>Ответственное лицо</div>
                                        <div>
                                            <Checkbox
                                                checkboxChange={() => {
                                                    setResponsibilityUser(!responsibilityUser);
                                                }}
                                                isChecked={responsibilityUser}
                                            >
                                                Являюсь ответственным лицом
                                            </Checkbox>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/*  {showAdduser && <AddUser setShowAddUser={setShowAddUser}/>} */}
            </div>
        </ContentWithHeaderLayout>
    );
});
