import React from 'react';
import { Chart } from 'react-google-charts';
import Tools from '../Tools';
import {Checkbox, FormGroup} from 'react-bootstrap';

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
        };
    }

    render() {

        let max = 0;
        let min = 99999999999999999999999999999999999999999;

        const rows = this.props.moneyValues.map((value) => {

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

            let row = [Tools.dateFormater(value.created_at)];

            if (this.state.display_buy){
                row.push(value.buy_price);
            }

            if (this.state.display_spot){
                row.push(value.spot_price);
            }

            if (this.state.display_sell){
                row.push(value.sell_price);
            }

            return row;
        });

        let options = {
            title: this.props.currency + ' prices',
            hAxis: {
                format: 'hh:mm:ss',
                gridlines: {
                    count: 24,
                }
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


        return (
            <div className="row">
                <div className="col-xs-12">

                    <div className="row">
                        <div className="col-xs-12">
                            <h3>{this.props.currency}</h3>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-xs-12">
                            <FormGroup>
                                <Checkbox inline checked={this.state.display_buy} onChange={this.setState.bind(this, {display_buy: !this.state.display_buy})}>
                                    Buy
                                </Checkbox>
                                {' '}
                                <Checkbox inline checked={this.state.display_spot} onChange={this.setState.bind(this, {display_spot: !this.state.display_spot})}>
                                    Spot
                                </Checkbox>
                                {' '}
                                <Checkbox inline checked={this.state.display_sell} onChange={this.setState.bind(this, {display_sell: !this.state.display_sell})}>
                                    Sell
                                </Checkbox>
                            </FormGroup>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-xs-12">
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
            </div>
        );
    }
}