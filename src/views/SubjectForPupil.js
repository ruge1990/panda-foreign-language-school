import React, { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../Utils/Common.js"
// react-bootstrap components
import {
  Button,
  Card,
  Form,
  Container,
  Row,
  Col,
  FormControl,
  Table
} from "react-bootstrap";


function SubjectForPupil({subject, ...props}) {
  const [showMore, setShowMore] = useState(false);

  const [tests, setTests] = useState([]);
  const [grade, setGrade] = useState(null);

  useEffect(() => {
    getTests();
    //getPupilAndGrade();
  }, [props.history])

  useEffect(() => {
    getGrade();
  }, [tests])

  // get all available pupils in the subject
  const getTests = async () => {
    //await axios.get('http://localhost:5000/api/v1/subject/' + subject.subjectID, {
    await axios.get('https://digital-grading-system.herokuapp.com/api/v1/subject/' + subject.subjectID, {
      headers: {
        Authorization: getToken(),
      }
    })
    .then(response => {
      console.log(response.data.tests);
      setTests(response.data.tests);
      //setIsLoading(false);
    }).catch(error => {
      //setSubmitting(false);
      //setError(JSON.stringify(error));
    });  
  }

  // get all available pupils in the subject
  const getGrade = async () => {

      let total_grade = 0;
      let count = 0;
      for (const test of tests) {
        //await axios.get('http://localhost:5000/api/v1/user/list', {
        await axios.get('https://digital-grading-system.herokuapp.com/api/v1/test/' + test.testID + '/grade/' + props.history.location.state.userID, {
          headers: {
            Authorization: getToken(),
          }
        })
        .then(response => {
          //console.log(response.data.grades[0].grade);
          total_grade += response.data.grades[0].grade;
          count += 1;
          //setIsLoading(false);
        }).catch(error => {
          //setSubmitting(false);
          //setError(JSON.stringify(error));
        });
      }
      let average = (count == 0) ? 0 : total_grade/count ;
      setGrade(average);
  }

  return (
    <Card>
      <Card.Header onClick={() => {
        setShowMore(!showMore);}
        //setError(null);
        //setSuccess(null);
      } onMouseOver={(e) => {e.target.style.cursor = 'pointer'}}>
        <Card.Title as="h4">{subject.subjectname}</Card.Title>
        <Card.Subtitle className="text-muted text-right">
          SubjectID: {subject._id}
        </Card.Subtitle>
      </Card.Header>
      <Card.Body>
        My Average Grade: {grade}
      {showMore &&
      <>
 
      {/********************show test*************************/}
      <hr />
      <Row sm="1">
        {tests.length != 0 ?
        <>
        {tests.map((test, index) =>(
          <Test testID={test.testID} key={index} {...props}/>
        ))}
        </>
        :
        <Col>No tests so far</Col>
      }
      </Row>
      </>
      }
      </Card.Body>
    </Card>
  )
}

function Test({testID, ...props}) {
  const [state, setState] = useState({});
  const [grade, setGrade] = useState(0);

  useEffect(() => {
    getTestInfo();
    getGrade();
  }, [props.history])

  // get information of test
  const getGrade = async () => {
    //await axios.get('http://localhost:5000/api/v1/test/' + test.testID, {  
    await axios.get('https://digital-grading-system.herokuapp.com/api/v1/test/' + testID + '/grade/' + props.history.location.state.userID, {
      headers: {
        Authorization: getToken(),
      }
    })
    .then(response => {
      setGrade(response.data.grades[0].grade);
      console.log(response.data.grades[0].grade);
      //setIsLoading(false);
    }).catch(error => {
      //setSubmitting(false);
      //setError(JSON.stringify(error));
    });
  }

  // get information of test
  const getTestInfo = async () => {
  //await axios.get('http://localhost:5000/api/v1/test/' + testID, {  
  await axios.get('https://digital-grading-system.herokuapp.com/api/v1/test/' + testID, {
    headers: {
      Authorization: getToken(),
    }
  })
  .then(response => {
    setState({...state,
      testname: response.data.testname,
      date: response.data.date
    });
    //console.log(response);
    //setIsLoading(false);
  }).catch(error => {
    //setSubmitting(false);
    //setError(JSON.stringify(error));
  });
  }

  return (
    <Col sm="6">
    <Card>
      <Card.Header >
        <Card.Title as="h4">{state.testname}</Card.Title>
        <Card.Subtitle className="text-muted text-right">Date: {state.date}</Card.Subtitle>
      </Card.Header>
      <Card.Body>
      My Grade: {grade}
      </Card.Body>
    </Card>
    </Col>
  )
}


export default SubjectForPupil;