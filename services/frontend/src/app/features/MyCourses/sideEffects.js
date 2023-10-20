import { select, call, put, takeEvery, takeLatest } from "redux-saga/effects";
import myCoursesService from "./api";
import {myCourseActions} from "./data"

// select -> select data from store (slice)
// call -> performs asynchronous fetch request
// put -> dispattch actions
// takeEvery -> perform every one event
// takeLatest -> take last event

function* fetchMyCourses({payload}) {
    try {
        const offset = yield select((store) => store.myCourses.offset);

        const data = yield call(myCoursesService.getAll, offset, payload ?? 10);

        yield put(myCourseActions.fetchSuccess(data));
    } catch (error) {
        yield put(myCourseActions.fetchFailure(error));
    } finally {
        //yield put(toggleSpinner(false)); // turn of ui feature spinner
    }
}

function* fetchCourseItem({payload}) {
    try {
        const {data} = yield call(myCoursesService.getItem, payload);

        yield put(myCourseActions.fetchItemSuccess(data));
    } catch (error) {
        yield put(myCourseActions.fetchFailure(error));
    }
}

function* fetchCourseItemDetails({payload}) {
    try {
        const {data} = yield call(myCoursesService.getItemDetails, payload);
        yield put(myCourseActions.fetchItemDetailsSuccess(data));
    } catch (error) {
        yield put(myCourseActions.fetchFailure(error));
    }
}

function* fetchChapters({payload}) {
    try {
        const {data} = yield call(myCoursesService.getChapters, payload);
        yield put(myCourseActions.fetchChaptersSuccess(data));
    } catch (error) {
        yield put(myCourseActions.fetchFailure(error));
    }
}

function* fetchContents({payload}) {
    try {
        const {data} = yield call(myCoursesService.getContents, payload);
        yield put(myCourseActions.fetchContentsSuccess(data));
    } catch (error) {
        yield put(myCourseActions.fetchContentsSuccess([]));
        yield put(myCourseActions.fetchFailure(error));
    }
}

export default function* myCoursesSaga() {
    yield takeLatest(myCourseActions.fetch.type, fetchMyCourses);
    yield takeLatest(myCourseActions.fetchItem.type, fetchCourseItem);
    yield takeLatest(myCourseActions.fetchItemDetails.type, fetchCourseItemDetails);
    yield takeLatest(myCourseActions.fetchChapters.type, fetchChapters);
    yield takeLatest(myCourseActions.fetchContents.type, fetchContents);
}
