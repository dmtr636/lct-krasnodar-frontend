import styles from "./style.module.scss";
import { observer } from "mobx-react-lite";
import { ContentWithHeaderLayout } from "src/features/layout/ui/ContentWithHeaderLayout/ContentWithHeaderLayout";
import { useNavigate } from "react-router-dom";
import { HeaderActionButton } from "src/features/layout/ui/Header/HeaderActionButton/HeaderActionButton";
import { IconClose, IconEye, IconStar, IconSuccessSmall } from "src/shared/assets/img";
import { educationStore } from "src/features/education/stores/educationStore";
import { useEffect, useState } from "react";
import { Drawer } from "@mui/material";
import { Button } from "src/shared/ui/Button/Button";
import { IconCalendar, IconCheckmark, IconEducation } from "src/features/education/assets";
import { Checkbox } from "src/shared/ui/Checkbox/Checkbox";
import { addDays, declOfNum } from "src/features/users/pages/UserPage/UserPage";
import classNames from "classnames";
import { ButtonBack } from "src/shared/ui/Button/ButtonBack/ButtonBack";
import { userStore } from "src/features/users/stores/userStore";
import { IUserCourse } from "src/features/education/interfaces/IUserCourse";
import { download } from "src/features/messages/pages/MessagesPage";
import { url } from "src/shared/helpers/url";
import { PDFViewer } from "src/features/education/components/PDFViewer/PDFViewer";

const tabs = ["Текущие курсы", "Завершённые курсы"];

