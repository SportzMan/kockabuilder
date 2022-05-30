import React from "react";
import Dropzone from "react-dropzone";
import {Container, Form,Button,Alert,Spinner,InputGroup,FormControl} from "react-bootstrap";
import { FiPlus } from "react-icons/fi";
import {MdOutlineCancel} from "react-icons/md";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { uploadFile, deleteFile } from "../../actions/programs";
import {getWorkouts} from "../../actions/workouts";
import WorkoutSelectorModal from "../modals/WorkoutSelectorModal";
import ItemDeleteModal from "../modals/ItemDeleteModal";
import TrainerWorkoutCard from "../cards/TrainerWorkoutCard";
import {Link} from 'react-router-dom';

class NewProgramForm extends React.Component {

  state = {
    program: {
      originalName: this.props.program.name,
      name: this.props.program.name,
      description: this.props.program.description,
      owner: this.props.user,
      workouts: this.props.program.workouts,
      thumbnailPath: this.props.program.thumbnailPath,
      isFree: this.props.program.isFree
    },
    modal: false,
    deleteModal: false,
    loading: false,
    success: false,
    Workouts: [],
    errors: {}
  };
  ///////////////////////////////////
  // A "Hatás Horog"
  // Dokumentáció: https://hu.reactjs.org/docs/hooks-effect.html
  // Az oldal betöltésekor lekérdezzük az adatbázisban található összes gyakorlatot tulajdonostól függetlenül, és eltároljuk azokat az "Workouts" változóban
  // Az első render után lefut a metódus és lekérdezi az adatbázisban elérhető összes gyakorlat objektumot
  componentDidMount() {
    this.props.getWorkouts().then(res => 
      this.setState( {...this.state.Workouts, Workouts: res, loading: false, success: true}))
      .catch(err => this.setState( {errors: { ...this.state.errors, errors: err.response.data.errors}, loading: false, success: false}))
  }
  //
  ///////////////////////////////////
  
  ///////////////////////////////////
  // Az egyszerűbb struktúrával rendelkező objektumokhoz kapcsolodó beviteli mezők változás követő eseménykezelő
  // A paraméterként megkapott esemény változó segítségével meghatározásra kerül az eseményt kiváltó komponens neve és értéke, és beállítja az ezekhez kapcsolódó állapot változókat.
  // Mivel az osztályhoz tartozó állapot változók immutabilisek, így csak a setState() metódus segítségel lehet azokat frissíteni.
  onChange = (e) =>
    this.setState({
      program: { ...this.state.program, [e.target.name]: e.target.value },
    });
  //
  ///////////////////////////////////

  ///////////////////////////////////
  // A checkbox mező változását nyomonkövető eseménykezelő
  checkChange = () => {
      this.setState({
        program: { ...this.state.program, isFree: !this.state.program.isFree },
      })
  };
  //
  ///////////////////////////////////

  ///////////////////////////////////
  // Az űrlap beküldésért felelős függvény
  onSubmit = (e) => {
    const {program} = this.state;
    e.preventDefault();
    const errors = this.validate(program);
    if (Object.keys(errors).length > 0){
        this.setState({errors});

    } else{
        this.setState({loading: true});
          this.props.submit(program)
          .then(() => this.setState({ loading: false}))
          .catch(err => this.setState({errors: { ...this.state.errors, errors: err.response.data.errors}, loading: false}));
    }
  }
  //
  ///////////////////////////////////

  ///////////////////////////////////
  // A borítókép beállításáért és feltöltéséért felelős függvény
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
  //
  ///////////////////////////////////

  ///////////////////////////////////
  // Borítókép törlése a tömbből és a szerver oldalról is
  deleteThumbnail = () => {
    this.props.deleteFile({thumbnailPath: this.state.program.thumbnailPath})
      .then(res => {
      this.setState({program: {...this.state.program, thumbnailPath: res.data.thumbnailPath}})
    })
      .catch(err => this.setState({errors: { ...this.state.errors, errors: err.response.data.errors}}))
  }
  //
  ///////////////////////////////////

  ///////////////////////////////////
  // A Modal komponensek megjelenítésééert és elrejtésért felelős függvények
  showModal = () => this.setState({ modal: true });

  hideModal = () => this.setState({ modal: false });

  showDeleteModal = () => this.setState({ deleteModal: true });

  hideDeleteModal = () => this.setState({ deleteModal: false });
  //
  ///////////////////////////////////

  ///////////////////////////////////
  // Az új edzés hozzáadásáért felelős függvény
  addWorkout = (workout) => {
      var add = this.state.program.workouts;
      add.push(workout);
      this.setState({program: {...this.state.program, workouts: add }})
  };
  //
  ///////////////////////////////////

