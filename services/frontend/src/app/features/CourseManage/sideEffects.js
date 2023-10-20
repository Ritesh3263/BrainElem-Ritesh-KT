import { select, call, put, takeLatest } from "redux-saga/effects";
import courseManageService from "./api";
import {courseManageActions} from "./data";

function* fetchChapters({payload}) {
    try {
        const offset = yield select((store) => store.courseManage.offset);

        const {data} = yield call(courseManageService.getChapters, offset, payload ?? 10);

        yield put(courseManageActions.fetchSuccess(data));
    } catch (error) {
        yield put(courseManageActions.fetchFailure(error));
    } finally {
        //yield put(toggleSpinner(false));
    }
}

function* fetchContent({payload}) {
    try {
        const {data} = yield call(courseManageService.getContent, payload);

        yield put(courseManageActions.fetchContentSuccess(data));
    } catch (error) {
        yield put(courseManageActions.fetchContentFailure(error));
    } finally {
        //yield put(toggleSpinner(false));
    }
}

function* fromOutsideOpen({payload:{chapterIndex, chapterId, contentIndex, contentId}}) {
    try {
        const {data} = yield call(courseManageService.getChapters, 0,chapterId);
        yield put(courseManageActions.fetchSuccess(data));
    } catch (error) {
        yield put(courseManageActions.fetchFailure(error));
    } finally {
        //yield put(toggleSpinner(false));
    }

    try {
        // const {data} = yield call(courseManageService.getContent, contentId);
        // yield put(courseManageActions.fetchContentSuccess(data));

        yield put(courseManageActions.openItemHelper({
            type:'OPEN_FROM_OUTSIDE',
            payload: {isOpenChapter: true, chapterIndex, chapterId, contentIndex, contentId}
        }));
    } catch (error) {
        //yield put(courseManageActions.fetchContentFailure(error));
    } finally {
        //yield put(toggleSpinner(false));
    }
}

function* doneItem({payload}) {
    try {
        const {data} = yield call(courseManageService.doneItem, payload);
        // => return list wit updated items isDone state and calculated progress
        //yield put(courseManageActions.doneItemSuccess(data));
    } catch (error) {
        // yield put(courseManageActions.doneItemFailure(error));
    } finally {
        //yield put(toggleSpinner(false));
    }
}

function* endCourse({payload}) {
    try {
        const {data} = yield call(courseManageService.endCourse, payload);
        // => return list wit updated items isDone state and calculated progress
        //yield put(courseManageActions.endCourseSuccess(data));
    } catch (error) {
        //yield put(courseManageActions.endCourseFailure(error));
    } finally {
        //yield put(toggleSpinner(false));
    }
}

export default function* coursesManageSaga() {
    yield takeLatest(courseManageActions.fetch.type, fetchChapters);
    yield takeLatest(courseManageActions.fetchContent.type, fetchContent);
    yield takeLatest(courseManageActions.fromOutsideOpen.type, fromOutsideOpen);
    yield takeLatest(courseManageActions.doneItem.type, doneItem);
    yield takeLatest(courseManageActions.endCourse.type, endCourse);
}