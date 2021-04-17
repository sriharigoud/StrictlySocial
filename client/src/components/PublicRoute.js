import React from "react";
import { Route, Redirect } from "react-router-dom";
import { isLogin } from "../utils/utils";

const PublicRoute = ({ component: Component, restricted, ...rest }) => {
    console.log(isLogin())
  return (
      
    <Route
      {...rest}
      render={(props) =>
        isLogin() && restricted ? (
          <Redirect to="/home" />
        ) : (
          <Component  {...rest} {...props} />
        )
      }
    />
  );
};

export default PublicRoute;
