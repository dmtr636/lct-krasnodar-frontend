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
import { departmentsStore } from "src/features/users/stores/deportamentStore";
import { tasksStore } from "src/features/users/stores/tasksStore";
import { userStore } from "src/features/users/stores/userStore";

export const UsersPage = observer(() => {
    const [inputValue, setInputValue] = useState("");
    const [showSort, setShowSort] = useState(false);
    const [sortedBy, setSortedBy] = useState("abc");
    const [showFilter, setShowFilter] = useState(false);

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
    }, []);
    userStore.searchInput = inputValue;
    return (
        <ContentWithHeaderLayout
            title={"Сотрудники"}
            onBack={() => navigate("/")}
            actions={[
                <HeaderActionButton icon={<IconAdd />} onClick={() => {}}>
                    Добавить сотрудника
                </HeaderActionButton>,
            ]}
        >
            <div className={styles.container}>
                <div className={styles.headBlock}>
                    <div className={styles.input}>
                        <SearchInput onChange={setInputValue} inputValue={inputValue} />
                    </div>
                    <div className={styles.sortedBlock}>
                        <div onClick={() => setShowSort(!showSort)} className={styles.sort}>
                            <img src={sort} alt="" />
                            Сортировка
                        </div>

                        {showSort && (
                            <div className={styles.sortedBy}>
                                <div
                                    onClick={() => {
                                        setSortedBy("abc");
                                        setShowSort(!showSort);
                                    }}
                                    className={classNames(styles.sortedItem, {
                                        [styles.active]: sortedBy === "abc",
                                    })}
                                >
                                    По алфавиту
                                </div>
                                <div
                                    onClick={() => {
                                        setSortedBy("date");
                                        setShowSort(!showSort);
                                    }}
                                    className={classNames(styles.sortedItem, {
                                        [styles.active]: sortedBy === "date",
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
                    </div>
                </div>
                <div className={styles.cloudArray}>
                    {cloudArrayDep}
                    {cloudArrayTask}
                </div>

                <EmployeeArray />
                {showFilter && (
                    <div className={styles.filterContainer}>
                        <div className={styles.filterHeader}>
                            <div className={styles.filterH1}>Фильтры</div>
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
                )}
            </div>
        </ContentWithHeaderLayout>
    );
});
