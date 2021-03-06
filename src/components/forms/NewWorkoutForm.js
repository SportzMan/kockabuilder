import React from "react";
import Dropzone from "react-dropzone";
import {Container, Form,Button,Alert,Spinner,InputGroup,FormControl, ListGroup} from "react-bootstrap";
import { FiPlus } from "react-icons/fi";
import {MdOutlineCancel} from "react-icons/md";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { uploadFile, deleteFile, addWorkout } from "../../actions/workouts";
import { getExercises} from "../../actions/exercises";
import ExerciseSelectorModal from "../modals/ExerciseSelectorModal";




class NewWorkoutForm extends React.Component {

  state = {
    workout: {
      name: "",
      description: "",
      owner: this.props.user,
      workoutGroups: [{
        workoutExercises: [],
        rounds: ""
      }],
      thumbnailPath: ""
    },
    modal: false,
    loading: false,
    success: false,
    selectedIndex: "",
    Exercises: [],
    errors: {}
  };

  // A "Hatás Horog"
  // Dokumentáció: https://hu.reactjs.org/docs/hooks-effect.html
  // Az oldal betöltésekor lekérdezzük az adatbázisban található összes gyakorlatot tulajdonostól függetlenül, és eltároljuk azokat az "Exercises" változóban
  // Az első render után lefut a metódus és lekérdezi az adatbázisban elérhető összes gyakorlat objektumot
  componentDidMount() {
    this.props.getExercises().then(res => {this.setState( {...this.state.Exercises, Exercises: res, loading: false, success: true})})
    .catch(err => {this.setState( {errors: { ...this.state.errors, errors: err.response.data.errors}, loading: false, success: false})})
  }

  ///////////////////////////////////
  // A nem tömbökben tárolt objektumokhoz kapcsolodó beviteli mezők változás kezelő függvénye
  // A paraméterként megkapott esemény változó segítségével meghatározásra kerül az eseményt kiváltó komponens neve és értéke, és beállítja az ezekhez kapcsolódó állapot változókat.
  // Mivel az osztályhoz tartozó állapot változók immutabilisek, így csak a setState() metódus segítségel lehet azokat frissíteni.
  onChange = (e) =>
    this.setState({
      workout: { ...this.state.workout, [e.target.name]: e.target.value },
    });
  //
  ///////////////////////////////////
  

  ///////////////////////////////////
  // Gyakorlat csoportok ismétlés számának frissítése
  updateRounds = (groupIndex) => (e) => {
    const workoutGroups = this.state.workout.workoutGroups;

    for(let i = 0; i < workoutGroups.length; i++){
      if(i === groupIndex){
        workoutGroups[groupIndex].rounds = e.target.value;
      }
    }

    this.setState({workout: {...this.state.workout, workoutGroups: workoutGroups}});
  }
  //
  ///////////////////////////////////

  ///////////////////////////////////
  // Az egyes gyakorlatok ismétlés/intervallum értékének frissítése
  updateChange = (groupIndex, exerciseIndex, value) => (e) => {

    const workoutGroups = this.state.workout.workoutGroups; // Aktuális edzés csoportok és gyakorlatok másolása

    for( let i = 0; i <workoutGroups.length; i++ ){
      if(i === groupIndex){
        for( let j = 0; j < workoutGroups[groupIndex].workoutExercises.length; j++ ){
          if(j === exerciseIndex){
            switch(value){
              case 'reps': workoutGroups[groupIndex].workoutExercises[exerciseIndex].reps = e.target.value
              break;
              case 'rest': workoutGroups[groupIndex].workoutExercises[exerciseIndex].rest = e.target.value
              break;
              case 'type': workoutGroups[groupIndex].workoutExercises[exerciseIndex].type = !workoutGroups[groupIndex].workoutExercises[exerciseIndex].type
              break;
            }

          }
        }
      }
    }

    this.setState({workout: {...this.state.workout, workoutGroups: workoutGroups}});
    }
  //
  ///////////////////////////////////
  
  ///////////////////////////////////
  // Az űrlap beküldését megvalósító függvény
  onSubmit = (e) => {
    const {workout} = this.state;
    e.preventDefault();
    const errors = this.validate(workout);
    if (Object.keys(errors).length > 0){
        console.log(errors);
        this.setState({errors});

    } else {
        this.setState({loading: true});
          this.props.submit(workout)
          .then(() => this.setState({ loading: false}))
          .catch(err => this.setState({errors: err.response.data.errors, loading: false}));
      }
  }
  //
  ///////////////////////////////////
  
