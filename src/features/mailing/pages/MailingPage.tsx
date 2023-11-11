import styles from "./style.module.scss";
import { observer } from "mobx-react-lite";
import { ContentWithHeaderLayout } from "src/features/layout/ui/ContentWithHeaderLayout/ContentWithHeaderLayout";
import { useNavigate } from "react-router-dom";
import { HeaderActionButton } from "src/features/layout/ui/Header/HeaderActionButton/HeaderActionButton";
import {
    IconAdd,
    IconChat,
    IconClose,
    IconDelete,
    IconMailing,
    IconSuccess,
} from "src/shared/assets/img";
import { useEffect, useState } from "react";
import { Drawer, TextareaAutosize } from "@mui/material";
import { Input } from "src/shared/ui/Inputs/Input/Input";
import { Button } from "src/shared/ui/Button/Button";
import { IconCheckmark } from "src/features/education/assets";
import { Checkbox } from "src/shared/ui/Checkbox/Checkbox";
import { USER_DEPARTMENT_FILTER_OPTIONS } from "src/features/users/constants/userDepartments";
import { IconButton } from "src/shared/ui/Button/IconButton/IconButton";
import { fileStore } from "src/features/education/stores/fileStore";
import classNames from "classnames";
import { Dialog } from "src/features/users/ui/Dialog/Dialog";
import { SuccessIcon } from "src/features/users/assets";
import { IMailing, mailingStore } from "src/features/mailing/stores/mailingStore";

