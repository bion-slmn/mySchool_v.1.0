import { useState, useEffect } from "react";
import { fetchData } from "./form";
import { PageLoading } from "./loadingIcon";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/search.css";
import { useAuth } from "./AuthProvider";

const SearchBar = () => {
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setSearchInput(e.target.value);
    console.log(e.target.value, 121212);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && searchInput) {
      navigate(`/searchResult/${searchInput}`);
    }
  };

  return (
    <div className="searchbar">
      <input
        type="text"
        placeholder="Search for student by name..."
        value={searchInput}
        onChange={handleChange}
        onKeyUp={handleKeyPress} // Listen for Enter key press
      />
    </div>
  );
};

export const SearchResults = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState("");
  const { searchInput } = useParams();
  const navigate = useNavigate();
  const { checkTokenAndRefresh } = useAuth();

  useEffect(() => {
    console.log(searchInput, 121212);
    const fetchSearch = async () => {
      setIsLoading(true);
      try {
        const url = `api/school/search/?search=${searchInput}`;
        const [data, error] = await fetchData("GET", url, checkTokenAndRefresh);
        setIsLoading(false);
        if (error) {
          console.log(error);
          setError(error);
          return;
        }
        setSearchResults(data);
        console.log(data, "data");
      } catch (err) {
        console.error(err);
      }
    };

    fetchSearch();
  }, [searchInput]);

  const handleClick = (id) => {
    console.log(id);
    navigate(`/get-payment-details/${id}`);
  };

  if (error) {
    return <p>Error</p>;
  }
  if (!searchResults) {
    return (
      <div className="no_results">
        <p>No Student results found for {searchInput}</p>
      </div>
    );
  }

  return (
    <div className="feecontainer" style={{ marginTop: "20px" }}>
      <SearchBar />
      {isLoading && <PageLoading />}
      <small>Click on a student to view payment details</small>
      <table className="searchresult-table">
        <caption>Results for {searchInput}</caption>
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Grade </th>
            <th>Gender</th>
          </tr>
        </thead>
        <tbody>
          {searchResults.map((student) => (
            <tr
              key={student.id}
              onClick={() => {
                handleClick(student.id);
              }}
            >
              <td data-label="Student Name">{student.name}</td>
              <td data-label="Grade">{student.grade_name}</td>
              <td data-label="Gender">{student.gender}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ViewPaymentDetails = ({ studentPayments }) => {
  return (
    <div>
      <h3>Student name: {studentPayments.name}</h3>
      <hr />

      <span className="detail">Grade: {studentPayments.grade_name} </span>
      <span className="detail">| {studentPayments.gender}</span>
      <span className="detail">| DoB: {studentPayments.date_of_birth}</span>

      <h4>Payment Information</h4>
      {Object.entries(studentPayments.payment_info).map(
        ([term, paymentDetails]) => (
          <div key={term}>
            <h4>{term}</h4>
            <span>Total paid: {paymentDetails.total}</span>
            <table className="searchresult-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {paymentDetails.payments.map((payment, index) => (
                  <tr key={index}>
                    <td data-label="Date">
                      {new Date(payment.date).toLocaleDateString()}
                    </td>
                    <td data-label="Amount">{payment.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
};

export const GetPaymentDetails = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState("");
  const { checkTokenAndRefresh } = useAuth();

  useEffect(() => {
    setIsLoading(true);
    const fetchPaymentDetails = async () => {
      try {
        const url = `api/school/get-student-detail/?id=${id}`;
        const [data, error] = await fetchData("GET", url, checkTokenAndRefresh);
        setIsLoading(false);
        if (error) {
          console.log(error);
          setError(data);
          return;
        }
        console.log(data, "data");
        setData(data);
      } catch (err) {
        console.error(err);
        setError(err);
      }
    };
    fetchPaymentDetails();
  }, []);

  return (
    <div>
      {isLoading && <PageLoading />}
      {data && <ViewPaymentDetails studentPayments={data} />}
    </div>
  );
};

export default SearchBar;
