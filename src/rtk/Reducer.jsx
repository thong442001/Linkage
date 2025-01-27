import { createSlice } from "@reduxjs/toolkit";
import { login } from "./API";

const initialState = {
    theme: true,// true: light - false: dark
    language: true,// true: ENG - false: VN
    user: null, // thông tin user đăng nhập
    messageLogin: null,
    token: '', // token
    refreshToken: '',// refreshToken

    // user test
    userTest: null,
};

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: { // chạy trong app

        // user test
        loginTest: (state) => {
            state.userTest = 1;
        },
        logoutTest: (state) => {
            state.userTest = null;
        },

        resetToken: (state, action) => {
            state.token = action.payload;
            //console.log(state.token);
        },
        // Đăng xuất người dùng
        logout: (state) => {
            state.user = null;
        },
        setTheme: (state) => {
            state.theme = !state.theme;
            ///console.log(state.theme);
        },
        setLanguage: (state) => {
            state.language = !state.language;
            ///console.log(state.language);
        }
    },

    extraReducers: (builder) => {
        //login
        builder.addCase(login.pending, (state, action) => {
            console.log("...Pending login");
            state.messageLogin = null;
            state.token = '';
            state.refreshToken = '';
            state.theme = true;
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
    setTheme,
    setLanguage,
    loginTest,
    logoutTest,
} = appSlice.actions;
export default appSlice.reducer;




