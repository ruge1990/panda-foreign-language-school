import React, { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../Utils/Common.js"
import SubjectForAdmin from "./SubjectForAdmin.js";
import SubjectForTeacher from "./SubjectForTeacher.js";
import SubjectForPupil from "./SubjectForPupil.js";

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

function Subjects(props) {

  const [allSubject, setAllSubject] = useState([]);

  const getAllSubject = async ()=>{
    //setIsLoading(true);
    if( props.history.location.state.role == "teacher") {
      //await axios.get('http://localhost:5000/api/v1/subject/list', {
      await axios.get('https://digital-grading-system.herokuapp.com/api/v1/subject/list', {
        headers: {
          Authorization: getToken(),
          teacherID: props.history.location.state.userID
        }
      })
      .then(response => {
        setAllSubject(response.data);
        //console.log(JSON.stringify(response.data));
        //setIsLoading(false);
      }).catch(error => {
        //setSubmitting(false);
        //setError(JSON.stringify(error));
      });
    }
    else if(props.history.location.state.role == "admin") {
      await axios.get('https://digital-grading-system.herokuapp.com/api/v1/subject/list', {
        headers: {
          Authorization: getToken(),
        }
      })
      .then(response => {
        setAllSubject(response.data);
        //console.log(JSON.stringify(response.data));
        //setIsLoading(false);
      }).catch(error => {
        //setSubmitting(false);
        //setError(JSON.stringify(error));
      });
    } else {
      await axios.post('http://localhost:5000/api/v1/class/pupil/contain', {
      //await axios.post('https://digital-grading-system.herokuapp.com/api/v1/class/pupil/contain', {
        pupilID: props.history.location.state.userID
      },{
        headers: {
          Authorization: getToken(),
        }
      })
      .then(response => {
        setAllSubject(response.data.subjects);
        //console.log(JSON.stringify(response.data));
        //setIsLoading(false);
      }).catch(error => {
        //setSubmitting(false);
        //setError(JSON.stringify(error));
      });
    }
    
  }

  useEffect(() => {
    getAllSubject();
  }, [props.location])

  return (
    <>
    {props.history.location.state.role == "teacher" ?
      <LayoutForTeacher
      allSubject={allSubject}
      {...props}/>
      :
      props.history.location.state.role == "admin" ?
      <LayoutForAdmin
      allSubject={allSubject}
      disabled="true"
      {...props}/>
      :
      <LayoutForPupil
      allSubject={allSubject}
      {...props}/>
    }
    </>
  );
}

function LayoutForAdmin ({allSubject, ...props}) {
  return (
    <Container fluid>
    <Card>
      <Card.Header>
        <Card.Title as="h4">Active Subjects</Card.Title>
      </Card.Header>
      <hr />
      <Card.Body>
      <Row>
        {allSubject.map((subject) =>(
          <SubjectForAdmin
          subject={subject}
          {...props}/>
        ))
        }
      </Row>
      </Card.Body>
    </Card>

    <Card>
      <Card.Header>
        <Card.Title as="h4">Archived Subjects</Card.Title>
      </Card.Header>
      <hr />
      <Card.Body>
      <Row>

      </Row>
      </Card.Body>
    </Card>
    </Container>
  )
}

function LayoutForTeacher ({allSubject, ...props}) {
  return (
    <Container fluid>
    <Card>
      <Card.Header>
        <Card.Title as="h4">Active Subjects</Card.Title>
      </Card.Header>
      <hr />
      <Card.Body>
      <Row sm="1">
        <Col>
        {allSubject.map((subject) =>(
          <SubjectForTeacher
          subject={subject}
          {...props}/>
        ))
        }
        </Col>
      </Row>
      </Card.Body>
    </Card>

    <Card>
      <Card.Header>
        <Card.Title as="h4">Archived Subjects</Card.Title>
      </Card.Header>
      <hr />
      <Card.Body>
      <Row>

      </Row>
      </Card.Body>
    </Card>
    </Container>
  )
}

function LayoutForPupil ({allSubject, ...props}) {
  return (
    <Container fluid>
    <Card>
      <Card.Header>
        <Card.Title as="h4">Active Subjects</Card.Title>
      </Card.Header>
      <hr />
      <Card.Body>
      <Row sm="1">
        <Col>
        {allSubject.map((subject) =>(
          <SubjectForPupil
          subject={subject}
          {...props}/>
        ))}
        </Col>
      </Row>
      </Card.Body>
    </Card>

    <Card>
      <Card.Header>
        <Card.Title as="h4">Archived Subjects</Card.Title>
      </Card.Header>
      <hr />
      <Card.Body>
      <Row>

      </Row>
      </Card.Body>
    </Card>
    </Container>
  )
}


export default Subjects;
