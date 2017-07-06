const React = require('react');
const ListGroup = require('react-bootstrap').ListGroup;
const ListGroupItem = require('react-bootstrap').ListGroupItem;

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

    onSuccess: function (response) {
        console.log(response);
        if (response.status && response.status == 'success'){
            this.setState({
                goals: response.data.goals
            });
        }
    },

    onError: function (response) {
        alert('error');
        console.log(response);
    },

    render() {

        const list = this.state.goals.length > 0 ? this.state.goals.map((goal) => (
            <ListGroupItem>{goal.title}</ListGroupItem>
        )) : (
            <ListGroupItem>No goal</ListGroupItem>
        );

        let score = 0;
        for (let i = 0 ; i < this.state.goals.length; i++)
            score += parseInt(this.state.goals[i].score);


        return (
            <div>
                <h2>{score}</h2>
                <ListGroup>
                    {list}
                </ListGroup>
            </div>
        );
    }
});

module.exports = GoalList;