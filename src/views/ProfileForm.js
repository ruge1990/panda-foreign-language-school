import React from "react";


// react-bootstrap components
import {
  Form,
  Row,
  Col,
} from "react-bootstrap";

function ProfileForm(props) {
  const [state, setState] = props.functions;
  
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <>
    <Row>
    <Col className="pr-1" md="7">
      <Form.Group>
      <label>userID (disabled)</label>
      <Form.Control
        defaultValue={state.userID}
        disabled
        placeholder="userID"
        type="text"
      ></Form.Control>
      </Form.Group>
    </Col>
    <Col className="pl-1" md="5">

      {(props.isCreate == false) ?
      <Form.Group>
      <label>role (disabled)</label>
      <Form.Control
        defaultValue={state.role}
        disabled
        placeholder="role"
        type="text"
      ></Form.Control>
      </Form.Group>
      :
      <Form.Group>
      <label>role</label>
      <Form.Control
        as="select"
        name="role"
        onChange={handleInputChange}
      >
        <option>pupil</option>
        <option>teacher</option>
        <option>admin</option>
      </Form.Control>
      </Form.Group>
      }
    </Col>
    </Row>

    <Row>
    <Col className="pr-1" md="6">
      <Form.Group>
      <label>user name</label>
      <Form.Control
        defaultValue={state.username}
        placeholder="user name"
        type="text"
        required
        name="username"
        onChange={handleInputChange}
      ></Form.Control>
      </Form.Group>
    </Col>
    <Col className="pl-1" md="6">
      <Form.Group>
      <label>password</label>
      <Form.Control
        defaultValue={state.password}
        placeholder="password"
        type="password"
        //aria-label="Password"
        required
        name="password"
        onChange={handleInputChange}
      ></Form.Control>
      </Form.Group>
    </Col>
    </Row>

    <Row>
    <Col className="pr-1" md="6">
      <Form.Group>
      <label>first name</label>
      <Form.Control
        defaultValue={state.forename}
        placeholder="first name"
        type="text"
        required
        name="forename"
        onChange={handleInputChange}
      ></Form.Control>
      </Form.Group>
    </Col>
    <Col className="pl-1" md="6">
      <Form.Group>
      <label>last name</label>
      <Form.Control
        defaultValue={state.surname}
        placeholder="last name"
        type="text"
        required
        name="surname"
        onChange={handleInputChange}
      ></Form.Control>
      </Form.Group>
    </Col>
    </Row>
    </>
  );
}


export default ProfileForm;