import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/results.css";
import { useState } from "react";
import { useAuth } from "./AuthProvider";

const handleErrors = (response) => {
  if (response.status === 403) {
    throw new Error("You must be the ADMIN to perform this action.");
  }

  if (response.status === 401) {
    localStorage.setItem("sHule", "");
    window.location.href = "/login";
    return;
  }
};

export const useFormSubmit = (
  endpoint,
  payload,
  onSuccess = (data) => {}, // Passing the result data to onSuccess
  includeAuth = false,
  setIsLoading = () => {}
) => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { checkTokenAndRefresh } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const url = "https://myschool-ax55.onrender.com/" + endpoint;
    let result;

    await checkTokenAndRefresh();

    try {
      setIsLoading(true);

      const headers = {
        "Content-Type": "application/json",
      };

      // If includeAuth is true, add the Authorization header
      if (includeAuth) {
        headers.Authorization = `Bearer ${localStorage.getItem("sHule")}`;
      }

      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      result = data;

      if (response.status === 401) {
        localStorage.setItem("sHule", "");
        navigate("/login");
      }

      // Handle 403 Forbidden status
      if (response.status === 403) {
        throw new Error("You must be the ADMIN to perform this action.");
      }

      // Handle other errors
      if (!response.ok) {
        console.error("Error submitting form: 23", data);
        const errorMessage =
          typeof data === "object" && data !== null
            ? JSON.stringify(data) // Convert object to string
            : data;
        throw new Error(errorMessage || "An error has occurred");
      }

      if (data.access) {
        localStorage.setItem("accessToken", data.access);
      }

      setError("");
      onSuccess(data); // Pass the result data to the onSuccess callback
    } catch (error) {
      console.error("Error submitting form:", error);
      setError(error.message || "An error has occurred");
    } finally {
      setIsLoading(false); // Stop loading after submission
    }
  };

  return { handleSubmit, error };
};

const Showresults = (props) => {
  const { key, value } = props.result; // Destructure key-value pair
  return (
    <div className="result-item">
      <span className="result-key">{key}:</span>{" "}
      <span className="result-value">{JSON.stringify(value)}</span>
    </div>
  );
};

export const HandleResult = ({ results }) => {
  const notToShow = [
    "id",
    "updated_at",
    "school",
    "fee",
    "student",
    "term",
    "created_at",
    "grade",
    "students",
    "is_active",
    "total_paid",
  ]; // Fields to exclude

  if (!results) {
    return;
  }

  // Scroll to the specified height when results are updated

  return (
    <div className="results-container">
      <h1 className="results-heading">Success ...</h1>
      {Array.isArray(results) ? (
        results.map((result, index) => (
          <div key={index} className="result-item">
            {Object.entries(result)
              .filter(([key]) => !notToShow.includes(key)) // Exclude certain fields
              .map(([key, value], subIndex) => (
                <Showresults key={subIndex} result={{ key, value }} />
              ))}
          </div>
        ))
      ) : (
        <div className="result-item">
          {Object.entries(results)
            .filter(([key]) => !notToShow.includes(key)) // Filter out keys that shouldn't be shown
            .map(([key, value], index) => (
              <Showresults key={index} result={{ key, value }} />
            ))}
        </div>
      )}
      {window.scrollTo({
        top: document.body.scrollHeight * 0.75,
        behavior: "smooth",
      })}
    </div>
  );
};

/**
 * Fetch data from a given URL with the specified HTTP method.
 *
 * @param {string} endpoint_method - The HTTP method (e.g., "GET", "POST").
 * @param {string} endpoint - The API endpoint URL.
 * @returns {Promise<{ data: any, urlError: string }>} - An object containing the response data and any error message.
 */
export const fetchData = async (
  endpoint_method,
  endpoint,
  checkTokenAndRefresh = null
) => {
  let data = null; // Initialize data to null
  let urlError = ""; // Initialize error message to an empty string
  const url = "https://myschool-ax55.onrender.com/" + endpoint;

  if (checkTokenAndRefresh) {
    await checkTokenAndRefresh();
  }

  try {
    const response = await fetch(url, {
      method: endpoint_method,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("sHule")}`,
        "Content-Type": "application/json",
      },
    });

    handleErrors(response);

    data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "An error occurred");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    urlError = error.message;
  }

  return [data, urlError]; // Return both data and urlError
};
