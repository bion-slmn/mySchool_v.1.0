import React, { useState, useEffect, useReducer } from "react";
import { getCurrentYear } from "../pages/footer";
import { HandleResult, useFormSubmit, fetchData } from "./form";
import { useAuth } from "./AuthProvider";
import Error from "./error";
import SubmitButton from "./submitButton";
import "../styles/form.css";
import RotatingIcon from "./loadingIcon";
import { FeeInfo } from "./create_fee";

export const CreateDailyFee = () => {
  const [feeData, setFeeData] = useState({
    fee_type: "DAILY",
    total_amount: "",
    name: "",
    description: "",
    term: "",
    grade_ids: [],
  });
  const [errorMessage, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [terms, setTerms] = useState([]);
  const [grades, setGrades] = useState([]);
  const { checkTokenAndRefresh } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFeeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (gradeId) => {
    setFeeData((prevData) => {
      const { grade_ids } = prevData;
      const newGradeIds = grade_ids.includes(gradeId)
        ? grade_ids.filter((id) => id !== gradeId)
        : [...grade_ids, gradeId];
      return { ...prevData, grade_ids: newGradeIds };
    });
  };

  const fetchDataFromAPI = async (url, data_type) => {
    setIsLoading(true);
    try {
      const [data, urlError] = await fetchData(
        "GET",
        url,
        checkTokenAndRefresh
      );
      setIsLoading(false);

      if (urlError) {
        setError(urlError);
      } else if (data_type === "grade") {
        setGrades(data);
      } else {
        setTerms(data);
      }
    } catch (err) {
      setIsLoading(false);
      setError(`An unexpected error occurred: ${err.message}`);
    }
  };

  useEffect(() => {
    const year = getCurrentYear();
    fetchDataFromAPI(`api/school/view-terms/?year=${year}`, "terms");
    fetchDataFromAPI("api/school/view-all-grades/", "grade");
  }, []);

  let { handleSubmit, error } = useFormSubmit(
    `api/school/create-fee/`,
    feeData,
    (data) => {
      setResultData(data);
      setFeeData({
        fee_type: "DAILY",
        total_amount: "",
        name: "",
        description: "",
        term: "",
        grade_ids: [],
      });
    },
    true,
    setIsLoading
  );
  const handleFormSubmission = (e) => {
    e.preventDefault();

    if (feeData.grade_ids.length === 0) {
      setError("Please select at least one grade.");
      return;
    }
    setError("");
    error = "";
    setResultData(null);

    handleSubmit(e);
  };

  return (
    <div>
      <h1>Create Daily Fee</h1>
      <FeeInfo feeData={feeData.fee_type} />
      <form
        onSubmit={handleFormSubmission}
        className="form"
        style={{ display: "block" }}
      >
        <label>Fee Name</label>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={feeData.name}
          onChange={handleInputChange}
          required
        />
        <label>Total Amount</label>
        <input
          type="number"
          name="total_amount"
          placeholder="Total Amount"
          value={feeData.total_amount}
          onChange={handleInputChange}
          required
        />
        <label>Description</label>
        <textarea
          className="description"
          name="description"
          placeholder="Give a description/breakdown of the fee"
          value={feeData.description}
          onChange={handleInputChange}
          required
          rows={4} // Adjust the height of the textarea as needed
          // Optional: makes it stretch across the form width
        />

        <label>Select Term</label>
        <select
          name="term"
          value={feeData.term}
          onChange={handleInputChange}
          required
        >
          <option value="">Select a term</option>
          {terms.map((term) => (
            <option value={term.id} key={term.id}>
              {term.name}
            </option>
          ))}
        </select>

        <label>Select Grades</label>
        <div
          className={`checkbox-container ${
            feeData.grade_ids.length > 0 ? "has-selected" : ""
          }`}
        >
          {grades.map((grade) => (
            <div key={grade.id} className="checkbox-item">
              <input
                type="checkbox"
                value={grade.id}
                checked={feeData.grade_ids.includes(grade.id)}
                onChange={() => handleCheckboxChange(grade.id)}
              />
              <label>{grade.name}</label>
            </div>
          ))}
        </div>

        <SubmitButton text="Create Fee" isLoading={isLoading} />
      </form>

      {(error || errorMessage) && <Error error={errorMessage || error} />}
      {resultData && <HandleResult results={resultData} />}
    </div>
  );
};

// Reducer to manage form state

const StudentPaymentInput = ({ student, handleAmountChange, value }) => (
  <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
    <span>{student.name}</span>
    <input
      type="number"
      placeholder="Amount"
      value={value}
      onChange={(e) => handleAmountChange(student.id, e.target.value)}
      style={{ marginRight: "10px", width: "100px" }}
      required
    />
  </div>
);

export const AddDailyPayments = () => {
  const date = new Date().toISOString().split("T")[0];
  const { checkTokenAndRefresh } = useAuth();

  // State
  const [datePaid, setDatePaid] = useState(date);
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [resultData, setResultData] = useState(null);

  // Initialize studentAmounts in the formData state
  const [formData, setFormData] = useState({
    date_paid: datePaid,
    payment_method: "cash",
    fee: "",
    grade: "",
    payments: "",
  });

  let { handleSubmit, error } = useFormSubmit(
    "api/school/create-daily-payment/",
    formData,
    (data) => {
      setResultData(data);
      setShowForm(false);
    },
    (error) => {
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

  // Handle changes to student amounts
  const handleStudentAmountChange = (studentId, amount) => {
    setFormData((prevData) => ({
      ...prevData,
      payments: {
        ...prevData.payments,
        [studentId]: amount,
      },
    }));
  };

  const fetchGrades = async () => {
    setIsLoading(true);
    const [data, urlError] = await fetchData(
      "GET",
      "api/school/view-all-grades/",
      checkTokenAndRefresh
    );
    setIsLoading(false);
    if (urlError) {
      setErrorMessage(urlError);
    } else {
      setGrades(data);
    }
  };

  const fetchStudentsAndFees = async (grade) => {
    setIsLoading(true);
    try {
      const studentUrl = `api/school/students-in-grade/${grade}/`;
      const feeUrl = `api/school/daily-fee/${grade}/?created_at=${datePaid}`;

      const [studentsData, studentsError] = await fetchData(
        "GET",
        studentUrl,
        checkTokenAndRefresh
      );
      const [feesData, feesError] = await fetchData(
        "GET",
        feeUrl,
        checkTokenAndRefresh
      );

      setIsLoading(false);
      if (studentsError || feesError) {
        setErrorMessage(studentsError || feesError);
      } else {
        setStudents(studentsData);
        setFees(feesData);
      }
    } catch (err) {
      setErrorMessage("Error fetching data.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (formData.grade) {
      fetchStudentsAndFees(formData.grade);
    }
  }, [formData.grade]);

  const handleShowForm = () => {
    if (!showForm) {
      fetchGrades();
    }
    setShowForm(!showForm);
    setResultData(null);
    setErrorMessage("");
    error = "";
  };

  return (
    <div className="StudentRegister">
      <h2>Register a Daily Payment</h2>
      <button
        className="menu payment"
        onClick={handleShowForm}
        disabled={isLoading}
      >
        Click to Register Daily Payments &nbsp;&nbsp;&nbsp;
        {isLoading && <RotatingIcon />}
      </button>

      {errorMessage && <Error error={errorMessage} />}

      {showForm && (
        <form onSubmit={handleSubmit} className="StudentForm">
          <label>Date Paid</label>
          <input
            type="date"
            value={datePaid}
            onChange={(e) => setDatePaid(e.target.value)}
            max={datePaid}
          />

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

          <div className="payment-amounts">
            <h4>Enter Student Payments.</h4>
            {students.map((student) => (
              <StudentPaymentInput
                key={student.id}
                student={student}
                handleAmountChange={handleStudentAmountChange}
                value={formData.payments[student.id] || ""}
              />
            ))}
            <hr />
            <b>
              Total payments:{" "}
              {Object.values(formData.payments).reduce(
                (total, amount) => total + (parseFloat(amount) || 0),
                0
              )}
            </b>
          </div>

          {Object.keys(formData.payments).length > 0 && (
            <SubmitButton text="Register Payment" isLoading={isLoading} />
          )}
        </form>
      )}
      {(error || errorMessage) && <Error error={errorMessage || error} />}

      {resultData && <HandleResult results={resultData} />}
    </div>
  );
};

const CreateAndAddDailyPayments = () => {};
