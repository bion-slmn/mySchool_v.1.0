import React, { useState, useEffect } from "react";
import { fetchData } from "../../service/apiservice";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../service/authService";

const ViewSchool = () => {
  const [school, setSchool] = useState(null); // State to hold school data
  const [loading, setLoading] = useState(true); // State to track loading
  const navigate = useNavigate(); 
  const { checkTokenAndRefresh } = useAuth();

  useEffect(() => {
    const getSchool = async () => {
      try {
        await checkTokenAndRefresh(); 
        const data = await fetchData("school/view/"); // Pass `checkTokenAndRefresh` if required
        setSchool(data);
      } catch (err) {
        console.error("Error fetching school:", err.message);
        toast.error(err.message || "Failed to fetch school data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    getSchool();
  }, [checkTokenAndRefresh]); // Add `checkTokenAndRefresh` to dependencies

  const handleUpdate = (school) => {
    toast.info("Redirecting to update school...");
    navigate("/updateSchool", { state: { school } }); // Use `navigate` correctly
    console.log("Update button clicked!");
  };

  if (loading) {
    return <p>Loading school data...</p>;
  }

  return (
    <div className="container">
      <br />
      <h2>View School</h2>
      <Card className="mb-3">
        {school ? (
          <Card.Body>
            <Card.Title>{school.name}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">{school.adress}</Card.Subtitle>
            <Card.Text>{school.address}</Card.Text>
          </Card.Body>
        ) : (
          <p>No school data available.</p>
        )}
      </Card>

      {/* Update Button */}
      <Button variant="primary" onClick={() => handleUpdate(school)} size="sm">
        Update School
      </Button>
    </div>
  );
};

export default ViewSchool;
