import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    Checkbox,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Grid,
    Skeleton,
    Stack,
    Tooltip,
    Typography,
} from "@mui/material";
import { fetchStudentExams } from "../../../Api/student";
import { DateTime } from "luxon";
import { Redirect } from "react-router-dom";
import RefreshablePage from "../CommonPages/RefreshablePage";
import NoExamsImage from "../../../Assets/Images/no_data.svg";
import screenfull from "screenfull";

const PreExamDialog = (props) => {
    const { open, onClose, examName, duration, examId } = props;
    const [redirect, setRedirect] = useState(false);
    const [instructionsRead, setInstructionsRead] = useState(false);

    if (redirect) {
        return <Redirect to={`/take-exam/${examId}`} />;
    }

    const toggleFullScreen = () => {
        if (screenfull.isEnabled) {
            screenfull.request();
        }
    };

    return (
        <Dialog open={open} onClose={onClose} scroll="paper">
            <DialogTitle>
                <Stack>
                    {examName}
                    <Typography variant="body2">
                        Time Duration: <strong>{duration}</strong> minutes
                    </Typography>
                </Stack>
            </DialogTitle>
            <DialogContent dividers>
                <Stack>
                    <h1>Privacy Policy for Examinator</h1>

                    <p>
                        At Examinator, accessible from
                        examinator-ai.southindia.cloudapp.azure.com, one of our
                        main priorities is the privacy of our visitors. This
                        Privacy Policy document contains types of information
                        that is collected and recorded by Examinator and how we
                        use it.
                    </p>

                    <p>
                        If you have additional questions or require more
                        information about our Privacy Policy, do not hesitate to
                        contact us.
                    </p>

                    <p>
                        This Privacy Policy applies only to our online
                        activities and is valid for visitors to our website with
                        regards to the information that they shared and/or
                        collect in Examinator. This policy is not applicable to
                        any information collected offline or via channels other
                        than this website. Our Privacy Policy was created with
                        the help of the{" "}
                        <a href="https://www.generateprivacypolicy.com/">
                            Free Privacy Policy Generator
                        </a>
                        .
                    </p>

                    <h2>Consent</h2>

                    <p>
                        By using our website, you hereby consent to our Privacy
                        Policy and agree to its terms.
                    </p>

                    <h2>Information we collect</h2>

                    <p>
                        The personal information that you are asked to provide,
                        and the reasons why you are asked to provide it, will be
                        made clear to you at the point we ask you to provide
                        your personal information.
                    </p>
                    <p>
                        If you contact us directly, we may receive additional
                        information about you such as your name, email address,
                        phone number, the contents of the message and/or
                        attachments you may send us, and any other information
                        you may choose to provide.
                    </p>
                    <p>
                        When you register for an Account, we may ask for your
                        contact information, including items such as name,
                        company name, address, email address, and telephone
                        number.
                    </p>

                    <h2>How we use your information</h2>

                    <p>
                        We use the information we collect in various ways,
                        including to:
                    </p>

                    <ul>
                        <li>Provide, operate, and maintain our website</li>
                        <li>Improve, personalize, and expand our website</li>
                        <li>Understand and analyze how you use our website</li>
                        <li>
                            Develop new products, services, features, and
                            functionality
                        </li>
                        <li>
                            Communicate with you, either directly or through one
                            of our partners, including for customer service, to
                            provide you with updates and other information
                            relating to the website, and for marketing and
                            promotional purposes
                        </li>
                        <li>Send you emails</li>
                        <li>Find and prevent fraud</li>
                    </ul>

                    <h2>Log Files</h2>

                    <p>
                        Examinator follows a standard procedure of using log
                        files. These files log visitors when they visit
                        websites. All hosting companies do this and a part of
                        hosting services' analytics. The information collected
                        by log files include internet protocol (IP) addresses,
                        browser type, Internet Service Provider (ISP), date and
                        time stamp, referring/exit pages, and possibly the
                        number of clicks. These are not linked to any
                        information that is personally identifiable. The purpose
                        of the information is for analyzing trends,
                        administering the site, tracking users' movement on the
                        website, and gathering demographic information.
                    </p>

                    <h2>Advertising Partners Privacy Policies</h2>

                    <p>
                        You may consult this list to find the Privacy Policy for
                        each of the advertising partners of Examinator.
                    </p>

                    <p>
                        Third-party ad servers or ad networks uses technologies
                        like cookies, JavaScript, or Web Beacons that are used
                        in their respective advertisements and links that appear
                        on Examinator, which are sent directly to users'
                        browser. They automatically receive your IP address when
                        this occurs. These technologies are used to measure the
                        effectiveness of their advertising campaigns and/or to
                        personalize the advertising content that you see on
                        websites that you visit.
                    </p>

                    <p>
                        Note that Examinator has no access to or control over
                        these cookies that are used by third-party advertisers.
                    </p>

                    <h2>Third Party Privacy Policies</h2>

                    <p>
                        Examinator's Privacy Policy does not apply to other
                        advertisers or websites. Thus, we are advising you to
                        consult the respective Privacy Policies of these
                        third-party ad servers for more detailed information. It
                        may include their practices and instructions about how
                        to opt-out of certain options.{" "}
                    </p>

                    <p>
                        You can choose to disable cookies through your
                        individual browser options. To know more detailed
                        information about cookie management with specific web
                        browsers, it can be found at the browsers' respective
                        websites.
                    </p>

                    <h2>
                        CCPA Privacy Rights (Do Not Sell My Personal
                        Information)
                    </h2>

                    <p>
                        Under the CCPA, among other rights, California consumers
                        have the right to:
                    </p>
                    <p>
                        Request that a business that collects a consumer's
                        personal data disclose the categories and specific
                        pieces of personal data that a business has collected
                        about consumers.
                    </p>
                    <p>
                        Request that a business delete any personal data about
                        the consumer that a business has collected.
                    </p>
                    <p>
                        Request that a business that sells a consumer's personal
                        data, not sell the consumer's personal data.
                    </p>
                    <p>
                        If you make a request, we have one month to respond to
                        you. If you would like to exercise any of these rights,
                        please contact us.
                    </p>

                    <h2>GDPR Data Protection Rights</h2>

                    <p>
                        We would like to make sure you are fully aware of all of
                        your data protection rights. Every user is entitled to
                        the following:
                    </p>
                    <p>
                        The right to access - You have the right to request
                        copies of your personal data. We may charge you a small
                        fee for this service.
                    </p>
                    <p>
                        The right to rectification - You have the right to
                        request that we correct any information you believe is
                        inaccurate. You also have the right to request that we
                        complete the information you believe is incomplete.
                    </p>
                    <p>
                        The right to erasure - You have the right to request
                        that we erase your personal data, under certain
                        conditions.
                    </p>
                    <p>
                        The right to restrict processing - You have the right to
                        request that we restrict the processing of your personal
                        data, under certain conditions.
                    </p>
                    <p>
                        The right to object to processing - You have the right
                        to object to our processing of your personal data, under
                        certain conditions.
                    </p>
                    <p>
                        The right to data portability - You have the right to
                        request that we transfer the data that we have collected
                        to another organization, or directly to you, under
                        certain conditions.
                    </p>
                    <p>
                        If you make a request, we have one month to respond to
                        you. If you would like to exercise any of these rights,
                        please contact us.
                    </p>

                    <h2>Children's Information</h2>

                    <p>
                        Another part of our priority is adding protection for
                        children while using the internet. We encourage parents
                        and guardians to observe, participate in, and/or monitor
                        and guide their online activity.
                    </p>

                    <p>
                        Examinator does not knowingly collect any Personal
                        Identifiable Information from children under the age of
                        13. If you think that your child provided this kind of
                        information on our website, we strongly encourage you to
                        contact us immediately and we will do our best efforts
                        to promptly remove such information from our records.
                    </p>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={instructionsRead}
                                onChange={(e) =>
                                    setInstructionsRead(e.target.checked)
                                }
                            />
                        }
                        label="I have read the instructions"
                        sx={{ mt: 2 }}
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary" variant="text">
                    Close
                </Button>
                <Button
                    onClick={() => {
                        if (instructionsRead) {
                            toggleFullScreen();
                            setRedirect(true);
                        }
                    }}
                    color="primary"
                    variant="text"
                    disabled={!instructionsRead}
                >
                    Start Exam
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const ExamCard = (props) => {
    const { examName, examStartTime, examEndTime, examId } = props;
    const examStartTimeDate = DateTime.fromISO(examStartTime);
    const examEndTimeDate = DateTime.fromISO(examEndTime);
    const duration = examEndTimeDate.diff(examStartTimeDate, "minutes").minutes;
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Card>
                <CardContent>
                    <Stack>
                        <Tooltip title={examName}>
                            <Typography variant="h6" gutterBottom noWrap>
                                {examName}
                            </Typography>
                        </Tooltip>
                        <Typography variant="caption">
                            <strong>Started At:</strong>{" "}
                            {examStartTimeDate.toLocaleString(
                                DateTime.DATETIME_MED
                            )}
                        </Typography>
                        <Typography variant="caption">
                            <strong>Ends At:</strong>{" "}
                            {examEndTimeDate.toLocaleString(
                                DateTime.DATETIME_MED
                            )}
                        </Typography>
                    </Stack>
                </CardContent>
                <CardActions>
                    <Button
                        disableElevation
                        color="success"
                        sx={{ px: 4, ml: "auto", mr: 1, mb: 1 }}
                        onClick={handleClickOpen}
                    >
                        Start Now
                    </Button>
                </CardActions>
            </Card>
            <PreExamDialog
                open={open}
                onClose={handleClose}
                examName={examName}
                duration={duration}
                examId={examId}
            />
        </>
    );
};

