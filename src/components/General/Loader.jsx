// src/components/Loader.jsx
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Loader = () => {
  return (
    <div className="flex justify-center items-center py-10 min-h-screen">
      <AiOutlineLoading3Quarters size={30} className="animate-spin text-3xl text-indigo-500" />
    </div>
  );
};

export default Loader;
