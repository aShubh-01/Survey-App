import { configureStore, combineReducers } from '@reduxjs/toolkit';
import submissionReducers from './features/submissionSlice';
import allSurveyReducers from './features/fetchSurveysSlice';
import surveyReducers from './features/surveySlice';

const rootReducer = combineReducers({
    allSurveys: allSurveyReducers,
    survey: surveyReducers,
    submission: submissionReducers
})

export const store = configureStore({
    reducer: rootReducer
})