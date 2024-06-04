import axios from 'axios';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Header from '../../components/Header';
// import { useNavigate } from 'react-router-dom';

const CreateUser = () => {
    // const navigate = useNavigate();
    const [info, setInfo] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        isAdmin: "false",
        password: "",
    });

    const handleChange = (e) => {
        setInfo((prev) => ({
            ...prev, [e.target.id]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newUser ={
                ...info
            };
            // Check if any required field is missing
            if (!newUser.name || !newUser.email || 
                !newUser.phoneNumber || !newUser.isAdmin
                || !newUser.password) {
                throw new Error("Please fill in all required fields.");
            }
            await axios.post("/auth/register", newUser);
            alert("User created!");
            setInfo({
                name: "",
                email: "",
                phoneNumber: "",
                isAdmin: "false",
                password: "",
            });
            // navigate("/home");
        } catch (error) {
            alert(error.message);
        }
    };

  return (
    <>
      <Header />
      <Container>
        <div style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          alignItems: "center",
          marginTop: "10px",
        }}>
          <h4>Create User</h4>
          <Form onSubmit={handleSubmit}
            style={{
            maxWidth: "600px",
            padding: "10px",
            borderRadius: "10px",
            boxShadow: "4px 4px 10px 1px #ff9f0e"
          }}>            
            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label htmlFor='name'>Name</Form.Label>
                <Form.Control 
                  type="text" 
                  id="name" onChange={handleChange} 
                  value={info.name}
                  required
                />
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label htmlFor='email'>Email</Form.Label>
                <Form.Control 
                  type="email" 
                  id="email" onChange={handleChange} 
                  value={info.email}
                  required
                />
              </Form.Group>
            </Row>
            
            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label htmlFor='phoneNumber'>Phone Number</Form.Label>
                <Form.Control 
                  type="number" 
                  id="phoneNumber" onChange={handleChange} 
                  value={info.phoneNumber}
                  required
                />
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label htmlFor='isAdmin'>Role</Form.Label>
                <Form.Select 
                    size="sm"
                    defaultValue="Select song genre..."
                    id="isAdmin" 
                    onChange={handleChange} 
                    value={info.isAdmin}
                    required
                >
                    <option value="false">User</option>
                    <option value="true">Admin</option>
                </Form.Select>
              </Form.Group>
            </Row>
            
            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label htmlFor='password'>Password</Form.Label>
                <Form.Control 
                  type="Password" 
                  id="password" 
                  onChange={handleChange} 
                  value={info.password}
                  required
                />
              </Form.Group>
            </Row>

            <Button variant="warning" type="submit">
              Create
            </Button>
          </Form>
        </div>
      </Container>
    </>
  );
};

export default CreateUser;
