import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { backendUrl } from '../../config';

async function createOption(questionId) {
    try {
        const optionResponse = await axios({
            url: `${backendUrl}/options`,
            method: 'POST',
            headers: {
                'Authorization': localStorage.getItem('queriousToken'),
                'Content-Type': "application/json"
            },
            data: {
                questionId,
                optionLabel: 'Untitled Option'
            }
        })
    
        return optionResponse.data.optionId
    } catch (err) {
        alert('Unable to create option')
        throw new Error('Unable to create option')
    }
}

async function createQuestion(surveyId) {
   try {
        const questionResponse = await axios({
            url: `${backendUrl}/questions`,
            method: 'POST',
            headers: {
                'Authorization': localStorage.getItem('queriousToken'),
                'Content-Type': "application/json"
            },
            data: {
                surveyId,
                questionLabel: 'Untitled Question',
                type: 'SINGLE_SELECT'
            }
        })

        return questionResponse.data.questionId;
    } catch (err) {
        alert('Unable to create question')
        throw new Error('Unable to create question')
    }
}

async function createSurvey() {
   try {
        const surveyResponse = await axios({
            url: `${backendUrl}/surveys`,
            method: 'POST',
            headers: {
                'Authorization': localStorage.getItem('queriousToken'),
                'Content-Type': "application/json"
            },
            data: {
                surveyTitle: 'Untitled Survey'
            }
        }) 

        return surveyResponse.data.surveyId
    } catch (err) {
        alert('Unable to create survey')
        throw new Error('Unable to create survey')    
    }
}

export const addQuestionAsync = createAsyncThunk('survey/addQuestionAsync', async(payload, { getState }) => {
    const { survey: { survey } } = getState();
    try {
        const questionId = await createQuestion(survey.id);
        const optionId = await createOption(questionId);

        console.log({
            id: questionId,
            questionLabel: 'Untitled Question',
            isRequired: false,
            type: 'SINGLE_SELECT',
            options: [
                {id: optionId, optionLabel: 'Untitled Option'}
            ]
        })

        return {
            id: questionId,
            questionLabel: 'Untitled Question',
            isRequired: false,
            type: 'SINGLE_SELECT',
            options: [
                {id: optionId, optionLabel: 'Untitled Option'}
            ]
        }
    } catch (err) {
        console.log(err)
        throw new Error('Failed to add question')
    }
});

const initialState = {
    survey: {
        id: 0,
        surveyTitle: 'Untitled Survey',
        description: '',
        questions: [{
            id: 0,
            questionLabel: 'Untitled Question',
            type: 'SINGLE_SELECT',
            isRequired: false,
            options: [{
                id: 0,
                optionLabel: 'Untitled Option'
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
        },

        updateDescription: (state, action) => {
            state.survey.description = action.payload.description;
        },

        setQuestionFocusesState: (state, action) => {
            state.survey.questions.forEach((question) => {
                question.isFocused = false
            })
        },

        setFocus: (state, action) => {
            state.survey.questions.filter((question) => {
                if(question.id === action.payload) {
                    question.isFocused = true
                } else {
                    question.isFocused = false
                }
            })
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addQuestionAsync.pending, (state) => {
                state.survey.loading = true;
                state.survey.error = null;
            })
            .addCase(addQuestionAsync.rejected, (state, action) => {
                state.survey.loading = false;
                state.survey.error = action.payload;
                alert('Unable to add new question')
            })
            .addCase(addQuestionAsync.fulfilled, (state, action) => {
                console.log(action.payload);
                delete state.survey.loading
                delete state.survey.error
                state.survey.questions.push(action.payload);
            })
    }
})

export const { initiateSurvey, addQuestion, setQuestionFocusesState, setFocus } = surveySlice.actions
export default surveySlice.reducer;