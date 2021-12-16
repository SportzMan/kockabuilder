import React from "react";
import Dropzone from "react-dropzone";
import {Card, Container, Form,Button,Alert,Spinner,InputGroup,FormControl, Row, Col} from "react-bootstrap";
import { FiPlus } from "react-icons/fi";
import {MdOutlineCancel} from "react-icons/md";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { uploadFile, deleteFile } from "../../actions/workouts";
import { getExercises} from "../../actions/exercises";
import ExerciseSelectorModal from "../modals/ExerciseSelectorModal";
import { addWorkout } from "../../actions/workouts";


class NewWorkoutForm extends React.Component {

  state = {
    workout: {
      name: "",
      description: "",
      owner: this.props.user,
      workoutExercises: [],
      thumbnailPath: ""
    },
    modal: false,
    loading: false,
    success: false,
    Exercises: [],
    // A komplexebb struktúrájú "workout" állapotváltozó végett szükségessé vált egy hasonló struktúrát követő "errors" állaptováltozó
    // Az elgondolás az, hogy minden workout.workoutExercises tömbben található elemhez tartozni fog egy errors.workoutExerciseErrors tömbben tárolt elem.
    // Az lehetővé teszi az űrlapok beviteli mezőinek validdálását.
    errors: {
        workoutExerciseErrors:[],
        errors: {}
    }
  };

  // A "Hatás Horog"
  // Dokumentáció: https://hu.reactjs.org/docs/hooks-effect.html
  // Az oldal betöltésekor lekérdezzük az adatbázisban található összes gyakorlatot tulajdonostól függetlenül, és eltároljuk azokat az "Exercises" változóban
  // Az első render után lefut a metódus és lekérdezi az adatbázisban elérhető összes gyakorlat objektumot
  componentDidMount() {
    this.props.getExercises().then(res => {this.setState( {...this.state.Exercises, Exercises: res, loading: false, success: true})})
    .catch(err => {this.setState( {errors: { ...this.state.errors, errors: err.response.data.errors}, loading: false, success: false})})
  }
  
  // Az egyszerűbb struktúrával rendelkező objektumokhoz kapcsolodó beviteli mezők változás kezelő függvénye
  // A paraméterként megkapott esemény változó segítségével meghatározásra kerül az eseményt kiváltó komponens neve és értéke, és beállítja az ezekhez kapcsolódó állapot változókat.
  // Mivel az osztályhoz tartozó állapot változók immutabilisek, így csak a setState() metódus segítségel lehet azokat frissíteni.
  onChange = (e) =>
    this.setState({
      workout: { ...this.state.workout, [e.target.name]: e.target.value },
    });

  
  updateReps = (index) => (e) => {
        const workoutExercises = [];
        const exerciseToEdit = this.state.workout.workoutExercises[index];
        exerciseToEdit.reps = e.target.value;

        for(let i = 0; i<this.state.workout.workoutExercises.length; i++){
            if ( i === index){

                workoutExercises.push({Exercise: exerciseToEdit.Exercise, reps: exerciseToEdit.reps, rest: exerciseToEdit.rest})
            }else {
                workoutExercises.push(this.state.workout.workoutExercises[i])

            }

        }
        this.setState({workout: {...this.state.workout, workoutExercises: workoutExercises}});
    }

    updateRest = (index) => (e) => {
        const workoutExercises = [];
        const exerciseToEdit = this.state.workout.workoutExercises[index];
        exerciseToEdit.rest = e.target.value;

        for(let i = 0; i<this.state.workout.workoutExercises.length; i++){
            if ( i === index){

                workoutExercises.push({Exercise: exerciseToEdit.Exercise, reps: exerciseToEdit.reps, rest: exerciseToEdit.rest})
            }else {
                workoutExercises.push(this.state.workout.workoutExercises[i])

            }

        }
        this.setState({workout: {...this.state.workout, workoutExercises: workoutExercises}});
    }

  removeWorkoutExercise = (index) => {
      const workoutExercises = this.state.workout.workoutExercises;
      workoutExercises.splice(index, 1);
      this.setState({workout: {...this.state.workout, workoutExercises: workoutExercises}});
  }

  onSubmit = (e) => {
    const {workout} = this.state;
    e.preventDefault();
    const errors = this.validate(workout);
    if (Object.keys(errors).length > 2){
        this.setState({errors});

    } else {
        this.setState({loading: true});
          this.props.submit(workout)
          .then(() => this.setState({ loading: false}))
          .catch(err => console.log(err));
      }
  }
  // Hasonlóan a NewExerciseForm-hoz
  onDrop = (files) => {

    var formData = new FormData();
    formData.append("workout", files[0]);
    // Kép fájl feltöltése  az uploadFile() függvény segítségével
    this.props.uploadFile(formData)
        .then((res) => {
            this.setState({ workout: {...this.state.workout, thumbnailPath: res.thumbnailPath}})
        })
        .catch((err) => this.setState({errors: { ...this.state.errors, errors: err.response.data.errors}, loading: false}))
  }

