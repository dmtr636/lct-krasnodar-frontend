import { Header, IHeaderProps } from "src/features/layout/ui/Header/Header";
import { ReactNode } from "react";
import styles from "./style.module.scss";

export interface IContentWithHeaderLayoutProps extends IHeaderProps {
    children: ReactNode;
}

export const ContentWithHeaderLayout = (props: IContentWithHeaderLayoutProps) => {
    return (
        <div className={styles.content}>
            <Header {...props} />
            {props.children}
        </div>
    );
};
