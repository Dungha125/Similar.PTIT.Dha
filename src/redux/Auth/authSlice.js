import { createSlice } from '@reduxjs/toolkit';
import { userLogin } from './action';
import {UserRole} from "../../Pages/RoleMap";

const userToken = localStorage.getItem('userToken') || null;

const initialState = {
    loading: false,
    userInfo: null,
    userToken: userToken, // Initialize with value from localStorage
    error: null,
    success: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            localStorage.removeItem('userToken'); // deletes token from storage
            state.loading = false;
            state.userInfo = null;
            state.userToken = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(userLogin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(userLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.userToken = action.payload.userToken;
                state.userInfo = action.payload.userInfo;
                state.userRole = UserRole
                console.log(action);
                console.log(state.userToken);

            })
            .addCase(userLogin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;