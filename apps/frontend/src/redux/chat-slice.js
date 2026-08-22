import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    onlineUsers: [],
    messages: [],
  },
  reducers: {
    // actions
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    // Appends a single message immutably. Used by realtime socket handling to
    // avoid stale-closure bugs (no need to capture the full messages array).
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },
});
export const { setOnlineUsers, setMessages, addMessage } = chatSlice.actions;
export default chatSlice.reducer;
