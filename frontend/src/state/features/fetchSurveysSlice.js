import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { backendUrl } from '../../config';
import axios from 'axios';

export const fetchAllSurveys = createAsyncThunk('allSurveys/fetchData', async () => {
    
    try {
        const response = await axios({
            url: `${backendUrl}/surveys/all`,
            method: 'GET',
            headers: {
                'Content-Type': "application/json",
                'Authorization': localStorage.getItem('queriousToken')
            }
        })
    
        const allSurveys = response.data.allSurveys;
        const publishedSurveys = allSurveys.filter((survey) => survey.isPublished)
        const unpublishedSurveys = allSurveys.filter((survey) => !survey.isPublished)
        return { publishedSurveys, unpublishedSurveys }
    } catch (err) {
        console.log(err);
        throw new Error("Unable to fetch surveys")
    }
})

const initialState = {
    loading: true,
    data: null,
    error: null
}

export const allSurveysSlice = createSlice({
    name: 'allSurveys',
    reducers: {},
    initialState,
    extraReducers: (builder) => {
        builder
        .addCase(fetchAllSurveys.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchAllSurveys.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
            state.error = null;
        })
        .addCase(fetchAllSurveys.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
    }
})

export default allSurveysSlice.reducer;