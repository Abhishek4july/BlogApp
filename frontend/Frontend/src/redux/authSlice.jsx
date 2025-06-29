import { createSlice } from "@reduxjs/toolkit";

const userFromStorage = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

const initialState = {
  user: userFromStorage,
  isAuthenticated: !!userFromStorage,
  isAdmin: userFromStorage?.role === "admin" || false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginUser: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isAdmin = action.payload.isAdmin || false;
    },
    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isAdmin = false;
      localStorage.removeItem("user");
      localStorage.removeItem("auth");
    },
  },
});

export const { loginUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
