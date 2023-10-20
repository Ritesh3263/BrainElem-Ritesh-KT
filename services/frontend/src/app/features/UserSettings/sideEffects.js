import { select, call, put, takeLatest } from "redux-saga/effects";
import userSettingsService from "./api";
import {userSettingsActions} from "./data";

function* fetchConnectedDevices({payload}){
    try{
        const {data} = yield call(userSettingsService.getConnectedDevices);
        yield put(userSettingsActions.fetchConnectedDevicesSuccess(data));
    }catch (err){
        yield put(userSettingsActions.fetchFailure(err));
    }
}

function* updateDevice({payload}){
    try{
        const {data} = yield call(userSettingsService.updateConnectedDevice,payload);
        yield put(userSettingsActions.updateDeviceSuccess(data));
        yield put(userSettingsActions.fetchConnectedDevices());
    }catch (err){
        yield put(userSettingsActions.fetchFailure(err));
    }
}

function* removeDevice({payload}){
    try{
        const {data} = yield call(userSettingsService.removeConnectedDevice,payload);
        yield put(userSettingsActions.removeDeviceSuccess(data));
        yield put(userSettingsActions.fetchConnectedDevices());
    }catch (err){
        yield put(userSettingsActions.fetchFailure(err));
    }
}

export default function* userSettingsSaga(){
    yield takeLatest(userSettingsActions.fetchConnectedDevices.type,fetchConnectedDevices)
    yield takeLatest(userSettingsActions.updateDevice.type,updateDevice)
    yield takeLatest(userSettingsActions.removeDevice.type,removeDevice)
}
