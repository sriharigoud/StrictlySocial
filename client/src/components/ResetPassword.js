import React, { useEffect, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import { doLogin, doLogout } from "../utils/utils";
import { Container, Row, Col } from "react-bootstrap";
import Main from "./Main";
export default function ResetPassword() {
  let history = useHistory();
  let { pathname } = useLocation();
  const [values, setValues] = useState({
    password: "",
  });

  const [errors, setErrors] = useState([]);
  const [user, setUser] = useState({});

  const saveFormData = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axios.post(
        "/api/users/reset/" + pathname.replace("/reset/", ""),
        JSON.stringify(values),
        config
      );
      doLogout();
      alert(response.data)
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
  useEffect(() => {
    async function getUserInfo() {
      try {
        let response = await axios(
          "/api/users/reset/" + pathname.replace("/reset/", "")
        );
        setUser(response.data);
        setErrors([]);
      } catch (error) {
        setErrors(error.response.data.errors);
      }
    }
    getUserInfo();
  }, []);
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
          {errors &&
                errors.map((error, idx) => (
                  <Alert key={idx} variant="danger" className="my-1 py-2">
                    {error.msg}
                  </Alert>
                ))}
            {user && errors && !errors.length && <Form onSubmit={onSubmit}>
              {/* <h3>Register</h3> */}

              <Form.Group controlId="formBasicPassword">
                <Form.Label>New Password</Form.Label>
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
            </Form>}
          </Col>
        </Row>
      </Container>
    </div>
  );
}