export const EducationEmployeePage = observer(() => {
    const navigate = useNavigate();
    const [showTest, setShowTest] = useState(false);
    const [selectedTab, setSelectedTab] = useState(tabs[0]);
    const [openedCourse, setOpenedCourse] = useState<IUserCourse | null>(null);
    const [previewRating, setPreviewRating] = useState(0);
    const [showRating, setShowRating] = useState(false);
    const [viewPdf, setViewPdf] = useState("");

    useEffect(() => {
        if (openedCourse) {
            educationStore.answers = {};
            setShowRating(openedCourse?.testScore !== null);
            setPreviewRating(0);
            educationStore.rating = 0;
        }
    }, [openedCourse]);

    const renderCurrentCourses = () => {
        const currentCourses = educationStore.userCourses
            .filter((uc) => uc.userId === userStore.currentUser?.id)
            .filter((uc) => !uc.finishTimestamp);
        const programsWithCourses = educationStore.programs.filter((p) =>
            currentCourses.some(
                (c) =>
                    educationStore.courses.find((_c) => _c.id === c.courseId)?.programId === p.id,
            ),
        );

        return (
            <div className={styles.card}>
                <div className={styles.header}>Курсы</div>
                {!programsWithCourses.length && (
                    <div className={styles.programBlock}>
                        <div className={styles.programBlockHeader}>
                            Отсутствуют назначенные курсы
                        </div>
                    </div>
                )}
                {programsWithCourses.map((program) => (
                    <div className={styles.programBlock}>
                        <div className={styles.programBlockHeader}>
                            {program.name}
                            <div className={styles.duration}>
                                <IconCalendar />
                                {educationStore.getCoursesTotalDurationForProgram(program.id)}
                                &nbsp;
                                {declOfNum(
                                    educationStore.getCoursesTotalDurationForProgram(program.id),
                                    ["день", "дня", "дней"],
                                )}
                            </div>
                        </div>
                        <div className={styles.courses}>
                            {currentCourses
                                .filter(
                                    (_c) =>
                                        educationStore.courses.find((c) => c.id === _c.courseId)
                                            ?.programId === program.id,
                                )
                                .map((uc) => (
                                    <button
                                        className={styles.course}
                                        onClick={() => {
                                            setOpenedCourse(uc);
                                        }}
                                    >
                                        <IconEducation />
                                        {
                                            educationStore.courses.find((c) => c.id === uc.courseId)
                                                ?.name
                                        }
                                        {uc.startTimestamp && (
                                            <div className={styles.courseDeadline}>
                                                Срок сдачи |&nbsp;&nbsp;
                                                {addDays(
                                                    uc.startTimestamp ?? "",
                                                    educationStore.courses.find(
                                                        (c) => c.id === uc.courseId,
                                                    )!.duration!,
                                                ).toLocaleDateString(undefined, {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "2-digit",
                                                })}
                                            </div>
                                        )}
                                    </button>
                                ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderFinishedCourses = () => {
        const finishedCourses = educationStore.userCourses
            .filter((uc) => uc.userId === userStore.currentUser?.id)
            .filter((uc) => uc.finishTimestamp);

        return (
            <div className={styles.card}>
                <div className={styles.header}>Завершённые курсы</div>
                {!finishedCourses.length && (
                    <div className={styles.programBlock}>
                        <div className={styles.programBlockHeader}>
                            Отсутствуют завершённые курсы
                        </div>
                    </div>
                )}
                {!!finishedCourses.length && (
                    <div className={styles.programBlock}>
                        <div className={classNames(styles.courses, styles.withoutMargin)}>
                            {finishedCourses.map((fc) => (
                                <button
                                    className={styles.course}
                                    onClick={() => {
                                        setOpenedCourse(fc);
                                    }}
                                >
                                    <IconSuccessSmall />
                                    {educationStore.courses.find((c) => c.id === fc.courseId)?.name}
                                    {fc.testScore !== null && (
                                        <div className={styles.courseDeadline}>
                                            {fc.testScore ?? "?"} /{" "}
                                            {educationStore.tests.filter(
                                                (t) => t.courseId === fc.courseId,
                                            ).length ?? "?"}
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <ContentWithHeaderLayout title={"Обучение"} onBack={() => navigate("/")}>
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
                {selectedTab === tabs[0] && renderCurrentCourses()}
                {selectedTab === tabs[1] && renderFinishedCourses()}
            </div>

            <Drawer open={!!openedCourse} anchor={"right"} elevation={0}>
                <div className={styles.drawer}>
                    <div className={styles.header}>
                        <div className={styles.headerTitle}>
                            {educationStore.getCourseByUserCourse(openedCourse)?.name}
                        </div>
                        <button className={styles.close} onClick={() => setOpenedCourse(null)}>
                            <IconClose />
                        </button>
                    </div>
                    {educationStore.getCourseByUserCourse(openedCourse)?.file?.url && (
                        <div
                            className={classNames(styles.section, {
                                [styles.withoutBottomBorder]: !(
                                    showRating ||
                                    educationStore.tests.filter(
                                        (t) => t.courseId === openedCourse?.courseId,
                                    ).length
                                ),
                            })}
                        >
                            <div className={styles.row}>
                                <div>
                                    <div className={styles.sectionHeader}>Обучающие материалы</div>
                                    <div className={styles.fileRow}>
                                        {educationStore
                                            .getCourseByUserCourse(openedCourse)
                                            ?.file?.name.endsWith(".pdf") && (
                                            <HeaderActionButton
                                                icon={<IconEye />}
                                                onClick={() => {
                                                    setViewPdf(
                                                        educationStore.getCourseByUserCourse(
                                                            openedCourse,
                                                        )?.file?.url ?? "",
                                                    );
                                                    setShowRating(true);
                                                }}
                                            >
                                                Просмотреть
                                            </HeaderActionButton>
                                        )}
                                        <HeaderActionButton
                                            onClick={() => {
                                                setShowRating(true);
                                                download(
                                                    url(
                                                        educationStore.getCourseByUserCourse(
                                                            openedCourse,
                                                        )?.file?.url ?? "",
                                                    ) ?? "",
                                                );
                                            }}
                                        >
                                            Скачать файл
                                        </HeaderActionButton>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {!!educationStore.tests.filter((t) => t.courseId === openedCourse?.courseId)
                        .length && (
                        <div
                            className={classNames(styles.section, {
                                [styles.withoutBottomBorder]: !(
                                    showRating || openedCourse?.testScore !== null
                                ),
                            })}
                        >
                            <div className={styles.sectionHeader}>Тестирование после изучения</div>
                            <div className={styles.rowStart}>
                                <HeaderActionButton
                                    onClick={() => setShowTest(true)}
                                    variant={"contained"}
                                    disabled={openedCourse?.testScore !== null}
                                >
                                    Пройти тестирование
                                </HeaderActionButton>
                                {openedCourse?.testScore !== null && (
                                    <div className={styles.testScore}>
                                        <span
                                            className={classNames({
                                                [styles.testScoreGreen]:
                                                    openedCourse!.testScore! /
                                                        educationStore.tests.filter(
                                                            (t) =>
                                                                t.courseId ===
                                                                openedCourse?.courseId,
                                                        ).length >
                                                    0.6,
                                                [styles.testScoreRed]:
                                                    openedCourse!.testScore! /
                                                        educationStore.tests.filter(
                                                            (t) =>
                                                                t.courseId ===
                                                                openedCourse?.courseId,
                                                        ).length <=
                                                    0.6,
                                            })}
                                        >
                                            {openedCourse!.testScore}
                                        </span>{" "}
                                        /{" "}
                                        {
                                            educationStore.tests.filter(
                                                (t) => t.courseId === openedCourse?.courseId,
                                            ).length
                                        }
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    {((showRating &&
                        !educationStore.tests.filter((t) => t.courseId === openedCourse?.courseId)
                            .length) ||
                        openedCourse?.testScore !== null) &&
                        !openedCourse?.finishTimestamp && (
                            <div className={classNames(styles.section, styles.withoutBottomBorder)}>
                                <div className={styles.sectionHeader}>
                                    Как бы вы оценили материалы в курсе?
                                </div>
                                <div
                                    className={styles.stars}
                                    onMouseLeave={() => setPreviewRating(0)}
                                >
                                    {[1, 2, 3, 4, 5].map((number) => (
                                        <IconStar
                                            className={classNames(styles.star, {
                                                [styles.active]:
                                                    previewRating >= number ||
                                                    educationStore.rating >= number,
                                            })}
                                            onMouseEnter={() => setPreviewRating(number)}
                                            onClick={() => (educationStore.rating = number)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    {!openedCourse?.finishTimestamp && (
                        <div className={styles.actionButton}>
                            <Button
                                onClick={async () => {
                                    await educationStore.updateUserCourse(openedCourse!);
                                    setOpenedCourse(null);
                                }}
                                isLoading={false}
                                disabled={!educationStore.rating}
                                icon={<IconCheckmark />}
                            >
                                Завершить курс
                            </Button>
                        </div>
                    )}
                </div>
            </Drawer>

            <Drawer open={showTest} anchor={"right"} hideBackdrop elevation={0}>
                <div className={styles.drawer}>
                    <div className={styles.header}>
                        Тестирование
                        <ButtonBack onClick={() => setShowTest(false)}>Назад</ButtonBack>
                    </div>
                    <div className={styles.test}>
                        {educationStore.tests
                            .filter((t) => t.courseId === openedCourse?.courseId)
                            .map((t, index) => (
                                <div className={styles.section}>
                                    <div className={styles.sectionHeader}>Вопрос {index + 1}</div>
                                    <div className={styles.questionRow}>
                                        <input
                                            className={classNames(styles.input)}
                                            value={t.question}
                                            disabled={true}
                                        />
                                    </div>
                                    <div className={styles.answersHeader}>Варианты ответа</div>
                                    <div className={styles.answers}>
                                        {t.answers.map((a, index) => (
                                            <div className={styles.answerRow}>
                                                <Checkbox
                                                    checkboxChange={() =>
                                                        (educationStore.answers[t.id!.toString()] =
                                                            index)
                                                    }
                                                    isChecked={
                                                        educationStore.answers[t.id!.toString()] ===
                                                        index
                                                    }
                                                />
                                                <input
                                                    className={classNames(styles.input)}
                                                    value={t.answers[index]}
                                                    disabled={true}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                    </div>

                    <div className={styles.actionButton}>
                        <Button
                            onClick={async () => {
                                openedCourse!.testScore = educationStore.tests
                                    .filter((t) => t.courseId === openedCourse?.courseId)
                                    .reduce(
                                        (a, b) =>
                                            a +
                                            (b.correctAnswerIndex ===
                                            educationStore.answers[b.id!.toString()]
                                                ? 1
                                                : 0),
                                        0,
                                    );
                                setShowTest(false);
                            }}
                            isLoading={false}
                            disabled={
                                educationStore.tests.filter(
                                    (t) => t.courseId === openedCourse?.courseId,
                                ).length !== Object.keys(educationStore.answers).length
                            }
                            icon={<IconCheckmark />}
                        >
                            Завершить тестирование
                        </Button>
                    </div>
                </div>
            </Drawer>

            {viewPdf && (
                <PDFViewer
                    open={!!viewPdf}
                    onClose={() => setViewPdf("")}
                    title={educationStore.getCourseByUserCourse(openedCourse)?.name ?? ""}
                    file={url(viewPdf)}
                />
            )}
        </ContentWithHeaderLayout>
    );
});
