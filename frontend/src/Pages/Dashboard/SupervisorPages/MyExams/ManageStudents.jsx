import {
    Box,
    Breadcrumbs,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Link,
    Tooltip,
    Typography,
} from "@mui/material";
import { Link as RouterLink, useRouteMatch } from "react-router-dom";
import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import RefreshablePage from "../../CommonPages/RefreshablePage";
import CustomDataGrid from "../../../../Components/CustomDataGrid";
import AddIcon from "@mui/icons-material/Add";
import EmailIcon from "@mui/icons-material/Email";
import DeleteIcon from "@mui/icons-material/Delete";
import {
    deleteStudentFromExam,
    getStudentsOfExam,
} from "../../../../Api/supervisor";
import { GridActionsCellItem } from "@mui/x-data-grid";
import {
    setSelectedStudent,
    setSupervisorDialogOpen,
} from "../../../../Features/supervisorSlice";

const DeleteStudentDialog = () => {
    const dispatch = useDispatch();
    const { selectedStudent, supervisorDialogOpen, selectedExam } = useSelector(
        (state) => state.supervisor
    );

    return (
        <Dialog
            open={supervisorDialogOpen}
            onClose={() => dispatch(setSupervisorDialogOpen(false))}
        >
            <DialogTitle>
                {`Remove "${selectedStudent.studentName}" ?`}
            </DialogTitle>
            <DialogContent>
                Are you sure you want to un-enroll this student from this
                examination ?
            </DialogContent>
            <DialogActions>
                <Button
                    variant="text"
                    onClick={() => dispatch(setSupervisorDialogOpen(false))}
                >
                    Cancel
                </Button>
                <Button
                    variant="text"
                    onClick={() => {
                        deleteStudentFromExam(dispatch, selectedExam.examId, [
                            selectedStudent.studentEmail,
                        ]);
                        dispatch(setSupervisorDialogOpen(false));
                    }}
                >
                    Un-enroll
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const ManageStudents = () => {
    const { examName, examId } = useSelector(
        (state) => state.supervisor.selectedExam
    );
    const { url } = useRouteMatch();
    const { enrolledStudents } = useSelector((state) => state.supervisor);
    const dispatch = useDispatch();
    const getStudents = () => getStudentsOfExam(dispatch, examId);
    const columns = [
        {
            headerName: "Sr No",
            field: "srNo",
            width: 100,
            headerAlign: "center",
            align: "center",
        },
        {
            headerName: "Student ID",
            field: "sid",
            width: 200,
            headerAlign: "center",
            align: "center",
        },
        {
            headerName: "Name",
            field: "name",
            minWidth: 200,
            headerAlign: "center",
            align: "center",
            flex: 1,
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
            headerName: "Email",
            field: "email",
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
            headerName: "Mobile",
            field: "mobile",
            width: 200,
            headerAlign: "center",
            align: "center",
        },
        {
            headerName: "Actions",
            field: "actions",
            type: "actions",
            getActions: (params) => [
                <GridActionsCellItem
                    icon={<EmailIcon color="info" />}
                    onClick={() => {
                        window.location.href = `mailto:${params.row.email}`;
                    }}
                />,
                <GridActionsCellItem
                    icon={<DeleteIcon color="error" />}
                    onClick={() => {
                        dispatch(
                            setSelectedStudent({
                                studentEmail: params.row.email,
                                studentName: params.row.name,
                            })
                        );
                        dispatch(setSupervisorDialogOpen(true));
                    }}
                />,
            ],
        },
    ];
    const rows = useMemo(
        () =>
            enrolledStudents.map((student, index) => ({
                id: student.studentId,
                srNo: index + 1,
                sid: student.studentId,
                name: `${student.studentFirstName} ${student.studentLastName}`,
                email: student.studentEmailId,
                mobile: student.studentPhoneNumber,
            })),
        [enrolledStudents]
    );

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
                <Typography>Manage Students</Typography>
            </Breadcrumbs>
            <RefreshablePage fetchExamFunction={getStudents}>
                <Box sx={{ display: "flex", justifyContent: "end", mb: 2 }}>
                    <Button
                        color="success"
                        startIcon={<AddIcon />}
                        component={RouterLink}
                        to={`${url}/enroll-students`}
                    >
                        Enroll Students
                    </Button>
                </Box>
                <CustomDataGrid rows={rows} columns={columns} />
            </RefreshablePage>
            <DeleteStudentDialog />
        </>
    );
};

export default ManageStudents;
