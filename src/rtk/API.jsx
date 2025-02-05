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

// export const myPost = createAsyncThunk(
//   'post/getMyPosts',
//   async (data, { rejectWithValue }) => {
//     try {
//       const response =
//         await AxiosHelper()
//           //.get('post/getMyPosts', data);
//           .get(`post/getMyPosts?userId=${data.userId}`);
//       //console.log(response)
//       if (response.status == true) {
//         return response;
//       } else {
//         return rejectWithValue(response.data.message);
//       }
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// /// test token
// export const getAllUsers = createAsyncThunk(
//   'user/getAllUsers',
//   async (data, { rejectWithValue }) => {
//     try {
//       const response =
//         await AxiosHelper()
//           .get('user/getAllUsers', data);
//       //console.log(response)
//       if (response.status == true) {
//         return response;
//       } else {
//         return rejectWithValue(response.data.message);
//       }
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// export const addPost = createAsyncThunk(
//   'post/addPost',
//   async (data, { rejectWithValue }) => {
//     try {
//       const response =
//         await AxiosHelper()
//           .post('post/add', data);
//       //console.log(response)
//       if (response.status == true) {
//         return response;
//       } else {
//         return rejectWithValue(response.data.message);
//       }
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );




