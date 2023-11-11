import { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import styles from "./styles.module.scss";
import { SearchInput } from "src/shared/ui/Inputs/SearchInput/SearchIntup";
import sort from "src/shared/assets/img/Sort.svg";
import filter from "src/shared/assets/img/Filter.svg";
import classNames from "classnames";
import { EmployeeArray } from "src/features/staff/staff/EmployeeArray/EmployeeArray";
import close from "src/shared/assets/img/Close.svg";
import { Checkbox } from "src/shared/ui/Checkbox/Checkbox";
import { ContentWithHeaderLayout } from "src/features/layout/ui/ContentWithHeaderLayout/ContentWithHeaderLayout";
import { HeaderActionButton } from "src/features/layout/ui/Header/HeaderActionButton/HeaderActionButton";
import { IconAdd } from "src/shared/assets/img";
import { useNavigate } from "react-router-dom";
import { departmentsStore } from "src/features/users/stores/departamentStore";
import { tasksStore } from "src/features/users/stores/tasksStore";
import { userStore } from "src/features/users/stores/userStore";
import { sortedStore } from "src/features/users/stores/sortedStore";
import { AddUser } from "src/features/staff/staff/AddUser/AddUser";
import { Drawer } from "@mui/material";
import { ShowSuccefull } from "src/features/staff/staff/ShowSuccefull/ShowSuccefull";
import { ShowFale } from "src/features/staff/staff/ShowFale/ShowFale";

export const UsersPage = observer(() => {
    const [inputValue, setInputValue] = useState("");
    const [showSort, setShowSort] = useState(false);
    const [showFilter, setShowFilter] = useState(false);
    const [showAdduser, setShowAddUser] = useState(false);
    const [responsibilityUser, setResponsibilityUser] = useState(false);
    const [ShowSuccefullWindow, setShowSuccefull] = useState(false);
    const [showFale, setShowFale] = useState(false);

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
    return (
        <ContentWithHeaderLayout
            title={"Сотрудники"}
            onBack={() => navigate("/")}
            startActions={[
                !(user?.role === "EMPLOYEE") && (
                    <HeaderActionButton
                        icon={<IconAdd />}
                        onClick={() => {
                            setShowAddUser(true);
                        }}
                    >
                        Добавить сотрудника
                    </HeaderActionButton>
                ),
            ]}
        >
            <div className={styles.container}>
                <div className={styles.headBlock}>
                    <div className={styles.input}>
                        <SearchInput onChange={setInputValue} inputValue={inputValue} />
                    </div>
                    <div
                        className={classNames(styles.sortedBlock, { [styles.active]: showSort })}
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
                        <div onClick={() => setShowFilter(!showFilter)} className={styles.sort}>
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

                <EmployeeArray responsibilityUser={responsibilityUser} />
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
                <Drawer open={showAdduser} onClose={() => setShowAddUser(false)} anchor={"right"}>
                    <AddUser
                        setShowFale={setShowFale}
                        setShowAddUser={setShowAddUser}
                        setShowSuccefull={setShowSuccefull}
                    />
                </Drawer>
                <Drawer
                    open={ShowSuccefullWindow}
                    onClose={() => setShowSuccefull(false)}
                    anchor={"right"}
                >
                    <ShowSuccefull setShowSuccefull={setShowSuccefull} />
                </Drawer>
                <Drawer open={showFale} onClose={() => setShowFale(false)} anchor={"right"}>
                    <ShowFale setShowFale={setShowFale} />
                </Drawer>
                {/*  {showAdduser && <AddUser setShowAddUser={setShowAddUser}/>} */}
            </div>
        </ContentWithHeaderLayout>
    );
});
