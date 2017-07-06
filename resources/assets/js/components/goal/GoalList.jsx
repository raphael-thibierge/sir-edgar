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

        const list = this.state.goals.length > 0 ? map((goal) => (
            <ListGroupItem>{goal.title}</ListGroupItem>
        )) : (
            <ListGroupItem>No goal</ListGroupItem>
        );

        return (
            <ListGroup>
                {list}
            </ListGroup>
        );
    }
});

module.exports = GoalList;