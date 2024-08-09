<<<<<<< HEAD
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({});
=======
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import allSurveyReducer from './features/fetchSurveysSlice';

const rootReducer = combineReducers({
    allSurveys: allSurveyReducer
})

export const store = configureStore({
    reducer: rootReducer
})
>>>>>>> 745ff16 (Added styling and colours to dashboard component)
