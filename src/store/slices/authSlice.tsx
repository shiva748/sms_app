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

type SchoolData = {
  teachers: string,
  students: string,
  grades: any[],
  sections: any[],
  academicYear: any | null
}

export type AuthState = {
  authenticated: boolean;
  user: User | null;
  role: "SCHOOL_HEAD" | "TEACHER" | "PARENT" | null;
  school: any | null;
  schoolData: SchoolData | null;
  token: string | null;
};

/* ================= INITIAL STATE ================= */

const initialState: AuthState = {
  authenticated: false,
  user: null,
  role: null,
  school: null,
  token: null,
  schoolData: null
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

    setSchool(state, action: PayloadAction<any>) {
      state.school = action.payload;
    },

    setSchoolData(state, action: PayloadAction<any>) {
      state.schoolData = action.payload;
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
      state.school = null;
      state.token = null;
      state.authenticated = false;
      state.schoolData = null
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
  setSchoolData,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
