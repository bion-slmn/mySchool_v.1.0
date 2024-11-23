import RegisterSchool from "../Components/registerSchool";
import RegisterGrade from "../Components/registerGrade";
import RegisterStudent from "../Components/registerStudent";
import CreateFee from "../Components/create_fee";
import RegisterPayment from "../Components/addPayment";
import "../styles/Sidebar.css";

const Sidebar = () => {
  return (
    <div>
      <RegisterGrade id="about" />
      <RegisterSchool id="blog" />
      <RegisterStudent id="projects" />
      <RegisterPayment id="contact" />
      <CreateFee id="contacts" />
    </div>
  );
};

export default Sidebar;
