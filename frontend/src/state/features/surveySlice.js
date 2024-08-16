import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    survey: {
        id: 0,
        surveyTitle: 'Untitled Survey',
        description: 'No description',
        questions: [{
            id: 0,
            questionLabel: 'Question Label',
            type: 'Single Choice',
            isRequired: false,
            options: [{
                id: 0,
                optionLabel: 'Option Label'
            }]
        }]
    }
}

export const surveySlice = createSlice({
    name: 'survey',
    initialState,
    reducers: {
        initiateSurvey: (state, action) => {
            state.survey = action.payload
        },
        updateTitle: (state, action) => {
            state.survey.title = action.payload.title;
        }
    }
})

export const { initiateSurvey } = surveySlice.actions
export default surveySlice.reducer;