import React, {useState} from "react";
import {Alert, Container, Row, Col} from "react-bootstrap";
import {addPurchase} from "../../actions/purchases";
import {updateMembership} from "../../actions/users";
import { PayPalButton } from "react-paypal-button-v2"; //Dokumentáció: https://www.npmjs.com/package/react-paypal-button-v2
import {connect} from "react-redux";
import "../CSS/pages/MembershipPage.css";


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
            <div id="title-container" >
                <h1>Tagság vásárlása</h1>
                <hr />
            </div>
            {successPayment &&<Alert variant="success"> Sikeres tranzakció!</Alert>}
            <div className="membership-flexbox-container">
                {
                    Memberships.map((membership, index) => {
                        const className = (activeIndex === index) ? "activeMembershipCard" : "membershipCard"
                        return (
                            <div className={className} id="membership-card" key={index} index={index} onClick={() => selectItem(membership, index)}>
                                <img  className="card-img" src={membership.img} alt="thumbnail"/>
                                <div  className="membership-info">
                                    <h2> {`${membership.duration} nap`} </h2>
                                    <br/>
                                    <h5>{`${membership.price} Ft`}</h5>
                                </div>
                            </div>
                        )
                    })

                }
            </div>

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