import { createAsyncThunk } from '@reduxjs/toolkit'
import AxiosHelper from '../helpers/AxiosHelper'
import axios from "axios";
// của spotify
const CLIENT_ID = "1517c266c3f940ad9c9826a65577eaa9";
const CLIENT_SECRET = "f24bc1b5e1bf4eca8e5b772b81de1c79";

export const checkBanUser = createAsyncThunk(
  'user/checkBanUser',
  async (data, { rejectWithValue }) => {
    try {
      const response =
        await AxiosHelper(data.token)
          //.get('post/getMyPosts', data);
          .get(`user/checkBanUser?ID_user=${data.ID_user}`);
      //console.log(response)
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

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

export const loginGG = createAsyncThunk(
  'gg/loginGG',
  async (data, { rejectWithValue }) => {
    try {
      const response =
        await AxiosHelper()
          .post('gg/loginGG', data);
      //console.log(response)
      return response;
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
export const check_email = createAsyncThunk(
  'gg/check-email',
  async (data, { rejectWithValue }) => {
    try {
      const response =
        await AxiosHelper()
          //.get('post/getMyPosts', data);
          .get(`gg/check-email?uid=${data.uid}`);
      //console.log(response)
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

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

export const huyBanBe = createAsyncThunk(
  'relationship/huyBanBe',
  async (data, { rejectWithValue }) => {
    try {
      const response = await AxiosHelper()
        .post(`relationship/huyBanBe`, data);
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
export const addMembers = createAsyncThunk(
  'group/addMembers',
  async (data, { rejectWithValue }) => {
    try {
      const response = await AxiosHelper()
        .post('group/addMembers', data);
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
      console.log(response)
      return response;
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

// editBioOfUser
export const editBioOfUser = createAsyncThunk(
  'user/editBioOfUser',
  async (data, { rejectWithValue }) => {
    try {
      const response = await AxiosHelper()
        .post('user/editBioOfUser', data);
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
  'post/deletePost',
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

// post_reaction
// params: ID_post, ID_user, ID_reaction
export const addPost_Reaction = createAsyncThunk(
  'post_reaction/addPost_Reaction',
  async (data, { rejectWithValue }) => {
    try {
      const response = await AxiosHelper()
        .post('post_reaction/addPost_Reaction', data);
      //console.log(response?.message)
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// xóa post_reaction
// params: _id
export const deletePost_reaction = createAsyncThunk(
  'post_reaction/deletePost_reaction',
  async (data, { rejectWithValue }) => {
    try {
      const response = await AxiosHelper()
        .post('post_reaction/deletePost_reaction', data);
      //console.log(response?.message)
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Độ 
export const getChiTietPost = createAsyncThunk(
  'post/getChiTietPost',
  async (data, { rejectWithValue }) => {
    try {
      const response = await AxiosHelper(data.token)
        .get(`post/getChiTietPost?ID_post=${data.ID_post}`);
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

// params: ID_user, ID_post, content, ID_comment_reply
export const addComment = createAsyncThunk(
  'comment/addComment',
  async (data, { rejectWithValue }) => {
    try {
      const response = await AxiosHelper()
        .post('comment/addComment', data);
      return response;
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.message);
    }
  }
);

// params: ID_comment
export const setComment_destroyTrue = createAsyncThunk(
  'comment/setComment_destroyTrue',
  async (data, { rejectWithValue }) => {
    try {
      const response = await AxiosHelper()
        .post('comment/setComment_destroyTrue', data);
      //console.log(response)
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const setNoti_token = createAsyncThunk(
  'user/setNoti_token',
  async (data, { rejectWithValue }) => {
    try {
      const response = await AxiosHelper()
        .post('user/setNoti_token', data);
      //console.log(response)
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// params: ID_comment, ID_user, ID_reaction
export const addComment_Reaction = createAsyncThunk(
  'comment_reaction/addComment_Reaction',
  async (data, { rejectWithValue }) => {
    try {
      const response = await AxiosHelper()
        .post('comment_reaction/addComment_Reaction', data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// // xóa deleteComment_reaction
// // params: _id
export const deleteComment_reaction = createAsyncThunk(
  'comment_reaction/deleteComment_reaction',
  async (data, { rejectWithValue }) => {
    try {
      const response = await AxiosHelper()
        .post('comment_reaction/deleteComment_reaction', data);
      //console.log(response?.message)
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ****************** notification ****************

// params : me(ID_user)
export const getAllNotificationOfUser = createAsyncThunk(
  'notification/getAllNotificationOfUser',
  async (data, { rejectWithValue }) => {
    try {
      const response = await AxiosHelper(data.token)
        .get(`notification/getAllNotificationOfUser?me=${data.me}`);
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

// params : _id(ID_notification)
export const setStatusSeen = createAsyncThunk(
  'notification/setStatusSeen',
  async (data, { rejectWithValue }) => {
    try {
      const response = await AxiosHelper()
        .post('notification/setStatusSeen', data); 3
      //console.log(response?.message)
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Cảnh
// noti call video
// params : ID_group, ID_user, isCallVideo(true: callVideo, false: callAudio)
// return res.status(200).json({ "status": true, message: "Thông báo thành công" });
//return res.status(4001).json({ "status": false, message: "Không tìm thấy ID_group hoặc không tìm thấy các members khác" });
export const notiCallVideo = createAsyncThunk(
  'group/notiCallVideo',
  async (data, { rejectWithValue }) => {
    try {
      const response = await AxiosHelper()
        .post('group/notiCallVideo', data);
      //console.log(response)
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Tài
// noti livestream
// params : ID_livestream, ID_user
// return res.status(200).json({ "status": true, message: "Thông báo thành công" });
// return res.status(4001).json({ "status": false, message: "User không có bạn bè" });
export const notiLiveStream = createAsyncThunk(
  'post/notiLiveStream',
  async (data, { rejectWithValue }) => {
    try {
      const response = await AxiosHelper()
        .post('post/notiLiveStream', data);
      //console.log(response)
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ****************** report ****************

export const getAllReason = createAsyncThunk(
  'reason/getAllReason',
  async (data, { rejectWithValue }) => {
    try {
      const response = await AxiosHelper(data.token)
        .get(`reason/getAllReason`);
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

// Report post
// params : me, ID_post, ID_reason
export const addReport_post = createAsyncThunk(
  'report_post/addReport_post',
  async (data, { rejectWithValue }) => {
    try {
      const response = await AxiosHelper()
        .post('report_post/addReport_post', data);
      //console.log(response)
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


// Report user
// params :me, ID_user, ID_reason
export const addReport_user = createAsyncThunk(
  'report_user/addReport_user',
  async (data, { rejectWithValue }) => {
    try {
      const response = await AxiosHelper()
        .post('report_user/addReport_user', data);
      //console.log(response)
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


//***************** Story viewer */
// show tất cả story viewer của story
// params : ID_post, ID_user
export const storyViewerOfStory = createAsyncThunk(
  'storyViewer/addReport_user',
  async (data, { rejectWithValue }) => {
    try {
      const response = await AxiosHelper()
        .post('storyViewer/storyViewerOfStory', data);
      //console.log(response)
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// add reaction story
// params : ID_post, ID_user, ID_reaction
export const addStoryViewer_reaction = createAsyncThunk(
  'storyViewer/addReport_user',
  async (data, { rejectWithValue }) => {
    try {
      const response = await AxiosHelper()
        .post('storyViewer/addStoryViewer_reaction', data);
      //console.log(response)
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


//******************* OTP phone */

// gửi mã OTP phone
// params : phone
export const sendOTP_dangKi_phone = createAsyncThunk(
  'phone_otp/sendOTP_dangKi_phone',
  async (data, { rejectWithValue }) => {
    try {
      const response = await AxiosHelper()
        .post('phone_otp/sendOTP_dangKi_phone', data);
      //console.log(response)
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// xác thực otp có đúng không phone
// params : phone, otp
export const checkOTP_phone = createAsyncThunk(
  'phone_otp/checkOTP_phone',
  async (data, { rejectWithValue }) => {
    try {
      const response = await AxiosHelper()
        .post('phone_otp/checkOTP_phone', data);
      //console.log(response)
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// gửi mã OTP quên mật khẩu phone
// params : phone
export const sendOTP_quenMatKhau_phone = createAsyncThunk(
  'phone_otp/sendOTP_quenMatKhau_phone',
  async (data, { rejectWithValue }) => {
    try {
      const response = await AxiosHelper()
        .post('phone_otp/sendOTP_quenMatKhau_phone', data);
      //console.log(response)
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);



//******************* OTP gmail */

// gửi mã OTP gmail
// params : gmail
export const sendOTP_dangKi_gmail = createAsyncThunk(
  'gmail_otp/sendOTP_dangKi_gmail',
  async (data, { rejectWithValue }) => {
    try {
      const response = await AxiosHelper()
        .post('gmail_otp/sendOTP_dangKi_gmail', data);
      //console.log(response)
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// xác thực otp có đúng không gmail
// params : gmail, otp
export const checkOTP_gmail = createAsyncThunk(
  'gmail_otp/checkOTP_gmail',
  async (data, { rejectWithValue }) => {
    try {
      const response = await AxiosHelper()
        .post('gmail_otp/checkOTP_gmail', data);
      //console.log(response)
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// gửi mã OTP quên mật khẩu gmail
// params : gmail
export const sendOTP_quenMatKhau_gmail = createAsyncThunk(
  'gmail_otp/sendOTP_quenMatKhau_gmail',
  async (data, { rejectWithValue }) => {
    try {
      const response = await AxiosHelper()
        .post('gmail_otp/sendOTP_quenMatKhau_gmail', data);
      //console.log(response)
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//******************* Quên mật khẩu */

// "status": true, message: "Đổi password thành công"
// "status": false, message: "User không tồn tại"
// nhớ khi call check "status"
// params :  phone, passwordNew
export const quenMatKhau_phone = createAsyncThunk(
  'user/quenMatKhau_phone',
  async (data, { rejectWithValue }) => {
    try {
      const response = await AxiosHelper()
        .post('user/quenMatKhau_phone', data);
      //console.log(response)
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// "status": true, message: "Đổi password thành công"
// "status": false, message: "User không tồn tại"
// nhớ khi call check "status"
// params :  gmail, passwordNew
export const quenMatKhau_gmail = createAsyncThunk(
  'user/quenMatKhau_gmail',
  async (data, { rejectWithValue }) => {
    try {
      const response = await AxiosHelper()
        .post('user/quenMatKhau_gmail', data);
      //console.log(response)
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Gợi ý kết bạn
// params :  me
// "status": true, data: 
export const getGoiYBanBe = createAsyncThunk(
  'relationship/getGoiYBanBe',
  async (data, { rejectWithValue }) => {
    try {
      const response = await AxiosHelper(data.token)
        .get(`relationship/getGoiYBanBe?me=${data.me}`);
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
