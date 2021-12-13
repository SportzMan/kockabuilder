import React from 'react';
import {Container, Card, Image} from "react-bootstrap"
import {Link} from 'react-router-dom';



const ProgramPage = () =>

<Container fluid id="course">
    <h2>Kurzusok</h2>
    <div className="flex-container">
        <Card as={Link} to='/training' id="card" alt="Az erős hasizmokért">
            <Image src='https://res.cloudinary.com/thenx-production/image/upload/w_450/v1569516160/workouts/6273/1569516129140.jpg' wrapped ui={false}/>
            <Card.Header>Az erős hasizmokért</Card.Header>
            <Card.Meta>Hozzáadva: 2020.05.07.</Card.Meta>
        </Card>
            
    </div>
</Container>

;


export default ProgramPage;
