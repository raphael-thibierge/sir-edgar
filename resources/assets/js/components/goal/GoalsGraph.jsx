import React from 'react';
import {Chart} from 'react-google-charts';
import PropTypes from 'prop-types';
import {Glyphicon, Popover, OverlayTrigger, Panel, PanelGroup} from 'react-bootstrap';
import CalendarHeatmap from 'react-calendar-heatmap';

export default class GoalsGraph extends React.Component{


    constructor(props){
        super(props);
        this.state = this.getInitialState();
    }


    getInitialState(){
        return{
            googleChartData: [],
            calendarData: [],
            scoreMax: 0,
        }
    }


    /**
     * Method called when component is mounted
     * Loads total score per day list in AJAX
     */
    componentDidMount() {
        this.request();
    }


    /**
     * AJAX request to get goals from server
     */
    request(){
        const request = $.ajax({
            url: './goals/score?offset=' + new Date().getTimezoneOffset(),
            cache: false,
            method: 'GET',
            success: this.onSuccess.bind(this),
            error: this.onError.bind(),
        });
    }


    sameDay(date1, date2){
        return (
        date1.getDate() == date2.getDate()
            && date1.getMonth() == date2.getMonth()
            && date1.getFullYear() == date2.getFullYear()
        );
    }

    /**
     * AJAX goal loading success method that store returned goals in component state
     * @param response
     */
    onSuccess(response) {
        if (response.status && response.status == 'success'){

            // list of scores per project per day
            const scores = response.data.scores;
            // list of projects
            const projects = response.data.projects;

            // get list of projects ids
            const projects_ids = Object.keys(projects);
            // get list of projects name
            const projects_names = Object.values(projects);

            // build header with the list of project name
            let header = ['Day'];
            header = header.concat(projects_names);
            header.push({ role: 'annotation' });

            // start filling data, with header as first line
            let data = [header];


            // get first date of scores
            let date = new Date(response.data.firstDate);
            // get last date (today)
            let lastDate = new Date;
            lastDate.setDate(lastDate.getDate() + 1);

            // calendar chart data
            let calendatData = [];
            let scoreMax = 0;

            // get score per project foreach day
            do  {

                // convert date to format "dd-mm-yyyy"
                const dateAsString = date.toISOString().slice(0,10);

                // first column is the date
                let line = [dateAsString];

                let total = 0;
                let projectScores = [];

                // insert each projects score per day in a separate column
                for (let i=0; i<projects_ids.length; i++){

                    if (
                        typeof scores[dateAsString] !== 'undefined' &&
                        typeof scores[dateAsString][projects_ids[i]] !== 'undefined'
                    ){
                        const score = scores[dateAsString][projects_ids[i]];

                        if (score > 0){
                            projectScores.push({
                                name: projects_names[i],
                                score: score,
                                id: projects_ids[i],
                            });
                            total+=score;
                        }
                        line.push(score);

                    } else {
                        line.push(0);
                    }
                }
                line.push(total > 0? total : "");

                calendatData.push({date: dateAsString, count: total, projects: projectScores});

                // update score max
                if (total > scoreMax){
                    scoreMax = total;
                }

                let minimalDate= new Date();
                minimalDate.setMonth(minimalDate.getMonth()-2);
                minimalDate.setDate(minimalDate.getDate()-15);

                if (date > minimalDate){
                    // insert day line in chart data
                    data.push(line);
                }


                // increment date and stop if date is tomorrow
                date.setDate(date.getDate() + 1);
            } while (date <= new Date());


            this.setState({
                googleChartData: data,
                calendarData: calendatData,
                scoreMax: scoreMax,
                projects: projects,
                projectIds: projects_ids,
            });
        }
    }

    /**
     * alert user when an ajax request failed
     * @param response
     */
    onError(response) {
        alert('error');
        console.error(response);
    }


    increaseTodayScore(score){
        data = this.state.googleChartData;
        const today = (new Date).toISOString().slice(0, 10);
        if (data.length > 1){
            let value = data[data.length-1];
            value[1]= value[1] + score;
            data[data.length-1] = value;
            this.setState({
                data: data
            });
        }
    }

