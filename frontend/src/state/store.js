import { configureStore, combineReducers } from '@reduxjs/toolkit';
import allSurveyReducer from './features/fetchSurveysSlice';

const rootReducer = combineReducers({
    allSurveys: allSurveyReducer
})

export const store = configureStore({
    reducer: rootReducer
})