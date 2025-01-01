"use-client";
import { useLogout } from "@/hooks/useLogout";

export default function LogoutButton() {
  const logout = useLogout();

  return (
    <button onClick={logout} className="px-4 py-2 bg-mo text-white rounded-md">
      Logout
    </button>
  );
}
