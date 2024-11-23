import { useNavigate } from "react-router-dom";
import { useFormSubmit, HandleResult, fetchData } from "./form";
import { useState } from "react";
import "../styles/form.css";
import SubmitButton from "./submitButton";
import RotatingIcon from "./loadingIcon";
import { useAuth } from "./AuthProvider";
import { useEffect } from "react";

const RegisterStudent = () => {
  const [formData, setFormData] = useState({
    name: "",
    date_of_birth: "",
    gender: "",
    grade: "",
  });

  const [grades, setGrades] = useState([]); // To store grades fetched from the API
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [resultData, setResultData] = useState(null);
  const [isadmission, setIsAdmission] = useState(false);
  const navigate = useNavigate();
  const { checkTokenAndRefresh } = useAuth();

  // Update handleSubmit to use the correct form data
  let { handleSubmit, error } = useFormSubmit(
    "api/school/register-student/",
    formData, // Pass formData directly
    (data) => {
      setSubmitted(true);
      setResultData(data);
      setShowForm(false);
      setFormData({});
    },
    true,
    setIsLoading
  );

  // Update formData state on input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleShowForm = async () => {
    const url = "api/school/view-all-grades/";
    setIsLoading(true);

    try {
      const [data, urlError] = await fetchData(
        "GET",
        url,
        checkTokenAndRefresh
      );
      setIsLoading(false);

      if (urlError) {
        setErrorMessage(urlError);
      } else {
        console.log(data); // Check data and urlError
        setGrades(data); // Set the fetched grades in the grades state variable
        setShowForm(!showForm);
        setErrorMessage("");
      }
    } catch (err) {
      console.error("An unexpected error occurred:", err);
      setErrorMessage(err);
    }
  };

  const handeRegisteratoion = (e) => {
    setIsAdmission(e.target.value);
    setShowForm(true);
    handleShowForm();
  };

  useEffect(() => {
    if (resultData && !error && isadmission == "admission") {
      const studentInfo = {
        student_id: resultData.id,
        name: resultData.name,
        grade: formData.grade,
        grade_id: resultData.grade_id,
        registerationType: "admission",
      };
      setTimeout(() => {
        navigate("/register-payment", { state: studentInfo });
      }, 2000);
    }
  }, [resultData, error, navigate]);

  return (
    <div className="Register">
      <h2>Register a student</h2>
      <label>Select the Registration Type</label>
      <select
        className="student"
        name="fee_type"
        value={formData.fee_type}
        onChange={handeRegisteratoion}
        required
      >
        <option value="">Select Registration Type</option>
        <option value="admission">New Student Admission</option>
        <option value="not admission">Returning Student Registration</option>
      </select>

      <button
        className="menu student"
        onClick={handleShowForm}
        disabled={isLoading}
      >
        Click to register a student&nbsp;&nbsp;&nbsp;
        {isLoading && <RotatingIcon />}
      </button>
      {errorMessage && <p>{errorMessage}</p>}

      {/* Conditionally render the form based on state */}
      {showForm && (
        <form onSubmit={handleSubmit} className="StudentForm">
          <label>Student Name</label>
          <input
            type="text"
            name="name"
            placeholder="Student Name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <label>Date of Birth</label>
          <input
            type="date"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleInputChange}
            required
          />
          <label>Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <label>Grade</label>
          <select
            name="grade"
            value={formData.grade}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Grade</option>
            {grades.map((grade) => (
              <option key={grade.id} value={grade.id}>
                {grade.name}
              </option>
            ))}
          </select>
          <SubmitButton
            text={
              isadmission == "admission"
                ? "Register and Continue"
                : "Register Student"
            }
            isLoading={isLoading}
          />
        </form>
      )}

      {resultData && <HandleResult results={resultData} />}
    </div>
  );
};

export default RegisterStudent;
