import RegisterSchool from "../Components/registerSchool";
import RegisterGrade from "../Components/registerGrade";
import RegisterStudent from "../Components/registerStudent";
import CreateFee from "../Components/create_fee";
import RegisterPayment from "../Components/addPayment";

const Register = () => {
  return (
    <div className="register" style={{ textAlign: "left" }}>
      <h1>Register</h1>
      <p>Register a school, grade, student, payment, or fee</p>
      <RegisterGrade id="about" />
      <RegisterSchool id="blog" />
      <RegisterStudent id="projects" />
      <RegisterPayment id="contact" />
      <CreateFee id="contacts" />
    </div>
  );
};

export default Register;
