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

export const UsersPage = observer(() => {
    const [inputValue, setInputValue] = useState("");
    const [showSort, setShowSort] = useState(false);
    const [showFilter, setShowFilter] = useState(false);
    const [showAdduser, setShowAddUser] = useState(false);
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
    console.log(tasksStore.selectedTasks);
    useEffect(() => {
        userStore.fetchAllUsers();
        console.log(userStore.allUsers + "загрузка");
        document.addEventListener("click", hideSort);
        return () => document.addEventListener("click", hideSort);
    }, []);
    userStore.searchInput = inputValue;
    const hideSort = () => {
        setShowSort(false);
    };
    return (
        <ContentWithHeaderLayout
            title={"Сотрудники"}
            onBack={() => navigate("/")}
            startActions={[
                <HeaderActionButton
                    icon={<IconAdd />}
                    onClick={() => {
                        setShowAddUser(true);
                    }}
                >
                    Добавить сотрудника
                </HeaderActionButton>,
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
                                        console.log(JSON.stringify(sortedStore.sortedBy));
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
                <div className={styles.cloudArray}>
                    {cloudArrayDep}
                    {cloudArrayTask}
                </div>

                <EmployeeArray />
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
                                            console.log("нажал");
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
                                    <div>{deportamentArray}</div>
                                </div>
                                <div className={styles.filterTasks}>
                                    <div className={styles.filterText}>Статус задач</div>
                                    <div>{optionsArray}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <Drawer open={showAdduser} onClose={() => setShowAddUser(false)} anchor={"right"}>
                    <AddUser setShowAddUser={setShowAddUser} />
                </Drawer>
                {/*  {showAdduser && <AddUser setShowAddUser={setShowAddUser}/>} */}
            </div>
        </ContentWithHeaderLayout>
    );
});
