import React from 'react';
import {Card, Container, Image, ListGroup} from "react-bootstrap"
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';




const TrainingPage = () =>

<Container fluid>
<ListGroup>
  <ListGroup.Item>
            Térdemelés
            <Image style={{width:'100px'}} src='https://i.vimeocdn.com/video/777877414_160x90.jpg?r=pad'/>
            <span>45 másodperc</span>
      </ListGroup.Item>
  </ListGroup>
</Container>
;


export default TrainingPage;