  deleteThumbnail = () => {
    this.props.deleteFile({thumbnailPath: this.state.workout.thumbnailPath})
      .then(res => {
      this.setState({workout: {...this.state.workout, thumbnailPath: res.data.thumbnailPath}})
    })
      .catch(err => this.setState({errors: { ...this.state.errors, errors: err.response.data.errors}}))
  }

  // A Modal komponens megjelenítésééert és elrejtésért felelős függvények
  showModal = () => this.setState({ modal: true });

  hideModal = () => this.setState({ modal: false });

  // A workout.workoutExercises állapot változó töltéséért felelős függvény
  addWorkoutExercise = (exercise) => {
      let workoutExercise = {Exercise: exercise, reps: "", rest: ""};
      var add = this.state.workout.workoutExercises;
      add.push(workoutExercise);
      this.setState({workout: {...this.state.workout, workoutExercises: add }});

      let workoutExerciseError = { errors: {}};
      add = this.state.errors.workoutExerciseErrors;
      add.push(workoutExerciseError);
      this.setState({errors: {...this.state.errors, workoutExerciseErrors: add }})
    };

// Az űrlap mezőinek kliens oldali ellenőrzéséhez használt validátor függvény
  validate = (data) => {

    const errors = this.state.errors;
    // Az "Edzés neve" mező nem lehet üres és nem lehet rövidebb 6 karakternél (ismert gyakorlatokat átnézve nem találtam ennél rövdiebb karakterláncú gyakorlatot)
    if (!data.name) errors.errors.name = "A mező nem maradhat üresen!";
    else{if (data.name.length < 6) errors.errors.name = "A név mező értéke legalább 6 karakter hosszú kell legyen!"
        } 
    // Az "Edzés leírása" mező nem lehet üres és nem lehet rövidebb 32 karakternél (érdemi leírás érdekében)
    if (!data.description) errors.errors.description = "A mező nem maradhat üresen!";
    else{if (data.description.length < 32) errors.errors.description = "A leírás mező értéke legalább 32 karakter hosszú kell legyen!"
        }
    // Az egyes gyakorlatokhoz tartozó "Ismétlések száma" mezők értéke legyen nagyobb 0-nál továbbá a "Pihenő" mezők értéke legyen legalább 0
    for(let i=0 ; i<data.workoutExercises.length; i++){
        if(!data.workoutExercises[i].reps) errors.workoutExerciseErrors[i].errors.reps = "A mező nem maradhat üresen!";
        else{if(data.workoutExercises[i].reps < 1) errors.workoutExerciseErrors[i].errors.reps = "Az ismétlések száma nem lehet 0!"
            }

        if(!data.workoutExercises[i].rest) errors.workoutExerciseErrors[i].errors.rest = "A mező nem maradhat üresen!";
        else{if(data.workoutExercises[i].rest < 0) errors.workoutExerciseErrors[i].errors.rest = "A pihenés ideje nem lehet negatív!"
            }
    }
    // Nem hiányozhat az előnézeti kép
    if(!data.thumbnailPath) errors.errors.global = "Az űrlap leadásához szükség van egy előnézeti képre!"

    // Tartalmaznia kell legalább 3 gyakorlatot
    if(data.workoutExercises.length < 3) errors.errors.global = "Az űrlap leadásához szükség van legalább három gyakorlat megadására!"

    return errors;
  };

