import React from 'react';

import {Link} from 'react-router-dom';
import {Container, Navbar, Nav, NavDropdown, Dropdown, Button} from 'react-bootstrap';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {logout} from "../../actions/auth";
import { FaUser} from "react-icons/fa"



class Header extends React.Component{

    render(){
    
        return(
            <Navbar fixed="top" collapseOnSelect expand="lg" bg="dark" variant="dark" >
                <Container fluid>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                    <Navbar.Collapse style={{padding: "5px"}}>
                        <Nav className="justify-content-end" style={{ width: "100%" }}>

                            <Button variant="dark" as={Link} to="/programbrowser" style={{  width: "6.4em", position: "relative" }}> Programok</Button>
                            {(this.props.user.isTrainer || this.props.user.isAdmin) && 
                                <Dropdown > 
                                    <Dropdown.Toggle variant="dark" >Vezérlőpult</Dropdown.Toggle>
                                    <Dropdown.Menu align="end" variant="dark">
                                {this.props.user.isTrainer &&<>
                                    <Dropdown.Header>  Edzések kezelése  </Dropdown.Header>
                                    <Dropdown.Item as={Link} to="/add_exercise">Új gyakorlat</Dropdown.Item>
                                    <Dropdown.Item href="/add_workout">Új edzés</Dropdown.Item>
                                    <Dropdown.Item href="/add_program">Új program</Dropdown.Item>
                                </>}
                                {this.props.user.isAdmin && <>
                                    <NavDropdown.Divider /> 
                                    <NavDropdown.Header>  Jogosultságkezelés  </NavDropdown.Header>
                                    <NavDropdown.Item as={Link} to="/manage">Felhasználók kezelése</NavDropdown.Item>
                                </>}
                                    </Dropdown.Menu>
                                </Dropdown> }
                            {this.props.isAuthenticated ? (
                                <Dropdown>
                                    <Dropdown.Toggle variant="dark" ><span><FaUser /></span></Dropdown.Toggle>
                                    <Dropdown.Menu align="end" variant="dark">
                                        <Dropdown.Item as={Link} to="/profile">Profil</Dropdown.Item>
                                        <Dropdown.Item as={Link} to="/password">Jelszócsere</Dropdown.Item>
                                        <Dropdown.Item as={Link} to="/calendar">Edzésnapló</Dropdown.Item>
                                        <Dropdown.Divider />
                                        <Dropdown.Item onClick={() => this.props.logout()}>Kijelentkezés</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown> )
                            : (
                                <Button variant="dark" as={Link} to="/login" style={{  width: "6.4em", position: "relative" }}> Belépés</Button>
                              )
                            }
                            
                        </Nav>
                    </Navbar.Collapse>
                </Container >
            </Navbar>
            
        )
    }
};

function mapStateToProps(state){
    return{
        isAuthenticated: !!state.user.token,
        user: state.user
    };
  }
  
Header.propTypes ={
    isAuthenticated: PropTypes.bool.isRequired,
    logout: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, {logout})(Header);