import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { App } from "@capacitor/app";
import { Toast } from "@capacitor/toast";

export function useAndroidBackButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const lastBackPress = useRef(0);

  /**
   * This is our "real" Android-style back stack.
   * It always represents the unique screens in the order the user visited them.
   */
  const stack = useRef<string[]>(["/"]);

  // --- KEEP THE STACK CLEAN (Android-like) ---
  useEffect(() => {
    const current = location.pathname;
    const last = stack.current[stack.current.length - 1];

    // If we're navigating to a NEW screen, push it
    if (current !== last) {
      // If this screen already exists earlier in the stack, remove everything after it
      const existingIndex = stack.current.indexOf(current);

      if (existingIndex !== -1) {
        // Trim stack to that point (prevents duplicates)
        stack.current = stack.current.slice(0, existingIndex + 1);
      } else {
        // Otherwise push new screen
        stack.current.push(current);
      }
    }
  }, [location.pathname]);

  // --- BACK BUTTON HANDLER (NATIVE BEHAVIOR) ---
  useEffect(() => {
    let listener: any = null;

    const setupListener = async () => {
      listener = await App.addListener("backButton", async () => {
        // ---- CASE 1: NOT AT ROOT → GO BACK NORMALLY ----
        if (stack.current.length > 1) {
          stack.current.pop(); // remove current screen
          const previous = stack.current[stack.current.length - 1];

          navigate(previous, { replace: true });
          return;
        }

        // ---- CASE 2: AT ROOT → DOUBLE BACK TO EXIT ----
        const now = Date.now();

        if (now - lastBackPress.current < 2000) {
          App.exitApp();
        } else {
          lastBackPress.current = now;

          await Toast.show({
            text: "Press back again to exit",
            duration: "short",
            position: "bottom",
          });
        }
      });
    };

    setupListener();

    return () => {
      if (listener) listener.remove();
    };
  }, []);
}