  render() {
    const { workout, errors, loading, Exercises, modal } = this.state;

    return (
      <Form noValidate onSubmit={this.onSubmit}>
        {errors.errors.global && (
          <Alert variant="danger">
            <Alert.Heading>Hiba!</Alert.Heading>
            <p>{errors.errors.global}</p>
          </Alert>
        )}
        <ExerciseSelectorModal modal={modal} Exercises={Exercises} hideModal={this.hideModal} addWorkoutExercise={this.addWorkoutExercise}/>
        <InputGroup controlid="workoutName" style={{ paddingBottom: "1.5rem" }}>
          <InputGroup.Text>Edzés neve</InputGroup.Text>
          <FormControl
            name="name"
            type="name"
            placeholder="Az edzés neve."
            value={workout.name}
            onChange={this.onChange}
            isInvalid={!!errors.errors.name}
            style={{
              borderTopRightRadius: "5px",
              borderBottomRightRadius: "5px",
            }}
          />
          <FormControl.Feedback type="invalid">
            {errors.errors.name}
          </FormControl.Feedback>
        </InputGroup>
        <InputGroup controlid="workoutDesc" style={{ paddingBottom: "1.5rem" }}>
          <InputGroup.Text>Edzés leírása</InputGroup.Text>
          <FormControl
            as="textarea"
            name="description"
            placeholder="Az edzés rövid leírása a felhasználók számára."
            row="3"
            value={workout.description}
            onChange={this.onChange}
            isInvalid={!!errors.errors.description}
            style={{
              borderTopRightRadius: "5px",
              borderBottomRightRadius: "5px",
            }}
          />
          <FormControl.Feedback type="invalid">
            {errors.errors.description}
          </FormControl.Feedback>
        </InputGroup>
          <p>Borítókép</p>
          <div style={{ padding: "1rem", display: "flex", justifyContent: "center",  width: "100%", border: "1px solid lightgray", marginBottom: "1rem", borderRadius: "5px"}}>
          {!workout.thumbnailPath ? 
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
            <div className="workout-thumbnail" style={{display: "block"}}>
              <img src={"http://localhost:8080/"+workout.thumbnailPath} alt="thumbnail" style={{width: "320px", height: "240px"}}/>
              <div className="workout-cancel" style={{ position: "relative", left: "18rem", bottom: "15rem"}} onClick={this.deleteThumbnail}><MdOutlineCancel id="workout-cancel-icon" /></div>
            </div>
            )}
          </div>

        <p>Gyakorlatok</p>
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
          // A workout.workoutExercises változóban tárolt elemeket a map() függvény segtségével összekapcsoljuk az alább található HTML komponenssel
          // A React megköveteli az egyedi key értékek használatát a map() függvény használata esetén. Az egyedi kulcsok generálása az "index" paraméterrel történt.
          workout.workoutExercises.map((exercise, index) => {
            return (
                <Col key={`col-${index}`}>
                    <Card index={index} style={{width: "320px"}}>
                        <Card.Img variant="top" src={`http://127.0.0.1:8080/${exercise.Exercise.thumbnailPath}`}  style={{width: "320px"}}/>
                        <div className="workout-cancel" style={{position: "absolute", right: 0}}><MdOutlineCancel id="workout-cancel-icon" onClick={() => this.removeWorkoutExercise(index)}/></div>
                        <div className="workout-index" > <p>{`${index+1}. gyakorlat`}</p></div>
                        <Card.Body>
                            <Card.Title>{exercise.Exercise.name}</Card.Title>
                            <InputGroup controlid="workoutDesc" style={{ paddingBottom: "1rem", width: "85%"}}>
                                <InputGroup.Text>Ismétlések száma:</InputGroup.Text>
                                <FormControl
                                    type="number"
                                    name="reps"
                                    placeholder="db"
                                    value={workout.workoutExercises[index].reps}
                                    onChange={this.updateReps(index)}
                                    isInvalid={!!errors.workoutExerciseErrors[index].errors.reps}
                                    style={{
                                        borderTopRightRadius: "5px",
                                        borderBottomRightRadius: "5px",
                                    }}
                                />
                                    <FormControl.Feedback type="invalid">
                                        {errors.workoutExerciseErrors[index].errors.reps}
                                    </FormControl.Feedback>
                            </InputGroup>
                            <InputGroup controlid="workoutDesc" style={{ paddingBottom: "1.5rem", width: "75%"}}>
                                <InputGroup.Text>Pihenő:</InputGroup.Text>
                                <FormControl
                                    type="number"
                                    name="rest"
                                    placeholder="másodperc"
                                    value={workout.workoutExercises[index].rest}
                                    onChange={this.updateRest(index)}
                                    isInvalid={!!errors.workoutExerciseErrors[index].errors.rest}
                                    style={{
                                        borderTopRightRadius: "5px",
                                        borderBottomRightRadius: "5px",
                                    }}
                                />
                                    <FormControl.Feedback type="invalid">
                                        {errors.workoutExerciseErrors[index].errors.rest}
                                    </FormControl.Feedback>
                            </InputGroup>
                        </Card.Body>
                    </Card>
                </Col>
            );
        })
            } 
        </Row>
        </Container>
        {!loading ? (
          <Button style={{marginBottom: "4rem"}} variant="primary" type="submit"> Mentés </Button>
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
      </Form>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

NewWorkoutForm.propTypes = {
  submit: PropTypes.func.isRequired
};


export default connect(mapStateToProps, {addWorkout, getExercises, uploadFile, deleteFile})(NewWorkoutForm);