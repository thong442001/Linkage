import { createSlice } from "@reduxjs/toolkit";
import { login } from "./API";

const initialState = {
    user: null, // thông tin user đăng nhập
    messageLogin: null,
    token: '', // token
    refreshToken: '',// refreshToken
};

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: { // chạy trong app

        resetToken: (state, action) => {
            state.token = action.payload;
            //console.log(state.token);
        },
        // Đăng xuất người dùng
        logout: (state) => {
            state.user = null;
        },
    },

    extraReducers: (builder) => {
        //login
        builder.addCase(login.pending, (state, action) => {
            console.log("...Pending login");
            state.messageLogin = null;
            state.token = '';
            state.refreshToken = '';
        });
        builder.addCase(login.fulfilled, (state, action) => {
            console.log("...fulfilled login");
            state.user = action.payload?.user;
            state.messageLogin = null;
            state.token = action.payload?.token;
            state.refreshToken = action.payload?.refreshToken;
            //console.log('>>>>>', action.payload?.refreshToken);
        });
        builder.addCase(login.rejected, (state, action) => {
            //console.log('=====>>>>>',action.payload);
            console.log("...Rejected login");
            state.user = null;
            state.messageLogin = action?.payload;
            state.token = '';
            state.refreshToken = '';
        });
    }
});

export const {
    resetToken,
    logout,

} = appSlice.actions;
export default appSlice.reducer;




