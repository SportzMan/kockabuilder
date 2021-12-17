import React from "react";
import {Modal} from "react-bootstrap";

const ItemDeleteModal = (props) => {

    return (
        <Modal show={props.modal} onHide={props.hideModal}>
            <Modal.Header closeButton>
                <Modal.Title>{props.exercise.name} </Modal.Title>
            </Modal.Header>

            <video src={props.exercise.filePath} style={{width: "100%"}} controls />

        </Modal>
    )
}

export default ItemDeleteModal