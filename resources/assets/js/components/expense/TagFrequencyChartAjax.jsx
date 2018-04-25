import React from 'react';
import { Chart } from 'react-google-charts';
import { FormGroup, FormControl, Label, Button} from 'react-bootstrap';

export default class TagFrequencyChartAjax extends React.Component {

    constructor(props){
        super(props);
        this.state = this.getInitialState();
    }

    getInitialState(){
        return {
            frequencies: [],
            tag: '',
        };
    }

    componentDidMount(){
        if (this.props.tags.length > 0){
            this.request(this.props);
        }
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.tags.length > 0){
            this.request(nextProps);
        }
    }

    request(props){

        const tag = props.tags;

        this.setState({
            loaded: false,
        });

        $.get('/tag-frequency?tag=' + tag)
            .catch(error => {
                alert(error.statusText);
                console.error(error);
            })
            .then(responseJSON => {
                if (responseJSON.status === 'success'){

                    // https://stackoverflow.com/questions/16590500/javascript-calculate-date-from-week-number
                    function getDateOfISOWeek(w, y) {
                        let simple = new Date(y, 0, 1 + (w - 1) * 7);
                        let dow = simple.getDay();
                        let ISOweekStart = simple;
                        if (dow <= 4)
                            ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
                        else
                            ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
                        return ISOweekStart;
                    }

                    let frequencies = [];

                    let totalPrice  = 0;
                    let totalOccurence  = 0;


                    if (responseJSON.data.frequencies.length > 0){
                        let firstFrenquency = responseJSON.data.frequencies[0];
                        let previous = getDateOfISOWeek(firstFrenquency._id.week, firstFrenquency._id.year);

                        responseJSON.data.frequencies.forEach(frequency => {

                            let date = getDateOfISOWeek(frequency._id.week, frequency._id.year);

                            while (previous < date){
                                frequencies.push([new Date(previous), 0, 0]);
                                previous.setDate(previous.getDate()+7);
                            }


                            previous.setDate(previous.getDate()+7);
                            //previous = date;

                            frequencies.push([
                                date,
                                frequency.occurrence,
                                frequency.price,
                            ]);
                        });

                        let today = new Date();
                        today.setDate(today.getDate()-today.getDay()+1);

                        while (previous < today){
                            frequencies.push([new Date(previous), 0, 0]);
                            previous.setDate(previous.getDate()+7);
                        }

                    }

                    this.setState({
                        loaded: true,
                        tag: responseJSON.data.tag,
                        frequencies: frequencies,
                        averagePrice: frequencies.length > 0 ? frequencies.sum(2)/frequencies.length : 0,
                        averageOccurrence: frequencies.length > 0 ? frequencies.sum(1)/frequencies.length : 0,
                    });
                }
            });
    }

    render(){

        if (this.state.loaded === false){
            return <p>Loading...</p>
        }

        return (
            <div className="row">
                <div className="col-xs-12">

                    {this.state.frequencies.length > 0 ?

                    <div className="row">
                        <div className="col-xs-12">
                            <Chart
                                chartType="LineChart"
                                rows={this.state.frequencies}
                                columns={[
                                    {label: 'week', type: 'date'},
                                    {label: 'occurrence', type: 'number'},
                                    {label: 'price', type: 'number'},
                                ]}
                                options={{
                                    title: 'Frequency of tag : ' + this.state.tag,
                                    series: {
                                        0: {targetAxisIndex: 0},
                                        1: {targetAxisIndex: 1}
                                    },
                                    vAxes: {
                                        // Adds titles to each axis.
                                        0: {title: 'Occurrence'},
                                        1: {title: 'Price'}
                                    },

                                }}
                                graph_id={"TagFrequencyChart_"+this.props.tags.replace(' ', '_')}
                                width="100%"
                                height={typeof this.props.height ? this.props.height : "400px"}
                                legend_toggle
                            />
                        </div>
                    </div>
                : this.state.tag === '' ? null :
                    <div className="alert alert-danger">Not any expenses found with this tag(s)</div>
                }

                </div>
            </div>
        );
    }

}