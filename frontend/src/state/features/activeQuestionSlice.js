import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    questionFocuses: [
        {id: 1, isFocused: true}
    ]
}

export const questionFocusesSlice = createSlice({
    name: 'questionFocuses',
    initialState,
    reducers: {
        setQuestionFocusesState: (state, action) => {
            state.questionFocuses = action.payload
        },

        setFocus: (state, action) => {
            state.questionFocuses.filter((question) => {
                if(question.id === action.payload) {
                    question.isFocused = true
                } else {
                    question.isFocused = false
                }
            })
        }
    }
})

export const { setFocus, setQuestionFocusesState } = questionFocusesSlice.actions;
export default questionFocusesSlice.reducer;

