import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { verifyTokenThunk } from "./redux/actions/clientActions";
import { fetchCategoriesThunk } from "./redux/actions/productActions";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import PageContent from "./layout/PageContent";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Team from "./pages/Team";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(verifyTokenThunk());
    }
    dispatch(fetchCategoriesThunk());
  }, [dispatch]);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <PageContent>
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/shop/:gender/:categoryName/:categoryId/:productNameSlug/:productId">
              <ProductDetail />
            </Route>
            <Route path="/shop/:gender/:categoryName/:categoryId">
              <Shop />
            </Route>
            <Route path="/shop">
              <Shop />
            </Route>
            <Route path="/team">
              <Team />
            </Route>
            <Route path="/about">
              <About />
            </Route>
            <Route path="/contact">
              <Contact />
            </Route>
            <Route path="/signup">
              <Signup />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/cart">
              <Cart />
            </Route>
            <Route path="/checkout">
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            </Route>
            <Route path="/orders">
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            </Route>
            <Route path="/product/:id">
              <ProductDetail />
            </Route>
          </Switch>
        </PageContent>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
