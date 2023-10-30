import { configureStore } from '@reduxjs/toolkit'
import whoLogedin from '../features/logdin/whoLogedin'

export default configureStore({
  reducer: {
        logedin : whoLogedin,
        logedinT : 2,
    },
})