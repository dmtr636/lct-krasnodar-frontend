import { observer } from "mobx-react-lite";
import { ContentWithHeaderLayout } from "src/features/layout/ui/ContentWithHeaderLayout/ContentWithHeaderLayout";

export const SupportPage = observer(() => {
    return (
        <ContentWithHeaderLayout title={"Поддержка"}>
            <div></div>
        </ContentWithHeaderLayout>
    );
});
