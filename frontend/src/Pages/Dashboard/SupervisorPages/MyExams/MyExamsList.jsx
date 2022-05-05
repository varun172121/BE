import { Button, Tooltip, Typography } from "@mui/material";
import { DateTime } from "luxon";
import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSupervisorExams } from "../../../../Api/supervisor";
import RefreshablePage from "../../CommonPages/RefreshablePage";
import EditIcon from "@mui/icons-material/Edit";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import CustomDataGrid from "../../../../Components/CustomDataGrid";

const MyExamsList = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { url } = useRouteMatch();
    const { exams } = useSelector((state) => state.supervisor);
    const getSupervisorExamsFunc = () => getSupervisorExams(dispatch);
    const columnSchema = [
        {
            headerName: "Sr No",
            field: "srNo",
            width: 100,
            headerAlign: "center",
            align: "center",
        },
        {
            headerName: "Exam Name",
            field: "examName",
            width: 200,
            headerAlign: "center",
            align: "center",
            renderCell: (params) => {
                return (
                    <Tooltip title={params.value}>
                        <Typography variant="body2" noWrap>
                            {params.value}
                        </Typography>
                    </Tooltip>
                );
            },
        },
        {
            headerName: "Created At",
            field: "createdAt",
            width: 200,
            type: "dateTime",
            headerAlign: "center",
            align: "center",
        },
        {
            headerName: "Exam Description",
            field: "examDescription",
            width: 200,
            headerAlign: "center",
            align: "center",
            renderCell: (params) => {
                return (
                    <Tooltip title={params.value}>
                        <Typography variant="body2" noWrap>
                            {params.value}
                        </Typography>
                    </Tooltip>
                );
            },
        },
        {
            headerName: "Starts At",
            field: "startsAt",
            width: 200,
            headerAlign: "center",
            align: "center",
        },
        {
            headerName: "Ends At",
            field: "endsAt",
            width: 200,
            headerAlign: "center",
            align: "center",
        },
        {
            headerName: "Actions",
            field: "actions",
            renderCell: (params) => {
                return (
                    <Button
                        color="success"
                        size="small"
                        endIcon={<EditIcon />}
                        onClick={() => {
                            history.push(`${url}/${params.id}`);
                        }}
                    >
                        Manage
                    </Button>
                );
            },
            headerAlign: "center",
            align: "center",
            minWidth: 200,
            flex: 1,
        },
    ];
    const rows = useMemo(
        () =>
            exams.map((exam, index) => ({
                id: exam.examId,
                srNo: index + 1,
                examName: exam.examName,
                createdAt: DateTime.fromISO(exam.examCreatedAt).toLocaleString(
                    DateTime.DATETIME_MED
                ),
                examDescription: exam.examDesc,
                startsAt: DateTime.fromISO(exam.examStartTime).toLocaleString(
                    DateTime.DATETIME_MED
                ),
                endsAt: DateTime.fromISO(exam.examEndTime).toLocaleString(
                    DateTime.DATETIME_MED
                ),
            })),
        [exams]
    );
    const columns = useMemo(() => columnSchema, []);

    return (
        <RefreshablePage fetchExamFunction={getSupervisorExamsFunc}>
            <CustomDataGrid rows={rows} columns={columns} />
        </RefreshablePage>
    );
};

export default MyExamsList;
