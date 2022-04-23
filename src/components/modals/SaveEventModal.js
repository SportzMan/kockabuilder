import React from "react";
import {Button, Modal} from "react-bootstrap";

const SaveEventModal = (props) => {

    return (
        <Modal show={props.modal} onHide={props.hideModal}>
            <Modal.Header closeButton>
                <Modal.Title>Edzés mentése?</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p>Szeretné rögzíteni ezt az edzést a naptárjába? </p>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={() => props.hideModal()}>Nem</Button>
                <Button variant="primary"  onClick={() => props.addEvent()}>Igen</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default SaveEventModal