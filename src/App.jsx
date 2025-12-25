
import './App.css';
import { Link } from 'react-router-dom';

function App() {
  return (
    <div>
      <Link to={'/dashboard'} >Sign Up</Link>
      <Link to={'/dashboard'} >Log in</Link>
    </div>
  );
}

export default App;
