import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  Home,
  Profile,
  ForgotPassword,
  Offers,
  SignIn,
  SignUp,CreateListing ,EditListing,Listing
} from "./pages/index";
import Header from "./compnents/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from "./compnents/PrivateRoute";
function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<PrivateRoute/>}>
        <Route path="/profile" element={<Profile />} />

        </Route>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/category/:categoryType/:listing" element={<Listing />} />
        <Route path="/create-listing" element={<PrivateRoute/>}>
        <Route path="/create-listing" element={<CreateListing />} />

        </Route>
        <Route path="/edit-listing" element={<PrivateRoute/>}>
        <Route path="/edit-listing/:listing" element={<EditListing />} />

        </Route>

      </Routes>
      <div className="bg-red-500">Hello World</div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </BrowserRouter>
  );
}

export default App;
