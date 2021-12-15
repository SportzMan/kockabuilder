import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Route, Redirect} from 'react-router-dom';

const   TrainerRoute = ({isTrainer, component: Component, ...rest}) => (
    <Route {...rest} render={props => isTrainer ? <Component {...props} key={Date.now()}/> : <Redirect to="/"/>}/> 
    // A key egyedi értékének beállítására azért van szükség, hogy egy adott kommponens akkor is újratöltsön amikor a menüben újra kiválasztásra kerül.
    // A router ugyanis nem hívja meg alapértelmezetten a render() függvényt, ha már az adott komponen mmeg van nyitva. 
    //Referencia: https://stackoverflow.com/questions/38839510/forcing-a-react-router-link-to-load-a-page-even-if-were-already-on-that-page
);

TrainerRoute.propTypes ={
    isTrainer: PropTypes.bool.isRequired
};

function mapStateToProps(state){
    return {
        isTrainer: state.user.isTrainer
    }
}
export default connect(mapStateToProps)(TrainerRoute);