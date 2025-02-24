import { createAsyncThunk } from '@reduxjs/toolkit'
import AxiosHelper from '../helpers/AxiosHelper'

export const login = createAsyncThunk(
  'user/login',
  async (data, { rejectWithValue }) => {
    try {
      const response =
        await AxiosHelper()
          .post('user/login', data);
      //console.log(response)
      if (response.status == true) {
        return response;
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const register = createAsyncThunk(
  'user/register',
  async (data, { rejectWithValue }) => {
    try {
      const response =
        await AxiosHelper()
          .post('user/addUser', data)
      //console.log(response)
      if (response.status == true) {
        return response.message;
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
)

export const checkPhone = createAsyncThunk(
  'user/checkPhone',
  async (data, { rejectWithValue }) => {
    try {
      const response =
        await AxiosHelper()
          //.get('post/getMyPosts', data);
          .get(`user/checkPhone?phone=${data.phone}`);
      //console.log(response)
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const checkEmail = createAsyncThunk(
  'user/checkEmail',
  async (data, { rejectWithValue }) => {
    try {
      const response =
        await AxiosHelper()
          //.get('post/getMyPosts', data);
          .get(`user/checkEmail?email=${data.email}`);
      //console.log(response)
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getUser = createAsyncThunk(
  'user/getUser',
  async (data, { rejectWithValue }) => {
    try {
      const response = await AxiosHelper(data.token)
        .get(`user/getUser?userId=${data.userId}`);
      //console.log(response.status)
      if (response.status == true) {
        return response;
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/// test token
export const getAllUsers = createAsyncThunk(
  'user/getAllUsers',
  async (data, { rejectWithValue }) => {
    try {
      const response = await AxiosHelper(data.token)
        .get('user/getAllUsers', data);
      //console.log(response.status)
      if (response.status == true) {
        return response;
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/////////////  chat

// tham gia room socket hoặc tạo group
export const joinGroupPrivate = createAsyncThunk(
  'group/joinGroupPrivate',
  async (data, { rejectWithValue }) => {
    try {
      const response = await AxiosHelper()
        .post('group/joinGroupPrivate', data);
      //console.log(response)
      if (response.status == true) {
        return response;
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const addGroup = createAsyncThunk(
  'group/addGroup',
  async (data, { rejectWithValue }) => {
    try {
      const response = await AxiosHelper()
        .post('group/addGroup', data);
      //console.log(response)
      if (response.status == true) {
        console.log(response?.message)
        return response;
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getGroupID = createAsyncThunk(
  'group/getGroupID',
  async (data, { rejectWithValue }) => {
    try {
      const response = await AxiosHelper(data.token)
        .get(`group/getGroupID?ID_group=${data.ID_group}`);
      //console.log(response.status)
      if (response.status == true) {
        return response;
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getAllGroupOfUser = createAsyncThunk(
  'group/getAllGroupOfUser',
  async (data, { rejectWithValue }) => {
    try {
      const response = await AxiosHelper(data.token)
        .get(`group/getAllGroupOfUser?ID_user=${data.ID_user}`);
      //console.log(response.status)
      if (response.status == true) {
        return response;
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getMessagesGroup = createAsyncThunk(
  'message/getMessagesGroup',
  async (data, { rejectWithValue }) => {
    try {
      const response = await AxiosHelper(data.token)
        .get(`message/getMessagesGroup?ID_group=${data.ID_group}`);
      //console.log(response.status)
      if (response.status == true) {
        return response;
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const getAllReaction = createAsyncThunk(
  'reaction/getAllReaction',
  async (data, { rejectWithValue }) => {
    try {
      const response = await AxiosHelper()
        .get(`reaction/getAllReaction`);
      //console.log(response.status)
      if (response.status == true) {
        return response;
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ******* relationships *******

export const getRelationshipAvsB = createAsyncThunk(
  'relationship/getRelationshipAvsB',
  async (data, { rejectWithValue }) => {
    try {
      const response = await AxiosHelper()
        .post('relationship/getRelationshipAvsB', data);
      console.log(response)
      if (response.status == true) {
        return response;
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const guiLoiMoiKetBan = createAsyncThunk(
  'relationship/guiLoiMoiKetBan',
  async (data, { rejectWithValue }) => {
    try {
      const response = await AxiosHelper()
        .post(`relationship/guiLoiMoiKetBan`, data);
      //console.log(response.status)
      if (response.status == true) {
        return response;
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const chapNhanLoiMoiKetBan = createAsyncThunk(
  'relationship/chapNhanLoiMoiKetBan',
  async (data, { rejectWithValue }) => {
    try {
      const response = await AxiosHelper()
        .post(`relationship/chapNhanLoiMoiKetBan`, data);
      //console.log(response.status)
      if (response.status == true) {
        return response;
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const huyLoiMoiKetBan = createAsyncThunk(
  'relationship/huyLoiMoiKetBan',
  async (data, { rejectWithValue }) => {
    try {
      const response = await AxiosHelper()
        .post(`relationship/huyLoiMoiKetBan`, data);
      //console.log(response.status)
      if (response.status == true) {
        return response;
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getAllLoiMoiKetBan = createAsyncThunk(
  'relationship/getAllLoiMoiKetBan',
  async (data, { rejectWithValue }) => {
    try {
      const response = await AxiosHelper(data.token)
        .get(`relationship/getAllLoiMoiKetBan?me=${data.me}`);
      //console.log(response.status)
      if (response.status == true) {
        return response;
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getAllFriendOfID_user = createAsyncThunk(
  'relationship/getAllLoiMoiKetBan',
  async (data, { rejectWithValue }) => {
    try {
      const response = await AxiosHelper(data.token)
        .get(`relationship/getAllFriendOfID_user?me=${data.me}`);
      //console.log(response.status)
      if (response.status == true) {
        return response;
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// nhóm chat
export const addtMembers = createAsyncThunk(
  'group/addtMembers',
  async (data, { rejectWithValue }) => {
    try {
      const response = await AxiosHelper()
        .post('group/addtMembers', data);
      //console.log(response)
      if (response.status == true) {
        console.log(response?.message)
        return response;
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteMember = createAsyncThunk(
  'group/deleteMember',
  async (data, { rejectWithValue }) => {
    try {
      const response = await AxiosHelper()
        .post('group/deleteMember', data);
      //console.log(response)
      if (response.status == true) {
        console.log(response?.message)
        return response;
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const passKey = createAsyncThunk(
  'group/passKey',
  async (data, { rejectWithValue }) => {
    try {
      const response = await AxiosHelper()
        .post('group/passKey', data);
      //console.log(response)
      if (response.status == true) {
        console.log(response?.message)
        return response;
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteGroup = createAsyncThunk(
  'group/deleteGroup',
  async (data, { rejectWithValue }) => {
    try {
      const response = await AxiosHelper()
        .post('group/deleteGroup', data);
      //console.log(response)
      if (response.status == true) {
        console.log(response?.message)
        return response;
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const editAvtNameGroup = createAsyncThunk(
  'group/editAvtNameGroup',
  async (data, { rejectWithValue }) => {
    try {
      const response = await AxiosHelper()
        .post('group/editAvtNameGroup', data);
      //console.log(response)
      if (response.status == true) {
        console.log(response?.message)
        return response;
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// post
export const addPost = createAsyncThunk(
  'post/addPost',
  async (data, { rejectWithValue }) => {
    try {
      const response =
        await AxiosHelper()
          .post('post/addPost', data);
      //console.log(response)
      if (response.status == true) {
        return response;
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//allProfile
export const allProfile = createAsyncThunk(
  'post/allProfile',
  async (data, { rejectWithValue }) => {
    try {
      const response = await AxiosHelper()
        .post('post/allProfile', data);
      //console.log(response)
      if (response.status == true) {
        return response;
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// all post in home
export const getAllPostsInHome = createAsyncThunk(
  'post/getAllPostsInHome',
  async (data, { rejectWithValue }) => {
    try {
      const response = await AxiosHelper(data.token)
        .get(`post/getAllPostsInHome?me=${data.me}`);
      //console.log(response.status)
      if (response.status == true) {
        return response;
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


// Tài ( edit user)
export const editNameOfUser = createAsyncThunk(
  'user/editNameOfUser',
  async (data, { rejectWithValue }) => {
    try {
      const response = await AxiosHelper()
        .post('user/editNameOfUser', data);
      //console.log(response)
      if (response.status == true) {
        return response;
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const editAvatarOfUser = createAsyncThunk(
  'user/editAvatarOfUser',
  async (data, { rejectWithValue }) => {
    try {
      const response = await AxiosHelper()
        .post('user/editAvatarOfUser', data);
      //console.log(response)
      if (response.status == true) {
        return response;
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const editBackgroundOfUser = createAsyncThunk(
  'user/editBackgroundOfUser',
  async (data, { rejectWithValue }) => {
    try {
      const response = await AxiosHelper()
        .post('user/editBackgroundOfUser', data);
      //console.log(response)
      if (response.status == true) {
        return response;
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// "status": true, message: "Đổi password thành công"
// "status": false, message: "Sai mật khẩu cũ"
// nhớ khi call check "status"
export const editPasswordOfUser = createAsyncThunk(
  'user/editPasswordOfUser',
  async (data, { rejectWithValue }) => {
    try {
      const response = await AxiosHelper()
        .post('user/editPasswordOfUser', data);
      //console.log(response)
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);



// Qthong

// đổi _destroy ( api này dùng cho xóa bài post và phục hồi bài post)
// params: _id
export const changeDestroyPost = createAsyncThunk(
  'post/changeDestroyPost',
  async (data, { rejectWithValue }) => {
    try {
      const response = await AxiosHelper()
        .post('post/changeDestroyPost', data);
      //console.log(response)
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Xóa vĩnh viễn bài post 
// params: _id
export const deletePost = createAsyncThunk(
  'post/changeDestroyPost',
  async (data, { rejectWithValue }) => {
    try {
      const response = await AxiosHelper()
        .post('post/deletePost', data);
      //console.log(response)
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// api lấy các bài post user đã xóa (trang thùng rác)
// params: {
// me: ID_user(_id của mình trong user._id redux) 
// token: token(APT get phải chuyền token trong params) 
// response.posts
export const getPostsUserIdDestroyTrue = createAsyncThunk(
  'post/getPostsUserIdDestroyTrue',
  async (data, { rejectWithValue }) => {
    try {
      const response = await AxiosHelper(data.token)
        .get(`post/getPostsUserIdDestroyTrue?me=${data.me}`);
      //console.log(response.status)
      if (response.status == true) {
        return response;
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);