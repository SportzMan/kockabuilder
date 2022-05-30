import React from 'react';
import Dropzone from "react-dropzone"; //Dokumentáció: https://react-dropzone.js.org
import {Form, Button, Alert, Spinner, InputGroup, FormControl} from 'react-bootstrap';
import {FiPlus} from "react-icons/fi";
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {addExercise, uploadFile, createThumbnail, deleteFiles} from '../../actions/exercises';
import {MdOutlineCancel} from "react-icons/md";
import ItemDeleteModal from "../modals/ItemDeleteModal";
import {Link} from 'react-router-dom';

class NewExerciseForm extends React.Component{

    state = {
        exercise: {
            originalName: this.props.exercise.name,
            name: this.props.exercise.name,
            owner: this.props.exercise.owner,
            filePath: this.props.exercise.filePath,
            thumbnailPath: this.props.exercise.thumbnailPath,
        },
        loading: false,
        success: false,
        errors: {},
        modal: false
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
                .then(() => this.setState({ exercise: {...this.state.exercise, originalName: this.state.exercise.name}, loading: false, success: true}, () => { setTimeout(() => {
                    this.setState({success: false})}, 5000);}))
                .catch(err => this.setState({ errors: err.response.data.errors , loading: false, success: false}));
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

    validate = (data) => {
        const errors = {};

        if (!data.name) errors.name = "A név mező nem maradhat üresen!";
        if (!data.filePath) errors.filePath = "Nincs kiválasztva feltöltendő fájl!";

        return errors;
    }

    hideModal = () => {
        this.setState({modal: false})
    };

    showModal = () => {
        this.setState({modal: true})
    };

    render(){
        const {exercise, errors, loading, success, modal} = this.state;

        return(

            <Form noValidate onSubmit={this.onSubmit} >
            <ItemDeleteModal modal={modal} name="a gyakorlatot" item={exercise} buttonName="Gyakorlat" hideModal={this.hideModal} deleteItem={this.props.deleteItem}/>

                {!loading&&success &&<Alert variant="success" >A gyakorlat sikeresen módosítva!</Alert>}

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
                <div className="exercise-dropzone-container" >
                {!exercise.thumbnailPath ? 
                    (<Dropzone onDrop={this.onDrop} multiple={false} maxSize={500000000} >
                    {({ getRootProps, getInputProps }) => (
                        <div className="plus-button" {...getRootProps()} >
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
                            <img src={`http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/${exercise.thumbnailPath}`} alt="thumbnail"/>
                        </div>
                    </div>
                    )}
                </div>
                <div className="button-container">

                    {!loading ? (
                        <Button variant="primary" type="submit" >Módosít</Button>
                    ) : (
                        <Button variant="primary" disabled >
                            <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            />
                            <span className="sr-only">Módosít...</span>
                        </Button>
                    )  }
                    <Button variant="outline-danger" onClick={this.showModal}>Törlés</Button>
                    <Button variant="outline-secondary" as={Link} to="/my_exercises">Vissza</Button>
                </div>
            </Form> )

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