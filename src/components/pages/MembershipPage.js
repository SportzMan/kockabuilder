import React, {useState} from "react";
import {Container, Card, Row, Col} from "react-bootstrap";
import {connect} from "react-redux";

const MembershipPage = () => {

    const Memmberships = [
        {duration: 30, price: 1500, img: "../../dumbell.png"},
        {duration: 90, price: 4500, img: "../../dumbell.png"},
        {duration: 180, price: 7500, img: "../../dumbell.png"},
        {duration: 360, price: 15000, img: "../../dumbell.png"}
    ];

    const [selectedMembership, setMembership] = useState(null)
    const [activeIndex, setIndex] = useState(null);

    const selectItem = (membership, index) => {
        setIndex(index);
        setMembership(membership);
    };

    return(
        <Container fluid>
            <div id="title-container" style={{ marginBottom: "1rem" }}>
                <h1>Tagság vásárlása</h1>
                <hr style={{ boxShadow: "0 0 8px 1px black"}}/>
            </div>
                <Row xs={1} md={2} lg={2} xl={4} style={{width: "100%", marginTop: "5%"}}>

                    {
                        Memmberships.map((membership, index) => {
                            const className = (activeIndex === index) ? "activeMembershipCard" : "membershipCard"
                            return (
                            <Col>
                                <div style={{ width: "320px", position: "relative",  marginBottom: "1rem" }} className={className} key={`col-${index}`} index={index} onClick={() => selectItem(membership, index)}>
                                <img className="card-img" src={membership.img} />
                                <div className="membership-info">
                                    <h2 style={{paddingLeft: "35%", paddingTop: "5%"}}> {`${membership.duration} nap`} </h2>
                                    <br/>
                                    <h5 style={{paddingLeft: "38%"}}>{`${membership.price} Ft`}</h5>
                                </div>
                            </div>
                            </Col>
                            )
                        })

                    }
                </Row>
        </Container>
    )
}

export default MembershipPage