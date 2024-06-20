import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainPage } from './pages/MainPage';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { Profile } from './components/Profile/Profile';
import { UserProvider } from './contexts/UserContext';
import { CategoryProvider } from './contexts/CategoryContext';
import { UserRegistry } from './pages/UserRegistry';
import { ArtworkRegistry } from './pages/ArtworkRegistry';
import OrderPage from './components/order/OrderPage';
import { OrderRegistry } from './pages/OrderRegistry';

import Cart from './components/Cart';
function App() {
  return (
    <div className="App">
      <UserProvider>
        <CategoryProvider>
          <Router>
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/profile/:username" element={<Profile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/userregistry" element={<UserRegistry />} />
              <Route path="/artworkregistry" element={<ArtworkRegistry />} />
              <Route path="/orderregistry" element={<OrderRegistry />} />
              <Route path="/register" element={<Register />} />
              <Route path="/order/:id" element={<OrderPage />} />
              <Route path="/order" element={<OrderPage />} />
              <Route path="/cart" element={<Cart />} />
            </Routes>
          </Router>
        </CategoryProvider>
      </UserProvider>
    </div>
  );
}

export default App;