export const MailingPage = observer(() => {
    const navigate = useNavigate();
    const [showAddMailing, setShowAddMailing] = useState(false);
    const [showAddTemplate, setShowAddTemplate] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<IMailing | null>(null);
    const [deletingMailing, setDeletingMailing] = useState<IMailing | null>(null);
    const [deletedMailing, setDeletedMailing] = useState<IMailing | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showSuccessMailing, setShowSuccessMailing] = useState(false);
    const [processingTemplate, setProcessingTemplate] = useState<IMailing | null>(null);

    const getStartActions = () => {
        return [
            <HeaderActionButton onClick={() => setShowAddTemplate(true)} icon={<IconAdd />}>
                Создать шаблон
            </HeaderActionButton>,
            <HeaderActionButton onClick={() => setShowAddMailing(true)} icon={<IconAdd />}>
                Создать новую рассылку
            </HeaderActionButton>,
        ];
    };

    useEffect(() => {
        if (showAddTemplate) {
            mailingStore.nameInput = "";
            mailingStore.textInput = "";
            fileStore.selectedFile = null;
            fileStore.uploadedFile = null;
        }
    }, [showAddTemplate]);

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
        if (editingTemplate) {
            mailingStore.nameInput = editingTemplate.name;
            mailingStore.textInput = editingTemplate.text;
            fileStore.uploadedFile = editingTemplate.file;
        }
    }, [editingTemplate]);

    useEffect(() => {
        if (processingTemplate) {
            mailingStore.nameInput = processingTemplate.name;
            mailingStore.textInput = processingTemplate.text;
            fileStore.uploadedFile = processingTemplate.file;
        }
    }, [processingTemplate]);

    return (
        <ContentWithHeaderLayout
            title={"Рассылка"}
            onBack={() => navigate("/")}
            startActions={getStartActions()}
        >
            <div className={styles.content}>
                <div className={styles.card}>
                    <div className={styles.header}>Шаблоны</div>
                    {!!mailingStore.mailings.filter((m) => m.isTemplate).length && (
                        <div className={styles.programBlock}>
                            <div className={styles.courses}>
                                {mailingStore.mailings
                                    .filter((m) => m.isTemplate)
                                    .map((mailing) => (
                                        <button
                                            className={styles.course}
                                            onClick={() => setEditingTemplate(mailing)}
                                        >
                                            <IconChat />
                                            {mailing.name}
                                            <div className={styles.actions}>
                                                <IconButton
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setProcessingTemplate(mailing);
                                                    }}
                                                    className={styles.deleteButton}
                                                >
                                                    <IconMailing />
                                                </IconButton>
                                                <IconButton
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setDeletingMailing(mailing);
                                                    }}
                                                    className={styles.deleteButton}
                                                >
                                                    <IconDelete />
                                                </IconButton>
                                            </div>
                                        </button>
                                    ))}
                            </div>
                        </div>
                    )}
                    {!mailingStore.mailings.filter((m) => m.isTemplate).length && (
                        <div className={styles.programBlock}>
                            <div>Шаблоны отсутствуют</div>
                        </div>
                    )}
                </div>
            </div>

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

            <Drawer open={showAddTemplate} anchor={"right"} elevation={0}>
                <div className={styles.drawer}>
                    <div className={styles.header}>
                        Создать шаблон
                        <button className={styles.close} onClick={() => setShowAddTemplate(false)}>
                            <IconClose />
                        </button>
                    </div>
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>Основная информация</div>
                        <Input
                            onChange={(value) => (mailingStore.nameInput = value)}
                            inputValue={mailingStore.nameInput}
                            labelName={"Название шаблона"}
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
                    <div className={classNames(styles.section, styles.withoutBottomBorder)}>
                        <div className={styles.sectionHeader}>Сообщение</div>
                        <TextareaAutosize
                            className={styles.textArea}
                            onChange={(e) => (mailingStore.textInput = e.target.value)}
                            value={mailingStore.textInput}
                            minRows={5}
                        />
                    </div>

                    <div className={styles.actionButton}>
                        <Button
                            onClick={() => {
                                mailingStore.addTemplateMailing();
                                setShowAddTemplate(false);
                            }}
                            isLoading={false}
                            disabled={!mailingStore.isAddMailingValid}
                            icon={<IconCheckmark />}
                        >
                            Создать шаблон
                        </Button>
                    </div>
                </div>
            </Drawer>

            <Drawer open={!!editingTemplate} anchor={"right"} elevation={0}>
                <div className={styles.drawer}>
                    <div className={styles.header}>
                        Редактировать шаблон
                        <button className={styles.close} onClick={() => setEditingTemplate(null)}>
                            <IconClose />
                        </button>
                    </div>
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>Основная информация</div>
                        <Input
                            onChange={(value) => (mailingStore.nameInput = value)}
                            inputValue={mailingStore.nameInput}
                            labelName={"Название шаблона"}
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
                    <div className={classNames(styles.section, styles.withoutBottomBorder)}>
                        <div className={styles.sectionHeader}>Сообщение</div>
                        <TextareaAutosize
                            className={styles.textArea}
                            onChange={(e) => (mailingStore.textInput = e.target.value)}
                            value={mailingStore.textInput}
                            minRows={5}
                        />
                    </div>

                    <div className={styles.actionButton}>
                        <Button
                            onClick={() => {
                                mailingStore.updateMailingTemplate(editingTemplate!);
                                setEditingTemplate(null);
                            }}
                            isLoading={false}
                            disabled={!mailingStore.isAddMailingValid}
                            icon={<IconCheckmark />}
                        >
                            Сохранить изменения
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
                            disabled={!mailingStore.isAddMailingValid}
                            icon={<IconCheckmark />}
                        >
                            Провести рассылку
                        </Button>
                    </div>
                </div>
            </Drawer>

            <Dialog
                open={!!deletingMailing}
                title={"Подтверждение удаления"}
                onClose={() => setDeletingMailing(null)}
                onCancel={() => setDeletingMailing(null)}
                description={"Будет удалён шаблон: " + deletingMailing?.name}
                onDelete={() => {
                    if (deletingMailing) {
                        setDeletedMailing({ ...deletingMailing });
                        mailingStore.deleteMailing({ ...deletingMailing });
                        setDeletingMailing(null);
                        setShowSuccess(true);
                    }
                }}
            />

            <Dialog
                open={showSuccess}
                title={"Шаблон успешно удалён"}
                titleIcon={<SuccessIcon />}
                onClose={() => setShowSuccess(false)}
                onCancel={() => {
                    setShowSuccess(false);
                }}
                description={"Был удалён шаблон: " + deletedMailing?.name}
                cancelButtonText={"Закрыть"}
            />
        </ContentWithHeaderLayout>
    );
});
