import {useState} from "react";
import {Button, Container, Col, Row, Modal} from "react-bootstrap";

const ExerciseSelectorModal = (props) => {

    const [activeIndex, setIndex] = useState(null);
    const [selectedExercise, setExercise] = useState(null);

    const selectItem = (exercise, index) => {
        setIndex(index);
        setExercise(exercise);
    };


    const closeModal = (selectedExercise) => {
      if(!selectedExercise){
        props.hideModal();
        setIndex(null);
        setExercise(null);
      }else{
        props.addWorkoutExercise(selectedExercise)
        props.hideModal();
        setIndex(null);
        setExercise(null);
      }
    }

    return (
        <Modal show={props.modal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Gyakorlat kiválasztása</Modal.Title>
        </Modal.Header>
        <Modal.Body className="show-grid" style={{ height: "20rem", overflowY: "auto" }}
        >
          <Container fluid
            style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <Row>
              <Col >
                {
                  // Az Exercises változóban tárolt elemeket a map() függvény segtségével összekapcsoljuk az alább található HTML komponenssel
                  // A React megköveteli az egyedi key értékek használatát a map() függvény használata esetén. Az egyedi kulcsok generálása az "index" paraméterrel történt.
                  props.Exercises.map((exercise, index) => {
                      const className = (activeIndex === index) ? "activeCard" : "exerciseCard"
                    return (
                      <div
                        className={className}
                        id={`card-${index}`}
                        key={`card-${index}`}
                        index={index}
                        style={{ marginBottom: "1rem" }}
                        onClick={() => selectItem(exercise, index)}
                      >
                        <div style={{ width: "300px", position: "relative" }}>
                          <img
                            className="card-img"
                            src={`http://127.0.0.1:8080/${exercise.thumbnailPath}`}
                            alt="thumbnail"
                          />
                          <div className="exercise-name">
                            <span>{exercise.name}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                }
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
        <Button variant="primary" onClick={() => closeModal(selectedExercise)}>
            Hozzáad
          </Button>
          <Button variant="secondary" onClick={() => closeModal(null)}>
            Mégse
          </Button>
        </Modal.Footer>
      </Modal>
    )
}

export default ExerciseSelectorModal