  ///////////////////////////////////
  // A kiválasztott edzés eltávolításáért felelős függvény
  removeWorkout = (index) => {
    const workouts = this.state.program.workouts;
    workouts.splice(index, 1);
    this.setState({program: {...this.state.program, workouts: workouts}});
  };
  //
  ///////////////////////////////////

  ///////////////////////////////////
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
  //
  ///////////////////////////////////

  ///////////////////////////////////
  // A HTML tartalmak megjelenítése
  render() {
    const { program, errors, loading, success, Workouts, modal, deleteModal } = this.state;

    return (
      <Form noValidate onSubmit={this.onSubmit}>
        {errors.global && <Alert variant="danger"> {errors.global} </Alert>}
        <ItemDeleteModal modal={deleteModal} name="a programot" item={program} buttonName="Program" hideModal={this.hideDeleteModal} deleteItem={this.props.deleteItem}/>

        <WorkoutSelectorModal modal={modal} Workouts={Workouts} hideModal={this.hideModal} addWorkout={this.addWorkout}/>

        <InputGroup controlid="programName" id="programName">
          <InputGroup.Text>Program neve</InputGroup.Text>
          <FormControl
            name="name"
            type="name"
            placeholder="Az edzésprogram neve."
            value={program.name}
            onChange={this.onChange}
            isInvalid={!!errors.name}
          />
          <FormControl.Feedback type="invalid">
            {errors.name}
          </FormControl.Feedback>
        </InputGroup>
        <InputGroup controlid="programDesc" >
          <InputGroup.Text>Program leírása</InputGroup.Text>
          <FormControl
            as="textarea"
            name="description"
            placeholder="Az edzésprogram rövid leírása a felhasználók számára."
            row="3"
            value={program.description}
            onChange={this.onChange}
            isInvalid={!!errors.description}
          />
          <FormControl.Feedback type="invalid">
            {errors.description}
          </FormControl.Feedback>
        </InputGroup>
        <Form.Group controlId="formUserRights">
              <Form.Check
                name="isFree"
                type="checkbox"
                label="Érvényes tagság nélkül is megtekinthetik a felhasználók"
                onChange={this.checkChange}
                checked={program.isFree}
              />
        </Form.Group>
        <h6>Borítókép</h6>
        <div className="thumbnail-container">
          {!program.thumbnailPath ? 
            (<Dropzone onDrop={this.onDrop} multiple={false} maxSize={500000000} >
              {({ getRootProps, getInputProps }) => (
                <div className="dropzone-container" {...getRootProps()}>
                  <input {...getInputProps()} />
                  <FiPlus id="plus-button" />
                </div>
              )}
            </Dropzone>)
            :
            (
            <div className="program-thumbnail-container" >
              <div className="program-thumbnail" >
                  <Button variant="outline-secondary" id="program-cancel-button" onClick={() => this.deleteThumbnail()}>
                      <MdOutlineCancel id="program-cancel-icon"/>
                  </Button>
                  <img src={`http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/${program.thumbnailPath}`} alt="thumbnail"/>
              </div>
            </div>
            )}
        </div>

        <h6>Edzések</h6>
        <Container fluid id="workout-container">
            <div className="add-button-container" >
                <Button variant="outline-secondary" onClick={this.showModal} >
                  <FiPlus />
                </Button>
            </div>
        <div className="workout-flexbox-container">
            {
          // A programm.workouts változóban tárolt elemeket a map() függvény segtségével összekapcsoljuk az alább található HTML komponenssel
          // Megkövetelt az egyedi key értékek használata a map() függvény használata esetén. Az egyedi kulcsok generálása az "index" paraméterrel történt.
          program.workouts.map((workout, index) => {
            return (
              <TrainerWorkoutCard key={index} workout={workout} index={index} removeWorkout={this.removeWorkout}/>
            );
        })
            } 
        </div>
        </Container>
        <div className="command-button-container">
          {!loading ? (
            <Button variant="primary" type="submit" > Mentés </Button>
          ) : (
            <Button variant="primary" disabled >
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
          <Button variant="outline-danger" onClick={this.showDeleteModal}>Törlés</Button>
          <Button variant="outline-secondary" as={Link} to="/my_programs">Vissza</Button>
        </div>
      </Form>
    );
  }
  //
  ///////////////////////////////////
}

///////////////////////////////////
// Az alkalmazás helyi tárolójában (local storage) tárolt felhasználói adatok átadása porps-ként
function mapStateToProps(state) {
  return {
    user: state.user,
  };
}
//
///////////////////////////////////

///////////////////////////////////
// Az oldal működéséhez szükséges előfeltételek, ezek később a props-ból lesznek elérhetőek
NewProgramForm.propTypes = {
  submit: PropTypes.func.isRequired
};
//
///////////////////////////////////

///////////////////////////////////
// Komponent exportálása, illetve props bind
export default connect(mapStateToProps, {getWorkouts, uploadFile, deleteFile})(NewProgramForm);
//
///////////////////////////////////