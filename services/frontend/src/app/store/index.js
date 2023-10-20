import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import rootSaga from "../features/root/rootSaga";
import {rootReducer} from "../features/root/rootReducer";

const sagaMiddleware = createSagaMiddleware();

export const store =  configureStore({
    reducer: rootReducer,
    middleware: [sagaMiddleware],
});

sagaMiddleware.run(rootSaga);

/** do not change anything in this file **/