  // Hasonlóan a NewExerciseForm-hoz
  onDrop = (files) => {
    var formData = new FormData();
    formData.append("workout", files[0]);
    // Kép fájl feltöltése  az uploadFile() függvény segítségével
    this.props.uploadFile(formData)
        .then((res) => {
            this.setState({ workout: {...this.state.workout, thumbnailPath: res.thumbnailPath}})
        })
        .catch((err) => this.setState({errors: err.response.data.errors, loading: false}))
  }
  // Előnézeti kép törlése
  deleteThumbnail = () => {
    this.props.deleteFile({thumbnailPath: this.state.workout.thumbnailPath})
      .then(res => {
      this.setState({workout: {...this.state.workout, thumbnailPath: res.data.thumbnailPath}})
    })
      .catch(err => this.setState({ errors: err.response.data.errors}))
  }

  ///////////////////////////////////
  // A Modal komponens megjelenítésééert és elrejtésért felelős függvények
  showModal = (index) => this.setState({ modal: true, selectedIndex: index });

  hideModal = () => this.setState({ modal: false });
  //
  ///////////////////////////////////
  
  // A workout.workoutExercises állapot változó töltéséért felelős függvény

  ///////////////////////////////////
  // Új gyakorlat hozzáadása a csoporthoz
  addWorkoutExercise = (exercise, index) => {
    let workoutExercise = {exercise: exercise, name: exercise.name, thumbnailPath: exercise.thumbnailPath, reps: "", rest: "", type: false};
    var groups = this.state.workout.workoutGroups;
    groups[index].workoutExercises.push(workoutExercise);
    this.setState({workout: {...this.state.workout, workoutGroups: groups }});
  };
  //
  ///////////////////////////////////
  
  ///////////////////////////////////
  // Új gyakorlatcsoport hozzáadása
  addWorkoutGroup = () => {
    let groups = this.state.workout.workoutGroups;
    groups.push({workoutExercises: [], rounds: ""})
    this.setState({workout: {...this.state.workout, workoutGroups: groups}})
  }
  //
  ///////////////////////////////////
  
  ///////////////////////////////////
  // Kiválasztott edzés csoport törlése
  removeWorkoutGroup = (index) => {
    const workoutGroups = this.state.workout.workoutGroups;
    if(workoutGroups.length > 1){ // Nincs értelme törölni csoportot, ha csak egy csoport van
      workoutGroups.splice(index, 1);
      this.setState({workout: {...this.state.workout, workoutGroups: workoutGroups}});
    }
}
//
///////////////////////////////////

  ///////////////////////////////////
  // Kiválasztott gyakorlat törlése
  removeWorkoutExercise = (groupIndex, exerciseIndex) => {
      const workoutGroups = this.state.workout.workoutGroups;

      for( let i = 0; i <workoutGroups.length; i++ ){
        if(i === groupIndex){
          workoutGroups[groupIndex].workoutExercises.splice(exerciseIndex, 1);
        }
      }

      this.setState({workout: {...this.state.workout, workoutGroups: workoutGroups}});
  }
  //
  ///////////////////////////////////

