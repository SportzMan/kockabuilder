import React from "react";
import Dropzone from "react-dropzone";
import {Card, Container, Form,Button,Alert,Spinner,InputGroup,FormControl, Row, Col} from "react-bootstrap";
import { FiPlus } from "react-icons/fi";
import {MdOutlineCancel} from "react-icons/md";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { uploadFile, deleteFile } from "../../actions/programs";
import {getWorkouts} from "../../actions/workouts";
import WorkoutSelectorModal from "../modals/WorkoutSelectorModal";
import ItemDeleteModal from "../modals/ItemDeleteModal";



class NewProgramForm extends React.Component {
  _isMounted = false;

  state = {
    program: {
      originalName: this.props.program.name,
      name: this.props.program.name,
      description: this.props.program.description,
      owner: this.props.user,
      workouts: this.props.program.workouts,
      thumbnailPath: this.props.program.thumbnailPath,
      isfree: this.props.program.isfree
    },
    modal: false,
    deleteModal: false,
    loading: false,
    success: false,
    Workouts: [],
    errors: {}
  };

  // A "Hatás Horog"
  // Dokumentáció: https://hu.reactjs.org/docs/hooks-effect.html
  // Az oldal betöltésekor lekérdezzük az adatbázisban található összes gyakorlatot tulajdonostól függetlenül, és eltároljuk azokat az "Workouts" változóban
  // Az első render után lefut a metódus és lekérdezi az adatbázisban elérhető összes gyakorlat objektumot
  componentDidMount() {
    this.props.getWorkouts().then(res => 
      this.setState( {...this.state.Workouts, Workouts: res, loading: false, success: true}))
      .catch(err => this.setState( {errors: { ...this.state.errors, errors: err.response.data.errors}, loading: false, success: false}))
  }
  
  
  // Az egyszerűbb struktúrával rendelkező objektumokhoz kapcsolodó beviteli mezők változás kezelő függvénye
  // A paraméterként megkapott esemény változó segítségével meghatározásra kerül az eseményt kiváltó komponens neve és értéke, és beállítja az ezekhez kapcsolódó állapot változókat.
  // Mivel az osztályhoz tartozó állapot változók immutabilisek, így csak a setState() metódus segítségel lehet azokat frissíteni.
  onChange = (e) =>
    this.setState({
      program: { ...this.state.program, [e.target.name]: e.target.value },
    });

  checkChange = () => {
      this.setState({
        program: { ...this.state.program, isfree: !this.state.program.isfree },
      })
  };

  removeWorkout = (index) => {
      const workouts = this.state.program.workouts;
      workouts.splice(index, 1);
      this.setState({program: {...this.state.program, workouts: workouts}});
  };

  onSubmit = (e) => {
    const {program} = this.state;
    e.preventDefault();
    const errors = this.validate(program);
    if (Object.keys(errors).length > 0){
        this.setState({errors});

    } else if(this._isMounted){
        this.setState({loading: true});
          this.props.submit(program)
          .then(() => this.setState({ loading: false}))
          .catch(err => this.setState({errors: { ...this.state.errors, errors: err.response.data.errors}, loading: false}));

    }
  }

  // Hasonlóan a NewExerciseForm-hoz
  onDrop = (files) => {

    var formData = new FormData();
    formData.append("program", files[0]);
    // Kép fájl feltöltése  az uploadFile() függvény segítségével
    this.props.uploadFile(formData)
        .then((res) => {
            this.setState({ program: {...this.state.program, thumbnailPath: res.thumbnailPath}})
        })
        .catch((err) => this.setState({errors: { ...this.state.errors, errors: err.response.data.errors}, loading: false}))
  }
// Borítókép törlése a tömbből és a szerver oldalról is
  deleteThumbnail = () => {
    this.props.deleteFile({thumbnailPath: this.state.program.thumbnailPath})
      .then(res => {
      this.setState({program: {...this.state.program, thumbnailPath: res.data.thumbnailPath}})
    })
      .catch(err => this.setState({errors: { ...this.state.errors, errors: err.response.data.errors}}))
  }
  // A Modal komponens megjelenítésééert és elrejtésért felelős függvények
  showModal = () => this.setState({ modal: true });

