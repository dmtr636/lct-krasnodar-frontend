import { useEffect, useRef } from "react";
import { Input } from "src/shared/ui/Inputs/Input/Input";
import styles from "./style.module.scss";
import close from "src/shared/assets/img/Close.svg";
import { useState } from "react";
import { HeaderActionButton } from "src/features/layout/ui/Header/HeaderActionButton/HeaderActionButton";
import { Button } from "src/shared/ui/Button/Button";
import { EmailInput } from "src/shared/ui/Inputs/EmailInput/EmailInput";
import checkmark from "src/shared/assets/img/CheckmarkWhite.svg";
import CheckmarkBrand from "src/shared/assets/img/CheckmarkBrand.svg";

import plus from "src/shared/assets/img/Plus.svg";

import axios from "axios";
import { USERS_ENDPOINT } from "src/shared/api/endpoints";
import classNames from "classnames";
import { USER_DEPARTMENT_FILTER_OPTIONS } from "src/features/users/constants/userDepartments";
import { IUser, IUserDepartment } from "src/features/users/interfaces/user";
import { userStore } from "src/features/users/stores/userStore";
import { fileStore } from "src/features/education/stores/fileStore";
import { USER_DEPARTMENTS } from "src/features/users/constants/userFilters";
import { IFile } from "src/features/education/interfaces/IFile";

