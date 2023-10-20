import { all, fork } from "redux-saga/effects";
import myCoursesSaga from '../MyCourses/sideEffects';
import coursesManageSaga from '../CourseManage/sideEffects';
import activitySaga from '../Activity/sideEffects';
import boardingSaga from '../OnBoarding/siedEffect';
import userSettingsSaga from "../UserSettings/sideEffects";

const combinedSagas = [
    fork(myCoursesSaga),
    fork(coursesManageSaga),
    fork(activitySaga),
    fork(boardingSaga),
    fork(userSettingsSaga),
];

export default function* rootSaga() {
    yield all(combinedSagas);
}