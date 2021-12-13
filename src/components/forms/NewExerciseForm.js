import React from 'react';
import Dropzone from "react-dropzone"; //Dokumentáció: https://react-dropzone.js.org
import {Form, Button, Alert, Spinner, InputGroup, FormControl} from 'react-bootstrap';
import {FiPlus} from "react-icons/fi";
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {addExercise, uploadFile, createThumbnail} from '../../actions/exercises';

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
                .catch(err => this.setState({ errors: err.response.data.errors , loading: false}));
        } 
    }

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
                <InputGroup controlid="exerciseName" style={{paddingBottom: "1.5rem"}}>
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
                <div style={{paddingBottom: "1.5em", display: 'flex', justifyContent: 'center' }}>
                <Dropzone onDrop={this.onDrop} multiple={false} maxSize={500000000} >
                    {({ getRootProps, getInputProps }) => (
                            <div style={{ width: '320px', height: '240px', border: '1px solid lightgray', display: 'flex', alignItems: "center", justifyContent: 'center' }}
                                {...getRootProps()}
                            >
                                <input {...getInputProps()} />
                                <FiPlus style={{ fontSize: '3rem' }} />

                            </div>
                        )}
                </Dropzone>
                {exercise.thumbnailPath !== "" &&
                        <div className="exercise-thumbnail" style={{paddingLeft: "2rem"}}>
                            <img src={"http://localhost:8080/"+exercise.thumbnailPath} alt="thumbnail"/>
                        </div>
                    }
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

export default connect(mapStateToProps, {addExercise, createThumbnail, uploadFile})(NewExerciseForm);