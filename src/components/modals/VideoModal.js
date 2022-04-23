import React from "react";
import {Modal} from "react-bootstrap";

const ItemDeleteModal = (props) => {

    return (
        <Modal show={props.modal} onHide={props.hideModal}>
            <Modal.Title>{props.exercise.name} </Modal.Title>

            <video src={`http://127.0.0.1:8080/${props.exercise.filePath}`} style={{width: "100%"}} controls />

        </Modal>
    )
}

export default ItemDeleteModal