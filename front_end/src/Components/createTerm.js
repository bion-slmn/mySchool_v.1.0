import { useFormSubmit, HandleResult } from "./form";
import { useState, useEffect } from "react";
import RotatingIcon from "./loadingIcon";
import "../styles/form.css";
import SubmitButton from "./submitButton";
import Error from "./error";

const CreateTerm = () => {
  const [formData, setFormData] = useState({
    name: "",
    start_date: "",
    end_date: "",
    grade: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [showForm, setShowForm] = useState(false); // Control form visibility
  const [submitError, setSubmitError] = useState(""); // State for error messages

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleShowForm = () => {
    setShowForm(!showForm);
    setSubmitError(""); // Clear the error message when showing the form
    setResultData(null); // Clear previous results
  };

  let { handleSubmit, error } = useFormSubmit(
    `api/school/create-term/`,
    formData,
    (data) => {
      setResultData(data);
      setShowForm(false);
      setFormData({
        name: "",
        start_date: "",
        end_date: "",
        grade: "",
      }); // Reset form data
      setSubmitError(""); // Clear error on successful submission
    },
    true,
    setIsLoading
  );

  // Handle error if it exists
  useEffect(() => {
    if (error) {
      setSubmitError(error); // Set the error state
    }
    if (resultData || error) {
      setShowForm(false);
    } // Hide the form on successful submission
  }, [error, resultData]);

  return (
    <div className="Register">
      <h2>Create a Term</h2>
      <button className="menu term" onClick={handleShowForm}>
        Click to create a Term&nbsp;&nbsp;&nbsp;
        {isLoading && <RotatingIcon />}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit}>
          <label>Name</label>
          <input
            type="text"
            name="name"
            placeholder="Term name e.g. Term 1 2024"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <label>Start Date</label>
          <input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleInputChange}
            required
          />
          <label>End Date</label>
          <input
            type="date"
            name="end_date"
            value={formData.end_date}
            min={formData.start_date} // Corrected: Should be start_date
            onChange={handleInputChange}
            required
          />
          <SubmitButton text="Create Term" isLoading={isLoading} />
        </form>
      )}
      {submitError && <Error error={submitError} />}
      {resultData && <HandleResult results={resultData} />}
    </div>
  );
};

export default CreateTerm;
