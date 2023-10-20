import { select, call, put, takeLatest } from "redux-saga/effects";
import activityService from "./api";
import {activityActions} from "./data";



function* fetchActivities({payload}) {
    try {
        const offset = yield select((store) => store.activity.offset);

        const {data} = yield call(activityService.getActivities, offset, payload ?? 10);

        yield put(activityActions.fetchActivitiesSuccess(data));
    } catch (error) {
        yield put(activityActions.fetchActivitiesFailure(error));
    } finally {
        //yield put(toggleSpinner(false));
    }
}

function* fetchActivity({payload}) {
    try {
        //const {data} = yield call(activityService.getActivity, payload);
        const data = yield select((store)=> store.activity.data.find(a => a._id === payload));
        yield put(activityActions.fetchActivitySuccess(data));
    } catch (error) {
        yield put(activityActions.fetchActivityFailure(error));
    } finally {
        //yield put(toggleSpinner(false));
    }
}

export default function* activitySaga() {
    yield takeLatest(activityActions.fetchActivities.type, fetchActivities);
    yield takeLatest(activityActions.fetchActivity.type, fetchActivity);
}