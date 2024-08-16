import { configureStore, combineReducers } from '@reduxjs/toolkit';
import allSurveyReducers from './features/fetchSurveysSlice';
import surveyReducers from './features/surveySlice';

const rootReducer = combineReducers({
    allSurveys: allSurveyReducers,
    survey: surveyReducers
})

export const store = configureStore({
    reducer: rootReducer
})