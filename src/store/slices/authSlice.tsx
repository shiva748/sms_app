import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthState = {
  user: User | null;
  role: "SCHOOL_HEAD" | "TEACHER" | "PARENT" | null;
  schoolId: number | null;
  token: string | null;
};

const initialState: AuthState = {
  user: null,
  role: null,
  schoolId: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    setRole(state, action: PayloadAction<AuthState["role"]>) {
      state.role = action.payload;
    },
    setSchool(state, action: PayloadAction<number>) {
      state.schoolId = action.payload;
    },
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
    },
    logout(state) {
      state.user = null;
      state.role = null;
      state.schoolId = null;
      state.token = null;
    },
  },
});

export const { setUser, setRole, setSchool, setToken, logout } =
  authSlice.actions;

export default authSlice.reducer;
