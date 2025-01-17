import { GiAbstract076 } from "react-icons/gi";
import "../styles/loading.css";

const RotatingIcon = () => {
  return (
    <div className="rotate_div">
      <GiAbstract076 className="rotate" size={20} color="white" />{" "}
    </div>
  );
};

export const PageLoading = () => {
  return (
    <div className="rotate_div_page">
      <GiAbstract076 className="rotate" size={50} color="#0d6efd" />{" "}
    </div>
  );
};

export default RotatingIcon;