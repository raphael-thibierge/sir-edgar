import React from 'react';
import {ProgressBar} from 'react-bootstrap';
import AjaxEditableValue from '../generic/AjaxEditableValue.jsx';
import MoneyGraph from './MoneyGraph';
import {PanelGroup} from 'react-bootstrap';


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
            BTC_values: null,
            ETH_values: null,
            LTC_values: null,
        }
    }

    pusher(){
        if (window.Echo) {
            this.setState({
                pusher: true
            });
            window.Echo.channel('coinbase')
                .listen('UpdateCoinbaseEvent', function(e){

                    let BTC_values = this.state.BTC_values;
                    if ( BTC_values !== null){
                        BTC_values.push(e.data.BTC);
                    }

                    let LTC_values = this.state.LTC_values;
                    if ( LTC_values !== null){
                        LTC_values.push(e.data.LTC);
                    }

                    let ETH_values = this.state.ETH_values;
                    if ( ETH_values !== null){
                        ETH_values.push(e.data.ETH);
                    }

                    this.setState({
                        data: e.data,
                        pusher: true,
                        BTC_values: BTC_values,
                        ETH_values: ETH_values,
                        LTC_values: LTC_values,
                    });
                }.bind(this));
        }
    }

    componentDidMount(){
        this.pusher();
        const btc_request = $.ajax({
            url: './money-values/24h/BTC',
            cache: false,
            method: 'GET',
            success: (response) => {
                if (response && response.status === 'success'){
                    this.setState({
                        BTC_values: response.data.values,
                    });
                }
            },
            error: (error) => {console.error(error); alert(error.statusText)},
        });
        const eth_request = $.ajax({
            url: './money-values/24h/ETH',
            cache: false,
            method: 'GET',
            success: (response) => {
                if (response && response.status === 'success'){
                    this.setState({
                        ETH_values: response.data.values,
                    });
                }
            },
            error: (error) => {console.error(error); alert(error.statusText)},
        });
        const ltc_request = $.ajax({
            url: './money-values/24h/LTC',
            cache: false,
            method: 'GET',
            success: (response) => {
                if (response && response.status === 'success'){
                    this.setState({
                        LTC_values: response.data.values,
                    });
                }
            },
            error: (error) => {console.error(error); alert(error.statusText)},
        });
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
                            <a href="./coinbase" target="_blank" className="btn btn-primary">
                                Check basic account stats
                            </a>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-xs-12">
                            <PanelGroup>
                                {this.state.BTC_values === null ? (
                                    (<p>Loading graphs</p>)
                                ) : null}
                                {this.state.BTC_values !== null ? (
                                    <MoneyGraph
                                        title={"Bitcoin"}
                                        currency="BTC"
                                        moneyValues={this.state.BTC_values}
                                    />
                                ): null}

                                {this.state.BTC_values !== null ? (
                                    <MoneyGraph
                                        title={"Ethereum"}
                                        currency="ETH"
                                        moneyValues={this.state.ETH_values}
                                    />
                                ): null}

                                {this.state.BTC_values !== null ? (
                                    <MoneyGraph
                                        title={"Litecoin"}
                                        currency="LTC"
                                        moneyValues={this.state.LTC_values}
                                    />
                                ): null}
                            </PanelGroup>
                        </div>
                    </div>

                </div>
            </div>
        )

    }
};