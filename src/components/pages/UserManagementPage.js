import React from 'react';
import { Alert, Badge, Container, Form, Spinner } from 'react-bootstrap';
import UserTable from "../tables/UserTable";
import { FcOk, FcCancel } from "react-icons/fc";
import UserProfileForm from "../forms/UserProfileForm";
import {getAllUsers, updateUserProfile} from "../../actions/users";
import {connect} from 'react-redux';


class UserManagementPage extends React.Component {

  state = {
    selectedMail: null,
    data: [],
    loading: true,
    success: false,
    errors: {}
  };

  componentDidMount(){
    this.props.getAllUsers()
      .then(res => {this.setState( {...this.state.data, data: res, loading: false, success: true})})
      .catch((err) => this.setState({ errors: err.response.data.errors, loading: false, success: false }))
  };

  setSelectedMail = (email) =>{
    this.setState({ selectedMail: email });
  };

  resetSelectedMail = () => {
    this.setState({ selectedMail: null });
    this.props.getAllUsers()
      .then(res => {this.setState( {...this.state.data, data: res, loading: false, success: true})})
      .catch((err) => this.setState({ errors: err.response.data.errors, loading: false, success: false }))
  };

  submit = (data) => 
    this.props.updateUserProfile(data)
  
render(){
  const {data, selectedMail, loading, success, errors} = this.state; 
  // A táblázat oszlopainak és fejlécének definiálása
const columns =  [
    {
      Header: "Felhasználónév",
      accessor: "username"
    },
    {
      Header: "Email",
      accessor: "email"
    },
    {
      Header: "Jogosultságok",
      accessor: data => data.isAdmin.toString() + ' ' + data.isTrainer.toString(), //A react-table nem tudja kezelni a boolean típusú értékeket, ezért át kell kasztolni szöveg típusúvá.
      Cell: ({ cell: { value } }) => {
        return(
          <>
          {value === "true true" &&<><Badge bg="danger" >Adminisztrátor</Badge>{' '}<Badge bg="primary">Edző</Badge>{' '}<Badge bg="secondary">Felhasználó</Badge> </>}
          {value === "true false" &&<><Badge bg="danger">Adminisztrátor</Badge>{' '}<Badge bg="secondary">Felhasználó</Badge> </>}
          {value === "false true" &&<><Badge bg="primary">Edző</Badge>{' '}<Badge bg="secondary">Felhasználó</Badge> </>}
          {value === "false false" &&<><Badge bg="secondary">Felhasználó</Badge> </>}
          </>
        ) // A Cell függvény segítségével lekérjük az összes oszlophoz rendelt mezőt. Ha az értéke igez, akkor az FcOk, egyébként pedig az FcCancel ikon megjelenítésre a szöveg helyett. 
      }
    },

  {
    Header: "Tagság érvényessége",
    accessor: "membership",
    Cell: ({ cell: { value } }) => {
      return(
        <>
          <Form.Control
            type="date" 
            value={value.split("T")[0]}
            disabled
          />
        </>
      ) //
    }
  }
  ];

    return(

      <Container fluid>

        {!(selectedMail === null) ? (
          <h1>Felhasználó adatai</h1> )
        : (<h1>Felhasználók kezelése</h1>)}

        { errors.global&& 
          <Alert  variant="danger">
            <Alert.Heading> Hiba! </Alert.Heading>
            <p>{errors.global}</p>
          </Alert>
        }
        
        { (loading && !success) ? (
          <div style={{display: 'flex', justifyContent: 'center', alignItems: "center" }}>          
          <Spinner
              as="span"
              animation="border"
              size="xl"
              role="status"
              aria-hidden="true"
            />
          </div> ):(
              <>
                {!(selectedMail === null) ? (
                <UserProfileForm email={selectedMail} resetSelectedMail={this.resetSelectedMail} submit={this.submit}/> )
              : (<UserTable columns={columns} data={data} setSelectedMail={this.setSelectedMail} />)}
              </>
            )}
        <br/>

      </Container>
    );

  }
}


export default connect(null, {getAllUsers, updateUserProfile})(UserManagementPage);