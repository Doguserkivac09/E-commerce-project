import { Redirect, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

/**
 * Protects routes that require login. Redirects to /login if user is not logged in.
 * Usage: <Route path="/checkout"><ProtectedRoute><Checkout /></ProtectedRoute></Route>
 */
function ProtectedRoute({ children }) {
  const user = useSelector((state) => state.client?.user);
  const location = useLocation();
  const isLoggedIn = user && (user.email || user.id || user.name);

  if (!isLoggedIn) {
    return (
      <Redirect
        to={{
          pathname: "/login",
          state: { from: location.pathname || location.pathname || "/" },
        }}
      />
    );
  }

  return children;
}

export default ProtectedRoute;
