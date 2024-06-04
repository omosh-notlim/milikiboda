import { useContext} from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';

const Header = () => {
    const{ user, dispatch } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
      try {
          localStorage.removeItem("user");
          
          // Dispatch the logout action
          dispatch({ type: "LOGOUT" });
          navigate("/");
      } catch (error) {
          console.error("Error logging out:", error);
      }
  };
  return (
    <Navbar collapseOnSelect expand="lg" style={{ 
        background: "#fff", 
        margin: "5px", 
        borderRadius: "5px",
        boxShadow: "1px 1px 5px 1px rgba(149, 126, 167, 0.7)"
      }}>
        <Container className="container">
          <Navbar.Brand href="#home">
            <span style={{
              color: "rgba(80,80,80)",
              fontWeight: "700"
            }}>
              Welcome  
            </span>
            <span style={{
              color: "rgba(60,60,60)",
              marginLeft: "5px",
              fontWeight: "400"
            }}>
              {user ? (user.name) : null}
            </span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              </Nav>
              <Nav>

              <Nav.Link href="#">
                <Link to="/home" style={{textDecoration: "none", color: "#000"}}><b>Home </b></Link>
              </Nav.Link>

              <Nav.Link href="#">
                <Link to="/new" style={{textDecoration: "none", color: "#000"}}>Add user</Link>
              </Nav.Link>
              
              {user ? (
                  <Button 
                      variant="outline-warning"
                      size="sm"
                      onClick={handleLogout}
                  >
                      Logout
                  </Button> ) : (
                  <Link to="/" style={{textDecoration: "none"}}>
                    <Button 
                        variant="warning"
                        size="sm"
                    >
                        Login
                    </Button>
                  </Link>
                )
              }
            </Nav>
          </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
