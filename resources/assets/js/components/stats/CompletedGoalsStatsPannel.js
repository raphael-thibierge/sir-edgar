import React from 'react'
import {Panel} from 'react-bootstrap';

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
            totalScore: 0,
            weekScore: 0,
            monthScore: 0,
        }
    }

    componentDidMount(){
        this.loadData();
    }


    loadData() {
        const request = $.ajax({
            url: 'goals/completed/stats',
            cache: false,
            method: 'GET',
            success: this.success,
            error: this.error,
        });
    }

    success(response){
        if (response.status === 'success'){
            const data = response.data;

            this.setState({
                totalScore: data.totalScore,
                weekScore: data.weekScore,
                monthScore: data.monthScore,
            });

            // link real time updates
            if (window.Echo) {
                window.Echo.private('App.User.' + window.user_id)
                    .listen('GoalCompleted', (e) => {
                        const goalScore = e.goal.score;
                        this.setState({
                            totalScore: this.state.totalScore + goalScore,
                            weekScore: this.state.weekScore + goalScore,
                            monthScore: this.state.monthScore + goalScore,
                        });
                    });
                window.Echo.private('App.User.' + window.user_id)
                    .listen('GoalDeleted', (e) => {
                        this.setState({
                            score: this.state.score - e.goal.score,
                        });
                    });
            }

        } else {
            this.error();
        }
    }


    error(response){
        console.log(error.responseJSON);
    }

    render(){
        return (
            <Panel header={<h2>Goals completed</h2>}>
                <table className={'table'}>
                    <tbody>
                        <tr><td>Total</td><td>{this.state.totalScore}</td></tr>
                        <tr><td>This week</td><td>{this.state.weekScore}</td></tr>
                        <tr><td>This month</td><td>{this.state.monthScore}</td></tr>
                    </tbody>
                </table>
            </Panel>
        );
    }
}