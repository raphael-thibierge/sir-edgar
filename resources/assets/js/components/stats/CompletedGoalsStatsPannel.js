import React from 'react'
import {Panel, Alert} from 'react-bootstrap';
import axios from 'axios';

export default class CompletedGoalsStatsPannel extends React.Component{

    constructor(props){
        super(props);
        this.state = this.getInitialState();

        // bindings
        this.success = this.success.bind(this);
        this.error = this.error.bind(this);
    }

    getInitialState(){
        return {
            loaded:false,
            goals: {
                today: 0,
                total: 0,
                week: 0,
                month: 0,
                todo: 0
            },
            score: {
                today: 0,
                week: 0,
                month: 0,
                todo: 0
            }
        }
    }

    componentDidMount(){
        this.loadData();
    }


    loadData() {
        axios.get('/goals/completed/stats')
            .then(response => response.data)
            .then(this.success.bind(this))
            .catch(this.error.bind(this))
    }

    success(response){
        if (response.status === 'success'){

            let state = response.data;
            state.loaded = true;
            state.error = false;
            this.setState(state);

            // link real time updates
            if (window.Echo) {
                window.Echo.private('App.User.' + window.user_id)
                    .listen('GoalCompleted', (e) => {
                        const goalScore = e.goal.score;
                        const state = this.state;
                        state.goals.today += 1 ;
                        state.goals.total += 1 ;
                        state.goals.week += 1 ;
                        state.goals.month += 1 ;
                        state.goals.todo += 1 ;
                        state.score.total += goalScore ;
                        state.score.week += goalScore ;
                        state.score.month += goalScore ;
                        state.score.todo += goalScore ;
                        this.setState(state);
                    });
                window.Echo.private('App.User.' + window.user_id)
                    .listen('GoalDeleted', (e) => {
                        const goalScore = e.goal.score;
                        const state = this.state;
                        state.goals.today -= 1 ;
                        state.goals.total -= 1 ;
                        state.goals.week -= 1 ;
                        state.goals.month -= 1 ;
                        state.goals.todo -= 1 ;
                        state.score.total -= goalScore ;
                        state.score.week -= goalScore ;
                        state.score.month -= goalScore ;
                        state.score.todo -= goalScore ;
                        this.setState(state);
                    });
            }

        } else {
            this.error(response);
        }
    }


    error(response){
        console.error(response.responseJSON);
    }

    render(){

        return (
            <Panel header={<h2>Goals completed</h2>}>

                {this.state.loaded === false ?
                    <Alert>Loading...</Alert>
                    : this.state.error === true ?
                        <Alert bsStyle={'danger'}>Loading stats failed...</Alert>
                        :

                        <table className={'table'}>
                            <thead>
                                <th></th>
                                <th>Goals</th>
                                <th>Scores</th>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Today</td>
                                    <td>{this.state.goals.today}</td>
                                    <td>{this.state.score.today}</td>
                                </tr>
                                <tr>
                                    <td>Last 7 days</td>
                                    <td>{this.state.goals.week}</td>
                                    <td>{this.state.score.week}</td>
                                </tr>
                                <tr>
                                    <td>Last 30 days</td>
                                    <td>{this.state.goals.month}</td>
                                    <td>{this.state.score.month}</td>
                                </tr>
                                <tr>
                                    <td>From beginning</td>
                                    <td>{this.state.goals.total}</td>
                                    <td>{this.state.score.total}</td>
                                </tr>
                                <tr>
                                    <td>Next to achieve</td>
                                    <td>{this.state.goals.todo}</td>
                                    <td>{this.state.score.todo}</td>
                                </tr>
                            </tbody>
                        </table>
                }
            </Panel>
        );
    }
}