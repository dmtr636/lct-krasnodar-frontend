import { observer } from "mobx-react-lite";
import { Alert, CircularProgress, Dialog } from "@mui/material";
import styles from "./style.module.css";
import { Document, Page, pdfjs } from "react-pdf";
import { useState } from "react";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { IconButton } from "src/shared/ui/Button/IconButton/IconButton";
import { IconClose } from "src/shared/assets/img";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.js",
    import.meta.url,
).toString();

interface IPDFViewerProps {
    open: boolean;
    onClose: () => void;
    title: string;
    file: string | Blob;
}

export const PDFViewer = observer((props: IPDFViewerProps) => {
    const [numPages, setNumPages] = useState(0);

    const onDocumentLoadSuccess = (document: any) => {
        setNumPages(document.numPages);
    };

    if (!props.file) {
        return null;
    }

    return (
        <Dialog
            open={props.open}
            onClose={props.onClose}
            maxWidth={false}
            className={styles.modal}
            PaperProps={{
                elevation: 0,
            }}
        >
            <div className={styles.card}>
                <div className={styles.header}>
                    {props.title}
                    <IconButton onClick={() => props.onClose()}>
                        <IconClose />
                    </IconButton>
                </div>
                <Document
                    file={props.file}
                    onLoadSuccess={onDocumentLoadSuccess}
                    className={styles.document}
                    loading={<CircularProgress />}
                    error={
                        <Alert severity={"error"}>Произошла ошибка при загрузке документа</Alert>
                    }
                >
                    {Array(numPages)
                        .fill(0)
                        .map((_, index) => (
                            <Page
                                scale={1.75}
                                pageNumber={index + 1}
                                key={index + 1}
                                className={styles.page}
                            />
                        ))}
                </Document>
            </div>
        </Dialog>
    );
});
