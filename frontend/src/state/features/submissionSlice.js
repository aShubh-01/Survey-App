import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
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
        
        return response.data;
    } catch (err) {
        console.log(err);
        throw new Error('Error', err);
    }
})

const initialState = {
    submissionSurvey: {
        isAlreadySubmitted: false,
        loading: false,
        data: null,
        error: null
    }
}

export const submissionSlice = createSlice({
    name: 'submission',
    initialState,
    reducers: {
        
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
                state.error = action.payload;
            })
    }
})

export default submissionSlice.reducer;