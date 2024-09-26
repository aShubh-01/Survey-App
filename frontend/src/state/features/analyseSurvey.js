import { createSlice } from '@reduxjs/toolkit';

const acceptResponsesSlice = createSlice({
    name: 'acceptResponses',
    initialState: {},
    reducers: {
        setIsClosed: (state, action) => {
            const { isClosed } = action.payload;
            state.isClosed = isClosed
        }
    }
})

export const { setIsClosed } = acceptResponsesSlice.actions;
export default acceptResponsesSlice.reducer;