import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Use BrowserRouter
import Login from "./components/login";
import AuthProvider from "./service/authService";
import Navigationbar from "./components/navbar";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ViewSchool from "./components/school/viewSchool";
import UpdateSchool from "./components/school/updateSchool";
import CreateTerm from "./components/school/createTerm";
import ViewTerms from "./components/school/viewTerm";
import UpdateTerm from "./components/school/updateTerm";
import CreateGrade from "./components/grade/createGrade";
import ViewGrades from "./components/grade/viewGrade";
import UpdateGrades from "./components/grade/updateGrades";


function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Navigationbar />
         
          <CreateTerm />
          <CreateGrade />
          <ViewGrades />
          <Routes>
            <Route path="login" element={<Login />} />
            <Route path="updateSchool" element={<UpdateSchool/>} />
            <Route path="viewSchool" element={<ViewSchool />} />
            <Route path="updateTerm" element={<UpdateTerm />} />
            <Route path="viewGrades" element={<ViewGrades />} />
            <Route path="updateGrade" element={<UpdateGrades />} />
          </Routes>
        </AuthProvider>
      </Router>
      <ToastContainer />
    </div>
  );
}

export default App;
