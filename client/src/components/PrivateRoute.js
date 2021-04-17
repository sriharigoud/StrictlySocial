import React from "react";
import { Route, Redirect } from "react-router-dom";
import { isLogin } from "../utils/utils";

const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      render={(props) =>{
        return isLogin() ? <Component  {...rest} {...props} /> : <Redirect to="/login" />
      }}
    />
  );
};

export default PrivateRoute;
