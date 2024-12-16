import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom"; // Use BrowserRouter here
import Login from "./components/login";
import AuthProvider from "./service/authService";
import Navigationbar from "./components/navbar";

function App() {
  return (
    <BrowserRouter> {/* Wrap your whole app in BrowserRouter */}
      <AuthProvider>
        <div className="App">
          <Navigationbar />
          <Routes>
            <Route path="login" element={<Login />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
