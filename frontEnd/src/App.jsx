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


function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Navigationbar />
         
          <CreateTerm />
          <ViewTerms />
          <Routes>
            <Route path="login" element={<Login />} />
            <Route path="updateSchool" element={<UpdateSchool/>} />
            <Route path="viewSchool" element={<ViewSchool />} />
            <Route path="updateTerm" element={<UpdateTerm />} />
          </Routes>
        </AuthProvider>
      </Router>
      <ToastContainer />
    </div>
  );
}

export default App;
