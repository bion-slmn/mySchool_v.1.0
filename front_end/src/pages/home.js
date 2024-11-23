import { Link } from "react-router-dom";
import { useState } from "react";
import "../styles/home.css";
import SearchBar from "../Components/searchBar";
import { Greeting } from "./greeting";
import { CreateDailyFee, AddDailyPayments } from "../Components/dailyPayments";

export const Dropdown = () => {
  return (
    <>
      <Link to="/register-school" className="dropdown-item">
        Register School
      </Link>
      <Link to="/register-grade" className="dropdown-item">
        Register Grade
      </Link>
      <Link to="/create-term" className="dropdown-item">
        Create a term
      </Link>
      <Link to="/register-student" className="dropdown-item">
        Register Student
      </Link>
      <Link to="/create-fee" className="dropdown-item">
        Create Fee
      </Link>
      <Link to="/create-daily-fee" className="dropdown-item">
        Create Daily Fee
      </Link>
      <Link to="/register-payment" className="dropdown-item">
        Register Payment
      </Link>
      <Link to="/register-daily-payment" className="dropdown-item">
        Register Daily Payment
      </Link>
    </>
  );
};

function Home() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Toggle dropdown visibility and scroll to the top
  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
    console.log("Scrolling to the top of the page");
    // Scroll to the top of the page when the button is clicked
    window.scrollTo({
      top: document.body.scrollHeight / 2,
      behavior: "smooth",
    });
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <Greeting />
        <h1 className="home-title">Manage Your School Finances Easily</h1>
        <p className="home-subtitle">
          Keep track of your students' and teachers' financial records with ease
          and accuracy.
        </p>
        <SearchBar />
      </header>

      <section className="home-actions">
        <Link to="/dashboard" className="home-link secondary">
          Go to Dashboard
        </Link>
        <div className="dropdown">
          <button onClick={handleDropdownToggle} className="home-link">
            Register ......
          </button>
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <Dropdown />
            </div>
          )}
        </div>
      </section>

      <div style={{ height: 250 }}></div>
    </div>
  );
}

export default Home;
