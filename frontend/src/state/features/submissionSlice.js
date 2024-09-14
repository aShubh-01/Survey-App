import { createSlice, createAsyncThunk, current } from '@reduxjs/toolkit';
import { backendUrl } from '../../config'
import axios from 'axios';

export const fetchSurveyAsync = createAsyncThunk('submission/fetchSurvey', async (payload) => {
    const { surveyId } = payload;

    try {
        const response = await axios({
            url: `${backendUrl}/surveys/${surveyId}`,
            method: 'GET',
            headers: {
                'Content-Type': "application/json",
                'Authorization': localStorage.getItem('queriousToken')
            }
        })

        if(response.data.survey) {
            response.data.survey.questions.forEach((question) => {
                if(question.type !== 'TEXT') {
                    question.options = question.options.map((option) => ({
                        ...option,
                        isChecked: false,
                    }))
                }
                else if(question.type === 'TEXT') {
                    delete question.options;
                    question.answer = ""
                }
            })

            const userResponse = response.data.survey.questions.map((question) => {
                const answer = (question.type === 'TEXT' ? "" : (question.type === 'MULTIPLE_SELECT' ? [] : null))
                return {
                    questionId: question.id,
                    type: question.type,
                    answer: answer
                }
            })

            response.data.submissionPayload = {
                surveyId: response.data.survey.id,
                isAnonymous: false,
                userResponse: userResponse
            }
        }

        return response.data

    } catch (err) {
        console.log(err);
        throw new Error('Error', err);
    }
})

const initialState = {
    loading: false,
    data: null,
    error: null
}

export const submissionSlice = createSlice({
    name: 'submission',
    initialState,
    reducers: {
        editAnswer: (state, action) => {
            const { questionId, questionType, optionId, isChecked, userAnswer } = action.payload;

            const questionIndex = state.data.survey.questions.findIndex(q => q.id == questionId)

            if(questionType === 'TEXT') {
                state.data.survey.questions[questionIndex].answer = userAnswer;
                state.data.submissionPayload.userResponse[questionIndex].answer = userAnswer;

            } else {
                const optionIndex = state.data.survey.questions[questionIndex].options.findIndex(op => op.id == optionId)
            
                switch(questionType) {
                    case 'SINGLE_SELECT': {
                        state.data.survey.questions[questionIndex].options = state.data.survey.questions[questionIndex].options.map((option) => ({
                            ...option, 
                            isChecked: false
                        }))
                        state.data.survey.questions[questionIndex].options[optionIndex].isChecked = true
                        state.data.submissionPayload.userResponse[questionIndex].answer = optionId
                        
                    } break;
    
                    case 'MULTIPLE_SELECT': {
                        const answers = state.data.submissionPayload.userResponse[questionIndex].answer;
                        if(isChecked) {
                            state.data.survey.questions[questionIndex].options[optionIndex].isChecked = false;
                            state.data.submissionPayload.userResponse[questionIndex].answer = answers.filter(answer => answer != optionId)
                        } else {
                            state.data.survey.questions[questionIndex].options[optionIndex].isChecked = true;
                            answers.push(optionId)
                            state.data.submissionPayload.userResponse[questionIndex].answer = answers
                        }
                    } break;
                }
            }

            console.log(current(state))
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSurveyAsync.pending, (state, action) => {
                state.loading = true;
                state.data = null;
                state.error = null;
            })
            .addCase(fetchSurveyAsync.fulfilled, (state, action) => {
                state.loading = false;
                if(action.payload.message === 'Response Already Submitted') {
                    state.isAlreadySubmitted = true
                } else {
                    state.data = action.payload;
                }
            })
            .addCase(fetchSurveyAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = true
            })
    }
})

export const { editAnswer } = submissionSlice.actions
export default submissionSlice.reducer;