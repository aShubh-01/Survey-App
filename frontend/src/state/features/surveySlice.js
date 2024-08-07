import { createSlice } from '@reduxjs/toolkit';

const initialSurveyState = {
    survey: {
        id: 0,
        surveyTitle: 'Untitled Survey',
        description: 'No description',
        questions: [{
            id: 0,
            questionLabel: 'Question Label',
            type: 'Multiple Choice',
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
    initialSurveyState,
    reducers: {
        addSurvey: (state, action) => {

        }
    }
})

export default surveySlice.reducer;