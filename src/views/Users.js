import React, { useState, useEffect } from "react";
import axios from "axios";
import { getToken, encrypt } from "../Utils/Common.js"
import ProfileForm from "./ProfileForm.js";

// react-bootstrap components
import {
  Button,
  Card,
  Table,
  Container,
  Row,
  Col,
  Form,
} from "react-bootstrap";


function Users(props) {
  const [allUser, setAllUser] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);

  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const [state, setState] = useState({
    role: "pupil",
  });

  useEffect(() => {
    getAllUser();
  }, [props.location])

  const getAllUser = async ()=>{
    //setIsLoading(true);
    await axios.get('https://digital-grading-system.herokuapp.com/api/v1/user/list',
    {
      headers: {
        Authorization: getToken()
      }
    })
    .then(response => {
      setAllUser(response.data);
      //console.log(JSON.stringify(response.data));
      //setIsLoading(false);
    }).catch(error => {
      //setSubmitting(false);
      //setError(JSON.stringify(error));
    });
  }

  // handle button click of create
  const handleCreate = e => {
    e.preventDefault()

    setError(null);
    setSuccess(null);
    setCreating(true);
    console.log(state.password);

    //axios.post('http://localhost:5000/api/v1/user/create', state,
    axios.post('https://digital-grading-system.herokuapp.com/api/v1/user/create/',
    {
      role: state.role,
      username: state.username,
      password: encrypt(state.password),
      forename: state.forename,
      surname: state.surname
    },{
      headers: {
        Authorization: getToken()
      }
    })
    .then(response => {
      setTimeout(() => {
        setCreating(false);
        if(response.data.error == true){
          console.log(response.data.message);
          setError("user name already exists, try another one");
        } else {
          setShowCreate(false);
          setSuccess("user created");
          //window.location.reload();

          //console.log("after update: " + JSON.stringify(props.location.state));
          props.history.push({
            pathname: '/user',
            state: props.location.state
          })
          setState(() => ({
            role: "pupil",
            username: "",
            password: "",
            forename: "",
            surname: ""
          }));
          setTimeout(() => {setSuccess(null)}, 3000);
        }
      }, 500); 
    }).catch(error => {
      setCreating(false);
      console.log(error.message);
      setError(JSON.stringify(error));
    });
  }

  return (
    <>
    <Container fluid>
    <Row>
    <Col>
    <Card className="strpied-tabled-with-hover">
    <Card.Header>
      <Card.Title as="h4">All Users</Card.Title>
      <p className="card-category">
      </p>
    </Card.Header>
    <Card.Body className="table-full-width table-responsive px-0">
        <Table className="table-hover table-striped table-bordered">
          <thead>
            <tr>
              <th className="border-0">UserID</th>
              <th className="border-0">Role</th>
              <th className="border-0">User Name</th>
              <th className="border-0">First Name</th>
              <th className="border-0">Last Name</th>
            </tr>
          </thead>
          <tbody>
            {allUser.map((user,index)=>(
              <User
              user={user}
              key={index}
              {...props}/>
            ))}
   
          </tbody>
        </Table>
    
        <Form onSubmit={handleCreate}>
        {showCreate &&
        <Col md="12">
          <Card>
            <Card.Header>
              <Card.Title as="h4">Create Profile</Card.Title>
            </Card.Header>
            <Card.Body>
              <ProfileForm functions={[state, setState]} isCreate={true} />
            </Card.Body>
          </Card>
        </Col>
        }
        
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}

        <Button
          className="mx-3 mb-1 btn-fill"
          type="submit"
          variant="info"
          onClick={(e) => {
            if(!showCreate) {
              e.preventDefault();
              setShowCreate(true);
            }
          }}
        >
          {creating ? "Creating..." : showCreate ? "Create" : "New User"}
        </Button>

        {showCreate &&
        <Button
          className="mx-3 mb-1 btn-fill"
          variant="secondary"
          onClick={() => {
            setShowCreate(false);
            setError(null);
            setSuccess(null);

            setState(() => ({
              role: "pupil",
              username: "",
              password: "",
              forename: "",
              surname: ""
            }));
          }}
        >
          Cancel
        </Button>
        }

        </Form>
      </Card.Body>
    </Card>
    </Col>
    </Row>
    </Container>
    </>
  );
}

