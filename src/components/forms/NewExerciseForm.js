import React from 'react';
import Dropzone from "react-dropzone"; //Dokumentáció: https://react-dropzone.js.org
import {Form, Button, Alert, Spinner, InputGroup, FormControl} from 'react-bootstrap';
import {FiPlus} from "react-icons/fi";
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {addExercise, uploadFile, createThumbnail, deleteFiles} from '../../actions/exercises';
import {MdOutlineCancel} from "react-icons/md";

class NewExerciseForm extends React.Component{

    state = {
        exercise: {
            name: "",
            owner: this.props.user,
            filePath: "",
            thumbnailPath: "",
        },
        loading: false,
        errors: {}
    };

    onChange = (e) =>
        this.setState({
            exercise: { ...this.state.exercise, [e.target.name]: e.target.value }
        });

    // Űrlap beküldésekor végrehajtott utaásítások
    onSubmit = (e) => {
        e.preventDefault();
        const errors = this.validate(this.state.exercise);
        if (Object.keys(errors).length > 0){
            this.setState({errors});
            setTimeout(() => { this.setState({ errors: {}})}, 5000);
        } else {
            this.setState({loading: true})
            this.props
                .submit(this.state.exercise)
                .then(() => this.setState({ loading: false}))
                .catch(err => console.log(err));
        } 
    }
    // Borítókép és videó törlése a tömbből és a szerver oldalról is
    deleteThumbnail = () => {
        this.props.deleteFiles({thumbnailPath: this.state.exercise.thumbnailPath, filePath: this.state.exercise.filePath})
        .then(res => {
        this.setState({exercise: {...this.state.exercise, thumbnailPath: res.data.thumbnailPath, filePath: res.data.filePath}})
        })
        .catch(err => this.setState({errors: { ...this.state.errors, errors: err.response.data.errors}}))
    }

    // Videófájl betallózáskor végrehajtódó utaásítások + Borítókép generálás
    onDrop = (files) => {

        var formData = new FormData();
        formData.append("video", files[0]);
        // Video fájl feltöltése  az uploadFile() függvény segítségével
        this.props.uploadFile(formData)
            .then((res) => {
                this.setState({ exercise: {...this.state.exercise, filePath: res.filePath}}, () => {
                    // A videófájl feltöltése után generálásra kerül egy előnézeti kép a createThumbnail() függvény segítségével
                    // Mivel a createThumbnail() megköveteli a state.exercise.filePath változó helyes adattartamát, továbbá a setState() függvény aszinkron módon állítja be a kívánt váltózókat(1),
                    // így a createThumbnail() függvény szigorúan a state változók beállítása után kerül meghívásra.
                    // Forrás: https://stackoverflow.com/questions/42018342/is-there-a-synchronous-alternative-of-setstate-in-reactjs
                    // (1) React életciklus dokumentáció: https://hu.reactjs.org/docs/state-and-lifecycle.html
                    this.props.createThumbnail(this.state.exercise)
                    .then((res) => {
                        this.setState({exercise: {...this.state.exercise, thumbnailPath: res.thumbnailPath}})
                    })
                    .catch((err) => this.setState({errors: err.response.data.errors}))
                })
            })
            .catch((err) => this.setState({ errors: err.response.data.errors , loading: false}))
    }
    // A bemeneti mezők validálása
    validate = (data) => {
        const errors = {};

        if (!data.name) errors.name = "Ez a mező nem maradhat üresen!";
        if (!data.filePath) errors.filePath = "Nincs kiválasztva feltöltendő fájl!";

        return errors;
    }

    render(){
        const {exercise, errors, loading} = this.state;

        return(
            <Form noValidate onSubmit={this.onSubmit} >

                {errors.global && <Alert variant="danger" >
                    <Alert.Heading>Hiba!</Alert.Heading>
                    <p>{errors.global}</p>
                    </Alert>}
                {errors.filePath && <Alert variant="danger" >
                    {errors.filePath}
                    </Alert>}
                <InputGroup controlid="exerciseName" id="exerciseName" >
                    <InputGroup.Text >Gyakorlat neve</InputGroup.Text>
                    <FormControl
                        name="name"
                        type="name" 
                        placeholder="Adja meg a gyakorlat nevét (pl.: fekvőtámasz)"
                        value={exercise.name} 
                        onChange={this.onChange}
                        isInvalid={!!errors.name}
                    />
                    <FormControl.Feedback type='invalid'>
                        {errors.name}
                    </FormControl.Feedback>
                </InputGroup>

                <h6>Videófájl</h6>
                <div className="thumbnail-container">
                {!exercise.thumbnailPath ? 
                    (<Dropzone onDrop={this.onDrop} multiple={false} maxSize={500000000} >
                        {({ getRootProps, getInputProps }) => (
                            <div className="plus-button-container"
                                {...getRootProps()}
                                >
                                <input {...getInputProps()} />
                                <FiPlus id="plus-button" />
                            </div>
                        )}
                    </Dropzone>)
                    :
                    (
                    <div className="exercise-thumbnail-container" >
                        <div className="exercise-thumbnail" >
                            <Button variant="outline-secondary" id="exercise-cancel-button" onClick={() => this.deleteThumbnail()}>
                                <MdOutlineCancel id="exercise-cancel-icon"/>
                            </Button>
                            <img src={"http://localhost:8080/"+exercise.thumbnailPath} alt="thumbnail"/>
                        </div>
                    </div>
                    )}
                </div>

                {!loading ? (
                    <Button variant="primary" type="submit">Hozzáad</Button>
                  ) : (
                    <Button variant="primary" disabled>
                        <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        />
                        <span className="sr-only">Hozzáadás...</span>
                    </Button>
                  )  }
            </Form>
        );
    }
}

function mapStateToProps(state){
    return{
        user: state.user
    };
  }

NewExerciseForm.propTypes = {
    submit: PropTypes.func.isRequired
};

export default connect(mapStateToProps, {addExercise, createThumbnail, uploadFile, deleteFiles})(NewExerciseForm);