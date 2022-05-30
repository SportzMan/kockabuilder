import React from "react";
import {Modal} from "react-bootstrap";

const ItemDeleteModal = (props) => {

    return (
        <Modal show={props.modal} onHide={props.hideModal}>
            <Modal.Title>{props.exercise.name} </Modal.Title>

            <video src={`http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/${props.exercise.filePath}`} style={{width: "100%"}} controls />

        </Modal>
    )
}

export default ItemDeleteModal