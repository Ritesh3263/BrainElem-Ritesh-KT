import { combineReducers } from "@reduxjs/toolkit";
import myCourseReducer from '../MyCourses/data';
import courseManageReducer from '../CourseManage/data';
import activityReducer from '../Activity/data';
import boardingReducer from '../OnBoarding/data';
import userSettingsReducer from "../UserSettings/data";
import contentFactoryReducer from "../ContentFactory/data";
import exploreReducer from "../Explore/data";

export const rootReducer = combineReducers({
    myCourses: myCourseReducer,
    courseManage: courseManageReducer,
    activity: activityReducer,
    boarding: boardingReducer,
    userSettings: userSettingsReducer,
    contentFactory: contentFactoryReducer,
    explore: exploreReducer,
});