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
} from "react-bootstrap";

function SubjectForAdmin({subject, ...props}) {
  const [teacherName, setTeacherName] = useState(null);
  const [state, setState] = useState({
    classID: props.classID
  });
  const [teachers, setTeachers] = useState([]);

  const [showMore, setShowMore] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setState({...state,
      subjectname: subject.subjectname,
      teacherID: subject.teacherID
    });
    getTeacherName();
  }, [subject.teacherID])


  const getTeacherName = async () => {
    //setIsLoading(true);
    await axios.get('https://digital-grading-system.herokuapp.com/api/v1/user/' + subject.teacherID, 
    {
      headers: {
        Authorization: getToken()
      }
    })
    .then(response => {
      //console.log(JSON.stringify(response.data));
      setTeacherName(response.data.forename + " " + response.data.surname);
      console.log('reset teacher name');
      //setIsLoading(false);
    }).catch(error => {
      //setSubmitting(false);
      //setError(JSON.stringify(error));
    });
  }

  // handle button click of updating
  const handleUpdate = e => {
    e.preventDefault()

    setError(null);
    setSuccess(null);

    if(state.teacherID == "") {
      setError("please assign a teacher");
      return
    }
    console.log(state);
    setUpdating(true);

    //axios.put('http://localhost:5000/api/v1/subject/update/' + subject.subjectID, state,
    axios.put('https://digital-grading-system.herokuapp.com/api/v1/subject/update/' + subject.subjectID, state,
    {
      headers: {
        Authorization: getToken()
      }
    })
    .then(response => {
      setTimeout(() => {
        setUpdating(false);
        if(response.data.error == true){
          console.log(response.data.message);
          setError("subject name already exists, try another one");
        } else {
          setShowUpdate(false);
          setShowMore(false);
          setSuccess("subject updated");
          //window.location.reload();

          console.log(JSON.stringify(props));
          props.history.push({
            pathname: props.history.location.pathname,
            state: props.location.state
          })
          getTeacherName();
          setTimeout(() => {setSuccess(null)}, 3000);
        }
      }, 500); 
    }).catch(error => {
      setUpdating(false);
      console.log(error.message);
      setError(JSON.stringify(error));
    });
  }
  
  const handleDelete = async ()=>{

    //axios.delete('http://localhost:5000/api/v1/subject/delete/' + subject.subjectID, 
    axios.delete('https://digital-grading-system.herokuapp.com/api/v1/subject/delete/' + subject.subjectID,
    {
      headers: {
        Authorization: getToken(),
        classID: props.classID,
      }
    }).then(response => {
        //alert("Person deleted sucessfully");
        props.history.push({
          pathname: '/class',
          state: props.location.state
        })
    }).catch(error => {
        console.log(error.message);
        setError(JSON.stringify(error));
    });
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const getTeacher = async () => {
    await axios.get('https://digital-grading-system.herokuapp.com/api/v1/user/list', {
      headers: {
        Authorization: getToken(),
        role: "teacher"
      }
    })
    .then(response => {
      setTeachers(response.data);

      //setIsLoading(false);
    }).catch(error => {
      //setSubmitting(false);
      //setError(JSON.stringify(error));
    });
  }

  return (
    <Col md="4" sm="6">
    <Form onSubmit={handleUpdate}>
    <Card>
      <Card.Header onClick={() => {
        if(!showUpdate && !props.disabled) {setShowMore(!showMore);}
        //setError(null);
        //setSuccess(null);
      }} onMouseOver={(e) => {e.target.style.cursor = 'pointer'}}>
        <Card.Title as="h4">
        {showUpdate ?
          <Form.Group>
          <label>subject name</label>
          <Form.Control
            defaultValue={state.subjectname}
            placeholder="role"
            type="text"
            name="subjectname"
            onChange={handleInputChange}
          ></Form.Control>
          </Form.Group>
          :
          state.subjectname}
        </Card.Title>
      </Card.Header>
      <Card.Body>
      {showUpdate ?
        <Form.Group>
        <label>Teacher</label>
        <Form.Control
          defaultValue={state.teacherID}
          as="select"
          name="teacherID"
          onChange={handleInputChange}
        >
        <option value=""></option>
        {teachers.map((teacher) => (
          <option value={teacher._id}>{teacher.username}</option>
        ))}
        </Form.Control>
        </Form.Group>
        :
        teacherName
      }
      {showMore &&
        <Row>
        <Button
          className="mx-3 my-2 btn-fill"
          type="submit"
          variant="primary"
          onClick={(e) => {
            if(!showUpdate) {
              e.preventDefault();
              setShowUpdate(true);
              getTeacher();
              setError(null);
              setSuccess(null);
            }
          }}
        >
          {updating ? "Updating..." : "Update"}
        </Button>
        {(showUpdate && !updating) &&
        <Button
          className="mx-3 my-2 btn-fill"
          variant="secondary"
          onClick={() => {
            setShowUpdate(false);
            setShowMore(false);
            setError(null);
            setSuccess(null);
          }}
        >
          Cancel
        </Button>
        }
        {(!showUpdate && !updating) &&
        <Button 
          className="mx-3 my-2 btn-fill"
          variant="danger"
          onClick={handleDelete}
        >
          Delete
        </Button>
        }
        </Row>  
      }
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      </Card.Body>
    </Card>
    </Form>
    </Col>
  )
}

export default SubjectForAdmin;