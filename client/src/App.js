import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import Register from "./components/Register";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Navigation from "./components/Navigation";
import "bootstrap/dist/css/bootstrap.min.css";
import PublicRoute from "./components/PublicRoute";
import PrivateRoute from "./components/PrivateRoute";
import 'font-awesome/css/font-awesome.min.css';
import Profile from "./components/Profile";

export default function App() {
  return (
    <div className="container h-auto app px-0 border-right border-left border-light">
      <Router>
        <Navigation />
        <Switch>
          <PublicRoute restricted={true} component={Login} path="/" exact />
          <PublicRoute restricted={true} component={Login} path="/login" exact />
          <PublicRoute restricted={true} component={Register} path="/register" exact />
          <PrivateRoute component={Home} path="/home/:id?" exact />
          <PrivateRoute component={Profile} path="/profile/:id" exact />
        </Switch>
      </Router>
      <Footer />
    </div>
  );
}
