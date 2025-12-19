import { useState } from "react";
import "./App.css";
import { Link, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Dashboard from "./pages/Dashboard";
import Analysis from "./pages/Analysis";
import Notes from "./pages/Notes";
import Session from "./pages/Session";
import Focusmode from './components/Focusmode'
function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <nav>
        {/* this will be displayed through out the app  */}
        <Link to={'/'}>Home</Link>
        <Link to={"/focus"}>Focus Mode</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} /> {/* First page that is displayed */}
        <Route path="/focus" element={<Focusmode />} ></Route>
        <Route path="/dashboard" element={<Dashboard />}> {/* after Login first page */}
        <Route path="/dashboard/session" element={<Session />} /> {/* drop downpart in dashboard - also it consists of all the session along with there in detailed analysis and notes */}
        <Route path="/dashboard/analysis" element={<Analysis />} /> {/* Overall analysis of the student */}
        <Route path="/dashboard/notes" element={<Notes />} /> {/* all topic wise notes */}
        </Route>
      </Routes>

    </div>
  );
}

export default App;
