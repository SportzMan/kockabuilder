import {useState} from "react";
import {Button, Container, Col, Row, Modal} from "react-bootstrap";

const WorkoutSelectorModal = (props) => {

    const [activeIndex, setIndex] = useState(null);
    const [selectedWorkout, setWorkout] = useState(null);

    const selectItem = (workout, index) => {
        setIndex(index);
        setWorkout(workout);
    };


    const closeModal = (selectedWorkout) => {
      if(!selectedWorkout){
        props.hideModal();
        setIndex(null);
        setWorkout(null);
      }else{
        props.addWorkout(selectedWorkout)
        props.hideModal();
        setIndex(null);
        setWorkout(null);
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
                  // A Workouts változóban tárolt elemeket a map() függvény segtségével összekapcsoljuk az alább található HTML komponenssel
                  // A React megköveteli az egyedi key értékek használatát a map() függvény használata esetén. Az egyedi kulcsok generálása az "index" paraméterrel történt.
                  props.Workouts.map((workout, index) => {
                      const className = (activeIndex === index) ? "activeCard" : "workoutCard"
                    return (
                      <div
                        className={className}
                        id={`card-${index}`}
                        key={`card-${index}`}
                        index={index}
                        style={{ marginBottom: "1rem" }}
                        onClick={() => selectItem(workout, index)}
                      >
                        <div style={{ width: "300px", position: "relative" }}>
                          <img
                            className="card-img"
                            src={`http://127.0.0.1:8080/${workout.thumbnailPath}`}
                          />
                          <div className="workout-name">
                            <span>{workout.name}</span>
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
        <Button variant="primary" onClick={() => closeModal(selectedWorkout)}>
            Hozzáad
          </Button>
          <Button variant="secondary" onClick={() => closeModal(null)}>
            Mégse
          </Button>
        </Modal.Footer>
      </Modal>
    )
}

export default WorkoutSelectorModal