function User({user, ...props}) {
  const [showMore, setShowMore] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const [state, setState] = useState({});

  useEffect(() => {
    setState({
      userID: user._id,
      role: user.role,
      username: user.username,
      password: encrypt(user.password),
      forename: user.forename,
      surname: user.surname
    });
  }, [user])

  // handle button click of updating
  const handleUpdate = e => {
    e.preventDefault()

    setError(null);
    setSuccess(null);
    setUpdating(true);
    //console.log("before update: " + JSON.stringify(user._id));
    //console.log("before update: (props)" + JSON.stringify(props))
    //console.log(state);

    axios.put('https://digital-grading-system.herokuapp.com/api/v1/user/update/' + user._id, 
    {
      username: state.username,
      password: encrypt(state.password),
      forename: state.forename,
      surname: state.surname
    },
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
          setError("user name already exists, try another one");
        } else {
          setShowUpdate(false);
          setSuccess("user updated");
          //window.location.reload();

          //if admin changes his own attributes, then update the header
          if(props.location.state.userID == user._id) {
            //console.log("after update: (admin) " + JSON.stringify(response.data.user));
            props.history.push({
              pathname: '/user',
              state: response.data.user
            })
          } else {
            //console.log("after update: " + JSON.stringify(props.location.state));
            props.history.push({
              pathname: '/user',
              state: props.location.state
            })
          }
          setTimeout(() => {setSuccess(null)}, 2000);
        }
      }, 500); 
    }).catch(error => {
      setUpdating(false);
      console.log(error.message);
      setError(JSON.stringify(error));
    });
  }

  const handleDelete = async ()=>{
    const confirm = prompt(`Please confirm with YES for ${user.forename} ${user.surname}`);
    if(confirm === "YES" || confirm === "yes"){
      //axios.delete('http://localhost:5000/api/v1/user/delete/' + user._id,
      axios.delete('https://digital-grading-system.herokuapp.com/api/v1/user/delete/' + user._id,
      {
        headers: {
          Authorization: getToken(),
          role: user.role
        }
      }).then(response => {
        if(response.data.error == true){
          console.log(response.data.message);
          setError(response.data.message);
        } else {
          //alert("Person deleted sucessfully");
          props.history.push({
            pathname: '/user',
            state: props.location.state
          })
          setShowMore(false);
        }
      }).catch(error => {
          console.log(error.message);
          setError(JSON.stringify(error));
      });
    }
  }

  return (
    <>
    <tr onClick={() => {
      setShowMore(!showMore);
      setShowUpdate(false);
      setError(null);
      setSuccess(null);
    }}>
    <td>{user._id}</td>
    <td>{user.role}</td> 
    <td>{user.username}</td> 
    <td>{user.forename}</td> 
    <td>{user.surname}</td> 
    </tr>
    {showMore && 
      <tr>
        <td colSpan="6">
          <Form onSubmit={handleUpdate}>
          {showUpdate &&
          <Row>
          <Col md="12">
            <Card>
              <Card.Header>
                <Card.Title as="h4">Update Profile</Card.Title>
              </Card.Header>
              <Card.Body>
                <ProfileForm functions={[state, setState]} isCreate={false}/>
              </Card.Body>
            </Card>
          </Col>
          </Row>
          }
          
          {success && <p style={{ color: 'green' }}>{success}</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}

          <Row>
          <Button
            className="mx-3 mb-1 btn-fill"
            type="submit"
            variant="info"
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
        </Form>
        </td>
      </tr>
    }
    </>
  )
}


export default Users;
