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
            console.log("payload", action.payload);

            for (let question of state.survey.questions) {
                console.log('1')
                if(question.id === questionId) {
                    console.log('2')
                    for(let option of question.options) {
                        console.log('3')
                        if(option.id === optionId) {
                            console.log("before", option.optionLabel)
                            option.optionLabel = optionLabel;
                            console.log("after", option.optionLabel)
                            break;
                        }
                    }
                    break;
                }
            }
        },

        deleteOption: (state, action) => {
            const { payload: { questionId, optionId } } = action;
            state.survey.questions = state.survey.questions.filter((question) => {
                if(question.id === questionId) question.options = question.options.filter((option) => {
                    if(option.id !== optionId ) return option
                })
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
                state.survey.questions.push(action.payload);
            })
    }
})

export const { initiateSurvey, deleteQuestion, setQuestionFocusesState, setFocus, 
    setQuesionLabel, setQuestionType, setOptionLabel, deleteOption,
    setTitle, setDescription
} = surveySlice.actions

export default surveySlice.reducer;