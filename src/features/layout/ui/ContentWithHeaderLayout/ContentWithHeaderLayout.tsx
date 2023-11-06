import { Header, IHeaderProps } from "src/features/layout/ui/Header/Header";
import { ReactNode } from "react";

export interface IContentWithHeaderLayoutProps extends IHeaderProps {
    children: ReactNode;
}

export const ContentWithHeaderLayout = (props: IContentWithHeaderLayoutProps) => {
    return (
        <div>
            <Header {...props} />
            {props.children}
        </div>
    );
};
