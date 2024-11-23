import { useState } from "react";
import { useFormSubmit, HandleResult } from "./form";
import "../styles/form.css";
import SubmitButton from "./submitButton";
import Error from "./error";
import { useEffect } from "react";

const RegisterSchool = () => {
  const [school, setSchool] = useState("");
  const [address, setAddress] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resultData, setResultData] = useState(null); // State for loading

  const { handleSubmit, error } = useFormSubmit(
    "api/school/create-school/",
    { school, address },
    (data) => {
      setIsLoading(false); // Stop loading when the form is successfully submitted
      setResultData(data);
    },
    true,
    setIsLoading
  );

  useEffect(() => {
    if (error || resultData) {
      setShowForm(false);
    }
  }, [resultData, error]);

  const handleShowForm = () => {
    setShowForm(!showForm);
    setResultData(null);

    // Clear the error message when showing the form // Clear previous results
  };

  return (
    <div className="Register">
      <h2>Register a School</h2>
      <button onClick={handleShowForm} className="menu school">
        Click to add a school
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="SchoolForm">
          <label>School Name</label>
          <input
            type="text"
            placeholder="Enter the name of the school"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            required
          />
          <label>Address of School</label>
          <input
            type="text"
            placeholder="Kakamega Maziwa road, 005100"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
          <SubmitButton text="Register" isLoading={isLoading} />
        </form>
      )}

      {/* Display error message if error exists */}
      {error && <Error error={error} />}
      {resultData && <HandleResult results={resultData} />}
    </div>
  );
};

export default RegisterSchool;
