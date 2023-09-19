import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import Header from './Header.jsx'
import Home from "./Home.jsx";
import FantasyDraft from "./FantasyDraft.jsx";
import MyLeagues from "./MyLeagues.jsx";
import TeamManagement from "./TeamManagement.jsx";
import LoginForm from "./LoginForm.jsx";
import SignUpForm from "./SignUpForm.jsx";

export default function App() {
  return (
      <div>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignUpForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/fantasy-draft" element={<FantasyDraft />}/>
            <Route path="/my-leagues" element={<MyLeagues />} />
            <Route path="/team-management" element={<TeamManagement />} />
          </Routes>
      </div>
  );
}
