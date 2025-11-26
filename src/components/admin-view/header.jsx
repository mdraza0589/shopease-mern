import { useDispatch } from "react-redux";
import { logoutUser } from "../../../server/auth" // ✅ must import the thunk

function AdminHeader() {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    const confirmToLogout = confirm("Do you want to logout?")
    if (confirmToLogout) {
      await dispatch(logoutUser());
    }
  };

  return (
    <header className="flex items-center justify-end px-6 py-3 bg-white border-b shadow-sm">
      <button
        onClick={handleLogout}
        className="flex cursor-pointer items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gray-500 rounded-md hover:bg-gray-600 active:scale-95 transition-all duration-200 shadow-md"
      >
        Logout
      </button>
    </header>
  );
}

export default AdminHeader;
