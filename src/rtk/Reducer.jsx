import {createSlice} from '@reduxjs/toolkit';
import {login} from './API';

const initialState = {
  user: null,
  messageLogin: null,
  token: '',
  refreshToken: '',
  reactions: null,
  // stories: {},
  history: [],
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    changeName: (state, action) => {
      state.user.first_name = action.payload.first_name;
      state.user.last_name = action.payload.last_name;
    },
    changeAvatar: (state, action) => {
      state.user.avatar = action.payload;
    },
    changeBackground: (state, action) => {
      state.user.background = action.payload;
    },
    resetToken: (state, action) => {
      state.token = action.payload;
    },

    logout: state => {
      state.user = null;
      state.token = '';
      state.refreshToken = '';
      state.stories = []; // Xóa luôn danh sách stories khi logout
    },

    setReactions: (state, action) => {
      state.reactions = action.payload;
    },

    addStory: (state, action) => {
      if (!action.payload) {
        console.error('addStory: action.payload is undefined!');
        return;
      }
      console.log('Adding story:', action.payload);
      state.stories = [...(state.stories || []), action.payload];
    },

    removeStory: (state, action) => {
      if (!state.stories || !Array.isArray(state.stories)) {
        console.error('removeStory: state.stories is not an array!');
        return;
      }
      console.log('Removing story with ID:', action.payload);
      state.stories = state.stories.filter(
        story => story?.id !== action.payload,
      );
    },
    addSearch: (state, action) => {
        const user = action.payload;
        if (!user || !user._id) return;
    
        //  Đảm bảo `state.history` luôn là mảng
        if (!Array.isArray(state.history)) {
            state.history = [];
        }
    
        // Loại bỏ user cũ nếu đã tồn tại
        state.history = state.history.filter((item) => item._id !== user._id);
    
        // Chỉ giữ tối đa 10 phần tử
        state.history = [user, ...state.history].slice(0, 10);
    },
    
    removeSearch: (state, action) => {
        //  Đảm bảo `state.history` không bị undefined
        if (!Array.isArray(state.history)) {
            state.history = [];
        }
        state.history = state.history.filter(item => item._id !== action.payload);
    },
    
    clearHistory: state => {
        //  Đảm bảo xóa lịch sử không bị lỗi
        state.history = [];
    },
  },

  extraReducers: builder => {
    builder.addCase(login.pending, state => {
      console.log('...Pending login');
      state.messageLogin = null;
      state.token = '';
      state.refreshToken = '';
    });

    builder.addCase(login.fulfilled, (state, action) => {
      console.log('...Fulfilled login', action.payload);
      state.user = action.payload?.user || null;
      state.token = action.payload?.token || '';
      state.refreshToken = action.payload?.refreshToken || '';
    });

    builder.addCase(login.rejected, (state, action) => {
      console.log('...Rejected login', action?.payload);
      state.user = null;
      state.messageLogin = action?.payload || 'Login failed';
      state.token = '';
      state.refreshToken = '';
    });
  },
});

export const {
  resetToken,
  logout,
  setReactions,
  addStory,
  removeStory,
  changeName,
  changeAvatar,
  changeBackground,
  addSearch,removeSearch,clearHistory

} = appSlice.actions;
export default appSlice.reducer;
