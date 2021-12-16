import React, {useState} from "react";
import {Alert, Container, Row, Col} from "react-bootstrap";
import {addPurchase} from "../../actions/purchases";
import {updateMembership} from "../../actions/users";
import { PayPalButton } from "react-paypal-button-v2"; //Dokumentáció: https://www.npmjs.com/package/react-paypal-button-v2
import {connect} from "react-redux";


const MembershipPage = (props) => {

    
    const Memberships = [
        {description: "30Day-membership", duration: 30, price: 1500, img: "../../dumbell.png"},
        {description: "90Day-membership", duration: 90, price: 4500, img: "../../dumbell.png"},
        {description: "180Day-membership", duration: 180, price: 7500, img: "../../dumbell.png"},
        {description: "360Day-membership", duration: 360, price: 15000, img: "../../dumbell.png"}
    ];

    const [selectedMembership, setMembership] = useState("")
    const [activeIndex, setIndex] = useState();
    const [successPayment, setSuccess] = useState(false);

    const selectItem = (membership, index) => {
        setSuccess(false);
        setIndex(index);
        setMembership(membership);
    };

    const changeSuccess = () => {
        setSuccess(true);
        setTimeout(() => {
            setSuccess(false);
          }, 5000);
    };


    return(

        <Container fluid>
            <div id="title-container" style={{ marginBottom: "1rem" }}>
                <h1>Tagság vásárlása</h1>
                <hr style={{ boxShadow: "0 0 8px 1px black"}}/>
            </div>
                {successPayment &&<Alert variant="success"> Sikeres tranzakció!</Alert>}
                <Row xs={1} md={2} lg={2} xl={4} style={{ marginTop: "5%"}}>

                    {
                        Memberships.map((membership, index) => {
                            const className = (activeIndex === index) ? "activeMembershipCard" : "membershipCard"
                            return (
                            <Col key={`col-${index}`}>
                                <div style={{ width: "320px", position: "relative",  marginBottom: "1rem" }} className={className}  index={index} onClick={() => selectItem(membership, index)}>
                                    <img  className="card-img" src={membership.img} alt="thumbnail"/>
                                    <div  className="membership-info">
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

            {!!selectedMembership &&
                <div style={{marginTop: "5rem", justifyContent: "center", alignItems: "center", display: "flex"}}  >
                <PayPalButton 
                    amount={selectedMembership.price}
                    onSuccess={(details, data) => {
                        props.addPurchase({user: props.user, membership: selectedMembership})
                        props.updateMembership({user: props.user, duration: selectedMembership.duration})
                        changeSuccess();
                    }}
                    options={{
                        clientId: "ARDmPNkTkpxISVogXySdIvVnN2iJVEEMUaK5pScBRdmrDcWsjvcBNDbUox8rDpDPN3xNeQpol6qTjpNy",
                        currency: "HUF"
                    }}
                    />
                </div>
            }
            
        </Container>

    )
}

function mapStateToProps(state) {
    return {
      user: state.user,
    };
  }

export default connect(mapStateToProps, {updateMembership, addPurchase})(MembershipPage)