import React from "react";
import { Container } from "react-bootstrap";
import { Route } from "react-router-dom";
import PropTypes from 'prop-types';

//components
import Navbar from "./components/navbar/Header";
//Oldalak
import HomePage from './components/pages/HomePage';
import ConfirmationPage from './components/pages/ConfirmationPage';
import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';
import ProgramBrowserPage from './components/pages/ProgramBrowserPage';
import TrainingPage from './components/pages/TrainingPage';
import ForgotPasswordPage from './components/pages/ForgotPasswordPage';
import ResetPasswordPage from './components/pages/ResetPasswordPage';
import ChangePasswordPage from './components/pages/ChangePasswordPage';
import ProfilePage from "./components/pages/ProfilePage";
import UserManagementPage from "./components/pages/UserManagementPage";
import NewExercisePage from "./components/pages/NewExercisePage";
import UpdateExercisePage from "./components/pages/UpdateExercisePage";
import NewWorkoutPage from "./components/pages/NewWorkoutPage";
import UpdateWorkoutPage from "./components/pages/UpdateWorkoutPage";
import NewProgramPage from "./components/pages/NewProgramPage";
import UpdateProgramPage from "./components/pages/UpdateProgramPage";
import MembershipPage from "./components/pages/MembershipPage";
import ProgramPage from './components/pages/ProgramPage';
import WorkoutPage from './components/pages/WorkoutPage';
import CalendarPage from './components/pages/CalendarPage';
import ProgramTrainerPage from './components/pages/ProgramTrainerPage';
import WorkoutTrainerPage from './components/pages/WorkoutTrainerPage';
import ExerciseTrainerPage from './components/pages/ExerciseTrainerPage';

//Átirányítások
import UserRoute from './components/routes/UserRoute';
import GuestRoute from './components/routes/GuestRoute';
import TrainerRoute from "./components/routes/TrainerRoute";
import AdminRoute from "./components/routes/AdminRoute";

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
        <UserRoute  location={location} path='/programbrowser' exact component={ProgramBrowserPage}/>
        <UserRoute  location={location} path='/program/:program' exact component={ProgramPage}/>
        <UserRoute  location={location} path='/workout/:workout' exact component={WorkoutPage}/>
        <UserRoute  location={location} path='/training' exact component={TrainingPage}/>
        <UserRoute  location={location} path='/profile' exact component={ProfilePage}/>
        <UserRoute  location={location} path='/password' exact component={ChangePasswordPage}/>
        <AdminRoute  location={location} path='/manage' exact component={UserManagementPage} />
        <TrainerRoute  location={location} path='/add_exercise' exact component={NewExercisePage} />
        <TrainerRoute  location={location} path='/edit_exercise/:exercise' exact component={UpdateExercisePage} />
        <TrainerRoute  location={location} path='/my_exercises' exact component={ExerciseTrainerPage} />
        <TrainerRoute  location={location} path='/add_workout' exact component={NewWorkoutPage} />
        <TrainerRoute  location={location} path='/edit_workout/:workout' exact component={UpdateWorkoutPage} />
        <TrainerRoute  location={location} path='/my_workouts' exact component={WorkoutTrainerPage} />
        <TrainerRoute  location={location} path='/add_program' exact component={NewProgramPage} />
        <TrainerRoute  location={location} path='/edit_program/:program' exact component={UpdateProgramPage} />
        <TrainerRoute  location={location} path='/my_programs' exact component={ProgramTrainerPage} />
        <UserRoute  location={location} path='/membership' exact component={MembershipPage} />
        <UserRoute  location={location} path='/calendar' exact component={CalendarPage} />
      </Container>
    </div>
)

App.propTypes = {
  location: PropTypes.shape({
      pathname: PropTypes.string.isRequired
  }).isRequired
};


export default (App);