  hideModal = () => this.setState({ modal: false });

  showDeleteModal = () => this.setState({ deleteModal: true });

  hideDeleteModal = () => this.setState({ deleteModal: false });

  // A program.workouts állapot változó töltéséért felelős függvény
  addWorkout = (workout) => {
      var add = this.state.program.workouts;
      add.push(workout);
      this.setState({program: {...this.state.program, workouts: add }})
  };

// Az űrlap mezőinek kliens oldali ellenőrzéséhez használt validátor függvény
  validate = (data) => {

    const errors = {};
    // Az "Edzés neve" mező nem lehet üres és nem lehet rövidebb 6 karakternél (ismert gyakorlatokat átnézve nem találtam ennél rövdiebb karakterláncú gyakorlatot)
    if (!data.name) errors.name = "A mező nem maradhat üresen!";
    else{if (data.name.length < 6) errors.name = "A név mező értéke legalább 6 karakter hosszú kell legyen!"
        } 
    // Az "Edzés leírása" mező nem lehet üres és nem lehet rövidebb 32 karakternél (érdemi leírás érdekében)
    if (!data.description) errors.description = "A mező nem maradhat üresen!";
    else{if (data.description.length < 32) errors.description = "A leírás mező értéke legalább 32 karakter hosszú kell legyen!"
        }
    // Nem hiányozhat az előnézeti kép
    if(!data.thumbnailPath) errors.global = "Az űrlap leadásához szükség van egy előnézeti képre!"

    // Tartalmaznia kell legalább 3 edzést
    if(data.workouts.length < 3) errors.global = "Az űrlap leadásához szükség van legalább három edzés megadására!"
    

    return errors;
  };

