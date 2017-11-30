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
            data: null,
            pusher: false,
        }
    }

    pusher(){
        if (window.Echo) {
            this.setState({
                pusher: true
            });
            window.Echo.channel('coinbase')
                .listen('UpdateCoinbaseEvent', function(e){
                    this.setState({
                        data: e.data,
                        pusher: true,
                    });
                }.bind(this));
        }
    }

    componentDidMount(){
        this.pusher();
    }

    render(){

        if (this.state.pusher === false){
            this.pusher();
        }

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
                            {this.state.data !== null ? (
                                <div className="div">
                                    <p>Updated at {(new Date().toLocaleString())}</p>

                                    <h3>BTC</h3>
                                    <p>Spot : {this.state.data.BTC.spot_price} EUR</p>
                                    <p>Sell : {this.state.data.BTC.sell_price} EUR</p>
                                    <p>Buy  : {this.state.data.BTC.buy_price} EUR</p>

                                    <h3>ETH</h3>
                                    <p>Spot : {this.state.data.ETH.spot_price} EUR</p>
                                    <p>Sell : {this.state.data.ETH.sell_price} EUR</p>
                                    <p>Buy  : {this.state.data.ETH.buy_price} EUR</p>

                                    <h3>LTC</h3>
                                    <p>Spot : {this.state.data.LTC.spot_price} EUR</p>
                                    <p>Sell : {this.state.data.LTC.sell_price} EUR</p>
                                    <p>Buy  : {this.state.data.LTC.buy_price} EUR</p>
                                </div>
                            ) : 'Updating..'}
                        </div>
                    </div>

                </div>
            </div>
        )

    }
};