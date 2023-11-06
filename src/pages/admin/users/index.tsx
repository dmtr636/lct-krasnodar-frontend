import { useState } from "react";
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

interface SortingOption {
    id: string;
    label: string;
}

export const UsersPage = observer(() => {
    const [inputValue, setInputValue] = useState("");
    const [showSort, setShowSort] = useState(false);
    const [sortedBy, setSortedBy] = useState("abc");
    const [showFilter, setShowFilter] = useState(false);
    const [selectedDeportament, setSelectedDeportament] = useState<string[]>(["D1"]);
    const [selectedTasks, setSelectedTasks] = useState<string[]>(["T1"]);
    const navigate = useNavigate();

    const optionsDeportament: SortingOption[] = [
        { id: "D1", label: "Выбрать все" },
        { id: "D2", label: "HR" },
        { id: "D3", label: "Руководители" },
        { id: "D4", label: "Клиентский сервис" },
        { id: "D5", label: "Дизайнеры" },
        { id: "D6", label: "Разработчики" },
        { id: "D7", label: "Проект-менеджеры" },
    ];
    const optionsTasks: SortingOption[] = [
        { id: "T1", label: "Выбрать все" },
        { id: "T2", label: "Есть невыполненные задачи" },
        { id: "T3", label: "Есть просроченные задачи" },
        { id: "T4", label: "Задач нет" },
    ];

    const handleOptionChange = (
        optionId: string,
        setSelected: (values: string[]) => void,
        selected: string[],
    ) => {
        if (selected.includes(optionId)) {
            setSelected(selected.filter((id) => id !== optionId));
        } else {
            setSelected([...selected, optionId]);
        }
    };

    const deportamentArray = optionsDeportament.map((option) => (
        <Checkbox
            key={option.id}
            isChecked={selectedDeportament.includes(option.id)}
            checkboxChange={() =>
                handleOptionChange(option.id, setSelectedDeportament, selectedDeportament)
            }
        >
            {option.label}
        </Checkbox>
    ));
    const optionsArray = optionsTasks.map((option) => (
        <Checkbox
            key={option.id}
            isChecked={selectedTasks.includes(option.id)}
            checkboxChange={() => handleOptionChange(option.id, setSelectedTasks, selectedTasks)}
        >
            {option.label}
        </Checkbox>
    ));
    console.log(selectedTasks);
    const selectedDeportamentLabels = optionsDeportament
        .filter((option) => selectedDeportament.includes(option.id))
        .map((option) => option.label);
    const selectedTasksLabels = optionsTasks
        .filter((option) => selectedTasks.includes(option.id))
        .map((option) => option.label);
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