  render() {
    const { program, errors, loading, success, Workouts, modal, deleteModal } = this.state;

    return (
      <Form noValidate onSubmit={this.onSubmit}>

        <ItemDeleteModal modal={deleteModal} name=" programot" item={program} buttonName="Program" hideModal={this.hideDeleteModal} deleteItem={this.props.deleteItem}/>

        {errors.global && (
          <Alert variant="danger">
            <Alert.Heading>Hiba!</Alert.Heading>
            <p>{errors.global}</p>
          </Alert>
        )}
        <WorkoutSelectorModal modal={modal} Workouts={Workouts} hideModal={this.hideModal} addWorkout={this.addWorkout}/>

        <InputGroup controlid="programName" style={{ paddingBottom: "1.5rem" }}>
          <InputGroup.Text>Program neve</InputGroup.Text>
          <FormControl
            name="name"
            type="name"
            placeholder="Az edzésprogram neve."
            value={program.name}
            onChange={this.onChange}
            isInvalid={!!errors.name}
            style={{
              borderTopRightRadius: "5px",
              borderBottomRightRadius: "5px",
            }}
          />
          <FormControl.Feedback type="invalid">
            {errors.name}
          </FormControl.Feedback>
        </InputGroup>
        <InputGroup controlid="programDesc" style={{ paddingBottom: "1.5rem" }}>
          <InputGroup.Text>Program leírása</InputGroup.Text>
          <FormControl
            as="textarea"
            name="description"
            placeholder="Az edzésprogram rövid leírása a felhasználók számára."
            row="3"
            value={program.description}
            onChange={this.onChange}
            isInvalid={!!errors.description}
            style={{
              borderTopRightRadius: "5px",
              borderBottomRightRadius: "5px",
            }}
          />
          <FormControl.Feedback type="invalid">
            {errors.description}
          </FormControl.Feedback>
        </InputGroup>
        <Form.Group controlId="formUserRights" style={{margin: "1rem 0 2rem"}}>
              <Form.Check
                name="isFree"
                type="checkbox"
                label="Érvényes tagság nélkül is megtekinthetik a felhasználók"
                onChange={this.checkChange}
                checked={program.isfree}
              />
        </Form.Group>
          <p>Borítókép</p>
          <div style={{ padding: "1rem", display: "flex", justifyContent: "center",  width: "100%", border: "1px solid lightgray", marginBottom: "1rem", borderRadius: "5px"}}>
          {!program.thumbnailPath ? 
            (<Dropzone onDrop={this.onDrop} multiple={false} maxSize={500000000} >
              {({ getRootProps, getInputProps }) => (
                <div style={{ width: "320px", height: "240px", border: "1px solid lightgray", display: "flex", alignItems: "center", justifyContent: "center"}}
                  {...getRootProps()}
                >
                  <input {...getInputProps()} />
                  <FiPlus style={{ fontSize: "3rem" }} />
                </div>
              )}
            </Dropzone>)
            :
            (
            <div className="program-thumbnail" style={{display: "block"}}>
              <img src={"http://localhost:8080/"+program.thumbnailPath} alt="thumbnail" style={{width: "320px", height: "240px"}}/>
              <div className="program-cancel" style={{ position: "relative", left: "18rem", bottom: "15rem"}} onClick={this.deleteThumbnail}><MdOutlineCancel id="program-cancel-icon" /></div>
            </div>
            )}
          </div>

        <p>Edzések</p>
        <Container fluid style={{
            padding: "1rem",
            marginBottom: "1rem",
            border: "1px solid lightgray",
            borderRadius: "5px",

          }}
        >
            <div className="add-button-container" style={{
                marginBottom: "1.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "5px",
                }}
            >
                <Button variant="outline-secondary" style={{
                    width: "2.5rem",
                    height: "2.5rem",
                    borderRadius: "100%",
                    margin: "0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
                onClick={this.showModal}
                >
                <FiPlus />
                </Button>
            </div>
        <Row xs ={1} md={2} lg={4} xl={4} className="g-4" >
            {
          // A programm.workouts változóban tárolt elemeket a map() függvény segtségével összekapcsoljuk az alább található HTML komponenssel
          // A React megköveteli az egyedi key értékek használatát a map() függvény használata esetén. Az egyedi kulcsok generálása az "index" paraméterrel történt.
          program.workouts.map((workout, index) => {
            return (
                <Col key={`col-${index}`}>
                    <Card index={index} style={{width: "320px"}}>
                        <Card.Img variant="top" src={`http://127.0.0.1:8080/${workout.thumbnailPath}`}  style={{width: "320px", height: "240px"}}/>
                        <div className="workout-cancel" style={{position: "absolute", right: 0}}><MdOutlineCancel id="workout-cancel-icon" onClick={() => this.removeWorkout(index)}/></div>
                        <div className="workout-index" > <p>{`${index+1}. gyakorlat`}</p></div>
                        <Card.Body>
                            <Card.Title>{workout.name}</Card.Title>
                        </Card.Body>
                    </Card>
                </Col>
            );
        })
            } 
        </Row>
        </Container>
        {!loading ? (
          <Button style={{marginBottom: "1rem"}} variant="primary" type="submit"> Mentés </Button>
        ) : (
          <Button variant="primary" disabled style={{marginBottom: "4rem"}}>
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
            <span className="sr-only">Mentés...</span>
          </Button>
        )}
        <Button variant="secondary" style={{marginLeft: "1rem", marginBottom: "1rem"}}>Vissza</Button>
        <Button variant="danger" style={{position: "absolute", right: "25px"}} onClick={this.showDeleteModal}>Törlés</Button>
      </Form>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

NewProgramForm.propTypes = {
  submit: PropTypes.func.isRequired
};


export default connect(mapStateToProps, {getWorkouts, uploadFile, deleteFile})(NewProgramForm);