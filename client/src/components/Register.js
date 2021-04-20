import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import { doLogin } from "../utils/utils";
import { Container, Row, Col } from "react-bootstrap";
import Main from "./Main";
export default function Regsiter() {
  let history = useHistory();
  const [values, setValues] = useState({
    name: "",
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
        "/api/users/register",
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
      setErrors([{ msg: `Registration failed! ${e.message}` }]);
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
              <h3>Register</h3>
              {errors &&
                errors.map((error, idx) => (
                  <Alert key={idx} variant="danger" className="my-1 py-2">
                    {error.msg}
                  </Alert>
                ))}
              <Form.Group controlId="formBasicName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  name="name"
                  onChange={(e) => onChange(e)}
                  type="text"
                  placeholder="Name"
                />
              </Form.Group>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  name="email"
                  type="email"
                  onChange={(e) => onChange(e)}
                  placeholder="Enter email"
                />
              </Form.Group>
              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  name="password"
                  type="password"
                  onChange={(e) => onChange(e)}
                  placeholder="Password"
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
              <Link to="/login" className="ml-2">
                Go back to login
              </Link>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
