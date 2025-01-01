import { useLogoutUserMutation } from "@/store/apiSlices/userApiSlice";
import { clearUser } from "@/store/slices/userSlice";
import { useDispatch } from "react-redux";

export const useLogout = () => {
  const [logoutUser] = useLogoutUserMutation();
  const dispatch = useDispatch();

  const logout = async () => {
    try {
      await logoutUser().unwrap();
      dispatch(clearUser());
      localStorage.removeItem("user");
    } catch (err) {
      console.error("Logout faild:", err);
    }
  };
  return logout;
};
