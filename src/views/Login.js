/*!

=========================================================
* Argon Dashboard React - v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, {useState} from "react";
import axios from 'axios';
import {setUserSession, encrypt} from '../Utils/Common'

// reactstrap components
import {
  Button,
  Card,
  Form,
  FormControl,
  InputGroup,
  Col,
} from "react-bootstrap";



const Login = (props) => {
  const username = useFormInput('');
  const password = useFormInput('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // handle button click of login form
  const handleLogin = () => {
    setError(null);
    setLoading(true);
    var encrypted = encrypt(password.value);
    axios.post('https://digital-grading-system.herokuapp.com/api/v1/user/login', { username: username.value, password: encrypted })
    .then(response => {
      setLoading(false);
      setUserSession(response.data);
      props.history.push({
        pathname: '/dashboard',
        state: response.data.user
      });

    }).catch(error => {
      setLoading(false);
      if (error.response.status === 401 || error.response.status === 400) setError(error.response.data.message);
      else setError("Something went wrong. Please try again later.");
    });

  }

  return (
    <>
      <Col md="9" lg="6">
        <br />
        <br />
        <Card className="shadow border-0">
          <Card.Header>
            <div className="text-muted text-center mt-2 mb-3">
              <h3>Welcome to Digital Grading System</h3>
            </div>
          </Card.Header>

          <Card.Body>
            <Form>
              <div className="mx-5" >
              <InputGroup className="mb-3" >
                <InputGroup.Prepend>
                  <InputGroup.Text>
                    <i className="nc-icon nc-circle-09" />
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  placeholder="Username"
                  //aria-label="Username"
                  {...username}
                />
              </InputGroup>
              <InputGroup className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Text>
                    <i className="nc-icon nc-key-25" />
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  type="password"
                  placeholder="Password"
                  //aria-label="Password"
                  {...password}
                />
              </InputGroup>
              {error && <p style={{ color: 'red' }}>{error}</p>}
              </div>

              <div className="text-center">
                <Button 
                  className="btn-fill pull-right"
                  variant="info" 
                  onClick={handleLogin}
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Login'}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </>
  );

};

const useFormInput = initialValue => {
  const [value, setValue] = useState(initialValue);
 
  const handleChange = e => {
    setValue(e.target.value);
  }
  return {
    value,
    onChange: handleChange
  }
}
export default Login;
