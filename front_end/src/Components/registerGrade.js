import { useEffect, useState } from "react";
import { useFormSubmit, HandleResult } from "./form";
import "../styles/form.css";
import SubmitButton from "./submitButton";
import Error from "./error";

const RegisterGrade = () => {
  const [name, setName] = useState("");
  const [description, setdescription] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState("");
  const [resultData, setResultData] = useState(null);

  let { handleSubmit, error } = useFormSubmit(
    "api/school/create-grade/",
    { name, description },
    (data) => {
      setSubmitted(true);
      setErrors("");
      setResultData(data);
    },
    true,
    setIsLoading
  );

  const handleShowForm = () => {
    setShowForm(!showForm);
    setErrors(""); // Clear the error message when showing the form
    setResultData(null); // Clear previous results
    error = "";
  };

  useEffect(() => {
    <HandleResult error={error} />;
    console.log(error);
    if (error || resultData) {
      setShowForm(false);
    }
  }, [error, resultData]);

  return (
    <div className="Register">
      <h2>Register a Grade</h2>
      <button className="menu grade" onClick={handleShowForm}>
        Click To Add a Grade
      </button>

      {/* Conditionally render the fo   rm based on state */}
      {showForm && (
        <form onSubmit={handleSubmit} className="GradeForm">
          <label>Grade Name</label>
          <input
            type="text"
            placeholder="Grade/Class 4"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <label>Description of Grade</label>
          <input
            type="text"
            placeholder="Brief discription Grade"
            value={description}
            onChange={(e) => setdescription(e.target.value)}
            required
          />
          <SubmitButton text="Add the Grade" isLoading={isLoading} />
        </form>
      )}
      {error && <Error error={error} />}
      {resultData && <HandleResult results={resultData} />}
    </div>
  );
};

export default RegisterGrade;
