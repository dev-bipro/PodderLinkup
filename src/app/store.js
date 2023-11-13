import { configureStore } from '@reduxjs/toolkit'
import whoLogedin from '../features/logdin/whoLogedin'
import postLikeCount from '../features/postLike/postLikeCount'

export default configureStore({
  reducer: {
        logedin : whoLogedin,
        postLike: postLikeCount,
        // logedinT : 2,
    },
})