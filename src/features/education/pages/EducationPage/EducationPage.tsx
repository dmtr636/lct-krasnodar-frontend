import styles from "./style.module.scss";
import { observer } from "mobx-react-lite";
import { ContentWithHeaderLayout } from "src/features/layout/ui/ContentWithHeaderLayout/ContentWithHeaderLayout";
import { useNavigate } from "react-router-dom";
import { HeaderActionButton } from "src/features/layout/ui/Header/HeaderActionButton/HeaderActionButton";
import { IconAdd, IconClose, IconDelete, IconEdit } from "src/shared/assets/img";
import { educationStore } from "src/features/education/stores/educationStore";
import { useEffect, useState } from "react";
import { Drawer, Menu, MenuItem } from "@mui/material";
import { Input } from "src/shared/ui/Inputs/Input/Input";
import { Button } from "src/shared/ui/Button/Button";
import {
    IconCalendar,
    IconCheckmark,
    IconEducation,
    IconMinus,
} from "src/features/education/assets";
import { Checkbox } from "src/shared/ui/Checkbox/Checkbox";
import { USER_DEPARTMENT_FILTER_OPTIONS } from "src/features/users/constants/userDepartments";
import { IconButton } from "src/shared/ui/Button/IconButton/IconButton";
import { LinkButton } from "src/shared/ui/Button/LinkButton/LinkButton";
import { fileStore } from "src/features/education/stores/fileStore";
import { declOfNum } from "src/features/users/pages/UserPage/UserPage";
import { ICourse } from "src/features/education/interfaces/ICourse";
import { IProgram } from "src/features/education/interfaces/IProgram";
import classNames from "classnames";

