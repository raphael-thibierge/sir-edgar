import React from 'react';
import { Chart } from 'react-google-charts';
import Tools from '../Tools';
import {Checkbox, FormGroup, Radio, Panel} from 'react-bootstrap';

export default class MoneyGraph extends React.Component {
    constructor(props) {
        super(props);
        this.chartEvents = [
            {
                eventName: 'select',
                callback(Chart) {
                    // Returns Chart so you can access props and  the ChartWrapper object from chart.wrapper
                    console.log('Selected ', Chart.chart.getSelection());
                },
            },
        ];
        this.state = {
            display_buy: false,
            display_sell: false,
            display_spot: true,
            period: '24h'
        };
    }

    render() {

        let max = 0;
        let min = 99999999999999999999999999999999999999999;

        let rows = [];
        let startDate = new Date();
        startDate.setSeconds(0);
        switch (this.state.period) {
            case '10m': startDate.setMinutes(startDate.getMinutes()-10); break;
            case '1h': startDate.setHours(startDate.getHours()-1); break;
            case '6h': startDate.setHours(startDate.getHours()-6); break;
            case '12h': startDate.setHours(startDate.getHours()-12); break;
            case '24h': startDate.setHours(startDate.getHours()-24); break;
        }

        this.props.moneyValues.forEach((value) => {

            const created_at = Tools.dateFormatWithOffset(value.created_at);

            if (created_at < startDate) return;


            // get max value
            if (value.spot_price > max && this.state.display_spot){
                max = value.spot_price;
            } if (value.sell_price > max && this.state.display_sell){
                max = value.sell_price;
            } if (value.buy_price > max && this.state.display_buy){
                max = value.buy_price;
            }

            // get max value
            if (value.spot_price < min && this.state.display_spot){
                min = value.spot_price;
            } if (value.sell_price < min && this.state.display_sell){
                min = value.sell_price;
            } if (value.buy_price < min && this.state.display_buy){
                min = value.buy_price;
            }

            let row = [Tools.dateFormatWithOffset(value.created_at)];

            if (this.state.display_buy){
                row.push(value.buy_price);
            }

            if (this.state.display_spot){
                row.push(value.spot_price);
            }

            if (this.state.display_sell){
                row.push(value.sell_price);
            }

            rows.push(row);
        });

        let options = {
            title: this.props.currency + ' prices',
            hAxis: {
                format: 'hh:mm:ss',
            },
            vAxis: {minValue: min, maxValue: max},
            legend: true,
        };

        let columns = [
            {
                type: 'datetime',
                label: 'Date',
            },
        ];

        if (this.state.display_buy){
            columns.push({
                type: 'number',
                    label: 'Buy Price',
            });
        }

        if (this.state.display_spot){
            columns.push({
                type: 'number',
                label: 'Spot Price',
            });
        }

        if (this.state.display_sell){
            columns.push({
                type: 'number',
                label: 'Sell Price',
            });
        }

        const lastMoneyValue = this.props.moneyValues[this.props.moneyValues.length -1];

        return (
            <Panel header={<h2>{this.props.title}</h2>}>

                <div className="row">
                    <div className="col-xs-12">
                        <FormGroup>
                            <Checkbox inline checked={this.state.display_buy} onChange={this.setState.bind(this, {display_buy: !this.state.display_buy})}>
                                Buy ( {lastMoneyValue.buy_price} {lastMoneyValue.currency} )
                            </Checkbox>
                            {' '}
                            <Checkbox inline checked={this.state.display_spot} onChange={this.setState.bind(this, {display_spot: !this.state.display_spot})}>
                                Spot ( {lastMoneyValue.spot_price} {lastMoneyValue.currency} )
                            </Checkbox>
                            {' '}
                            <Checkbox inline checked={this.state.display_sell} onChange={this.setState.bind(this, {display_sell: !this.state.display_sell})}>
                                Sell ( {lastMoneyValue.sell_price} {lastMoneyValue.currency} )
                            </Checkbox>
                        </FormGroup>
                    </div>
                </div>

                <div className="row">
                    <div className="col-xs-12">
                        <FormGroup>
                            <Radio inline checked={this.state.period == '10m'} onChange={() => {this.setState({period: '10m'})}}>
                                10min
                            </Radio>
                            {' '}
                            <Radio inline checked={this.state.period == '1h'} onChange={() => {this.setState({period: '1h'})}}>
                                1h
                            </Radio>
                            {' '}
                            <Radio inline checked={this.state.period == '6h'} onChange={() => {this.setState({period: '6h'})}}>
                                6h
                            </Radio>
                            {' '}
                            <Radio inline checked={this.state.period == '12h'} onChange={() => {this.setState({period: '12h'})}}>
                                12h
                            </Radio>
                            {' '}
                            <Radio inline checked={this.state.period == '24h'} onChange={() => {this.setState({period: '24h'})}}>
                                24h
                            </Radio>
                        </FormGroup>
                    </div>
                </div>

                <div className="row">
                    <div className="col-xs-12">
                        <div id={this.props.currency + '_price_chart'}>
                            <Chart
                                chartType="LineChart"
                                rows={rows}
                                columns={columns}
                                options={options}
                                graph_id={this.props.currency + '_price_chart'}
                                width="100%"
                                height="500px"
                                chartEvents={this.chartEvents}
                                legend_toggle
                            />
                        </div>
                    </div>
                </div>
            </Panel>
        );
    }
}