const ExamCardGrid = (props) => {
    return (
        <Grid container spacing={4}>
            {props.exams.map((exam, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                    <ExamCard {...exam} />
                </Grid>
            ))}
        </Grid>
    );
};

const OngoingExams = () => {
    const dispatch = useDispatch();
    const exams = useSelector((state) => state.student.exams.current);
    const fetchCurrentExams = () => fetchStudentExams(dispatch, "current");
    const { isFetching } = useSelector((state) => state.dashboard);

    return (
        <RefreshablePage
            title="Ongoing Exams"
            fetchExamFunction={fetchCurrentExams}
        >
            {isFetching ? (
                <Grid container spacing={4}>
                    {[...new Array(3)].map((_) => (
                        <Grid item xs={12} sm={6} md={4} lg={3}>
                            <Skeleton
                                variant="rectangular"
                                height={200}
                                animation="wave"
                            />
                        </Grid>
                    ))}
                </Grid>
            ) : exams.length > 0 ? (
                <ExamCardGrid exams={exams} />
            ) : (
                <Container maxWidth="xs">
                    <Stack spacing={4}>
                        <img
                            src={NoExamsImage}
                            alt="No Exams"
                            height="100%"
                            width="auto"
                        />
                        <Stack spacing={2}>
                            <Typography
                                variant="h4"
                                textAlign="center"
                                fontWeight="fontWeightBold"
                            >
                                No Ongoing Exams
                            </Typography>
                            <Typography variant="h6" textAlign="center">
                                All your exams will be listed here{" "}
                                <strong>once you are enrolled</strong> in an
                                exam .
                            </Typography>
                        </Stack>
                    </Stack>
                </Container>
            )}
        </RefreshablePage>
    );
};

export default OngoingExams;
