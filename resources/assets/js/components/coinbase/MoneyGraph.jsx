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
            options: {
                title: 'BTC Prices',
                hAxis: { title: 'Date'},
                vAxis: { title: 'Price'},
                legend: 'none',
            },
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
                    label: 'Sell Price',
                },
                {
                    type: 'number',
                    label: 'Spot Price',
                },
            ],
        };
    }
    render() {

        const rows = this.props.moneyValues.map((value) => [Tools.dateFormater(value.created_at), value.buy_price, value.spot_price, value.sell_price]);


        return (
            <Chart
                chartType="LineChart"
                rows={rows}
                columns={this.state.columns}
                options={this.state.options}
                graph_id="LineChart"
                width="100%"
                height="600px"
                chartEvents={this.chartEvents}
            />
        );
    }
}