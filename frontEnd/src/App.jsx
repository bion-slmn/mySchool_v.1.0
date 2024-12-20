import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Use BrowserRouter
import Login from "./components/login";
import AuthProvider from "./service/authService";
import Navigationbar from "./components/navbar";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import UpdateSchool from "./components/school/updateSchool";
import UpdateTerm from "./components/school/updateTerm";
import UpdateGrades from "./components/grade/updateGrades";
import UpdateStudent from "./components/students/updateStrudent";
import { ViewPaymentonStudent } from "./components/payments/viewPayments";
import { ViewPaymentDetails } from "./components/payments/viewPayments";
import { UpdatePayment } from "./components/payments/updatePayment";
import School from "./pages/school";
import Grades from "./pages/grades";
import ViewStudentsinGrade from "./pages/student";
import { ViewStudent } from "./components/students/viewStudent";
import FeesAndPayments from "./pages/fees";


function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Navigationbar />
          
          <Routes>
            <Route path="login" element={<Login />} />
            <Route path="updateSchool" element={<UpdateSchool/>} />
            <Route path="school" element={<School />} />
            <Route path="updateTerm" element={<UpdateTerm />} />
            <Route path="grades" element={<Grades />} />
            <Route path="viewStudents" element={<ViewStudentsinGrade />} />
            <Route path="updateGrade" element={<UpdateGrades />} />
            <Route path="updateStudent" element={<UpdateStudent />} />
            <Route path="viewPayments" element={<ViewPaymentonStudent />} />
            <Route path="/viewPayments/PaymentDetails" element={<ViewPaymentDetails />} />
            <Route path="viewPayments/PaymentDetails/updatePayment" element={<UpdatePayment />} />
            <Route path="viewStudent" element={<ViewStudent />} />
            <Route path="viewFee" element={<FeesAndPayments />} />
          </Routes>
        </AuthProvider>
      </Router>
      <ToastContainer />
    </div>
  );
}

export default App;
