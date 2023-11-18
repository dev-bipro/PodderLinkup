import { createSlice } from '@reduxjs/toolkit'

export const activeChat = createSlice({
  name: 'activeChat',
  initialState: {
    activeChatValue: null,
  },
  reducers: {
    setActiveChat: (state,action) => {
        state.activeChatValue = action.payload ;
    },
  },
})

// Action creators are generated for each case reducer function
export const { setActiveChat } = activeChat.actions

export default activeChat.reducer