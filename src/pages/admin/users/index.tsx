import { observer } from "mobx-react-lite";
import styles from "./styles.module.scss";
import { SearchInput } from "src/shared/ui/Inputs/SearchInput/SearchIntup";
import { useState } from "react";
import sort from "src/shared/assets/img/Sort.svg";
import filter from "src/shared/assets/img/Filter.svg";
import classNames from "classnames";
import { EmployeeArray } from "src/features/staff/staff/EmployeeArray/EmployeeArray";
export const UsersPage = observer(() => {
    const [inputValue, setInputVaue] = useState("");
    const [showSort, setShowSort] = useState(false);
    const [sortedBy, setSortedBy] = useState("abc");
    const [showFilter, setShowFilter] = useState(false);

    return (
        <div className={styles.container}>
            <div className={styles.headBlock}>
                <div className={styles.input}>
                    <SearchInput onChange={setInputVaue} inputValue={inputValue} />
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
                                    [styles.active]: sortedBy == "abc",
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
                                    [styles.active]: sortedBy == "date",
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
            {showFilter && <>123</>}
        </div>
    );
});
