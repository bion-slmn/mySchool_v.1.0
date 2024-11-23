import React from "react";
import "../styles/progressbar.css";

const ProgressBar = (props) => {
  const { completed } = props;

  // Ensure the progress does not exceed 100%
  const safeCompleted = Math.min(completed, 100);

  let bgcolor;
  let font_color = "black";

  if (completed <= 30) {
    bgcolor = "red"; // #FF0000
  } else if (completed > 30 && completed <= 60) {
    bgcolor = "orange"; // #FFA500
  } else {
    bgcolor = "#30CB00"; // Bright Green
  }

  return (
    <div className="progress-container">
      <div
        className="progress-filler"
        style={{
          width: `${safeCompleted}%`,
          backgroundColor: bgcolor,
        }}
      >
        <small
          className="progress-label"
          style={{ color: font_color }}
        >{`${completed}%`}</small>
      </div>
    </div>
  );
};

export default ProgressBar;
