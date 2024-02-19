import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Hero } from './components/hero';
import { Login } from './components/login';
import { Register } from './components/register';
import { Profile } from './components/profile';
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/profile/:username" element={<Profile />} />
          {/* <Route path="/profile" element={<Profile />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