  ///////////////////////////////////
  //// Az űrlap mezőinek kliens oldali ellenőrzéséhez használt validátor függvény
  validate = (data) => {
    const workout = data;
    const errors = {};
    // Az "Edzés neve" mező nem lehet üres és nem lehet rövidebb 6 karakternél (ismert gyakorlatokat átnézve nem találtam ennél rövdiebb karakterláncú gyakorlatot)
    if (!data.name) errors.name = "A mező nem maradhat üresen!";
    else{if (data.name.length < 6) errors.name = "A név mező értéke legalább 6 karakter hosszú kell legyen!"
    
        } 
    // Az "Edzés leírása" mező nem lehet üres és nem lehet rövidebb 32 karakternél (érdemi leírás érdekében)
    if (!data.description) errors.description = "A mező nem maradhat üresen!";
    else{if (data.description.length < 32) errors.description = "A leírás mező értéke legalább 32 karakter hosszú kell legyen!"
        }

    // Az egyes gyakorlatokhoz tartozó "Ismétlések száma" mezők értéke legyen nagyobb 0-nál továbbá a "Pihenő" mezők értéke legyen legalább 0
    for(let i= 0; i<data.workoutGroups.length; i++){

      // A körök száma 0-nál nagyobb kell legyen
      if (data.workoutGroups[i].rounds < 1) errors.rounds = "A körök száma legalább 1 kell legyen!"

      for(let j=0; j<data.workoutGroups[i].workoutExercises.length; j++){

        if(!data.workoutGroups[i].workoutExercises[j].reps){ workout.workoutGroups[i].workoutExercises[j].repsError = "A mező nem maradhat üresen!"; errors.repsError = "flag" }
        else{if(data.workoutGroups[i].workoutExercises[j].reps < 1){ workout.workoutGroups[i].workoutExercises[j].repsError = "Az ismétlések száma nem lehet 0!"; errors.repsError = "flag" }
            }

        if(!data.workoutGroups[i].workoutExercises[j].rest){ workout.workoutGroups[i].workoutExercises[j].restError = "A mező nem maradhat üresen!"; errors.restError = "flag"}
        else{if(data.workoutGroups[i].workoutExercises[j].rest < 0) { workout.workoutGroups[i].workoutExercises[j].restError = "A pihenés ideje nem lehet negatív!"; errors.restError = "flag" }
            }
    }
  }
    // Nem hiányozhat az előnézeti kép
    if(!data.thumbnailPath) errors.global = "Az űrlap leadásához szükség van egy előnézeti képre!"

    // Tartalmaznia kell legalább 3 gyakorlatot
    if(data.workoutGroups[0].workoutExercises.length < 3) errors.global = "Az űrlap leadásához szükség van legalább három gyakorlat megadására!"

    this.setState({...this.state.workout, workout: workout});
    return errors;
  };
  ////
  ///////////////////////////////////


