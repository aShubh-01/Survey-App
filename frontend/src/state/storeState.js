import { configureStore } from '@reduxjs/toolkit';
import surveyReducers from './features/surveySlice';
import axios from 'axios';

export const store = configureStore({
    reducer: surveyReducers
})