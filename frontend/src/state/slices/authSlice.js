import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
    userEmail: ''
}

export const emailSlice = createSlice({
    name: 'email',
    initialState,
    reducers: {
        saveEmail: () => {}
    }
});