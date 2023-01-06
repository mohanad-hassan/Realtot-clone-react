
import { useNavigate } from "react-router-dom";
export default function OAuth() {
  const navigate = useNavigate();
  async function onGoogleClick() {

  }
  return (
    <button
      type="button"
      onClick={onGoogleClick}
      className="flex items-center justify-center w-full bg-red-700 text-white px-7 py-3 uppercase text-sm font-medium hover:bg-red-800 active:bg-red-900 shadow-md hover:shadow-lg active:shadow-lg transition duration-150 ease-in-out rounded"
    >
      Continue with Google
    </button>
  );
}