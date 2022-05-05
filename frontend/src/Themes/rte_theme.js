import { createTheme } from "@mui/material";

export default createTheme({
    typography: {
        fontFamily: ["Inter"],
    },
    overrides: {
        MUIRichTextEditor: {
            root: {
                fontFamily: ["Inter"],
                border: "1px solid rgb(158 158 158 / 80%)",
                borderRadius: 8,
            },
            editor: {
                height: 300,
                maxHeight: 300,
                overflow: "auto",
            },
            editorContainer: {
                padding: 16,
            },
            toolbar: {
                borderBottom: "1px solid rgb(158 158 158 / 80%)",
                paddingLeft: 16,
                paddingRight: 16,
            },
        },
    },
});
