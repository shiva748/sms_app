import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/* ================= TYPES ================= */

type User = {
  id: number;
  name: string;
  email: string;
  phone?: string;

  // dynamic role-based data
  schoolHeads?: any[];
  teachers?: any[];
  parent?: any | null;

  // escape hatch for future fields
  [key: string]: any;
};


export type AuthState = {
  authenticated: boolean;
  user: User | null;
  role: "SCHOOL_HEAD" | "TEACHER" | "PARENT" | null;
  schoolId: number | null;
  token: string | null;
};

/* ================= INITIAL STATE ================= */

const initialState: AuthState = {
  authenticated: false,
  user: null,
  role: null,
  schoolId: null,
  token: null,
};

/* ================= SLICE ================= */

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

    setAuthenticated(state, action: PayloadAction<boolean>) {
      state.authenticated = action.payload;
    },

    logout(state) {
      state.user = null;
      state.role = null;
      state.schoolId = null;
      state.token = null;
      state.authenticated = false;
    },
  },
});

/* ================= EXPORTS ================= */

export const {
  setUser,
  setRole,
  setSchool,
  setToken,
  setAuthenticated,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
