import { configureStore, combineReducers } from '@reduxjs/toolkit';
import submissionReducers from './features/submissionSlice';
import allSurveyReducers from './features/fetchSurveysSlice';
import surveyReducers from './features/surveySlice';
import acceptResponsesReducers from './features/analyseSurvey';
import analyseSurvey from './features/analyseSurvey';

const rootReducer = combineReducers({
    analyseSurvey: acceptResponsesReducers,
    allSurveys: allSurveyReducers,
    survey: surveyReducers,
    submission: submissionReducers
})

export const store = configureStore({
    reducer: rootReducer
})