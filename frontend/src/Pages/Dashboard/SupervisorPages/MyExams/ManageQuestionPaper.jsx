import {
    Box,
    Breadcrumbs,
    Button,
    Dialog,
    DialogContent,
    Divider,
    Link,
    Stack,
    Typography,
} from "@mui/material";
import {
    Link as RouterLink,
    useHistory,
    useParams,
    useRouteMatch,
} from "react-router-dom";
import React, { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import RefreshablePage from "../../CommonPages/RefreshablePage";
import AddIcon from "@mui/icons-material/Add";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PublishIcon from "@mui/icons-material/Publish";
import { GridActionsCellItem } from "@mui/x-data-grid";
import {
    getQuestionPaperForSupervisor,
    updateQuestionPaper,
} from "../../../../Api/supervisor";
import {
    setSelectedQuestionId,
    setSupervisorDialogOpen,
} from "../../../../Features/supervisorSlice";
import CustomDataGrid from "../../../../Components/CustomDataGrid";
import MUIRichTextEditor from "mui-rte";
import EditQuestion from "./EditQuestion";

const QuestionDialog = () => {
    const dispatch = useDispatch();
    const { selectedQuestionId, supervisorDialogOpen, selectedQuestionPaper } =
        useSelector((state) => state.supervisor);
    const optionsColumnSchema = [
        {
            headerName: "Sr No",
            field: "srNo",
            width: 100,
            headerAlign: "center",
            align: "center",
        },
        {
            headerName: "Option",
            field: "option",
            minWidth: 200,
            headerAlign: "center",
            align: "center",
            flex: 1,
        },
        {
            headerName: "Correct",
            field: "isCorrect",
            width: 100,
            headerAlign: "center",
            align: "center",
            type: "boolean",
        },
    ];

    const optionRows = selectedQuestionPaper[selectedQuestionId]?.options?.map(
        (option, index) => ({
            id: index,
            srNo: index + 1,
            option: option.optionDesc,
            isCorrect: option.isCorrect,
        })
    );

    return (
        <Dialog
            open={supervisorDialogOpen}
            onClose={() => dispatch(setSupervisorDialogOpen(false))}
            fullWidth
            maxWidth="md"
        >
            {selectedQuestionPaper.length > 0 && (
                <>
                    <DialogContent>
                        <Typography variant="body1">
                            <strong>Question</strong>
                            <MUIRichTextEditor
                                value={
                                    selectedQuestionPaper[selectedQuestionId]
                                        .question
                                }
                                readOnly
                                toolbar={false}
                            />
                        </Typography>
                        <Typography variant="body2" textAlign="end">
                            Marks Assigned:{" "}
                            <strong>
                                {
                                    selectedQuestionPaper[selectedQuestionId]
                                        .weightage
                                }
                            </strong>
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Stack>
                            <Typography variant="body1" mb={1}>
                                <strong>Options Provided: </strong>
                            </Typography>
                            <CustomDataGrid
                                columns={optionsColumnSchema}
                                rows={optionRows}
                                noShadow
                            />
                        </Stack>
                    </DialogContent>
                </>
            )}
        </Dialog>
    );
};

const ManageQuestionPaper = () => {
    const history = useHistory();
    const { url } = useRouteMatch();
    const { selectedQuestionPaper, selectedExam } = useSelector(
        (state) => state.supervisor
    );
    const { examName, questionPaperId } = selectedExam;
    const { examId } = useParams();
    const dispatch = useDispatch();
    const getQuestionPaper = () =>
        getQuestionPaperForSupervisor(dispatch, examId);
    const viewQuestion = useCallback(
        (id) => () => {
            dispatch(setSelectedQuestionId(id));
            dispatch(setSupervisorDialogOpen(true));
        },
        [dispatch]
    );
    const [selectionModel, setSelectionModel] = useState([]);

    const editQuestion = useCallback(
        (id) => () => {
            history.push(`${url}/edit-question/${id}`);
        },
        [history, url]
    );

    const deleteQuestions = () => {
        const selectedRows = new Set(selectionModel);
        const newQuestionList = selectedQuestionPaper.filter(
            (_, index) => !selectedRows.has(index)
        );
        updateQuestionPaper(
            dispatch,
            history,
            examId,
            questionPaperId,
            newQuestionList
        );
    };

    const columns = [
        {
            headerName: "Sr No",
            field: "srNo",
            width: 100,
            headerAlign: "center",
            align: "center",
        },
        {
            headerName: "Question",
            field: "question",
            minWidth: 200,
            flex: 1,
            headerAlign: "center",
            renderCell: (params) => {
                return (
                    <MUIRichTextEditor
                        value={params.row.question}
                        readOnly
                        toolbar={false}
                    />
                );
            },
        },
        {
            headerName: "Total Options",
            field: "totalOptions",
            width: 150,
            headerAlign: "center",
            align: "center",
        },
        {
            headerName: "Weightage",
            field: "weightage",
            width: 150,
            headerAlign: "center",
            align: "center",
        },
        {
            headerName: "Action",
            field: "action",
            type: "actions",
            getActions: (params) => [
                <GridActionsCellItem
                    icon={<DriveFileRenameOutlineIcon color="success" />}
                    label="Edit"
                    onClick={editQuestion(params.id)}
                />,
                <GridActionsCellItem
                    icon={<VisibilityIcon color="info" />}
                    label="View"
                    onClick={viewQuestion(params.id)}
                />,
            ],
            width: 150,
            headerAlign: "center",
            sortable: false,
            filterable: false,
        },
    ];

    const rows = selectedQuestionPaper.map((question, index) => ({
        id: index,
        srNo: index + 1,
        question: question.question,
        totalOptions: question.options.length,
        weightage: question.weightage,
    }));

    return (
        <>
            <Breadcrumbs sx={{ mb: 3 }} separator=">">
                <Link
                    color="black"
                    underline="hover"
                    component={RouterLink}
                    to="/dashboard/exam/my-exams"
                >
                    My Exams
                </Link>
                <Link
                    color="black"
                    underline="hover"
                    component={RouterLink}
                    to={`/dashboard/exam/my-exams/${examId}`}
                >
                    {examName}
                </Link>
                <Typography>Manage Question Bank</Typography>
            </Breadcrumbs>
            <RefreshablePage fetchExamFunction={getQuestionPaper}>
                <Box sx={{ display: "flex", justifyContent: "end", mb: 2 }}>
                    <Stack direction="row" spacing={2}>
                        {selectionModel.length > 0 && (
                            <Button
                                color="error"
                                variant="contained"
                                onClick={deleteQuestions}
                            >
                                Delete selected
                            </Button>
                        )}
                        <Button
                            color="success"
                            startIcon={<AddIcon />}
                            onClick={() => history.push(`${url}/add-question`)}
                        >
                            Add Question
                        </Button>
                    </Stack>
                </Box>
                <CustomDataGrid
                    rows={rows}
                    columns={columns}
                    checkboxSelection
                    selectionModel={selectionModel}
                    onSelectionModelChange={setSelectionModel}
                />
            </RefreshablePage>
            <QuestionDialog />
        </>
    );
};

export default ManageQuestionPaper;
