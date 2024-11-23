import React, { useState, useEffect } from "react";
import "../styles/greeting.css";

export const Greeting = () => {
  const [isVisible, setIsVisible] = useState(true);

  const hours = new Date().getHours();
  const greet = hours < 12 ? "morning" : hours < 18 ? "afternoon" : "evening";

  useEffect(() => {
    // Set a timeout to hide the greeting after 2 minutes (120000 milliseconds)
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 60000); // 2 minutes = 120000 milliseconds

    // Cleanup the timeout if the component unmounts or is updated
    return () => clearTimeout(timer);
  }, []);

  return isVisible ? (
    <span className="greeting-message">Good {greet}! Welcome to sHule</span>
  ) : null;
};
