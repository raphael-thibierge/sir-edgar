const React = require('react');
const ListGroup = require('react-bootstrap').ListGroup;
const ListGroupItem = require('react-bootstrap').ListGroupItem;
const Button = require('react-bootstrap').Button;
const Badge = require('react-bootstrap').Badge;

/**
 * React component managing goal lists
 */
const GoalList = React.createClass({

    propTypes: {
        onGoalCompleted: React.PropTypes.func.isRequired,
        onGoalDeleted: React.PropTypes.func.isRequired,
    },

    /**
     * Define component initial state
     *
     * @returns {{goals: Array}}
     */
    getInitialState: function () {
        return {
            goals: []
        };
    },

    /**
     * Method called when component is mounted in html
     * Loads goal list in AJAX
     */
    componentDidMount: function () {
        this.request();
    },

    /**
     * add a goal in component's goal list
     *
     * @param goal
     */
    addToList: function (goal) {

        let goals = this.state.goals;
        goals.push(goal);
        this.setState({
            goals: goals
        });
    },

    /**
     * AJAX request to get goals from server
     */
    request: function(){
        const request = $.ajax({
            url: './goals',
            cache: false,
            method: 'GET',
            success: this.onSuccess,
            error: this.onError,
        });
    },

    /**
     * AJAX goal loading success method that store returned goals in component state
     * @param response
     */
    onSuccess: function (response) {
        if (response.status && response.status == 'success'){
            this.setState({
                goals: response.data.goals
            });
        }
    },

    /**
     * AJAX request to notify server that user has complete a goal
     * @param goal
     */
    onCompleteGoalClick: function(goal){
        const request = $.ajax({
            url: goal.routes.complete,
            cache: false,
            method: 'POST',
            // when server return success
            success: function (oldGoal, response) {
                // check status
                if (response.status && response.status == 'success'){
                    // get component goal list
                    let goals = this.state.goals;
                    let newGoals = [];
                    for(let i = 0; i < goals.length; i++){
                        const goal = goals[i];
                        // update the completed goal
                        if (goal._id == oldGoal._id){
                            goal.is_completed = true;
                            this.props.onGoalCompleted(goal);
                        }
                        newGoals.push(goal);
                    }
                    // update component's goal list
                    this.setState({
                        goals: newGoals
                    });

                } else {
                    this.onError(response);
                }
            }.bind(this, goal), // bind is used to call method in this component
            error: this.onError,
        });
    },

    /**
     * alert user when an ajax request failed
     * @param response
     */
    onError: function (response) {
        alert('error');
        console.error(response);
    },

    /**
     * AJAX request to notify server that user has deleted a goal
     *
     * @param goal
     */
    onDeleteClick: function (goal) {
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
                // keep all goals except deleted one
                for(let i = 0; i < goals.length; i++){
                    const goal = goals[i];
                    if (goal._id != oldGoal._id){
                        newGoals.push(goal);
                    } else {
                        this.props.onGoalDeleted(oldGoal);
                    }
                }
                // update component's goal list
                this.setState({
                    goals: newGoals
                })
            }.bind(this, goal),
            error: this.onError,
        });
    },

    /**
     * Component's HTML render method
     *
     * @returns {XML}
     */
    render() {

        // goal list
        const goals = this.state.goals;

        let doneGoals = [];
        let todoGoals = [];

        // separates done goals from todo goals
        for (let iterator=0; iterator<goals.length; iterator++){
            const goal = goals[iterator];
            if (goal.is_completed){
                doneGoals.push(goal);
            } else {
                todoGoals.push(goal);
            }
        }

        // render html foreach to-do goal
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

        // render html foreach done goal
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

        // compute user score and total goal scores
        let score = 0;
        let total = 0;
        for (let i = 0 ; i < this.state.goals.length; i++){
            const goal = this.state.goals[i];
            if (goal.is_completed  == true){
                score += parseInt(goal.score);
            }
            total += parseInt(goal.score);
        }


        // return component's html
        return (
            <div>
                <h2>Score : {score}</h2>
                <h3>To do : {total-score}</h3>
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