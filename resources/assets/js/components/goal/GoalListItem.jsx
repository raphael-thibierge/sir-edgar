const React = require('react');
const ListGroup = require('react-bootstrap').ListGroup;
const ListGroupItem = require('react-bootstrap').ListGroupItem;
const Button = require('react-bootstrap').Button;
const Badge = require('react-bootstrap').Badge;

const GoalList = React.createClass({


    getInitialState: function () {
        return {
            goals: []
        };
    },

    componentDidMount: function () {
        this.request();
    },

    addToList: function (goal) {

        let goals = this.state.goals;
        goals.push(goal);
        this.setState({
            goals: goals
        });
    },

    request: function(){
        const request = $.ajax({
            url: 'http://localhost:8000/goals',
            cache: false,
            method: 'GET',
            success: this.onSuccess,
            error: this.onError,
        });
    },

    onCompleteGoalClick: function(goal){
        const self = this;
        const request = $.ajax({
            url: goal.routes.complete,
            cache: false,
            method: 'POST',
            success: function (oldGoal, response) {
                if (response.status && response.status == 'success'){
                    let goals = this.state.goals;
                    let newGoals = [];
                    for(let i = 0; i < goals.length; i++){
                        const goal = goals[i];
                        if (goal._id == oldGoal._id){
                            goal.is_completed = true;
                        }
                        newGoals.push(goal);
                    }
                    this.setState({
                        goals: newGoals
                    })
                } else {
                    this.onError(response);
                }


            }.bind(self, goal),
            error: this.onError,
        });
    },

    onSuccess: function (response) {
        if (response.status && response.status == 'success'){
            this.setState({
                goals: response.data.goals
            });
        }
    },

    onError: function (response) {
        alert('error');
        console.error(response);
    },

    onDeleteClick: function (goal) {
        const self = this;
        $.ajax({
            url: goal.routes.destroy,
            cache: false,
            method: 'POST',
            datatype: 'json',
            data: {
                method: 'DELETE',
                _method: 'DELETE'
            },
            success: function (oldGoal) {
                let goals = this.state.goals;
                let newGoals = [];
                for(let i = 0; i < goals.length; i++){
                    const goal = goals[i];
                    if (goal._id != oldGoal._id){
                        newGoals.push(goal);
                    }
                }
                this.setState({
                    goals: newGoals
                })
            }.bind(self, goal),
            error: this.onError,
        });
    },

    render() {

        const goals = this.state.goals;

        let doneGoals = [];
        let todoGoals = [];


        for (let iterator=0; iterator<goals.length; iterator++){
            const goal = goals[iterator];
            if (goal.is_completed){
                doneGoals.push(goal);
            } else {
                todoGoals.push(goal);
            }
        }


        const todoList = todoGoals.length > 0 ? todoGoals.map((goal) => (
            <ListGroupItem key={goal._id}>
                <span className="text-left">{goal.title}</span>
                <span className="text-left" style={{marginLeft : '20px'}}>
                    <Button
                        onClick={this.onDeleteClick.bind(null, goal)}
                        bsSize="xs"
                        bsStyle="danger"
                    >Delete</Button>
                </span>
                <span className="text-left" style={{marginLeft : '20px'}}>
                    <Button
                        onClick={this.onCompleteGoalClick.bind(null, goal)}
                        bsSize="xs"
                        bsStyle="success"
                    >Complete</Button>
                </span>
                <Badge>{goal.score}</Badge>
            </ListGroupItem>
        )) : (
            <ListGroupItem>No goal</ListGroupItem>
        );

        const doneList = doneGoals.length > 0 ? doneGoals.map((goal) => (
            <ListGroupItem key={goal._id} bsStyle="success">

                <span className="text-left">{goal.title}</span>
                <span className="text-left" style={{marginLeft : '20px'}}>
                    <Button
                        onClick={this.onDeleteClick.bind(null, goal)}
                        bsSize="xs"
                        bsStyle="danger"
                    >Delete</Button>
                </span>
                <Badge>{goal.score}</Badge>
            </ListGroupItem>
        )) : (
            <ListGroupItem>No goal</ListGroupItem>
        );





        let score = 0;
        let total = 0;
        for (let i = 0 ; i < this.state.goals.length; i++){
            const goal = this.state.goals[i];
            if (goal.is_completed  == true){
                score += parseInt(goal.score);
            }
            total += parseInt(goal.score);
        }


        return (
            <div>
                <h2>Score : {score}</h2>
                <h3>Todo : {total-score}</h3>
                <ListGroup>
                    {todoList}
                </ListGroup>
                <h3>Done : {score}</h3>
                <ListGroup>
                    {doneList}
                </ListGroup>
            </div>
        );
    }
});

module.exports = GoalList;