import React, { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../Utils/Common.js"
import Subject from "./SubjectForAdmin"

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


function Classes(props) {
  const [allClass, setAllClass] = useState([]);
  const [showCreateClass, setShowCreateClass] = useState(false);
  const [creatingClass, setCreatingClass] = useState(false);  
  const [classname, setClassName] = useState(null);

  const [classSuccess, setClassSuccess] = useState(null);
  const [classError, setClassError] = useState(null);

  useEffect(() => {
    getAllClass();
  }, [props.location])

  const getAllClass = async ()=>{
    //setIsLoading(true);
    await axios.get('https://digital-grading-system.herokuapp.com/api/v1/class/list',
    {
      headers: {
        Authorization: getToken()
      }
    })
    .then(response => {
      setAllClass(response.data);
      //console.log(JSON.stringify(response.data));
      //setIsLoading(false);
    }).catch(error => {
      //setSubmitting(false);
      //setError(JSON.stringify(error));
    });
  }

  // handle button click of create class
  const handleCreateClass = e => {
    e.preventDefault()

    setClassError(null);
    setClassSuccess(null);

    setCreatingClass(true);

    //axios.post('http://localhost:5000/api/v1/class/create/', {"classname": classname},
    axios.post('https://digital-grading-system.herokuapp.com/api/v1/class/create/', {"classname": classname},
    {
      headers: {
        Authorization: getToken()
      }
    })
    .then(response => {
      setTimeout(() => {
        setCreatingClass(false);
        if(response.data.error == true){
          console.log(response.data.message);
          setClassError("class name already exists, try another one");

        } else {
          setShowCreateClass(false);
          setClassSuccess("class created");
          //window.location.reload();

          //console.log("after update: " + JSON.stringify(props));
          props.history.push({
            pathname: '/class',
            state: props.location.state
          })
          setTimeout(() => {setClassSuccess(null)}, 3000);
        }
      }, 500); 
      setClassName("");
    }).catch(error => {
      setCreatingClass(false);
      console.log(error.message);
      setClassError(JSON.stringify(error));
    });
  }

  return (
    <>
    <Container fluid>
      <Row>
        <Col>
          {allClass.map((_class, index) =>(
            <Class
            _class={_class}
            key={index}
            {...props}/>
          ))}
          <Form onSubmit={handleCreateClass}>
          {showCreateClass &&
          <Row md="3">
            <Col>
            <Card>
            <Card.Body>
              <Form.Group>
              <label>class name</label>
              <Form.Control
                placeholder="class name"
                type="text"
                name="classname"
                onChange={e => setClassName(e.target.value)}
              />
              </Form.Group>
            </Card.Body>
            </Card>
            </Col>
          </Row>
          }
          {classSuccess && <p style={{ color: 'green' }}>{classSuccess}</p>}
          {classError && <p style={{ color: 'red' }}>{classError}</p>}

          <Row>
          <Col>
          <Button
            className="mx-2 mb-2 btn-fill"
            type="submit"
            variant="success"
            onClick={(e) => {
              if(!showCreateClass) {
                e.preventDefault();
                setShowCreateClass(true);
              }
            }}
          >
          {creatingClass ? "Creating..." : showCreateClass ? "Create" : "New Class"}
          </Button>
          {showCreateClass &&
          <Button
            className="mx-2 mb-2 btn-fill"
            variant="secondary"
            onClick={() => {
              setShowCreateClass(false);
              setClassError(null);
              setClassSuccess(null);
            }}
          >
            Cancel
          </Button>
          }
          </Col>
          </Row>

          </Form>
        </Col>
      </Row>
    </Container>
    </>
  );
}

function Class({_class, ...props}) {
  const [showMore, setShowMore] = useState(false);
  const [showCreateSubject, setShowCreateSubject] = useState(false);
  const [creatingSubject, setCreatingSubject] = useState(false);
  const [showAssign, setShowAssign] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [deletingClass, setDeletingClass] = useState(false);
  const [showUpdateClass, setShowUpdateClass] = useState(false);
  const [updatingClass, setUpdatingClass] = useState(false);

  const [subjectSuccess, setSubjectSuccess] = useState(null);
  const [subjectError, setSubjectError] = useState(null);
  const [pupilSuccess, setPupilSuccess] = useState(null);
  const [pupilError, setPupilError] = useState(null);
  const [classSuccess, setClassSuccess] = useState(null);
  const [classError, setClassError] = useState(null);

  const [state, setState] = useState({});

  const [pupilID, setPupilID] = useState(null);
  const [classname, setClassname] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [pupils, setPupils] = useState([]);

  useEffect(() => {
    setState({...state, "classID": _class._id});
    setClassname(_class.classname);
  }, [_class._id])

  // handle button click of assigning
  const handleAssignPupil = e => {
    e.preventDefault()

    setPupilError(null);
    setPupilSuccess(null);

    if(pupilID == null) {
      setPupilError("please assign a pupil");
      return
    }

    //axios.post('http://localhost:5000/api/v1/class/pupil/contain', {
    axios.post('https://digital-grading-system.herokuapp.com/api/v1/class/pupil/contain', {
      "pupilID": pupilID,
    },{
      headers: {
        Authorization: getToken()
      }
    }).then( response => {
      if(response.data._id) {
        //axios.post('http://localhost:5000/api/v1/class/' + response.data._id + '/pupil/assign', {
        axios.post('https://digital-grading-system.herokuapp.com/api/v1/class/' + response.data._id + '/pupil/assign', {
          "pupilID": pupilID,
          "assign": 'false'
        },
        {
          headers: {
            Authorization: getToken()
          }
        })
      }
    })
    setAssigning(true);
    //axios.post('http://localhost:5000/api/v1/class/' + _class._id + '/pupil/assign', {
    axios.post('https://digital-grading-system.herokuapp.com/api/v1/class/' + _class._id + '/pupil/assign', {
      "pupilID": pupilID,
      "assign": 'true'
    },
    {
      headers: {
        Authorization: getToken()
      }
    })
    .then(response => {
      setTimeout(() => {
        setAssigning(false);
        if(response.data.error == true){
          console.log(response.data.message);
          setPupilError("error");
        } else {
          setShowAssign(false);
          setPupilSuccess("pupil assigned");
          //window.location.reload();

          //console.log("after update: " + JSON.stringify(props));
          props.history.push({
            pathname: '/class',
            state: props.location.state
          })
          setPupilID(null);
          setTimeout(() => {setPupilSuccess(null)}, 3000);
        }
      }, 500); 
    }).catch(error => {
      setAssigning(false);
      console.log(error.message);
      setPupilError(JSON.stringify(error));
    });
  }
  
  // handle button click of creating
  const handleCreateSubject = e => {
    e.preventDefault()

    setSubjectError(null);
    setSubjectSuccess(null);

    if(!state.teacherID) {
      setSubjectError("please assign a teacher");
      return
    }
    const s = _class.subjects.find( ({subjectname}) => subjectname === state.subjectname);
    if(s) {
      setSubjectError("subject name already exists, try another one");
      return
    }
    setCreatingSubject(true);
    console.log(state);
    //axios.post('http://localhost:5000/api/v1/subject/create', state,
    axios.post('https://digital-grading-system.herokuapp.com/api/v1/subject/create/', state,
    {
      headers: {
        Authorization: getToken()
      }
    })
    .then(response => {
      setTimeout(() => {
        setCreatingSubject(false);
        if(response.data.error == true){
          console.log(response.data.message);
          setSubjectError(response.data.message);
        } else {
          setShowCreateSubject(false);
          setSubjectSuccess("new subject created");
          //window.location.reload();

          //console.log("after update: " + JSON.stringify(props));
          props.history.push({
            pathname: '/class',
            state: props.location.state
          })
          setState(() => ({
            subjectname: "",
            teacherID: "",
            classID: _class._id
          }));
          setTimeout(() => {setSubjectSuccess(null)}, 3000);
        }
      }, 500); 
    }).catch(error => {
      setCreatingSubject(false);
      console.log(error.message);
      setSubjectError(JSON.stringify(error));
    });
  }
  
  // handle button click of updating
  const handleUpdateClass = e => {
    e.preventDefault()

    setClassError(null);
    setClassSuccess(null);

    //console.log(state);
    setUpdatingClass(true);

    //axios.put('http://localhost:5000/api/v1/class/update/' + _class._id, {"classname": classname},
    axios.put('https://digital-grading-system.herokuapp.com/api/v1/class/update/' + _class._id, {"classname": classname},
    {
      headers: {
        Authorization: getToken()
      }
    })
    .then(response => {
      setTimeout(() => {
        setUpdatingClass(false);
        if(response.data.error == true){
          console.log(response.data.message);
          setClassError("class name already exists, try another one");
          setClassname(_class.classname);
        } else {
          setShowUpdateClass(false);
          setClassSuccess("class updated");
          //window.location.reload();

          //console.log("after update: " + JSON.stringify(props));
          props.history.push({
            pathname: '/class',
            state: props.location.state
          })

          setTimeout(() => {setClassSuccess(null)}, 3000);
        }
      }, 500); 
    }).catch(error => {
      setUpdatingClass(false);
      console.log(error.message);
      setClassError(JSON.stringify(error));
    });
  }
  
  // handle button click of deleting
  const handleDeleteClass = async ()=>{

    for( const subject of _class.subjects) {
      //axios.delete('http://localhost:5000/api/v1/subject/delete/' + subject.subjectID, 
      axios.delete('https://digital-grading-system.herokuapp.com/api/v1/subject/delete/' + subject.subjectID,
      {
        headers: {
          Authorization: getToken(),
          classID: _class._id
        }
      }).then(response => {
        console.log(response.message);
      })
      //axios.get('http://localhost:5000/api/v1/subject/archive/' + subject.subjectID, 
      axios.delete('https://digital-grading-system.herokuapp.com/api/v1/subject/archive/' + subject.subjectID,
      {
        headers: {
          Authorization: getToken(),
        }
      }).then(response => {
        console.log(response.message);
      })
    }

    setDeletingClass(true);
    //axios.delete('http://localhost:5000/api/v1/class/delete/' + _class._id, 
    axios.delete('https://digital-grading-system.herokuapp.com/api/v1/class/delete/' + _class._id,
    {
      headers: {
        Authorization: getToken(),
      }
    }).then(response => {
        //alert("Person deleted sucessfully");
      setTimeout(() => {
        props.history.push({
          pathname: '/class',
          state: props.location.state
      })}, (500));
      setDeletingClass(false);
      setShowMore(false);
      setState(null);
    }).catch(error => {
        console.log(error.message);
        setClassError(JSON.stringify(error));
    });
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  // get all available teachers
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

  // get all available pupils except those already in this class
  const getPupil = async () => {
    await axios.get('https://digital-grading-system.herokuapp.com/api/v1/user/list', {
      headers: {
        Authorization: getToken(),
        role: "pupil"
      }
    })
    .then(response => {
      //console.log(JSON.stringify(response.data));
      //console.log(JSON.stringify(_class.pupils));
      let pupilArray = [];
      for (const pupil of response.data) {
        if(!_class.pupils.find(({pupilID}) => pupilID == pupil._id)) {
          pupilArray.push(pupil);
        }
      }
      setPupils(pupilArray);
      //console.log(JSON.stringify(pupilArray));

      //setIsLoading(false);
    }).catch(error => {
      //setSubmitting(false);
      //setError(JSON.stringify(error));
    });
  }

  return (
    <>
    <Card>
      <Card.Header onClick={() => {
        setShowMore(!showMore);
        //setShowUpdate(false);
        setClassError(null);
        //setSuccess(null);
      }} onMouseOver={(e) => {e.target.style.cursor = 'pointer'}}
      >
        <Card.Title as="h4">{classname}</Card.Title>
        <Card.Subtitle className="text-muted text-right">ClassID: {_class._id}</Card.Subtitle>
      </Card.Header>
      <Card.Body>
      {showMore &&
      <>
{/********************show subject*************************/}
      <hr />
      <Row> 
        {_class.subjects.map((subject, index) =>(
          <Subject subject={subject} class={_class} key={index} {...props}/>
        ))}
        <Col md="4" sm="6">
        <Form onSubmit={handleCreateSubject}>
        {showCreateSubject &&
          <Card>
            <Card.Header>
              <Form.Group>
                <label>subject name</label>
                <Form.Control
                  placeholder="subject name"
                  type="text"
                  name="subjectname"
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Card.Header>
            <Card.Body>
            <Form.Group>
              <label>Teacher</label>
              <Form.Control
                as="select"
                name="teacherID"
                onChange={handleInputChange}
              >
                <option value=""></option>
                {teachers.map((teacher, index) => (
                  <option value={teacher._id} key={index}>{teacher.username}</option>
                ))}

              </Form.Control>
            </Form.Group>
            </Card.Body>
          </Card>
        }

        {subjectError && <p style={{ color: 'red' }}>{subjectError}</p>}
        {subjectSuccess && <p style={{ color: 'green' }}>{subjectSuccess}</p>}

        <Button
          className="mx-2 mb-1 btn-fill"
          type="submit"
          variant="primary"
          onClick={(e) => {
            if(!showCreateSubject) {
              e.preventDefault();
              setShowCreateSubject(true);
              getTeacher();
            }
          }}
        >
        {creatingSubject ? "Adding..." : showCreateSubject ? "Add" : "Add Subject"}
        </Button>

        {showCreateSubject &&
        <Button
        className="mx-2 mb-1 btn-fill"
        variant="secondary"
        onClick={() => {
          setShowCreateSubject(false);
          setSubjectError(null);
          setSubjectSuccess(null);
          setState(() => ({
            subjectname: "",
            teacher: ""
          }));
        }}
        >
          Cancel
        </Button>
        }
        </Form>
        </Col>
      </Row>

{/********************show pupil************************/}
      <hr />
      <Row lg= "5" md="4" sm="3">
        {_class.pupils.map((pupil, index) =>(
          <Pupil pupil={pupil} classID={_class._id} key={index} {...props}/>
        ))}
        <Col >
        <Form onSubmit={handleAssignPupil}>
        {showAssign &&
          <Card>
            <Card.Body>
            <Form.Group>
              <label>Pupil</label>
              <Form.Control
                as="select"
                name="pupilID"
                onChange={e => setPupilID(e.target.value)}
              >
                <option value=""></option>
                {pupils.map((pupil, index) => (
                  <option value={pupil._id}>{pupil.username}</option>
                ))}

              </Form.Control>
            </Form.Group>
            </Card.Body>
          </Card>
        }

        {pupilError && <p style={{ color: 'red' }}>{pupilError}</p>}
        {pupilSuccess && <p style={{ color: 'green' }}>{pupilSuccess}</p>}

        <Button
          className="mx-2 mb-1 btn-fill"
          type="submit"
          variant="info"
          onClick={(e) => {
            if(!showAssign) {
              e.preventDefault();
              setShowAssign(true);
              getPupil();
            }
          }}
        >
        {assigning ? "Assigning..." : showAssign ? "Assign" : "Assign Pupil"}
        </Button>

        {showAssign &&
        <Button
        className="mx-2 mb-1 btn-fill"
        variant="secondary"
        onClick={() => {
          setShowAssign(false);
          setPupilError(null);
          setPupilSuccess(null);
          setState(() => ({
            subjectname: "",
            teacher: ""
          }));
        }}
        >
          Cancel
        </Button>
        }
        </Form>
        </Col>
      </Row>
      
      <hr />
      <Form onSubmit={handleUpdateClass}>
      {showUpdateClass &&
      <Row md="3">
      <Col>
      <Card>
      <Card.Body>
        <Form.Group>
        <label>class name</label>
        <Form.Control
          defaultValue={classname}
          placeholder="class name"
          type="text"
          name="classname"
          onChange={e => setClassname(e.target.value)}
        />
        </Form.Group>
      </Card.Body>
      </Card>
      </Col>
      </Row>
      }
      {classSuccess && <p style={{ color: 'green' }}>{classSuccess}</p>}
      {classError && <p style={{ color: 'red' }}>{classError}</p>}
      <Button
        className="mx-2 mb-2 btn-fill"
        type="submit"
        variant="success"
        onClick={(e) => {
          if(!showUpdateClass) {
            e.preventDefault();
            setShowUpdateClass(true);
          }
        }}
      >
      {updatingClass ? "updating..." : showUpdateClass ? "Update" : "Update Class"}
      </Button>

      {(showUpdateClass && !updatingClass) &&
      <Button
        className="mx-2 mb-2 btn-fill"
        variant="secondary"
        onClick={() => {
          setShowUpdateClass(false);
          setClassError(null);
          setClassSuccess(null);
        }}
      >
        Cancel
      </Button>
      }
      {(!showUpdateClass && !updatingClass) &&
      <Button 
        className="mx-2 mb-2 btn-fill"
        variant="danger"
        onClick={handleDeleteClass}
      >
        {deletingClass ? "Deleting" : "Delete Class"}
      </Button>
      }

      </Form>
      </>
      }
      </Card.Body>
    </Card>
    </>
  )
}

function Pupil({pupil, ...props}) {
  const classID = props.classID;
  const [pupilName, setPupilName] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [deassigning, setDeassigning] = useState(false);
  useEffect(() => {
    getPupilName();
  }, [pupil])

  const getPupilName = async () => {
    //setIsLoading(true);
    await axios.get('https://digital-grading-system.herokuapp.com/api/v1/user/' + pupil.pupilID, 
    {
      headers: {
        Authorization: getToken()
      }
    })
    .then(response => {
      //console.log(JSON.stringify(response.data));
      setPupilName(response.data.forename + " " + response.data.surname);
      //setIsLoading(false);
    }).catch(error => {
      //setSubmitting(false);
      //setError(JSON.stringify(error));
    });
  }

  const handleDeassignPupil = e => {
    e.preventDefault()

    //setError(null);
    //setSuccess(null);

    setDeassigning(true);
    //axios.post('http://localhost:5000/api/v1/class/' + classID + '/pupil/assign',
    axios.post('https://digital-grading-system.herokuapp.com/api/v1/class/' + classID + '/pupil/assign', {
      "pupilID": pupil.pupilID,
      "assign": 'false' 
    },{
      headers: {
        Authorization: getToken()
      }
    })
    .then(response => {
      setTimeout(() => {
        setDeassigning(false);
        setShowMore(false);
        if(response.data.error == true){
          console.log(response.data.message);
          //setError("error");
        } else {
          //setSuccess("pupil assigned");
          //window.location.reload();

          //console.log("after update: " + JSON.stringify(props));
          props.history.push({
            pathname: '/class',
            state: props.location.state
          })
          //setTimeout(() => {setPupilSuccess(null)}, 3000);
        }
      }, 500); 
    }).catch(error => {
      setDeassigning(false);
      console.log(error.message);
      //setError(JSON.stringify(error));
    });
  }
  
  return (
    <Col>
    <Card>
      <Card.Header  onClick={() => {
        setShowMore(!showMore);}
        //setShowUpdate(false);
        //setError(null);
        //setSuccess(null);
      } onMouseOver={(e) => {e.target.style.cursor = 'pointer'}}>
        <Card.Title as="h5">
          {pupilName}
        </Card.Title>
      </Card.Header>
      <Card.Body>
        {showMore &&
          <Button
          className="mx-1 mt-2 btn-fill"
          type="submit"
          variant="danger"
          onClick={handleDeassignPupil}
        >
          {deassigning ? "Deassigning" : "Deassign"}
        </Button>
        }
      </Card.Body>
    </Card>
    </Col>
  )
}

export default Classes;