    deleteGoal(goal){
        console.log(goal);
        if (goal && goal.is_completed){
            let data = this.state.googleChartData;

            if (goal.completed_at){
                const goalDate = goal.completed_at.slice(0,10);
                for (let i = 0; i < data.length; i++){
                    let value = data[i];
                    if (value[0] == goalDate){
                        value[1] = value[1] - goal.score;
                        data[i] = value;
                    }
                }

                this.setState({
                    data: data
                });
            } else {
                this.increaseTodayScore(-goal.score);
            }
        }

    }

    render(){


        if (this.props.projectCurrentNumber === 0 ){
            return (
                <div className="row">
                    <div className="col-xs-12">
                        <div className="alert alert-info">
                            <Glyphicon glyph="info-sign "/>
                            <strong> Statistics ! </strong>
                            <span>
                                After creating your first project and compete your first goal,
                                your statistics will be displayed here !
                            </span>
                        </div>
                    </div>
                </div>
            )
        }

        const options = {
            isStacked: true,
            vAxis: {
                minValue: 5,
            },
            annotations: {
                textStyle: {
                    //fontName: 'Times-Roman',
                    //fontSize: 14,
                    //bold: true,
                    //italic: true,
                    // The color of the text.
                    color: '#000000',
                    // The color of the text outline.
                    //auraColor: '#d799ae',
                    // The transparency of the text.
                    //opacity: 0.8
                }
            },
        };

        return (
            <div className="row">
                <div className="col-xs-12">



                    <div className="row">
                        <div className="col-xs-12">
                            <h1 className="page-header productivity-page-header">Stats <small>Best score : {this.state.scoreMax}</small></h1>
                        </div>
                    </div>
                    <br/>

                    <div className="row">
                        <div className="col-xs-12">
                            <PanelGroup>
                                <Panel header={<h2>Daily score over year</h2>} footer={<small>Lines ordered by day of the week</small>}>
                                    <CalendarHeatmap
                                        values={this.state.calendarData}
                                        tooltipDataAttrs={{ 'data-toggle': 'tooltip' }}
                                        numDays={365}
                                        titleForValue={(value) => {
                                            if (!value) {
                                                return '';
                                            }
                                            return value.date;
                                        }}
                                        transformDayElement={(rect, value, index) => {
                                            if (!value || value.count === 0){
                                                return rect;
                                            }
                                            const tooltip = (
                                                <Popover id="tooltip" title={value.date}>
                                                    <h4>Total : {value.count}</h4>
                                                    <ul>
                                                        {value.projects.map((project) => (
                                                            <li key={project.id}> {project.name} : {project.score}</li>
                                                        ))}
                                                    </ul>
                                                </Popover>
                                            );
                                            return (
                                                <OverlayTrigger placement="top" overlay={tooltip}>
                                                    {rect}
                                                </OverlayTrigger>
                                            );
                                        }}
                                        classForValue={(value) => {
                                            if (!value) {
                                                return 'color-scale-0';
                                            }

                                            let color = 0;
                                            const scoreMax= this.state.scoreMax;

                                            const nbColor = 4;
                                            for (let i = 0; i < nbColor; i++){
                                                if (value.count > i * scoreMax / nbColor){
                                                    color = i + 1;
                                                }
                                            }

                                            return `color-scale-${color}`;
                                        }}
                                    />
                                </Panel>
                                <Panel header={<h2>Project scores per day</h2>} style={{paddingTop: -10}}>
                                    <Chart
                                        chartType="ColumnChart"
                                        data={this.state.googleChartData}
                                        options={options}
                                        graph_id="ScatterChart_material"
                                        width="100%"
                                        height="400px"
                                        legend_toggle
                                    />
                                </Panel>
                            </PanelGroup>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
};
/*
GoalsGraph.propTypes = {
    projectCurrentNumber: PropTypes.number.isRequired
};*/