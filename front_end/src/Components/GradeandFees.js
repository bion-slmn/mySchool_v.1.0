import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/cards.css";
import ProgressBar from "./progressBar";

const GradeandFees = ({ data, feeType }) => {
  const navigate = useNavigate();
  const [totalPaid, setTotalPaid] = useState(0);

  // Navigate to fee details page when the card is clicked
  const handleCardClick = (feeId, feeName, feeToPay, total_students) => {
    if (total_students || feeType === "ADMISSION") {
      navigate(`/fee/${feeName}/${feeId}/${feeToPay}`);
    }
  };

  // Calculate the percentage of fee paid for each fee
  const calculatePercentage = (fee) => {
    const total_paid = fee.fees__total_paid || fee.total_paid || 0;
    const total_amount = fee.total_amount || fee.fees__total_amount || 0;
    const students = fee.total_students || 1;

    if (students === 0 && feeType !== "ADMISSION") return 0;

    return ((total_paid / (total_amount * students)) * 100).toFixed(2);
  };

  // Calculate the total amount paid for a grade
  const calculateTotalPaidForGrade = (fees) => {
    if (feeType === "ADMISSION") {
      return `${fees.total_paid} / ${fees.total_amount}`;
    }

    const fee_paid = fees
      .reduce((total, fee) => total + (fee.fees__total_paid || 0), 0)
      .toFixed(2);

    const fee_total = fees
      .reduce(
        (total, fee) =>
          total + (fee.fees__total_amount || 0) * (fee.total_students || 0),
        0
      )
      .toFixed(2);

    return `${fee_paid} / ${fee_total}`;
  };

  // Calculate the total amount paid across all grades
  const calculateTotalPaidOverall = () => {
    let total = 0;

    Object.values(data).forEach((fees) => {
      fees.forEach((fee) => {
        total += fee.fees__total_paid || fee.total_paid || 0;
      });
    });

    return total.toFixed(2);
  };

  // Set the total paid amount when the component mounts or data changes
  useEffect(() => {
    const total = calculateTotalPaidOverall();
    setTotalPaid(total);
  }, [data]);

  return (
    <div className="container">
      <h3>Total Paid: Kshs {totalPaid}</h3>
      <hr className="divider-total" />
      {Object.entries(data).map(([gradeName, fees], index) => (
        <div key={gradeName}>
          <div className="gradeSection">
            <h4 className="gradeTitle">{gradeName}</h4>
            <p className="gradeTotal">
              Paid : kshs {calculateTotalPaidForGrade(fees)}
            </p>

            <div className="cardsContainer">
              {fees.map((fee) => (
                <div
                  key={fee.fees__id || fee.id}
                  className="card"
                  onClick={() =>
                    handleCardClick(
                      fee.fees__id || fee.id,
                      fee.fees__name || fee.name,
                      fee.fees__total_amount || fee.total_amount,
                      fee.total_students || 0
                    )
                  }
                >
                  <div className="cardContent">
                    <p>
                      {`${fee.fees__name || fee.name} | Kshs ${(
                        fee.fees__total_amount || fee.total_amount
                      ).toFixed(2)} | ${fee.total_students || 0} students`}
                    </p>
                    <ProgressBar completed={calculatePercentage(fee)} />
                  </div>

                  <div className="total">
                    <p>
                      Paid: Kshs{" "}
                      {`${fee.fees__total_paid || fee.total_paid || 0} / ${(
                        fee.fees__total_amount ||
                        fee.total_amount * (fee.total_students || 1)
                      ).toFixed(2)}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {index < Object.entries(data).length - 1 && (
            <hr className="divider-payments" />
          )}
        </div>
      ))}
    </div>
  );
};

export default GradeandFees;
