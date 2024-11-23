import React from "react";
import { fetchData } from "./form";
import { useParams } from "react-router-dom";
import { useState } from "react";
import "../styles/table.css";
import { PageLoading } from "./loadingIcon";
import { useAuth } from "./AuthProvider";

const PaymentsPerStudent = () => {
  const { feeId, studentID, feeName } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { checkTokenAndRefresh } = useAuth();

  React.useEffect(() => {
    const fetchPaymentData = async () => {
      setIsLoading(true);
      try {
        const url = `api/school/payments-per-student/${feeId}/?student_id=${studentID}`;
        const [data, urlError] = await fetchData(
          "GET",
          url,
          checkTokenAndRefresh
        );
        if (urlError) {
          console.error(urlError);
          setError(urlError);
        } else {
          setData(data);
        }
      } catch (err) {
        console.error("An unexpected error occurred:", err);
        setError(err.message || "An unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentData();
  }, [feeId, studentID]);

  if (isLoading) {
    return <PageLoading />;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!data) {
    return <p>No data available</p>;
  }

  const calculateTotalAmount = (payments) =>
    payments.reduce((total, payment) => total + parseFloat(payment.amount), 0);

  const totalAmount = calculateTotalAmount(data);

  return (
    <div className="feecontainer">
      <h3>
        {data[0]?.student_name} Payments Statement {feeName}
      </h3>
      <h4>Total amount: Kshs {totalAmount.toFixed(2)}</h4>{" "}
      {/* Display total amount */}
      <table className="payment-table">
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Date Paid</th>
            <th>Payment Method</th>
            <th>Amount Paid</th>
            <th>Reference Number</th>
          </tr>
        </thead>
        <tbody>
          {data.map((payment) => (
            <tr key={payment.id}>
              <td data-label="Student Name">{payment.student_name}</td>
              <td data-label="Date Paid">{payment.date_paid}</td>
              <td data-label="Payment Method">{payment.payment_method}</td>
              <td data-label="Amount">{payment.amount}</td>
              <td data-label="Reference Number">{payment.reference_number}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentsPerStudent;
