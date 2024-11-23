import { useNavigate } from "react-router-dom";
import { useFormSubmit, HandleResult, fetchData } from "./form";
import { useState, useEffect } from "react";
import "../styles/form.css";
import SubmitButton from "./submitButton";
import RotatingIcon from "./loadingIcon";
import Error from "./error";
import { useAuth } from "./AuthProvider";
import { useLocation } from "react-router-dom";

const RegisterPayment = () => {
  const location = useLocation();
  const { student_id, name, registerationType, grade, grade_id } =
    location.state || {};
  const [formData, setFormData] = useState({
    amount: "",
    date_paid: "",
    payment_method: "",
    reference_number: "",
    fee: "",
    student: student_id || "",
    grade: grade_id || "",
  });

  const [fees, setFees] = useState([]); // To store fees fetched from the API
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [resultData, setResultData] = useState(null);
  const { checkTokenAndRefresh } = useAuth();

  console.log(name, registerationType, "name, registerationType");

  const { handleSubmit, error } = useFormSubmit(
    "api/school/create-payment/",
    formData,
    (data) => {
      setSubmitted(true);
      setResultData(data);
      setShowForm(false);
      setFormData({});
      setErrorMessage(""); // Clear error message on success
    },
    (error) => {
      // This is where you handle errors from the submission
      setErrorMessage(error.message || "An unknown error occurred.");
      setIsLoading(false);
    },
    setIsLoading
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleShowForm = async () => {
    if (resultData || error) {
      console.log("resultData", resultData);
      setResultData(null);
      setErrorMessage("");
    }
    if (!showForm) {
      const url = `api/school/view-all-grades/`;
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
          setGrades(data);
          setShowForm(!showForm);
          setErrorMessage("");
        }
      } catch (err) {
        console.error("An unexpected error occurred:", err);
        setErrorMessage("");
      }
    } else {
      setErrorMessage("");
      setResultData(null);
      setFormData({}); // Reset formData when hiding the form
      setShowForm(false);
    }
  };

  useEffect(() => {
    if (formData.grade) {
      setIsLoading(true);
      const fetchStudent = async () => {
        try {
          const url = `api/school/students-in-grade/${formData.grade}/`;
          const [data, urlError] = await fetchData(
            "GET",
            url,
            checkTokenAndRefresh
          );
          setIsLoading(false);
          if (urlError) {
            setErrorMessage(urlError);
          }
          setStudents(data);
        } catch (err) {
          console.error(err);
          setErrorMessage("");
        }
      };

      fetchStudent();
    }
  }, [formData.grade]);

  useEffect(() => {
    if (formData.grade) {
      setIsLoading(true);
      let url;
      const fetchFees = async () => {
        try {
          if (registerationType === "admission") {
            url = `api/school/fees-in-grade/${formData.grade}/?admission_status=true`;
          } else {
            url = `api/school/fees-in-grade/${formData.grade}/`;
          }
          console.log(url, "url", registerationType);
          const [data, urlError] = await fetchData(
            "GET",
            url,
            checkTokenAndRefresh
          );
          setIsLoading(false);
          if (urlError) {
            setErrorMessage(urlError);
          }

          setFees(data);
        } catch (err) {
          console.error(err);
        }
      };

      fetchFees();
    }
  }, [formData.grade]);

  useEffect(() => {
    if (error || resultData || errorMessage) {
      setShowForm(false);
    }
    console.log(submitted, 121212, "submitted");
  }, [error, resultData, errorMessage]);

  return (
    <div className="StudentRegister">
      <h2>{registerationType ? "Pay Admission Fee" : "Register a Payment"}</h2>

      <button
        className="menu payment"
        onClick={handleShowForm}
        disabled={isLoading}
      >
        Click to register a payment&nbsp;&nbsp;&nbsp;
        {isLoading && <RotatingIcon />}
      </button>
      {errorMessage && <Error error={errorMessage} />}
      {showForm && (
        <form onSubmit={handleSubmit} className="StudentForm">
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

          <label>Select Fee</label>
          <select
            name="fee"
            value={formData.fee}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Fee</option>
            {fees.map((fee) => (
              <option key={fee.id} value={fee.id}>
                {fee.name}
              </option>
            ))}
          </select>
          <label>Select Student Name</label>
          <select
            name="student"
            value={formData.student}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Student</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </select>
          <label>Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            required
          />
          <label>Date of Payment</label>
          <input
            type="date"
            name="date_paid"
            value={formData.date_paid}
            onChange={handleInputChange}
            required
          />
          <label>Payment Method</label>
          <input
            type="text"
            name="payment_method"
            value={formData.payment_method}
            onChange={handleInputChange}
            required
          />
          <label>Reference number</label>
          <input
            type="text"
            name="reference_number"
            value={formData.reference_number}
            onChange={handleInputChange}
            required
          />
          <SubmitButton text="Register Payment" isLoading={isLoading} />
        </form>
      )}
      {error && <Error error={errorMessage} />}
      {resultData && <HandleResult results={resultData} />}
    </div>
  );
};

export default RegisterPayment;