  render() {
    const { workout, errors, loading, Exercises, modal, selectedIndex} = this.state;

    return (
      <div className="form-container">
      <ExerciseSelectorModal modal={modal} Exercises={Exercises} hideModal={this.hideModal} addWorkoutExercise={this.addWorkoutExercise} index={selectedIndex}/>

      <Form noValidate onSubmit={this.onSubmit}>
        {errors.global && (
          <Alert variant="danger">
            <Alert.Heading>Hiba!</Alert.Heading>
            <p>{errors.global}</p>
          </Alert>
        )}

        <InputGroup controlid="workoutName" id="workoutName" >
          <InputGroup.Text>Edzés neve</InputGroup.Text>
          <FormControl
            name="name"
            type="name"
            placeholder="Az edzés neve."
            value={workout.name}
            onChange={this.onChange}
            isInvalid={!!errors.name}
          />
          <FormControl.Feedback type="invalid">
            {errors.name}
          </FormControl.Feedback>
        </InputGroup>

        <InputGroup controlid="workoutDesc" id="workoutDesc">
          <InputGroup.Text>Edzés leírása</InputGroup.Text>
          <FormControl
            as="textarea"
            name="description"
            placeholder="Az edzés rövid leírása a felhasználók számára."
            row="3"
            value={workout.description}
            onChange={this.onChange}
            isInvalid={!!errors.description}
          />
          <FormControl.Feedback type="invalid">
            {errors.description}
          </FormControl.Feedback>
        </InputGroup>

        <h6>Borítókép</h6>
          <div className= "workout-dropzone-container" >
          {!workout.thumbnailPath ? 
            (<Dropzone id="thumbnail-dropzone" onDrop={this.onDrop} multiple={false} maxSize={500000000} >
              {({ getRootProps, getInputProps }) => (
                <div className="plus-button-container" {...getRootProps()} >
                  <input {...getInputProps()} />
                  <FiPlus id="plus-button" />
                </div>
              )}
            </Dropzone>)
            :
            (
            <div className="workout-thumbnail-container" >
              <div className="workout-thumbnail" >
                  <Button variant="outline-secondary" id="workout-cancel-button" onClick={() => this.deleteThumbnail()}>
                      <MdOutlineCancel id="workout-cancel-icon"/>
                  </Button>
                  <img src={`http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/${workout.thumbnailPath}`} alt="thumbnail"/>
              </div>
            </div>
            )}
          </div>

        <Container fluid id="exercise-container">
          <h6>Gyakorlatok</h6>
            {workout.workoutGroups.map((group, groupIndex) => {
              return(

              <ListGroup key={`group-${groupIndex}`} >
                <ListGroup.Item>
                  <div className="cancel-button-container">
                    <Button variant="outline-secondary" id="wgroup-cancel-button" onClick={() => this.removeWorkoutGroup(groupIndex)}>
                      <MdOutlineCancel id="wgroup-cancel-icon"/>
                    </Button>
                  </div>     
                  <InputGroup controlid="workoutRounds" id="workoutRounds">
                    <Form.Label >Körök száma: </Form.Label> 
                    <FormControl 
                      name="rounds"
                      type="number"
                      placeholder="A gyakorlat csoport ismétléséinek száma"
                      value={workout.workoutGroups[groupIndex].rounds}
                      onChange={this.updateRounds(groupIndex)}
                      isInvalid={!!workout.workoutGroups[groupIndex].roundsError}
                    />
                    <FormControl.Feedback type="invalid">
                      {workout.workoutGroups[groupIndex].roundsError}
                    </FormControl.Feedback>
                  </InputGroup>
                </ListGroup.Item>

                {group.workoutExercises.map((exercise, exerciseIndex) => {
                  return(
                    <ListGroup.Item key={`exercise-${exerciseIndex}`}>
                      
                      <div className="main-exercise-container">
                        <div className="exercise-cancel-button-container">
                          <Button variant="outline-secondary" id="exercise-cancel-button" onClick={() => this.removeWorkoutExercise(groupIndex, exerciseIndex)}>
                            <MdOutlineCancel id="exercise-cancel-icon"/>
                          </Button>
                        </div>   
                        <div className="exercise-header-container">
                          <div className="exercise-img-container">
                            <img className="exercise-thumbnail" src={`http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/${exercise.exercise.thumbnailPath}`}/>
                            <p className="exercise-name-paragraph">{exercise.exercise.name}</p>
                          </div>
                        </div>
                        <div className="exercise-container">

                          <Form.Check id="exercise-repetition-type" type="switch" label="Intervallum gyakorlat" 
                            checked={workout.workoutGroups[groupIndex].workoutExercises[exerciseIndex].type}
                            onChange={this.updateChange(groupIndex, exerciseIndex, 'type')}/>

                          <InputGroup controlid="workoutReps" id="workoutReps">
                            <InputGroup.Text>{workout.workoutGroups[groupIndex].workoutExercises[exerciseIndex].type ? 'Intervallum ideje:' : 'Ismétlések száma:'}</InputGroup.Text>
                              <FormControl
                                type="number"
                                name="reps"
                                placeholder={workout.workoutGroups[groupIndex].workoutExercises[exerciseIndex].type ? 'másodperc' : 'darab'}
                                value={workout.workoutGroups[groupIndex].workoutExercises[exerciseIndex].reps}
                                onChange={this.updateChange(groupIndex, exerciseIndex, 'reps')}
                                isInvalid={!!workout.workoutGroups[groupIndex].workoutExercises[exerciseIndex].repsError}
                              />
                              <FormControl.Feedback type="invalid">
                                {workout.workoutGroups[groupIndex].workoutExercises[exerciseIndex].repsError}
                              </FormControl.Feedback>
                          </InputGroup>
                         
                          <InputGroup controlid="workoutRest" id="workoutRest">
                            <InputGroup.Text>Pihenő:</InputGroup.Text>
                              <FormControl
                                type="number"
                                name="rest"
                                placeholder="másodperc"
                                value={workout.workoutGroups[groupIndex].workoutExercises[exerciseIndex].rest}
                                onChange={this.updateChange(groupIndex, exerciseIndex, 'rest')}
                                isInvalid={!!workout.workoutGroups[groupIndex].workoutExercises[exerciseIndex].restError}
                              />
                              <FormControl.Feedback type="invalid">
                                {workout.workoutGroups[groupIndex].workoutExercises[exerciseIndex].restError}
                              </FormControl.Feedback>
                          </InputGroup>
                        </div>
                      </div>
                    </ListGroup.Item>
                   )
                  })}

                  <div className="add-exercise-button-container">
                    <Button id="exercise-button" variant="outline-secondary"
                      onClick={() => this.showModal(groupIndex)}
                    >
                      <FiPlus />
                    </Button>
                  </div>
              </ListGroup>
            )})}

            <div className="add-group-button-container" >
              <Button id="group-button" variant="outline-primary" 
                onClick={this.addWorkoutGroup}
              >
                <FiPlus />
              </Button>
            </div>
       
        </Container>
        <div className="command-button-container">
          {!loading ? 
            (
              <Button variant="primary" type="submit"> Mentés </Button>
            ) 
            : 
            (
              <Button variant="primary" disabled>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                <span className="sr-only">Mentés...</span>
              </Button>
            )
          }
        </div>

      </Form>
      </div>
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