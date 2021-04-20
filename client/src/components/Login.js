import React, {useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import { doLogin } from "../utils/utils";
import { Container, Row, Col } from "react-bootstrap";
import Main from "./Main";

export default function Login() {
  let history = useHistory();
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState([]);

  const saveFormData = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axios.post(
        "/api/auth/login",
        JSON.stringify(values),
        config
      );
      doLogin(response.data);
      history.push("/home");
    } catch (error) {
      setErrors(error.response.data.errors);
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault(); // Prevent default submission
    try {
      await saveFormData();
    } catch (e) {
      setErrors([{ msg: `Login failed! ${e.message}` }]);
    }
  };
  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <div className="mt-2 border py-2">
      <Container>
        <Row>
          <Col md={7} className="border-right mb-2">
            <Main />
          </Col>
          <Col>
            <Form onSubmit={onSubmit}>
              <h3>Login</h3>
              {errors &&
                errors.map((error, idx) => (
                  <Alert key={idx} variant="danger" className="my-1 py-2">
                    {error.msg}
                  </Alert>
                ))}
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" name="email" onChange={(e) => onChange(e)} placeholder="Enter email" />
              </Form.Group>
              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" onChange={(e) => onChange(e)} name="password" placeholder="Password" />
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
              <Link to="/register" className="ml-2">
                Don't you have an account? Create one
              </Link>
            </Form>{" "}
          </Col>
        </Row>
      </Container>
    </div>
  );
}
