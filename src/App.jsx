import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { About } from "./pages/about";
import { ContactUs } from "./pages/contactus";
import { SignUp } from "./pages/signup";
import { Login } from "./pages/login";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/footer/footer";
import { Logout } from "./pages/logout";
import { Product } from "./pages/Products";
import { AddProduct } from "./pages/addProduct";
import { ProductDetails } from "./pages/productDetails";
import { Profile } from "./pages/profile";
import { AdminLayout } from "./components/layouts/admin-Layout";
import { AdminUser } from "./pages/adminUser";
import { AdminContact } from "./pages/adminContact";
import { AdminUserUpdate } from "./pages/adminUser-update";
import { AdminProduct } from "./pages/adminProduct";
import { Account } from "./components/layouts/userAccount-Layout";
import { MyBids } from "./pages/bids";
import { WinningProducts } from "./pages/winningProducts";
import { Order } from "./pages/order";

import ProductEditPage from "./pages/productEdit";


const app = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/product" element={<Product />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/addProduct" element={<AddProduct />} />
        <Route path="/productDetails" element={<ProductDetails />} />
        <Route path="/productEdit" element={<ProductEditPage />} />
        <Route path="/order" element={<Order />} />
        <Route path="/account" element={<Account />} >
          <Route path="profile" element={<Profile />}/>
          <Route path="bids" element={<MyBids />} />
          <Route path="winner" element={<WinningProducts />} />
          {/* <Route path="products" element={MyProducts} />
           */}
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          
          <Route path="user" element={<AdminUser />} />
          <Route path="user/update" element={<AdminUserUpdate/>} />
          <Route path="contact" element={<AdminContact />} />
          <Route path="products" element={<AdminProduct/>} />
          

        
        </Route>
        
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default app;
