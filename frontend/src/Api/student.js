import {
    FETCH_CURRENT_EXAM_URL,
    FETCH_PAST_EXAM_URL,
    FETCH_UPCOMING_EXAM_URL,
} from "../Constants/urls";
import { setDashboardFetching } from "../Features/dashboardSlice";
import {
    setCurrentExams,
    setHistoryExams,
    setUpcomingExams,
} from "../Features/studentSlice";
import { userRequest } from "../requestMethods";
import { snackActions } from "../Utils/SnackBarUtils";

export const fetchStudentExams = (dispatch, time) => {
    dispatch(setDashboardFetching(true));
    // Timeout to prevent loading bar vanishing too fast
    setTimeout(async () => {
        try {
            let choice;
            let setter;
            switch (time) {
                case "upcoming":
                    choice = FETCH_UPCOMING_EXAM_URL;
                    setter = setUpcomingExams;
                    break;
                case "history":
                    choice = FETCH_PAST_EXAM_URL;
                    setter = setHistoryExams;
                    break;
                case "current":
                    choice = FETCH_CURRENT_EXAM_URL;
                    setter = setCurrentExams;
                    break;
                default:
                    break;
            }
            const res = await userRequest.get(choice);
            dispatch(setter(res.data));
        } catch (error) {
            console.log(error);
            snackActions.error(error.response.data);
        } finally {
            dispatch(setDashboardFetching(false));
        }
    }, 1000);
};
