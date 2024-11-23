import "../styles/error.css";

const Error = ({ error }) => {
  console.log(typeof error, error, "error from error.js");

  let errorMessage;

  // Check if the error is an object and not null (i.e., serializer.errors)
  if (typeof error === "object" && error !== null) {
    // If it's an object, map through the keys to display error messages
    errorMessage = Object.entries(error)
      .map(([field, messages]) => {
        // Handle cases where messages might be an array (e.g., from serializer.errors)
        if (Array.isArray(messages)) {
          return `${field}: ${messages.join(", ")}`;
        }
        return `${field}: ${messages}`;
      })
      .join(" | ");
  } else {
    // If it's not an object, use the error directly
    errorMessage = error;
  }

  return <div className="error">Error: {errorMessage}</div>;
};

export default Error;
