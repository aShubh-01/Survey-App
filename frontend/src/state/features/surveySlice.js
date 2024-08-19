import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { backendUrl } from '../../config';

async function createOption(questionId, optionLabel) {
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
                optionLabel
            }
        })
    
        return optionResponse.data.optionId
    } catch (err) {
        alert('Unable to create option')
        throw new Error('Unable to create option')
    }
}

async function createQuestion(surveyId, questionLabel, type) {
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
                questionLabel,
                type
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

export const addQuestionAsync = createAsyncThunk('survey/addQuestionAsync', async(payload) => {
    try {
        const questionId = await createQuestion(payload.surveyId, payload.questionLabel, payload.questionType);
        const optionId = await createOption(questionId, payload.optionLabel);

        return {
            id: questionId,
            questionLabel: payload.questionLabel,
            isRequired: false,
            isFocused: true,
            type: 'SINGLE_SELECT',
            options: [
                {id: optionId, optionLabel: payload.questionLabel}
            ]
        }
    } catch (err) {
        console.log(err)
        throw new Error('Failed to add question')
    }
});

export const addOptionAsync = createAsyncThunk('survey/addOptionAsync', async(payload) => {
    try {
        const response = await axios({
            url: `${backendUrl}/options`,
            method: 'POST',
            headers: {
                'Content-Type': "application/json",
                'Authorization': localStorage.getItem('queriousToken')
            },
            data: {
                questionId: payload.id,
                optionLabel: payload.optionLabel
            }
        })

        return {
            questionId: payload.id,
            id: response.data.optionId,
            optionLabel: payload.optionLabel
        }

    } catch (err) {
        console.log(err);
        throw new Error('Failed to add option');
    }
}) 

export const toggleRequirementAsync = createAsyncThunk('survey/toggleRequirementAsync', async(payload) => {
    try {
        const { questionId } = payload;

        const response = await axios({
            url: `${backendUrl}/questions/required/${questionId}`,
            method: 'PUT',
            headers: {
                'Content-Type': "application/json",
                'Authorization': localStorage.getItem('queriousToken')
            }
        })

        return { questionId, updatedRequirement: response.data.updatedRequirement}

    } catch (err) {
        console.log(err);
        throw new Error('Unable to toggle requirement')
    }
})

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

        setQuestionFocusesState: (state, action) => {
            state.survey.questions.forEach((question) => {
                question.isFocused = false
            })
        },

        setFocus: (state, action) => {
            const { payload: id } = action;
            state.survey.questions.forEach((question) => {
                if(question.id === id) {
                    question.isFocused = true
                } else {
                    question.isFocused = false
                }
            })
        },

        setTitle: (state, action) => {
            const { payload: title } = action;
            state.survey.surveyTitle = title;
        },

        setDescription: (state, action) => {
            const { payload: description } = action;
            state.survey.description = description;
        },

        setQuesionLabel: (state, action) => {
            const { payload: { id, questionLabel } } = action;
            const question = state.survey.questions.find(question => question.id === id);
            if(question) question.questionLabel = questionLabel;
        },

        setQuestionType: (state, action) => {
            const { payload: { id, type } } = action;
            for (let question of state.survey.questions) {
                if(question.id === id){
                    if(type === 'TEXT') question.options = []
                    question.type = type
                    break;
                }
            }
        },

        setOptionLabel: (state, action) => {
            const { payload: { questionId, optionId, optionLabel } } = action;

            const question = state.survey.questions.find(question => question.id === questionId);
            const option = question.options.find(option => option.id === optionId)
            option.optionLabel = optionLabel
        },

        deleteOption: (state, action) => {
            console.log(action.payload);
            const { payload: { questionId, optionId } } = action;

            state.survey.questions = state.survey.questions.map((question) => {
                if(question.id === questionId) {
                    return {
                        ...question,
                        options: question.options.filter((option) => option.id !== optionId)
                    }
                }
                return question
            })
        },

        deleteQuestion: (state, action) => {
            const { payload: { questionId } } = action;
            state.survey.questions = state.survey.questions.filter((question) => {
                if(question.id !== questionId) return question
            })
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addQuestionAsync.fulfilled, (state, action) => {
                state.survey.questions.forEach((question) => question.isFocused = false);
                state.survey.questions.push(action.payload);
            })
            .addCase(addOptionAsync.fulfilled, (state, action) => {
                const questions = state.survey.questions.find(question => question.id === action.payload.questionId)
                questions.options.push({id: action.payload.id, optionLabel: action.payload.optionLabel});
            })
            .addCase(toggleRequirementAsync.fulfilled, (state, action) => {
                const { payload: { questionId, updatedRequirement} } = action;
                state.survey.questions.filter((question) => {
                    if(question.id === questionId) question.isRequired =  updatedRequirement;
                })
            })
    }
})

export const { initiateSurvey, deleteQuestion, setQuestionFocusesState, setFocus, 
    setQuesionLabel, setQuestionType, setOptionLabel, deleteOption,
    setTitle, setDescription
} = surveySlice.actions

export default surveySlice.reducer;