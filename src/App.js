import React from "react";
import { Container } from "react-bootstrap";
import { Route } from "react-router-dom";
import PropTypes from 'prop-types';

//components
import Footer from './components/footer/Footer';
import Navbar from "./components/navbar/Header";
//Oldalak
import HomePage from './components/pages/HomePage';
import ConfirmationPage from './components/pages/ConfirmationPage';
import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';
import ProgramPage from './components/pages/ProgramPage';
import TrainingPage from './components/pages/TrainingPage';
import ForgotPasswordPage from './components/pages/ForgotPasswordPage';
import ResetPasswordPage from './components/pages/ResetPasswordPage';
import ChangePasswordPage from './components/pages/ChangePasswordPage';
import ProfilePage from "./components/pages/ProfilePage";
import UserManagementPage from "./components/pages/UserManagementPage";
import NewExercisePage from "./components/pages/NewExercisePage";
import NewWorkoutPage from "./components/pages/NewWorkoutPage";
import NewProgramPage from "./components/pages/NewProgramPage";

//Átirányítások
import UserRoute from './components/routes/UserRoute';
import GuestRoute from './components/routes/GuestRoute';

const App = ({location}) => (
    <div>
      <Navbar />
      <Container id="main-content" fluid style={{marginTop: "4em"}}> 
        <Route location={location}  path='/' exact component={HomePage}/>
        <Route location={location} path="/confirm/:token" exact component={ConfirmationPage}/>
        <GuestRoute location={location} path='/login' exact component={LoginPage}/>
        <GuestRoute location={location} path='/register' exact component={RegisterPage}/>
        <GuestRoute location={location} path='/forgot_password' exact component={ForgotPasswordPage}/>
        <GuestRoute location={location} path='/reset_password/:token' exact component={ResetPasswordPage}/>
        <UserRoute  location={location} path='/programs' exact component={ProgramPage}/>
        <UserRoute  location={location} path='/training' exact component={TrainingPage}/>
        <UserRoute  location={location} path='/profile' exact component={ProfilePage}/>
        <UserRoute  location={location} path='/password' exact component={ChangePasswordPage}/>
        <UserRoute  location={location} path='/manage' exact component={UserManagementPage} />
        <UserRoute  location={location} path='/add_exercise' exact component={NewExercisePage} />
        <UserRoute  location={location} path='/add_workout' exact component={NewWorkoutPage} />
        <UserRoute  location={location} path='/add_program' exact component={NewProgramPage} />
      </Container>
      <Footer/>
    </div>
)

App.propTypes = {
  location: PropTypes.shape({
      pathname: PropTypes.string.isRequired
  }).isRequired
};


export default (App);