import styles from "./style.module.scss";
import { observer } from "mobx-react-lite";
import { ContentWithHeaderLayout } from "src/features/layout/ui/ContentWithHeaderLayout/ContentWithHeaderLayout";
import { useNavigate } from "react-router-dom";
import { HeaderActionButton } from "src/features/layout/ui/Header/HeaderActionButton/HeaderActionButton";
import { IconAdd, IconClose, IconDelete } from "src/shared/assets/img";
import { programStore } from "src/features/education/stores/programStore";
import React, { useState } from "react";
import { Drawer, Menu, MenuItem } from "@mui/material";
import { Input } from "src/shared/ui/Inputs/Input/Input";
import { Button } from "src/shared/ui/Button/Button";
import { IconCheckmark } from "src/features/education/assets";
import { Checkbox } from "src/shared/ui/Checkbox/Checkbox";
import { USER_DEPARTMENT_FILTER_OPTIONS } from "src/features/users/constants/userDepartments";
import { IconButton } from "src/shared/ui/Button/IconButton/IconButton";
import { LinkButton } from "src/shared/ui/Button/LinkButton/LinkButton";
import { fileStore } from "src/features/education/stores/fileStore";

export const EducationPage = observer(() => {
    const navigate = useNavigate();
    const [showAddProgram, setShowAddProgram] = useState(false);
    const [showAddCourse, setShowAddCourse] = useState(false);
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

    return (
        <ContentWithHeaderLayout
            title={"Обучение"}
            onBack={() => navigate("/")}
            startActions={getStartActions()}
        >
            <div className={styles.content}>
                <div className={styles.card}>
                    <div className={styles.header}>Курсы</div>
                    {programStore.programs.map((program) => (
                        <div className={styles.programBlock}>
                            <div className={styles.programBlockHeader}>
                                <button className={styles.addButton}>
                                    <div className={styles.icon}>
                                        <IconAdd />
                                    </div>
                                    {program.name}
                                </button>
                                <IconButton onClick={() => programStore.deleteProgram(program.id)}>
                                    <IconDelete />
                                </IconButton>
                            </div>
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
                            onChange={(value) => (programStore.nameInput = value)}
                            inputValue={programStore.nameInput}
                            placeholder={"Название программы обучения"}
                        />
                    </div>
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>Для кого предназначена программа</div>
                        <div className={styles.checkboxGrid}>
                            <Checkbox
                                checkboxChange={(value) => {
                                    programStore.selectedDepartments = [];
                                }}
                                isChecked={!programStore.selectedDepartments.length}
                            >
                                Выбрать все
                            </Checkbox>
                            {USER_DEPARTMENT_FILTER_OPTIONS.map((option) => (
                                <Checkbox
                                    checkboxChange={(value) => {
                                        console.log(value);
                                        if (value) {
                                            programStore.selectedDepartments.push(
                                                option.department,
                                            );
                                        } else {
                                            programStore.selectedDepartments =
                                                programStore.selectedDepartments.filter(
                                                    (d) => d !== option.department,
                                                );
                                        }
                                    }}
                                    isChecked={programStore.selectedDepartments.includes(
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
                                programStore.addProgram();
                                setShowAddProgram(false);
                            }}
                            isLoading={false}
                            disabled={false}
                            icon={<IconCheckmark />}
                        >
                            Создать план обучения
                        </Button>
                    </div>
                </div>
            </Drawer>

            <Drawer open={showAddCourse} onClose={() => setShowAddCourse(false)} anchor={"right"}>
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
                            onChange={(value) => (programStore.nameInput = value)}
                            inputValue={programStore.nameInput}
                            placeholder={"Название курса"}
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
                                                {fileStore.selectedFile.name}
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
                                        icon={<IconAdd />}
                                    >
                                        Выбрать
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
                                    {programStore.programs.map((p) => (
                                        <MenuItem
                                            className={styles.menuItem}
                                            onClick={() => {
                                                programStore.selectedProgram = p;
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
                        <HeaderActionButton onClick={() => {}} variant={"contained"}>
                            Создать тестирование
                        </HeaderActionButton>
                    </div>
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>Срок прохождения</div>
                        <div style={{ width: "440px" }}>
                            <Input
                                onChange={(value) => (programStore.nameInput = value)}
                                inputValue={programStore.nameInput}
                                placeholder={"Сколько дней потребуется для прохождения?"}
                                type={"number"}
                            />
                        </div>
                    </div>
                    <div className={styles.actionButton}>
                        <Button
                            onClick={async () => {
                                await fileStore.uploadFile();
                                // setShowAddCourse(false);
                            }}
                            isLoading={false}
                            disabled={false}
                            icon={<IconCheckmark />}
                        >
                            Добавить курс
                        </Button>
                    </div>
                </div>
            </Drawer>
        </ContentWithHeaderLayout>
    );
});