export const EditUser = ({
    setShowAddUser,

    userData,
}: {
    setShowAddUser: (arg: boolean) => void;

    userData: IUser;
}) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [patronymic, setPatronymic] = useState("");
    const [file, setFile] = useState<File | null | string>(null);
    const [number, setNumber] = useState("");
    const [TG, setTG] = useState("");
    const [email, setEmail] = useState("");
    const [emailIsValid, setEmailIsValidated] = useState(false);
    const [department, setDepartment] = useState<IUserDepartment | "">("");
    const [departmentName, setDepartmentName] = useState("");

    const [responsibleUserId, setResponsibleUserId] = useState<number | null>(null);
    const [responsibleUserName, setResponsibleUserName] = useState("");

    const [showSort, setShowSort] = useState(false);
    const [showManager, setShowManager] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            fileStore.selectedFile = files[0];
            setFile(files[0]);
        }
    };
    const handleClearFile = () => {
        fileStore.selectedFile = null;
        setFile(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };
    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };
    const data = {
        ...userData,
        id: userData.id,
        email: email,
        department: department,
        firstName: firstName,
        lastName: lastName,
        patronymic: patronymic,
        telegram: TG,
        phone: number,
        photoFileId: fileStore.uploadedFile?.id ?? userData.photoFile?.id ?? null,
        responsibleUserId: responsibleUserId,
    };
    const sendUser = async () => {
        if (file) {
            await fileStore.uploadFile();
        }
        await axios
            .put(USERS_ENDPOINT, { ...data })
            .then((response) => {
                setShowAddUser(false);
                /*     setEmail("");
                setDepartment("");
                setResponsibleUserId(null);
                setFirstName("");
                setLastName("");
                setPatronymic("");
                setTG("");
                setNumber("");
                setShowSuccefull(true); */
            })
            .catch((error) => {});
        userStore.fetchAllUsers();
    };
    useEffect(() => {
        setEmail(userData?.email);
        setDepartmentName(USER_DEPARTMENTS[userData.department]);
        setDepartment(userData?.department);
        setResponsibleUserId(userData?.responsibleUserId);
        setFirstName(userData?.firstName);
        setLastName(userData?.lastName);
        setPatronymic(userData?.patronymic);
        setTG(userData?.telegram);
        setNumber(userData?.phone);
        /*         setFile(userData?.photoFileUrl)
         */
    }, []);
    const depArray = USER_DEPARTMENT_FILTER_OPTIONS.map((option, index) => (
        <div
            key={index}
            onClick={() => {
                setDepartment(option.department);
                setDepartmentName(option.name);
                setResponsibleUserId(null);
                setResponsibleUserName("");

                setShowSort(!showSort);
            }}
            className={classNames(styles.sortedItem, {
                [styles.active]: option.department == department,
            })}
        >
            {option.name}
        </div>
    ));
    const responsibleUsers = userStore.allUsers.filter((user) => user.role === "MANAGER");
    const responsibleUsersArray = responsibleUsers.map((user, index) => (
        <div
            key={index}
            className={styles.responsibleUsersArrayItem}
            onClick={() => {
                setResponsibleUserId(user.id);
                setResponsibleUserName(`${user.firstName} ${user.lastName}`);
                setShowManager(!showManager);
            }}
        >
            {`${user.firstName} ${user.lastName}`}
        </div>
    ));
    return (
        <div className={styles.container} onClick={() => setShowAddUser(false)}>
            <div className={styles.content} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <div className={styles.headerText}>Редактирование сотрудника</div>
                    <div onClick={() => setShowAddUser(false)} className={styles.headerIcon}>
                        {" "}
                        <img src={close} alt="" />
                    </div>
                </div>
                <div className={styles.mainInfo}>
                    <div className={styles.mainInfoText}>Основная информация</div>
                    <div className={styles.mainInfoArray}>
                        <div className={styles.input}>
                            <Input inputValue={firstName} onChange={setFirstName} labelName="Имя" />
                        </div>
                        <div className={styles.input}>
                            <Input
                                inputValue={lastName}
                                onChange={setLastName}
                                labelName="Фамилия"
                            />
                        </div>
                        <div className={styles.input}>
                            <Input
                                inputValue={patronymic}
                                onChange={setPatronymic}
                                labelName="Отчество при наличии"
                            />
                        </div>
                    </div>
                </div>
                <div className={styles.userPhoto}>
                    <div className={styles.userPhotoText}>Фотография сотрудника</div>
                    <div className={styles.userPhotoContent}>
                        <div>
                            <input
                                type="file"
                                style={{ display: "none" }}
                                ref={fileInputRef}
                                onChange={handleFileChange}
                            />
                            <div onClick={handleButtonClick}>
                                <HeaderActionButton onClick={() => {}}>
                                    Загрузить фотографию
                                </HeaderActionButton>
                            </div>
                        </div>
                        {file ? (
                            <div className={styles.photoName}>
                                {`${(file as any)?.name.substring(0, 15)}...`}{" "}
                                <div className={styles.headerIcon} onClick={handleClearFile}>
                                    {" "}
                                    <img src={close} alt="" />
                                </div>
                            </div>
                        ) : (
                            <div className={styles.photoName}>JPG, PNG, WEBP</div>
                        )}
                    </div>
                </div>
                <div className={styles.company}>
                    <div className={styles.companyContent}>
                        <div className={styles.companyRole}>
                            {" "}
                            <div className={styles.companyRoleHead}>Роль в компании</div>
                            <div
                                className={classNames(styles.addButton, {
                                    [styles.active]: showSort && department.length == 0,
                                })}
                            >
                                <div
                                    onClick={() => {
                                        setShowSort(!showSort);
                                        setShowManager(false);
                                    }}
                                >
                                    {department.length === 0 ? (
                                        <div className={styles.sort}>
                                            <img src={plus} alt="" />
                                            Выбрать должность
                                        </div>
                                    ) : (
                                        <div className={styles.depName}>
                                            <img src={CheckmarkBrand} alt="" />
                                            {departmentName}
                                        </div>
                                    )}
                                </div>
                            </div>
                            {showSort && <div className={styles.sortedBy}>{depArray}</div>}
                        </div>
                        <div className={styles.companyRole}>
                            {department.length > 1 &&
                                department !== "HR" &&
                                department !== "MANAGER" && (
                                    <div>
                                        <div className={styles.companyRoleHead}>
                                            Ответственное лицо
                                        </div>
                                        <div
                                            className={styles.userLeft}
                                            onClick={() => {
                                                setShowManager(!showManager);
                                                setShowSort(false);
                                            }}
                                        >
                                            {responsibleUserName.length === 0 ? (
                                                <div className={styles.sortUser}>
                                                    <img src={plus} alt="" />
                                                    Выбрать сотрудника
                                                </div>
                                            ) : (
                                                <div className={styles.userName}>
                                                    <img src={CheckmarkBrand} alt="" />
                                                    {responsibleUserName}
                                                </div>
                                            )}
                                            {showManager && (
                                                <div className={styles.responsibleUsersArray}>
                                                    {responsibleUsersArray}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                        </div>
                    </div>
                </div>
                <div className={styles.contact}>
                    <div className={styles.contactText}>Контактные данные</div>
                    <div className={styles.contactContent}>
                        <div className={styles.contactArray}>
                            <div className={styles.input}>
                                <Input inputValue={TG} onChange={setTG} labelName="Телеграм" />
                            </div>
                            <div className={styles.input}>
                                <Input
                                    inputValue={number}
                                    onChange={setNumber}
                                    labelName="Номер телефона"
                                />
                            </div>
                            <div className={styles.input}>
                                <EmailInput
                                    inputValue={email}
                                    onChange={setEmail}
                                    setEmailIsValidated={setEmailIsValidated}
                                    error={false}
                                    /*                                     labelName="Электронная почта"
                                     */
                                />
                            </div>
                            <div className={styles.contactArrayText}>
                                Пароль будет отправлен <br /> на указанную почту
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.button}>
                    <Button
                        isLoading={false}
                        disabled={false}
                        onClick={() => {
                            sendUser();
                        }}
                    >
                        <img src={checkmark}></img> Сохранить изменения
                    </Button>
                </div>
            </div>
        </div>
    );
};
