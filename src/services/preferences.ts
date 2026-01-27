import { Preferences } from "@capacitor/preferences";
import type { AuthState } from "../store/slices/authSlice";
import type { AppDispatch, RootState } from "../store/store";
import type { Store } from "@reduxjs/toolkit";
import {
  setUser,
  setRole,
  setSchool,
  setToken,
  setAuthenticated,
  setProfile
} from "../store/slices/authSlice";

const AUTH_KEY = "auth_state";

/* ================================================= */
/* ============== BASIC STORAGE APIS ============== */
/* ================================================= */

/** Save full or partial auth state */
export const saveAuthState = async (state: Partial<AuthState>) => {
  const existing = await getAuthState();

  const merged: Partial<AuthState> = {
    ...existing,
    ...state,
  };

  await Preferences.set({
    key: AUTH_KEY,
    value: JSON.stringify(merged),
  });
};

/** Read stored auth state */
export const getAuthState = async (): Promise<Partial<AuthState> | null> => {
  const { value } = await Preferences.get({ key: AUTH_KEY });
  return value ? JSON.parse(value) : null;
};

/** Clear on logout */
export const clearAuthState = async () => {
  await Preferences.remove({ key: AUTH_KEY });
};

/* ================================================= */
/* ============== REDUX SYNC HELPERS ============== */
/* ================================================= */

/**
 * Restore Redux state from Capacitor Preferences
 * (Call this once when app starts)
 */
export const syncAuthFromStorageToRedux = async (dispatch: AppDispatch) => {
  const saved = await getAuthState();
  if (!saved) return;

  if (saved.user) dispatch(setUser(saved.user));
  if (saved.role) dispatch(setRole(saved.role));
  if (saved.school) dispatch(setSchool(saved.school));
  if (saved.token) dispatch(setToken(saved.token));
  if (saved.profile) dispatch(setProfile(saved.profile))
  if (saved.authenticated) {
    dispatch(setAuthenticated(true));
  }
};

/**
 * Auto-persist Redux auth state to Capacitor Preferences
 * (Call this once when app starts)
 */
export const autoPersistAuthState = (store: Store<RootState>) => {
  let currentState = store.getState().auth;

  store.subscribe(() => {
    const nextState = store.getState().auth;

    if (currentState !== nextState) {
      currentState = nextState;

      saveAuthState({
        authenticated: nextState.authenticated,
        user: nextState.user,
        role: nextState.role,
        school: nextState.school,
        token: nextState.token,
        profile: nextState.profile
      });
    }
  });
};
