import React, { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../Utils/Common.js"
import ProfileForm from "./ProfileForm.js";

// react-bootstrap components
import {
  Button,
  Card,
  Form,
  Container,
  Row,
  Col,
  FormControl,
} from "react-bootstrap";

function Profile(props) {

  const [state, setState] = useState({
    userID: props.location.state.userID,
    role: props.location.state.role,
    username: props.location.state.username,
    password: props.location.state.password,
    forename: props.location.state.forename,
    surname: props.location.state.surname
  });

  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // handle button click of submit form
  const handleSubmit = e => {
    e.preventDefault()
    
    setError(null);
    setSuccess(null);
    setSubmitting(true);
    //console.log("before submit: " + JSON.stringify(state));
    axios.put('https://digital-grading-system.herokuapp.com/api/v1/user/update/' + props.location.state.userID, state,
    {
      headers: {
        Authorization: getToken()
      }
    })
    .then(response => {
      setTimeout(() => {
        setSubmitting(false);

        if(response.data.error == true){
          setError("user name already exists, try another one");
        } else {
          setSuccess("updated success");
          console.log("before submit: " + JSON.stringify(props.location.state));
          console.log("after submit: " + JSON.stringify(response.data.user));

          props.history.push({
            pathname: '/profile',
            state: response.data.user
          });
        }
      }, 500); 
    }).catch(error => {
      setSubmitting(false);
      setError(JSON.stringify(error));
    });
  }


  return (
    <>
      <Container fluid>
        <Row>
          <Col md="12">
            <Card>
              <Card.Header>
                <Card.Title as="h4">My Profile</Card.Title>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <ProfileForm functions={[state, setState]} isCreate={false} />
                    
                  {success && <p style={{ color: 'green' }}>{success}</p>}
                  {error && <p style={{ color: 'red' }}>{error}</p>}
                  <Button
                    className="btn-fill pull-right"
                    type="submit"
                    variant="info"
                  >
                    {submitting ? 'Updating...' : 'Update profile'}
                  </Button>
                  <div className="clearfix"></div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}


export default Profile;
