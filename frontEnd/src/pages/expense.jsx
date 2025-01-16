import { ViewExpenseInTerm } from "../components/expense/viewEpense";
import { useAuth } from "../service/authService";
import CreateExpense from "../components/expense/createExpense";
import { Button } from "react-bootstrap";
import { useState } from "react";

const Expense = () => {
    const [activeSection, setActiveSection] = useState("viewExpense"); // Manage active section
    const { checkTokenAndRefresh } = useAuth();

    const toggleSection = (section) => {
        // Toggle between viewExpense and createExpense
        setActiveSection((prevSection) => (prevSection === section ? "viewExpense" : section));
    };

    checkTokenAndRefresh();

    return (
        <div>
            <br />
            <div className="d-flex justify-content-center mt-3">
                <Button
                    variant="primary"
                    onClick={() => toggleSection("createExpense")}
                    className="me-2"
                >
                    {activeSection === "createExpense" ? "Hide Create Expense" : "Create Expense"}
                </Button>
                <Button
                    variant="secondary"
                    onClick={() => toggleSection("viewExpense")}
                >
                    {activeSection === "viewExpense" ? "Hide View Expense" : "View Expense"}
                </Button>
            </div>
            <br />
            {activeSection === "viewExpense" && <ViewExpenseInTerm />}

            {activeSection === "createExpense" && (
                <div
                    className="container"
                    style={{
                        border: "1px solid lightgray",
                        borderRadius: "5px",
                        padding: "16px",
                        margin: "auto",
                        width: "70%",
                    }}
                >
                    <CreateExpense />
                </div>
            )}


        </div>
    );
};

export default Expense;
