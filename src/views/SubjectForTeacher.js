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


function SubjectForTeacher({subject, ...props}) {
  const [showMore, setShowMore] = useState(false);
  const [showCreateTest, setShowCreateTest] = useState(false);
  const [creatingTest, setCreatingTest] = useState(false);

  const [testSuccess, setTestSuccess] = useState(null);
  const [testError, setTestError] = useState(null);
  
  const [state, setState] = useState();
  const [pupils, setPupils] = useState([]);
  const [pupilAndGrades, setPupilAndGrades] = useState([]);

  useEffect(() => {
    setState({...state,
      "subjectID": subject._id
    })
    getPupil();
  }, [subject])

  useEffect(() => {
    getPupilAndGrade();
  }, [pupils || props.history])

  // get all available pupils in the subject
  const getPupil = async () => {
    //await axios.get('http://localhost:5000/api/v1/user/list', {
    await axios.get('https://digital-grading-system.herokuapp.com/api/v1/user/list', {
      headers: {
        Authorization: getToken(),
        subjectID: subject._id
      }
    })
    .then(response => {
      //console.log(JSON.stringify(response.data.pupils));
      setPupils(response.data.pupils);

      //setIsLoading(false);
    }).catch(error => {
      //setSubmitting(false);
      //setError(JSON.stringify(error));
    });
  }
  
  // get all available pupils in the subject
  const getPupilAndGrade = async () => {
    setPupilAndGrades([]);
    for (const pupil of pupils) {
      let total_grade = 0;
      let count = 0;
      for (const test of subject.tests) {
        //await axios.get('http://localhost:5000/api/v1/user/list', {
        await axios.get('https://digital-grading-system.herokuapp.com/api/v1/test/' + test.testID + '/grade/' + pupil.pupilID, {
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
      
      setPupilAndGrades(pupilAndGrades => [...pupilAndGrades, {
        pupilID: pupil.pupilID,
        grade: average
      }]);
    }
  }

  // handle button click of creating
  const handleCreateTest = e => {
    e.preventDefault()

    setTestError(null);
    setTestSuccess(null);

    setCreatingTest(true);
    console.log(state);
    //axios.post('http://localhost:5000/api/v1/test/create', state,
    axios.post('https://digital-grading-system.herokuapp.com/api/v1/test/create/', state,
    {
      headers: {
        Authorization: getToken()
      }
    })
    .then(response => {
      setTimeout(() => {
        setCreatingTest(false);
        if(response.data.error == true){
          console.log(response.data.message);
          setTestError("error");
        } else {
          setShowCreateTest(false);
          setTestSuccess("new test created");
          //window.location.reload();

          //console.log("after update: " + JSON.stringify(props));
          props.history.push({
            pathname: '/subject',
            state: props.location.state
          })
          setState(() => ({
            testname: "",
            date: null,
            subjectID: subject._id
          }));
          setTimeout(() => {setTestSuccess(null)}, 3000);
        }
      }, 500); 
    }).catch(error => {
      setCreatingTest(false);
      console.log(error.message);
      setTestError(JSON.stringify(error));
    });
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

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
      {showMore &&
      <>

      {/********************show pupil*************************/}
      <hr />
      <Row>
      <Col>
      <Table className="table-hover table-striped table-bordered">
        <thead>
          <tr>
            <th className="border-0">PupilID</th>
            <th className="border-0">First Name</th>
            <th className="border-0">Last Name</th>
            <th className="border-0">Grade</th>
          </tr>
        </thead>
        <tbody>
          {pupilAndGrades.map((grade,index)=>(
            <Grade
            grade={grade}
            key={index}
            disabled="true"
            {...props}/>
          ))}
        </tbody>
      </Table>
      </Col>
      </Row>

      {/********************show test*************************/}
      <hr />
      <Row sm="1"> 
        {subject.tests.map((test, index) =>(
          <Test test={test} subjectID={subject._id} pupils={pupils} key={index} {...props}/>
        ))}
      </Row>

      {/********************add test*************************/}
      <hr />
      <Row>
        <Col>
        <Form onSubmit={handleCreateTest}>
        {showCreateTest &&
          <Card>
            <Card.Header>
              <Form.Group>
                <label>test name</label>
                <Form.Control
                  placeholder="test name"
                  type="text"
                  name="testname"
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Card.Header>
            <Card.Body>
            <Form.Group>
              <label>Date</label>
              <Form.Control
                  placeholder="date"
                  type="text"
                  name="date"
                  onChange={handleInputChange}
              />
            </Form.Group>
            </Card.Body>
          </Card>
        }

      
        {testError && <p style={{ color: 'red' }}>{testError}</p>}
        {testSuccess && <p style={{ color: 'green' }}>{testSuccess}</p>}
        <Button
          className="mx-2 mb-1 btn-fill"
          type="submit"
          variant="primary"
          onClick={(e) => {
            if(!showCreateTest) {
              e.preventDefault();
              setShowCreateTest(true);
            }
          }}
        >
        {creatingTest ? "Adding..." : showCreateTest ? "Add" : "Add Test"}
        </Button>

        {showCreateTest &&
        <Button
        className="mx-2 mb-1 btn-fill"
        variant="secondary"
        onClick={() => {
          setShowCreateTest(false);
          setTestError(null);
          setTestSuccess(null);
          setState(() => ({
            testname: "",
            date: null
          }));
        }}
        >
          Cancel
        </Button>
        }
        </Form>
        </Col>
      </Row>

      </>
      }
      </Card.Body>
    </Card>
  )
}

function Test({test, ...props}) {
  const [showMore, setShowMore] = useState(false);
  const [showUpdateTest, setShowUpdateTest] = useState(false);
  const [updatingTest, setUpdatingTest] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  
  const [testSuccess, setTestSuccess] = useState(null);
  const [testError, setTestError] = useState(null);
  const [gradeSuccess, setGradeSuccess] = useState(null);
  const [gradeError, setGradeError] = useState(null);

  const [state, setState] = useState({});
  const [grades, setGrades] = useState([]);
  const [ungradedPupil, setUngradedPupil] = useState([]);
  const [newGrade, setNewGrade] = useState([]);

  useEffect(() => {
    getTestInfo();
  }, [test])

  useEffect(() => {
    getPupil();
  }, [grades])

  // get information of test
  const getTestInfo = async () => {
    //await axios.get('http://localhost:5000/api/v1/test/' + test.testID, {  
    await axios.get('https://digital-grading-system.herokuapp.com/api/v1/test/' + test.testID, {
      headers: {
        Authorization: getToken(),
      }
    })
    .then(response => {
      setState({...state,
        testname: response.data.testname,
        date: response.data.date
      });
      setGrades(response.data.grades);
      //console.log(response);
      //setIsLoading(false);
    }).catch(error => {
      //setSubmitting(false);
      //setError(JSON.stringify(error));
    });
  }

  const getPupil = () => {
    let pupilArray = [];
    for (const pupil of props.pupils) {
      if(!grades.find(({pupilID}) => pupilID == pupil.pupilID)) {
        pupilArray.push(pupil);
      }
    }
    //console.log(props.pupils);
    //console.log(grades);
    setUngradedPupil(pupilArray);
  }

  // handle button click of create
  const handleCreateGrade = e => {
    e.preventDefault()

    setGradeError(null);
    setGradeSuccess(null);
    setCreating(true);

    //axios.post('http://localhost:5000/api/v1/user/create', state,
    axios.post('https://digital-grading-system.herokuapp.com/api/v1/test/' + test.testID + '/grade/create/', newGrade,
    {
      headers: {
        Authorization: getToken()
      }
    })
    .then(response => {
      setTimeout(() => {
        setCreating(false);

        if(response.data.error == true){
          console.log(response.data.message);
          setGradeError("error");
        } else {
          setShowCreate(false);
          setGradeSuccess("grade created");
          //window.location.reload();

          //console.log("after update: " + JSON.stringify(props.location.state));
          props.history.push({
            pathname: props.history.location.pathname,
            state: props.location.state
          })
          setNewGrade({});
          setTimeout(() => {setGradeSuccess(null)}, 3000);

        }
      }, 500); 
    }).catch(error => {
      setCreating(false);
      console.log(error.message);
      setGradeError(JSON.stringify(error));
    });
  }
    
  // handle button click of updating
  const handleUpdateTest = e => {
    e.preventDefault()

    setTestError(null);
    setTestSuccess(null);

    console.log(state);
    setUpdatingTest(true);

    //axios.put('http://localhost:5000/api/v1/test/update/' + test.testID, state,
    axios.put('https://digital-grading-system.herokuapp.com/api/v1/test/update/' + test.testID, state,
    {
      headers: {
        Authorization: getToken()
      }
    })
    .then(response => {
      setTimeout(() => {
        setUpdatingTest(false);
        if(response.data.error == true){
          console.log(response.data.message);
          setTestError("error");
        } else {
          setShowUpdateTest(false);

          setTestSuccess("test updated");
          //window.location.reload();

          //console.log(JSON.stringify(props));
          props.history.push({
            pathname: props.history.location.pathname,
            state: props.location.state
          })
          setTimeout(() => {setTestSuccess(null)}, 3000);
        }
      }, 500); 
    }).catch(error => {
      setUpdatingTest(false);
      console.log(error.message);
      setTestError(JSON.stringify(error));
    });
  }

  const handleDeleteTest = async ()=>{
    //axios.delete('http://localhost:5000/api/v1/test/delete/' + test.testID, 
    axios.delete('https://digital-grading-system.herokuapp.com/api/v1/test/delete/' + test.testID,
    {
      headers: {
        Authorization: getToken(),
        subjectID: props.subjectID,
      }
    }).then(response => {
        //alert("Person deleted sucessfully");
        props.history.push({
          pathname: props.location.state.pathname,
          state: props.location.state
        })
    }).catch(error => {
        console.log(error.message);
        setTestError(JSON.stringify(error));
    });
  }
  
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <Col>
    <Card>
      <Card.Header onClick={() => {
        if(!showUpdateTest) {setShowMore(!showMore);}
        //setShowUpdate(false);
        //setError(null);
        //setSuccess(null);
      }} onMouseOver={(e) => {e.target.style.cursor = 'pointer'}}>
        <Card.Title as="h4">{state.testname}</Card.Title>
        <Card.Subtitle className="text-muted text-right">Date: {state.date}</Card.Subtitle>
      </Card.Header>
      <Card.Body>
      {showMore &&
      <>
      <hr />

      <Table className="table-hover table-striped table-bordered">
        <thead>
          <tr>
            <th className="border-0">PupilID</th>
            <th className="border-0">First Name</th>
            <th className="border-0">Last Name</th>
            <th className="border-0">Grade</th>
          </tr>
        </thead>
        <tbody>
          {grades.map((grade,index)=>(
            <Grade
            grade={grade}
            testID={test.testID}
            key={index}
            {...props}/>
          ))}
        </tbody>
      </Table>

      <Form onSubmit={handleCreateGrade}>
        <Button
          className="mx-3 mb-1 btn-fill"
          type="submit"
          variant="success"
          onClick={(e) => {
            if(!showCreate) {
              e.preventDefault();
              setShowCreate(true);
          }}}
        >
          {creating ? "Creating..." : showCreate ? "Create" : "New Grade"}
        </Button>

        {showCreate &&
        <Button
          className="mx-3 mb-1 btn-fill"
          variant="secondary"
          onClick={() => {
            setShowCreate(false);
            setGradeError(null);
            setGradeSuccess(null);
            setNewGrade({});
          }}
        >
          Cancel
        </Button>
        }

        {gradeError && <p style={{ color: 'red' }}>{gradeError}</p>}
        {gradeSuccess && <p style={{ color: 'green' }}>{gradeSuccess}</p>}

        {showCreate &&
        <Col md="12">
          <Card>
            <Card.Header>
              <Card.Title as="h4">Create Grade</Card.Title>
            </Card.Header>
            <Card.Body>
              <GradeForm functions={[newGrade, setNewGrade]} pupils={ungradedPupil} isCreate={true} />
            </Card.Body>
          </Card>
        </Col>
        }
        </Form>

      <hr />
      {testSuccess && <p style={{ color: 'green' }}>{testSuccess}</p>}
      {testError && <p style={{ color: 'red' }}>{testError}</p>}
      <Form onSubmit={handleUpdateTest}>
        <Button
          className="mx-2 mb-2 btn-fill"
          type="submit"
          variant="primary"
          onClick={(e) => {
            if(!showUpdateTest) {
              e.preventDefault();
              setShowUpdateTest(true);
              setTestError(null);
              setTestSuccess(null);
            }
          }}
        >
          {updatingTest ? "Updating..." : "Update"}
        </Button>
        {(showUpdateTest && !updatingTest) &&
        <Button
          className="mx-2 mb-2 btn-fill"
          variant="secondary"
          onClick={() => {
            setShowUpdateTest(false);
            setTestError(null);
            setTestSuccess(null);
          }}
        >
          Cancel
        </Button>
        }
        {(!showUpdateTest && !updatingTest) &&
        <Button 
          className="mx-2 mb-2 btn-fill"
          variant="danger"
          onClick={handleDeleteTest}
        >
          Delete
        </Button>
        }
        {showUpdateTest &&
        <Row>
        <Col>
        <Card>
        <Card.Body>
          <Form.Group>
          <label>test name</label>
          <Form.Control
            defaultValue={state.testname}
            placeholder="test name"
            type="text"
            name="testname"
            onChange={handleInputChange}
          />
          </Form.Group>
          <Form.Group>
          <label>date</label>
          <Form.Control
            defaultValue={state.date}
            placeholder="date (yyyy-mm-dd)"
            type="text"
            name="date"
            onChange={handleInputChange}
          />
          </Form.Group>
        </Card.Body>
        </Card>
        </Col>
        </Row>
        }
        </Form>
      </>
      }
      </Card.Body>
    </Card>
    </Col>
  )
}

function Grade({grade, ...props}) {
  const [showMore, setShowMore] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const [state, setState] = useState({
    pupilID: grade.pupilID,
    grade: grade.grade
  });

  const [pupilName, setPupilName] = useState({});

  useEffect(() => {
    getPupilName();
  }, [state])

  const getPupilName = async () => {
    //await axios.get('http://localhost:5000/api/v1/user/' + state.pupilID, {  
    await axios.get('https://digital-grading-system.herokuapp.com/api/v1/user/' + state.pupilID, {
      headers: {
        Authorization: getToken(),
      }
    })
    .then(response => {
      setPupilName({...state,
        pupilname: response.data.username,
        forename: response.data.forename,
        surname: response.data.surname
      });

      //console.log(response);
      //setIsLoading(false);
    }).catch(error => {
      //setSubmitting(false);
      //setError(JSON.stringify(error));
    });
  }

  // handle button click of updating grade
  const handleUpdate = async (e) => {
    e.preventDefault();

    setError(null);
    setSuccess(null);
    setUpdating(true);
    //console.log("before update: " + JSON.stringify(user._id));
    //console.log("before update: (props)" + JSON.stringify(props))
    console.log(state);

    axios.put('https://digital-grading-system.herokuapp.com/api/v1/test/' + props.testID + '/grade/update/', state,
    {
      headers: {
        Authorization: getToken()
      }
    })
    .then(response => {
      setTimeout(() => {
        setUpdating(false);

        if(response.data.error == true){
          console.log(response.data.error.message);
          setError("error");
        } else {
          setShowUpdate(false);
          setSuccess("grade updated");
          //window.location.reload();

          //console.log("after update: (admin) " + JSON.stringify(response.data.user));
          props.history.push({
            pathname: props.history.location.pathname,
            state: props.location.state
          })
          setTimeout(() => {setSuccess(null)}, 2000);
        }
      }, 500); 
    }).catch(error => {
      setUpdating(false);
      console.log(error.message);
      setError(JSON.stringify(error));
    });
  }

  // handle button click of deleting grade
  const handleDelete = async ()=>{
    //axios.delete('http://localhost:5000/api/v1/test/' + props.testID + '/grade/delete',
    axios.delete('https://digital-grading-system.herokuapp.com/api/v1/test/'  + props.testID + '/grade/delete',
    {
      headers: {
        Authorization: getToken(),
        pupilID: state.pupilID,
      }
    }).then(response => {
        //alert("Person deleted sucessfully");
        props.history.push({
          pathname: props.location.state.pathname,
          state: props.location.state
        })
    }).catch(error => {
        console.log(error.message);
        setTestError(JSON.stringify(error));
    });
  }

  return (
    <>
    <tr onClick={() => { if(!props.disabled) {
      setShowMore(!showMore);
      setShowUpdate(false);
      setError(null);
      setSuccess(null);
    }}}>
    <td>{state.pupilID}</td>
    <td>{pupilName.forename}</td> 
    <td>{pupilName.surname}</td> 
    <td>{state.grade}</td> 
    </tr>
    {showMore && 
      <tr>
        <td colSpan="4">
          <Form onSubmit={handleUpdate}>
          <Row>
          <Button
            className="mx-3 mb-1 btn-fill"
            type="submit"
            variant="success"
            onClick={(e) => {
              if(!showUpdate) {
                e.preventDefault();
                setShowUpdate(true);
                setError(null);
                setSuccess(null);
              }
            }}
          >
          {updating ? "Updating..." : "Update"}
          </Button>
          {(showUpdate && !updating) &&
          <Button
            className="mx-3 mb-1 btn-fill"
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
            className="mx-3 mb-1 btn-fill"
            variant="danger"
            onClick={handleDelete}
          >
            Delete
          </Button>
          }
          </Row>  
          {success && <p style={{ color: 'green' }}>{success}</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {showUpdate &&
          <Row className="justify-content-center">
          <Col md="12">
            <Card>
              <Card.Header>
                <Card.Title as="h4">Update Grade</Card.Title>
              </Card.Header>
              <Card.Body>
                <GradeForm name={pupilName} functions={[state, setState]}  isCreate={false} />
              </Card.Body>
            </Card>
          </Col>
          </Row>
          }
        </Form>
        </td>
      </tr>
    }
    </>
  )
}

function GradeForm(props) {
  const [state, setState] = props.functions;
  const name = props.name;
  const [pupils, setPupils] = useState([]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  useEffect(() => {
    getPupilName();
  }, [props.pupils])

  const getPupilName = async () => {
    if(props.pupils){
    for( const pupil of props.pupils) {

    //await axios.get('http://localhost:5000/api/v1/user/' + pupil.pupilID, {  
    await axios.get('https://digital-grading-system.herokuapp.com/api/v1/user/' + pupil.pupilID, {
      headers: {
        Authorization: getToken(),
      }
    })
    .then(response => {
      setPupils(pupils => [...pupils, {
        pupilID: pupil.pupilID,
        pupilname: response.data.username,
        forename: response.data.forename,
        surname: response.data.surname
      }]);

      console.log(response.data);
      //setIsLoading(false);
    }).catch(error => {
      //setSubmitting(false);
      //setError(JSON.stringify(error));
    });
  }}
  }

  return (
    <Row>
    <Col className="pr-1" md="7">
    {(props.isCreate == false) ?
      <Form.Group>
      <label>pupil name (disabled)</label>
      <Form.Control
        defaultValue={name.pupilname}
        disabled
        placeholder="pupil name"
        type="text"
      ></Form.Control>
      </Form.Group>
      :
      <Form.Group>
      <label>Pupil</label>
      <Form.Control
        as="select"
        name="pupilID"
        onChange={handleInputChange}
      >
        <option value=""></option>
        {pupils.map((pupil) => (
          <option value={pupil.pupilID}>{pupil.pupilname}</option>
        ))}

      </Form.Control>
      </Form.Group>
    }
    </Col>

    <Col className="pr-1" md="5">
      <Form.Group>
      <label>grade</label>
      <Form.Control
        defaultValue={state.grade}
        required
        placeholder="grade"
        type="text"
        name="grade"
        onChange={handleInputChange}
      ></Form.Control>
      </Form.Group>
    </Col>
    </Row>
  )
}
export default SubjectForTeacher;