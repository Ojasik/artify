import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { Navbar } from './components/navbar';
import { Hero } from './components/hero';
import { Login } from './components/login';
function App() {
  return (
    <div className="App">
      <Router>
        {/* <Navbar /> */}
        {/* <Hero /> */}
        <Routes>
          <Route path="/" Component={Hero} />
          <Route path="/profile" />
          <Route path="/login" Component={Login} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
