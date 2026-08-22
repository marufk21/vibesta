import { createSlice } from '@reduxjs/toolkit';
const postSlice = createSlice({
  name: 'post',
  initialState: {
    posts: [],
    selectedPost: null,
  },
  reducers: {
    //actions
    setPosts: (state, action) => {
      state.posts = action.payload;
    },

    // Append additional posts (pagination). De-duplicates by _id so repeated
    // pages never produce duplicate feed rows.
    addPosts: (state, action) => {
      const incoming = action.payload || [];
      if (incoming.length === 0) return;
      const existing = new Set(state.posts.map((p) => p._id));
      state.posts = [
        ...state.posts,
        ...incoming.filter((p) => p && !existing.has(p._id)),
      ];
    },
    setSelectedPost: (state, action) => {
      state.selectedPost = action.payload;
    },

    // Granular updates used by individual <Post/> rows. Updating a single post
    // here (instead of replacing the whole posts array) lets React.memo
    // skip re-rendering every other post in the feed.
    toggleLikeForPost: (state, action) => {
      const { postId, userId, liked } = action.payload;
      if (!postId || !userId) return;
      state.posts = state.posts.map((p) =>
        p._id === postId
          ? {
              ...p,
              likes: liked
                ? (p.likes || []).filter((id) => String(id) !== String(userId))
                : [...(p.likes || []), userId],
            }
          : p
      );
    },
    addCommentToPost: (state, action) => {
      const { postId, comment } = action.payload;
      if (!postId) return;
      state.posts = state.posts.map((p) =>
        p._id === postId
          ? { ...p, comments: [...(p.comments || []), comment] }
          : p
      );
    },
    removePost: (state, action) => {
      const postId = action.payload;
      if (!postId) return;
      state.posts = state.posts.filter((p) => p._id !== postId);
      if (state.selectedPost?._id === postId) {
        state.selectedPost = null;
      }
    },
  },
});
export const {
  setPosts,
  addPosts,
  setSelectedPost,
  toggleLikeForPost,
  addCommentToPost,
  removePost,
} = postSlice.actions;
export default postSlice.reducer;
