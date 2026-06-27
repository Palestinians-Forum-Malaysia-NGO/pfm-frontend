import { useLocation } from "react-router-dom";

/**
 * Returns "/staff" when rendered inside the staff layout, "/admin" otherwise.
 * Used by shared feature components so navigate() calls work in both layouts.
 */
export default function useLayoutBase() {
  const { pathname } = useLocation();
  return pathname.startsWith("/staff") ? "/staff" : "/admin";
}
