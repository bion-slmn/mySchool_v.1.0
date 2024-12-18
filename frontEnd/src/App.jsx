import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Use BrowserRouter
import Login from "./components/login";
import AuthProvider from "./service/authService";
import Navigationbar from "./components/navbar";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ViewSchool from "./components/school/viewSchool";
import UpdateSchool from "./components/school/updateSchool";
import UpdateTerm from "./components/school/updateTerm";
import ViewGrades from "./components/grade/viewGrade";
import UpdateGrades from "./components/grade/updateGrades";
import UpdateStudent from "./components/students/updateStrudent";
import CreateFee from "./components/fees/createFee";
import { ViewFee, ViewFeeInClassOrTerm } from "./components/fees/viewFees";


function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Navigationbar />
         <ViewFeeInClassOrTerm type="grade" />
         
          <Routes>
            <Route path="login" element={<Login />} />
            <Route path="updateSchool" element={<UpdateSchool/>} />
            <Route path="viewSchool" element={<ViewSchool />} />
            <Route path="updateTerm" element={<UpdateTerm />} />
            <Route path="viewGrades" element={<ViewGrades />} />
            <Route path="updateGrade" element={<UpdateGrades />} />
            <Route path="updateStudent" element={<UpdateStudent />} />
            <Route path="viewFee" element={<ViewFee />} />
          </Routes>
        </AuthProvider>
      </Router>
      <ToastContainer />
    </div>
  );
}

export default App;
