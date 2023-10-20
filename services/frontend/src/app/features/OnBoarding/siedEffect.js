import { select, call, put, takeLatest } from "redux-saga/effects";
import boardingService from "./api";
import {boardingActions} from "./data";

function* fetchOnBoardings({payload}) {
    try {
        const {data} = yield call(boardingService.getOnBoardings,payload);
        yield put(boardingActions.fetchSuccess(data));
    } catch (error) {
        yield put(boardingActions.fetchFailure(error));
    } finally {
        //yield put(toggleSpinner(false));
    }
}


export default function* boardingSaga() {
    yield takeLatest(boardingActions.fetch.type, fetchOnBoardings);
}