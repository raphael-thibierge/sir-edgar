import React from 'react';
import {ProgressBar} from 'react-bootstrap';
import AjaxEditableValue from '../generic/AjaxEditableValue.jsx';

export default class PriceRoot extends React.Component{

    constructor(props){
        super(props);
        this.state = this.getInitialState();
    }

    getInitialState(){
        return {
            score: 0,
            data: [],
        }
    }

    componentDidMount(){
        //this.request();

        if (window.Echo) {
            window.Echo.public('coinbase')
                .listen('UpdateCoinbaseEvent', (e) => {
                    this.setState({
                        data: e.data,
                    });
                });
        }
    }


    /**
     * AJAX request to get goals from server
     */
    request(){

        const request = $.ajax({
            url: './goals/current-score',
            cache: false,
            method: 'GET',
            success: (response) => {

                if (response && response.status === 'success'){
                    this.setState({
                        score: response.data.score,
                        scoreGoal: parseInt(response.data.daily_score_goal),
                    }, () => {

                        if (window.Echo) {
                            window.Echo.private('App.User.' + window.user_id)
                                .listen('GoalCompleted', (e) => {
                                    this.setState({
                                        score: this.state.score + e.goal.score,
                                    });
                                });
                            window.Echo.private('App.User.' + window.user_id)
                                .listen('GoalDeleted', (e) => {
                                    this.setState({
                                        score: this.state.score - e.goal.score,
                                    });
                                });
                        }

                    });
                }

            },
            error: (error) => {console.error(error.message); alert(error)},
        });
    }


    render(){

        console.log(this.state.data);


        return (
            <div className="row">
                <div className="col-xs-12">

                    <div className="row">
                        <div className="col-xs-12">
                            <h1 className="page-header productivity-page-header">Crypto prices from coinbase</h1>
                        </div>
                    </div>


                    <div className="row">
                        <div className="col-xs-12">
                            {this.state.data === [] ? (
                                <div className="div">
                                    <h3>BTC</h3>
                                    <p>Spot : {this.state.data.BTC.spot}</p>
                                    <p>Sell : {this.state.data.BTC.sell}</p>
                                    <p>Buy  : {this.state.data.BTC.buy}</p>
                                    <h3>ETH</h3>
                                    <p>Spot : {this.state.data.ETH.spot}</p>
                                    <p>Sell : {this.state.data.ETH.sell}</p>
                                    <p>Buy  : {this.state.data.ETH.buy}</p>
                                    <h3>LTC</h3>
                                    <p>Spot : {this.state.data.LTC.spot}</p>
                                    <p>Sell : {this.state.data.LTC.sell}</p>
                                    <p>Buy  : {this.state.data.LTC.buy}</p>
                                </div>
                            ) : 'Updating..'}
                        </div>
                    </div>

                </div>
            </div>
        )

    }
};