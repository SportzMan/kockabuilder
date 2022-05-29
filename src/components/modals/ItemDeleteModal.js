import React from "react";
import {Button, Modal} from "react-bootstrap";

const ItemDeleteModal = (props) => {

    return (
        <Modal show={props.modal} onHide={props.hideModal}>
            <Modal.Header closeButton>
                <Modal.Title>{props.buttonName} törlése?</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p>Biztosan törölni szeretné {props.name}? </p>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={() => props.hideModal()}>Mégse</Button>
                <Button variant="danger" onClick={() => props.deleteItem(props.item)}>{props.buttonName} törlése</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ItemDeleteModal