export const EducationPage = observer(() => {
    const navigate = useNavigate();
    const [showAddProgram, setShowAddProgram] = useState(false);
    const [showAddCourse, setShowAddCourse] = useState(false);
    const [showAddTest, setShowAddTest] = useState(false);
    const [editingCourse, setEditingCourse] = useState<ICourse | null>(null);
    const [editingProgram, setEditingProgram] = useState<IProgram | null>(null);
    const [selectProgramAnchorEl, setSelectProgramAnchorEl] = useState<any>(null);

    const getStartActions = () => {
        return [
            <HeaderActionButton onClick={() => setShowAddProgram(true)} icon={<IconAdd />}>
                Добавить программу обучения
            </HeaderActionButton>,
            <HeaderActionButton onClick={() => setShowAddCourse(true)} icon={<IconAdd />}>
                Добавить курс
            </HeaderActionButton>,
        ];
    };

    useEffect(() => {
        if (showAddCourse) {
            educationStore.nameInput = "";
            educationStore.selectedProgram = null;
            educationStore.durationInput = "";
            fileStore.selectedFile = null;
        }
    }, [showAddCourse]);

    useEffect(() => {
        if (showAddProgram) {
            educationStore.nameInput = "";
            educationStore.selectedDepartments = [];
        }
    }, [showAddProgram]);

    useEffect(() => {
        if (editingCourse) {
            educationStore.nameInput = editingCourse.name;
            educationStore.selectedProgram = educationStore.programs.find(
                (p) => p.id === editingCourse.programId,
            )!;
            educationStore.durationInput = editingCourse.duration.toString();
            fileStore.uploadedFile = editingCourse.file;
        }
    }, [editingCourse]);

    useEffect(() => {
        if (editingProgram) {
            educationStore.nameInput = editingProgram.name;
            educationStore.selectedDepartments = editingProgram.departments;
            educationStore.selectedCourses = educationStore.courses.filter(
                (c) => c.programId === editingProgram.id,
            );
        }
    }, [editingProgram]);

    return (
        <ContentWithHeaderLayout
            title={"Обучение"}
            onBack={() => navigate("/")}
            startActions={getStartActions()}
        >
            <div className={styles.content}>
                <div className={styles.card}>
                    <div className={styles.header}>Курсы</div>
                    {!!educationStore.coursesWithoutProgram.length && (
                        <div className={styles.programBlock}>
                            <div className={styles.programBlockHeader}>
                                Не состоят в программах обучения
                            </div>
                            <div className={styles.courses}>
                                {educationStore.coursesWithoutProgram.map((c) => (
                                    <button
                                        className={styles.course}
                                        onClick={() => setEditingCourse(c)}
                                    >
                                        <IconEducation />
                                        {c.name}
                                        <IconButton
                                            onClick={() => {
                                                educationStore.deleteCourse(c.id);
                                            }}
                                            className={styles.deleteButton}
                                        >
                                            <IconDelete />
                                        </IconButton>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    {educationStore.programs.map((program) => (
                        <div className={styles.programBlock}>
                            <div className={styles.programBlockHeader}>
                                <button
                                    className={classNames(styles.addButton)}
                                    onClick={(e) => {
                                        setEditingProgram(program);
                                    }}
                                >
                                    <div className={styles.icon}>
                                        <IconEdit />
                                    </div>
                                    {program.name}
                                </button>
                                {!!educationStore.getCoursesForProgram(program.id).length ? (
                                    <div className={styles.duration}>
                                        <IconCalendar />
                                        {educationStore.getCoursesTotalDurationForProgram(
                                            program.id,
                                        )}
                                        &nbsp;
                                        {declOfNum(
                                            educationStore.getCoursesTotalDurationForProgram(
                                                program.id,
                                            ),
                                            ["день", "дня", "дней"],
                                        )}
                                    </div>
                                ) : (
                                    <IconButton
                                        className={styles.deleteButton}
                                        onClick={() => educationStore.deleteProgram(program.id)}
                                    >
                                        <IconDelete />
                                    </IconButton>
                                )}
                            </div>
                            {!!educationStore.getCoursesForProgram(program.id).length && (
                                <div className={styles.courses}>
                                    {educationStore.getCoursesForProgram(program.id).map((c) => (
                                        <button
                                            className={styles.course}
                                            onClick={() => setEditingCourse(c)}
                                        >
                                            <IconEducation />
                                            {c.name}
                                            <IconButton
                                                onClick={() => educationStore.deleteCourse(c.id)}
                                                className={styles.deleteButton}
                                            >
                                                <IconDelete />
                                            </IconButton>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <Drawer open={showAddProgram} onClose={() => setShowAddProgram(false)} anchor={"right"}>
                <div className={styles.drawer}>
                    <div className={styles.header}>
                        Добавить программу обучения
                        <button className={styles.close} onClick={() => setShowAddProgram(false)}>
                            <IconClose />
                        </button>
                    </div>
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>Название программы обучения</div>
                        <Input
                            onChange={(value) => (educationStore.nameInput = value)}
                            inputValue={educationStore.nameInput}
                            labelName={"Название программы обучения"}
                        />
                    </div>
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>Для кого предназначена программа</div>
                        <div className={styles.checkboxGrid}>
                            <Checkbox
                                checkboxChange={(value) => {
                                    educationStore.selectedDepartments = [];
                                }}
                                isChecked={!educationStore.selectedDepartments.length}
                            >
                                Выбрать все
                            </Checkbox>
                            {USER_DEPARTMENT_FILTER_OPTIONS.map((option) => (
                                <Checkbox
                                    checkboxChange={(value) => {
                                        if (value) {
                                            educationStore.selectedDepartments.push(
                                                option.department,
                                            );
                                        } else {
                                            educationStore.selectedDepartments =
                                                educationStore.selectedDepartments.filter(
                                                    (d) => d !== option.department,
                                                );
                                        }
                                    }}
                                    isChecked={educationStore.selectedDepartments.includes(
                                        option.department,
                                    )}
                                >
                                    {option.name}
                                </Checkbox>
                            ))}
                        </div>
                    </div>

                    {!educationStore.unselectedCourses.length &&
                    !educationStore.selectedCourses.length ? (
                        <div className={classNames(styles.section, styles.withoutBottomBorder)}>
                            <div className={styles.sectionHeader}>Курсы не найдены</div>
                            <HeaderActionButton
                                onClick={() => {
                                    setShowAddCourse(true);
                                }}
                                className={styles.addCourseButton}
                                icon={<IconAdd />}
                            >
                                Создать курс
                            </HeaderActionButton>
                        </div>
                    ) : (
                        <div className={styles.section}>
                            <div className={styles.sectionHeader}>Входящие курсы</div>
                            {!!educationStore.selectedCourses.length ? (
                                <div className={styles.courses}>
                                    {educationStore.selectedCourses.map((c) => (
                                        <div className={styles.course}>
                                            <IconEducation />
                                            {c.name}
                                            <IconButton
                                                className={styles.deleteButton}
                                                onClick={() => {
                                                    educationStore.selectedCourses =
                                                        educationStore.selectedCourses.filter(
                                                            (_c) => _c !== c,
                                                        );
                                                }}
                                            >
                                                <IconMinus />
                                            </IconButton>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div>Курсы не добавлены</div>
                            )}
                        </div>
                    )}

                    {!!educationStore.unselectedCourses.length && (
                        <div className={styles.section}>
                            <div className={styles.sectionHeader}>Не входят в план обучения</div>
                            <div className={styles.courses}>
                                {educationStore.unselectedCourses.map((c) => (
                                    <div className={styles.course}>
                                        <IconEducation />
                                        {c.name}
                                        <IconButton
                                            className={styles.deleteButton}
                                            onClick={() => {
                                                educationStore.selectedCourses.unshift(c);
                                            }}
                                        >
                                            <IconAdd />
                                        </IconButton>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className={styles.actionButton}>
                        <Button
                            onClick={() => {
                                educationStore.addProgram();
                                setShowAddProgram(false);
                            }}
                            isLoading={false}
                            disabled={!educationStore.isAddProgramValid}
                            icon={<IconCheckmark />}
                        >
                            Создать план обучения
                        </Button>
                    </div>
                </div>
            </Drawer>

            <Drawer
                open={!!editingProgram}
                onClose={() => setEditingProgram(null)}
                anchor={"right"}
            >
                <div className={styles.drawer}>
                    <div className={styles.header}>
                        Редактировать программу обучения
                        <button className={styles.close} onClick={() => setEditingProgram(null)}>
                            <IconClose />
                        </button>
                    </div>
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>Название программы обучения</div>
                        <Input
                            onChange={(value) => (educationStore.nameInput = value)}
                            inputValue={educationStore.nameInput}
                            labelName={"Название программы обучения"}
                        />
                    </div>
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>Для кого предназначена программа</div>
                        <div className={styles.checkboxGrid}>
                            <Checkbox
                                checkboxChange={(value) => {
                                    educationStore.selectedDepartments = [];
                                }}
                                isChecked={!educationStore.selectedDepartments.length}
                            >
                                Выбрать все
                            </Checkbox>
                            {USER_DEPARTMENT_FILTER_OPTIONS.map((option) => (
                                <Checkbox
                                    checkboxChange={(value) => {
                                        if (value) {
                                            educationStore.selectedDepartments.push(
                                                option.department,
                                            );
                                        } else {
                                            educationStore.selectedDepartments =
                                                educationStore.selectedDepartments.filter(
                                                    (d) => d !== option.department,
                                                );
                                        }
                                    }}
                                    isChecked={educationStore.selectedDepartments.includes(
                                        option.department,
                                    )}
                                >
                                    {option.name}
                                </Checkbox>
                            ))}
                        </div>
                    </div>

                    {!educationStore.unselectedCourses.length &&
                    !educationStore.selectedCourses.length ? (
                        <div className={classNames(styles.section, styles.withoutBottomBorder)}>
                            <div className={styles.sectionHeader}>Курсы не найдены</div>
                            <HeaderActionButton
                                onClick={() => {
                                    setShowAddCourse(true);
                                }}
                                className={styles.addCourseButton}
                                icon={<IconAdd />}
                            >
                                Создать курс
                            </HeaderActionButton>
                        </div>
                    ) : (
                        <div className={styles.section}>
                            <div className={styles.sectionHeader}>Входящие курсы</div>
                            {!!educationStore.selectedCourses.length ? (
                                <div className={styles.courses}>
                                    {educationStore.selectedCourses.map((c) => (
                                        <div className={styles.course}>
                                            <IconEducation />
                                            {c.name}
                                            <IconButton
                                                className={styles.deleteButton}
                                                onClick={() => {
                                                    educationStore.selectedCourses =
                                                        educationStore.selectedCourses.filter(
                                                            (_c) => _c !== c,
                                                        );
                                                }}
                                            >
                                                <IconMinus />
                                            </IconButton>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div>Курсы не добавлены</div>
                            )}
                        </div>
                    )}
                    {!!educationStore.unselectedCourses.length && (
                        <div className={styles.section}>
                            <div className={styles.sectionHeader}>Не входят в план обучения</div>
                            <div className={styles.courses}>
                                {educationStore.unselectedCourses.map((c) => (
                                    <div className={styles.course}>
                                        <IconEducation />
                                        {c.name}
                                        <IconButton
                                            className={styles.deleteButton}
                                            onClick={() => {
                                                educationStore.selectedCourses.unshift(c);
                                            }}
                                        >
                                            <IconAdd />
                                        </IconButton>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className={styles.actionButton}>
                        <Button
                            onClick={async () => {
                                await educationStore.updateProgram(editingProgram!);
                                setEditingProgram(null);
                            }}
                            isLoading={false}
                            disabled={!educationStore.isAddProgramValid}
                            icon={<IconCheckmark />}
                        >
                            Сохранить изменения
                        </Button>
                    </div>
                </div>
            </Drawer>

            <Drawer
                hideBackdrop={showAddCourse && showAddProgram}
                open={showAddCourse}
                onClose={() => setShowAddCourse(false)}
                anchor={"right"}
            >
                <div className={styles.drawer}>
                    <div className={styles.header}>
                        Добавить курс
                        <button className={styles.close} onClick={() => setShowAddCourse(false)}>
                            <IconClose />
                        </button>
                    </div>
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>Основная информация</div>
                        <Input
                            onChange={(value) => (educationStore.nameInput = value)}
                            inputValue={educationStore.nameInput}
                            labelName={"Название курса"}
                        />
                    </div>
                    <div className={styles.section}>
                        <div className={styles.row}>
                            <div>
                                <div className={styles.sectionHeader}>Загрузить материалы</div>
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
                                        ) : (
                                            <>DOCX, PDF</>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className={styles.sectionHeader}>Программа обучения</div>
                                <div>
                                    <LinkButton
                                        onClick={(event) =>
                                            setSelectProgramAnchorEl(event.currentTarget)
                                        }
                                        icon={
                                            educationStore.selectedProgram ? (
                                                <IconCheckmark className={styles.checkmarkIcon} />
                                            ) : (
                                                <IconAdd />
                                            )
                                        }
                                        className={classNames(styles.linkButton, {
                                            [styles.withBottomBorder]: !!selectProgramAnchorEl,
                                        })}
                                    >
                                        {educationStore.selectedProgram
                                            ? educationStore.selectedProgram.name
                                            : "Выбрать"}
                                    </LinkButton>
                                </div>
                                <Menu
                                    open={!!selectProgramAnchorEl}
                                    onClose={() => setSelectProgramAnchorEl(null)}
                                    anchorEl={selectProgramAnchorEl}
                                    classes={{
                                        paper: styles.selectProgramMenu,
                                    }}
                                >
                                    {educationStore.programs.map((p) => (
                                        <MenuItem
                                            className={styles.menuItem}
                                            onClick={() => {
                                                educationStore.selectedProgram = p;
                                                setSelectProgramAnchorEl(null);
                                            }}
                                        >
                                            {p.name}
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </div>
                        </div>
                    </div>
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>Тестирование после изучения</div>
                        <HeaderActionButton
                            onClick={() => setShowAddTest(true)}
                            variant={"contained"}
                        >
                            Создать тестирование
                        </HeaderActionButton>
                    </div>
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>Срок прохождения</div>
                        <div style={{ width: "440px" }}>
                            <Input
                                onChange={(value) => (educationStore.durationInput = value)}
                                inputValue={educationStore.durationInput}
                                labelName={"Сколько дней потребуется для прохождения?"}
                                type={"number"}
                            />
                        </div>
                    </div>
                    <div className={styles.actionButton}>
                        <Button
                            onClick={async () => {
                                await educationStore.addCourse();
                                setShowAddCourse(false);
                            }}
                            isLoading={false}
                            disabled={!educationStore.isAddCourseValid}
                            icon={<IconCheckmark />}
                        >
                            Добавить курс
                        </Button>
                    </div>
                </div>
            </Drawer>

            <Drawer open={!!editingCourse} onClose={() => setEditingCourse(null)} anchor={"right"}>
                <div className={styles.drawer}>
                    <div className={styles.header}>
                        Редактировать курс
                        <button className={styles.close} onClick={() => setEditingCourse(null)}>
                            <IconClose />
                        </button>
                    </div>
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>Основная информация</div>
                        <Input
                            onChange={(value) => (educationStore.nameInput = value)}
                            inputValue={educationStore.nameInput}
                            labelName={"Название курса"}
                        />
                    </div>
                    <div className={styles.section}>
                        <div className={styles.row}>
                            <div>
                                <div className={styles.sectionHeader}>Загрузить материалы</div>
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
                                            <>DOCX, PDF</>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className={styles.sectionHeader}>Программа обучения</div>
                                <div>
                                    <LinkButton
                                        onClick={(event) =>
                                            setSelectProgramAnchorEl(event.currentTarget)
                                        }
                                        icon={
                                            educationStore.selectedProgram ? (
                                                <IconCheckmark className={styles.checkmarkIcon} />
                                            ) : (
                                                <IconAdd />
                                            )
                                        }
                                    >
                                        {educationStore.selectedProgram
                                            ? educationStore.selectedProgram.name
                                            : "Выбрать"}
                                    </LinkButton>
                                </div>
                                <Menu
                                    open={!!selectProgramAnchorEl}
                                    onClose={() => setSelectProgramAnchorEl(null)}
                                    anchorEl={selectProgramAnchorEl}
                                    classes={{
                                        paper: styles.selectProgramMenu,
                                    }}
                                >
                                    {educationStore.programs.map((p) => (
                                        <MenuItem
                                            className={styles.menuItem}
                                            onClick={() => {
                                                educationStore.selectedProgram = p;
                                                setSelectProgramAnchorEl(null);
                                            }}
                                        >
                                            {p.name}
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </div>
                        </div>
                    </div>
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>Тестирование после изучения</div>
                        <HeaderActionButton
                            onClick={() => setShowAddTest(true)}
                            variant={"contained"}
                        >
                            Создать тестирование
                        </HeaderActionButton>
                    </div>
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>Срок прохождения</div>
                        <div style={{ width: "440px" }}>
                            <Input
                                onChange={(value) => (educationStore.durationInput = value)}
                                inputValue={educationStore.durationInput}
                                labelName={"Сколько дней потребуется для прохождения?"}
                                type={"number"}
                            />
                        </div>
                    </div>
                    <div className={styles.actionButton}>
                        <Button
                            onClick={async () => {
                                await educationStore.updateCourse(editingCourse!);
                                setEditingCourse(null);
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

            <Drawer
                open={showAddTest}
                onClose={() => setShowAddTest(false)}
                anchor={"right"}
                hideBackdrop
            >
                <div className={styles.drawer}>
                    <div className={styles.header}>
                        Создать тестирование
                        <button className={styles.close} onClick={() => setShowAddTest(false)}>
                            <IconClose />
                        </button>
                    </div>
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>Основная информация</div>
                        <Input
                            onChange={(value) => (educationStore.nameInput = value)}
                            inputValue={educationStore.nameInput}
                            labelName={"Название курса"}
                        />
                    </div>
                    <div className={styles.section}>
                        <div className={styles.row}>
                            <div>
                                <div className={styles.sectionHeader}>Загрузить материалы</div>
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
                                            <>DOCX, PDF</>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className={styles.sectionHeader}>Программа обучения</div>
                                <div>
                                    <LinkButton
                                        onClick={(event) =>
                                            setSelectProgramAnchorEl(event.currentTarget)
                                        }
                                        icon={
                                            educationStore.selectedProgram ? (
                                                <IconCheckmark className={styles.checkmarkIcon} />
                                            ) : (
                                                <IconAdd />
                                            )
                                        }
                                    >
                                        {educationStore.selectedProgram
                                            ? educationStore.selectedProgram.name
                                            : "Выбрать"}
                                    </LinkButton>
                                </div>
                                <Menu
                                    open={!!selectProgramAnchorEl}
                                    onClose={() => setSelectProgramAnchorEl(null)}
                                    anchorEl={selectProgramAnchorEl}
                                    classes={{
                                        paper: styles.selectProgramMenu,
                                    }}
                                >
                                    {educationStore.programs.map((p) => (
                                        <MenuItem
                                            className={styles.menuItem}
                                            onClick={() => {
                                                educationStore.selectedProgram = p;
                                                setSelectProgramAnchorEl(null);
                                            }}
                                        >
                                            {p.name}
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </div>
                        </div>
                    </div>
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>Тестирование после изучения</div>
                        <HeaderActionButton
                            onClick={() => setShowAddTest(true)}
                            variant={"contained"}
                        >
                            Создать тестирование
                        </HeaderActionButton>
                    </div>
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>Срок прохождения</div>
                        <div style={{ width: "440px" }}>
                            <Input
                                onChange={(value) => (educationStore.durationInput = value)}
                                inputValue={educationStore.durationInput}
                                labelName={"Сколько дней потребуется для прохождения?"}
                                type={"number"}
                            />
                        </div>
                    </div>
                    <div className={styles.actionButton}>
                        <Button
                            onClick={async () => {
                                await educationStore.updateCourse(editingCourse!);
                                setEditingCourse(null);
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
        </ContentWithHeaderLayout>
    );
});
