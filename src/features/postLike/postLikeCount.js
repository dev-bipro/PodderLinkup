import { createSlice } from '@reduxjs/toolkit'

export const postLikeCount = createSlice({
  name: 'postLike',
  initialState: {
    likePostId: "",
    likePostLike: [],
  },
  reducers: {
    setPostId: (state,action) => {
        state.likePostId = action.payload ;
    },
    likeCount: (state,action) => {
        state.likePostId = action.payload ;
    },
  },
})

// Action creators are generated for each case reducer function
export const { setPostId, likeCount } = postLikeCount.actions

export default postLikeCount.reducer