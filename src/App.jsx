
import './App.css';
import { Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
function App() {
  const {loading , user } = useAuth()
  const navigate = useNavigate()
 useEffect(() => {
    if (!loading) {
      if (user) {
        navigate("/dashboard");
      }
    }
  }, []);
  return (
    <div>
      <Link to={'/auth'} >Sign Up</Link>
      <Link to={'/auth'} >Log in</Link>
    </div>
  );
}

export default App;
