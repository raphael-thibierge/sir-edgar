import React from 'react';
import { Chart } from 'react-google-charts';
import Tools from '../Tools';
import {Checkbox, FormGroup, Radio, Panel, Button} from 'react-bootstrap';

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
            period: '6h',
            log_scale: false,
            y_zero: false,
            previous_data: 0,
        };
    }

    next(e){
        console.log("heheh");
        this.setState({
            previous_data: this.state.previous_data-1
        });
    }

    previous(e){
        console.log("vouvuo");
        this.setState({
            previous_data: this.state.previous_data+1
        });
    }

    render() {

        const lastMoneyValue = this.props.moneyValues[this.props.moneyValues.length -1];

        let max = 0;
        let min = 99999999999999999999999999999999999999999;

        let rows = [];
        let startDate = new Date();
        startDate.setSeconds(0);
        let stopDate = startDate;
        for (let i = 0 ; i<= this.state.previous_data; i++){
            stopDate = new Date(startDate);
            console.log('yoo');
            switch (this.state.period) {
                case '15min': startDate.setMinutes(startDate.getMinutes()-15); break;
                case '30min': startDate.setMinutes(startDate.getMinutes()-30); break;
                case '1h': startDate.setHours(startDate.getHours()-1); break;
                case '3h': startDate.setHours(startDate.getHours()-3); break;
                case '6h': startDate.setHours(startDate.getHours()-6); break;
                case '12h': startDate.setHours(startDate.getHours()-12); break;
                case '24h': startDate.setHours(startDate.getHours()-24); break;
                case '3j': startDate.setDate(startDate.getDate()-3); break;
                case '1w': startDate.setDate(startDate.getDate()-7); break;
                case '1m': startDate.setDate(startDate.getDate()-31); break;
            }
        }


        console.log(startDate);
        console.log(stopDate);

        this.props.moneyValues.forEach((value) => {
            const created_at = Tools.dateFormatWithOffset(value.created_at);

            if (created_at < startDate || created_at > stopDate) return;

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
            hAxis: {
                format: 'hh:mm:ss',
            },
            vAxis: {
                logScale: this.state.log_scale,
            },
            legend: true,
        };

        if (this.state.y_zero){
            options.vAxis.minValue = 0;
        }

        let columns = [
            {
                type: 'datetime',
                label: 'Date',
            },
        ];

        if (this.state.display_buy){
            columns.push({
                type: 'number',
                    label: 'Buy Price (' + lastMoneyValue.native_currency + ')',
            });
        }

        if (this.state.display_spot){
            columns.push({
                type: 'number',
                label: 'Spot Price (' + lastMoneyValue.native_currency + ')',
            });
        }

        if (this.state.display_sell){
            columns.push({
                type: 'number',
                label: 'Sell Price (' + lastMoneyValue.native_currency + ')',
            });
        }

        console.log(rows);

        return (
            <Panel header={<h2>{this.props.title}</h2>}>

                <div className="row">
                    <div className="col-xs-12">
                        <FormGroup>
                            <Radio
                                inline
                                checked={this.state.period == '30min'}
                                onChange={() => {this.setState({period: '30min', previous_data: 0})}}
                            >30min</Radio>{' '}
                            <Radio
                                inline
                                checked={this.state.period == '1h'}
                                onChange={() => {this.setState({period: '1h', previous_data: 0})}}
                            >1h</Radio>{' '}
                            <Radio
                                inline
                                checked={this.state.period == '3h'}
                                onChange={() => {this.setState({period: '3h', previous_data: 0})}}
                            >3h</Radio>{' '}
                            <Radio
                                inline
                                checked={this.state.period == '6h'}
                                onChange={() => {this.setState({period: '6h', previous_data: 0})}}
                            >6h</Radio>{' '}
                            <Radio
                                inline
                                checked={this.state.period == '12h'}
                                onChange={() => {this.setState({period: '12h', previous_data: 0})}}
                            >12h</Radio>{' '}
                            <Radio
                                inline
                                checked={this.state.period == '24h'}
                                onChange={() => {this.setState({period: '24h', previous_data: 0})}}
                            >24h</Radio>
                            <Radio
                                inline
                                checked={this.state.period == '3j'}
                                onChange={() => {this.setState({period: '3j', previous_data: 0})}}
                            >3j</Radio>
                            <Checkbox inline checked={this.state.log_scale} onChange={this.setState.bind(this, {log_scale: !this.state.log_scale, y_zero:false })} style={{marginLeft: 15}}>
                                Logarithmic scale
                            </Checkbox>
                            <Checkbox inline checked={this.state.y_zero} onChange={this.setState.bind(this, {y_zero: !this.state.y_zero, log_scale: false})} style={{marginLeft: 15}}>
                                Y = 0
                            </Checkbox>
                        </FormGroup>
                    </div>
                </div>

                <div className="row">
                    <div className="col-xs-12">
                        <FormGroup inline>
                            <Checkbox inline checked={this.state.display_buy} onChange={this.setState.bind(this, {display_buy: !this.state.display_buy})}>
                                Buy ( {lastMoneyValue.buy_price} {lastMoneyValue.native_currency} )
                            </Checkbox>
                            {' '}
                            <Checkbox inline checked={this.state.display_spot} onChange={this.setState.bind(this, {display_spot: !this.state.display_spot})}>
                                Spot ( {lastMoneyValue.spot_price} {lastMoneyValue.native_currency} )
                            </Checkbox>
                            {' '}
                            <Checkbox inline checked={this.state.display_sell} onChange={this.setState.bind(this, {display_sell: !this.state.display_sell})}>
                                Sell ( {lastMoneyValue.sell_price} {lastMoneyValue.native_currency} )
                            </Checkbox>
                        </FormGroup>
                    </div>
                </div>

                <div className="row">
                    <div className="col-xs-12">
                        <div id={this.props.currency + '_price_chart'}>
                            <Chart
                                chartType="AreaChart"
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
                <div className="row">
                    <div className="col-xs-3">
                        <Button onClick={this.previous.bind(this)} disabled={Tools.dateFormatWithOffset(this.props.moneyValues[1].created_at) > startDate}>
                            Previous
                        </Button>
                    </div>
                    <div className="col-xs-3 col-xs-offset-6 text-right">
                        <Button onClick={this.next.bind(this)} disabled={this.state.previous_data <= 0}>
                            Next
                        </Button>
                    </div>
                </div>

            </Panel>
        );
    }
}