import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudentExams } from "../../../Api/student";
import { DateTime } from "luxon";
import RefreshablePage from "../CommonPages/RefreshablePage";
import CustomDataGrid from "../../../Components/CustomDataGrid";

const columns = [
    {
        headerName: "Sr No",
        field: "srNo",
        type: "number",
        headerAlign: "center",
        align: "center",
        width: 100,
    },
    {
        headerName: "Exam Name",
        field: "examName",
        headerAlign: "center",
        align: "center",
        width: 300,
    },
    {
        headerName: "Start Date",
        field: "startTime",
        type: "dateTime",
        headerAlign: "center",
        align: "center",
        width: 200,
    },
    {
        headerName: "End Date",
        field: "endTime",
        type: "dateTime",
        headerAlign: "center",
        align: "center",
        width: 200,
    },
    {
        headerName: "Exam Description",
        field: "examDesc",
        headerAlign: "center",
        align: "center",
        minWidth: 300,
        flex: 1,
    },
];

const UpcomingExams = () => {
    const dispatch = useDispatch();
    const exams = useSelector((state) => state.student.exams.upcoming);
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
    const fetchUpcomingExams = () => fetchStudentExams(dispatch, "upcoming");

    return (
        <RefreshablePage
            title="Upcoming Exams"
            fetchExamFunction={fetchUpcomingExams}
        >
            <CustomDataGrid rows={rows} columns={columns} />
        </RefreshablePage>
    );
};

export default UpcomingExams;
