import "./App.css";
import { BrowserRouter, HashRouter, Route, Routes } from "react-router-dom";
import Landing from "./components/landing";
// import Dashboard from "./components/dashboard";
import TabsDash from "./components/tabsDash";
import SignInPage from "./components/signIn";
import SignUpPage from "./components/signUp";

function App() {

  return (
    <>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/dashboard" element={<TabsDash />} />
          <Route path="/tabsDash" element={<TabsDash />} />
        </Routes>
      </HashRouter>
    </>
  );
}

export default App;
