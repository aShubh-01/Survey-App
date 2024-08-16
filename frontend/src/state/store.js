import { configureStore, combineReducers } from '@reduxjs/toolkit';
import allSurveyReducers from './features/fetchSurveysSlice';
import surveyReducers from './features/surveySlice';
import questionFocusesReducers from './features/activeQuestionSlice';

const rootReducer = combineReducers({
    allSurveys: allSurveyReducers,
    survey: surveyReducers,
    questionFocuses: questionFocusesReducers
})

export const store = configureStore({
    reducer: rootReducer
})