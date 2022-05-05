import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { DateTime } from "luxon";
import { fetchStudentExams } from "../../../Api/student";
import RefreshablePage from "../CommonPages/RefreshablePage";
import CustomDataGrid from "../../../Components/CustomDataGrid";
import { Button } from "@mui/material";

const columns = [
    {
        headerName: "Sr No",
        field: "srNo",
        width: 100,
        type: "number",
        headerAlign: "center",
        align: "center",
    },
    {
        headerName: "Exam Name",
        field: "examName",
        width: 200,
        headerAlign: "center",
        align: "center",
    },
    {
        headerName: "Start",
        field: "startTime",
        width: 200,
        type: "dateTime",
        headerAlign: "center",
        align: "center",
    },
    {
        headerName: "End",
        field: "endTime",
        width: 200,
        type: "dateTime",
        headerAlign: "center",
        align: "center",
    },
    {
        headerName: "Exam Description",
        field: "examDesc",
        minWidth: 200,
        flex: 1,
        headerAlign: "center",
        align: "center",
    },
    {
        headerName: "Action",
        field: "action",
        width: 200,
        headerAlign: "center",
        align: "center",
        renderCell: (params) => {
            return (
                <Button size="small" onClick={() => console.log(params.row.id)}>
                    View result
                </Button>
            );
        },
    },
];

const ExamHistory = () => {
    const dispatch = useDispatch();
    const exams = useSelector((state) => state.student.exams.history);
    const rows = exams.map((exam, index) => ({
        id: exam.examId,
        srNo: index + 1,
        examName: exam.examName,
        startTime: DateTime.fromISO(exam.examStartTime).toLocaleString(
            DateTime.DATETIME_MED
        ),
        endTime: DateTime.fromISO(exam.examEndTime).toLocaleString(
            DateTime.DATETIME_MED
        ),
        examDesc: exam.examDesc,
    }));
    const fetchExamsHistory = () => fetchStudentExams(dispatch, "history");

    return (
        <RefreshablePage
            title="Exams History"
            fetchExamFunction={fetchExamsHistory}
        >
            <CustomDataGrid rows={rows} columns={columns} />
        </RefreshablePage>
    );
};

export default ExamHistory;
