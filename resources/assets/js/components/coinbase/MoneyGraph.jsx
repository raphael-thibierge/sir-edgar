import React from 'react';
import { Chart } from 'react-google-charts';
import Tools from '../Tools';

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
            columns: [
                {
                    type: 'date',
                    label: 'Date',
                },
                {
                    type: 'number',
                    label: 'Buy Price',
                },{
                    type: 'number',
                    label: 'Spot Price',
                }, {
                    type: 'number',
                    label: 'Sell Price',
                },
            ],
        };
    }

    render() {

        let max = 0;
        let min = 99999999999999999999999999999999999999999;

        const rows = this.props.moneyValues.map((value) => {

            // get max value
            if (value.spot_price > max){
                max = value.spot_price;
            } if (value.sell_price > max){
                max = value.sell_price;
            } if (value.buy_price > max){
                max = value.buy_price;
            }

            // get max value
            if (value.spot_price < min){
                min = value.spot_price;
            } if (value.sell_price < min){
                min = value.sell_price;
            } if (value.buy_price < min){
                min = value.buy_price;
            }


            return [Tools.dateFormater(value.created_at), value.buy_price, value.spot_price, value.sell_price];
        });

        let options = {
            title: this.props.currency + ' prices',
            hAxis: {},
            vAxis: {minValue: min, maxValue: max},
            legend: true,
        };


        return (
            <Chart
                chartType="LineChart"
                rows={rows}
                columns={this.state.columns}
                options={options}
                graph_id={this.props.currency + '_price_chart'}
                width="100%"
                height="500px"
                chartEvents={this.chartEvents}
                legend_toggle
            />
        );
    }
}