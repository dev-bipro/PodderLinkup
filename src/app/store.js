import { configureStore } from '@reduxjs/toolkit'
import whoLogedin from '../features/logdin/whoLogedin'
import activeChat from '../features/activeChat/activeChat'

export default configureStore({
  reducer: {
        logedin : whoLogedin,
        whoActiveChat: activeChat,
        // logedinT : 2,
    },
})