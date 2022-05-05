import {
    Box,
    Button,
    Checkbox,
    Divider,
    Fab,
    FormControlLabel,
    Grid,
    Stack,
    TextField,
    ThemeProvider,
    Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { convertToRaw } from "draft-js";
import theme from "../../../../Themes/rte_theme";
import MuiEditor from "mui-rte";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import QuizIcon from "@mui/icons-material/Quiz";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import ScaleIcon from "@mui/icons-material/Scale";
import CustomCard from "../../../../Components/CustomCard";
import { useHistory } from "react-router-dom";
import {
    createQuestionPaper,
    updateQuestionPaper,
} from "../../../../Api/supervisor";

const column = [
    {
        field: "srNo",
        headerName: "Sr No",
        width: 100,
        headerAlign: "center",
        align: "center",
    },
    {
        field: "optionDesc",
        headerName: "Option",
        minWidth: 200,
        headerAlign: "center",
        align: "center",
        flex: 1,
    },
    {
        field: "isCorrect",
        headerName: "Correct",
        width: 100,
        headerAlign: "center",
        align: "center",
        type: "boolean",
    },
];

const QuestionForm = ({ edit, qid }) => {
    let question;
    const history = useHistory();
    const dispatch = useDispatch();
    const { examId, questionPaperId } = useSelector(
        (state) => state.supervisor.selectedExam
    );

    const { selectedQuestionPaper } = useSelector((state) => state.supervisor);

    if (edit) {
        question = selectedQuestionPaper[qid];
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        getValues,
    } = useForm({
        resolver: yupResolver(
            yup.object().shape({
                question: yup.string().required(),
                options: yup
                    .array()
                    .min(2, "Please add atleast 2 options")
                    .of(
                        yup.object().shape({
                            optionDesc: yup.string(),
                            isCorrect: yup.boolean(),
                        })
                    ),
                weightage: yup
                    .number()
                    .positive("Weightage must be greater than 0")
                    .required("Weightage is required"),
            })
        ),
        defaultValues: {
            question: edit ? question.question : "",
            options: edit
                ? question.options.map((option, index) => ({
                      id: option.optionId,
                      srNo: index + 1,
                      optionDesc: option.optionDesc,
                      isCorrect: option.isCorrect,
                  }))
                : [],
            weightage: edit ? question.weightage : 0,
        },
    });

    const [currentOption, setCurrentOption] = useState({
        optionDesc: "",
        isCorrect: false,
    });

    const [selectionModel, setSelectionModel] = useState([]);

    useEffect(() => {
        register("question");
        register("options");
    });

    const handleDelete = () => {
        const selectedRows = new Set(selectionModel);
        const oldOptions = getValues("options");
        const newOptions = oldOptions.filter(
            (_, index) => !selectedRows.has(index)
        );
        setValue("options", newOptions);
        setSelectionModel([]);
    };

    const muiRteProps = {
        label: "Start typing here...",
        onChange: (value) => {
            const content = convertToRaw(value.getCurrentContent());
            setValue("question", JSON.stringify(content));
        },
    };

    if (edit) {
        muiRteProps.defaultValue = question.question;
    }

    const submitForm = (data) => {
        console.log([data]);
        if (!questionPaperId && selectedQuestionPaper.length === 0) {
            console.log("Question Paper is being created")
            createQuestionPaper(dispatch, history, examId, [data]);
        } else {
            console.log("Question Paper is being updated");
            if (edit) {
                let qb = [...selectedQuestionPaper];
                qb[qid] = data;
                updateQuestionPaper(
                    dispatch,
                    history,
                    examId,
                    questionPaperId,
                    qb
                );
            } else {
                updateQuestionPaper(
                    dispatch,
                    history,
                    examId,
                    questionPaperId,
                    [...selectedQuestionPaper, data]
                );
            }
        }
    };

    let _rows = watch("options").map((row, index) => ({
        id: index,
        srNo: index + 1,
        ...row,
    }));

    return (
        <Box component="form" noValidate onSubmit={handleSubmit(submitForm)}>
            <Grid container spacing={4}>
                <Grid item lg={8} md={6} sm={12} xs={12}>
                    <Stack spacing={4}>
                        <CustomCard title="Question" icon={<QuizIcon />}>
                            <Grid item xs={12}>
                                <ThemeProvider theme={theme}>
                                    <MuiEditor {...muiRteProps} />
                                </ThemeProvider>
                            </Grid>
                        </CustomCard>

                        <CustomCard
                            title="Options"
                            icon={<QuestionAnswerIcon />}
                        >
                            <Grid item xs={12}>
                                <Stack direction="row" spacing={2}>
                                    <TextField
                                        variant="outlined"
                                        label="Enter option text"
                                        fullWidth
                                        value={currentOption.optionDesc}
                                        onChange={(e) => {
                                            setCurrentOption({
                                                ...currentOption,
                                                optionDesc: e.target.value,
                                            });
                                        }}
                                        error={!!errors.options}
                                        helperText={errors.options?.message}
                                    />
                                    <Box>
                                        <Fab
                                            color="primary"
                                            onClick={() => {
                                                setValue("options", [
                                                    ...watch("options"),
                                                    currentOption,
                                                ]);
                                                setCurrentOption({
                                                    optionDesc: "",
                                                    isCorrect: false,
                                                });
                                            }}
                                            disabled={!currentOption.optionDesc}
                                        >
                                            <AddIcon />
                                        </Fab>
                                    </Box>
                                </Stack>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={currentOption.isCorrect}
                                            onChange={(e) => {
                                                setCurrentOption({
                                                    ...currentOption,
                                                    isCorrect: e.target.checked,
                                                });
                                            }}
                                        />
                                    }
                                    label="This is the correct option"
                                    sx={{ pl: 1 }}
                                />
                                <Divider sx={{ my: 3 }} variant="middle" />
                                <Box
                                    display="flex"
                                    justifyContent="space-between"
                                >
                                    <Typography
                                        variant="body1"
                                        fontWeight="fontWeightBold"
                                        color="text.secondary"
                                    >
                                        Options
                                    </Typography>
                                    <Button
                                        color="error"
                                        size="small"
                                        sx={{ my: 2 }}
                                        disabled={selectionModel.length === 0}
                                        onClick={handleDelete}
                                        startIcon={<DeleteIcon />}
                                    >
                                        Delete selected
                                    </Button>
                                </Box>
                                <DataGrid
                                    columns={column}
                                    rows={_rows}
                                    autoHeight
                                    checkboxSelection
                                    disableSelectionOnClick
                                    onSelectionModelChange={setSelectionModel}
                                    selectionModel={selectionModel}
                                />
                            </Grid>
                        </CustomCard>
                    </Stack>
                </Grid>
                <Grid item lg={4} md={6} sm={12} xs={12}>
                    <Stack spacing={4}>
                        <CustomCard title="Marks" icon={<ScaleIcon />}>
                            <Grid item xs={12}>
                                <TextField
                                    label="Enter Marks"
                                    type="number"
                                    fullWidth
                                    {...register("weightage")}
                                    error={!!errors.weightage}
                                    helperText={errors.weightage?.message}
                                />
                            </Grid>
                        </CustomCard>
                        <Button size="large" color="success" type="submit">
                            {edit ? "Update Question" : "Add Question"}
                        </Button>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
};

export default QuestionForm;
