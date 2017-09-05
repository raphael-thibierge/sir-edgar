const React = require('react');
const ListGroup = require('react-bootstrap').ListGroup;
const ListGroupItem = require('react-bootstrap').ListGroupItem;
const Button = require('react-bootstrap').Button;
const Badge = require('react-bootstrap').Badge;
const Glyphicon = require('react-bootstrap').Glyphicon;
const GoalInput = require('./GoalInput.jsx');
/**
 * React component managing goal lists
 */
const GoalList = React.createClass({

    propTypes: {
        goals: React.PropTypes.array.isRequired,
        createGoal: React.PropTypes.func.isRequired,
        project_id: React.PropTypes.string.isRequired,
    },

    /**
     * Define component initial state
     *
     * @returns {{goals: Array}}
     */
    getInitialState: function () {
        return {};
    },

    /**
     * Method called when component is mounted in html
     * Loads goal list in AJAX
     */
    componentDidMount: function () {},


    /**
     * Component's HTML render method
     *
     * @returns {XML}
     */
    render() {

        // goal list
        const goals = this.props.goals;

        let doneGoals = [];


        const newGoal = {_id: null, title:'', score: 1, is_completed:false, create: this.props.createGoal, project_id: this.props.project_id};
        // new to-do goal
        let todoGoals = [];

        // separates done goals from todo goals
        for (let iterator=0; iterator<goals.length; iterator++){
            const goal = goals[iterator];
            if (goal.is_completed){

                const complete_at = new Date(goal.completed_at);
                const diff = new Date()-complete_at;

                // display only if completed today
                if ((diff/1000/60) + new Date().getTimezoneOffset() < 24 * 60 || goal.completed_at === null){
                    doneGoals.push(goal);
                }

            } else {
                todoGoals.push(goal);
            }
        }

        todoGoals.push(newGoal);


        // render html foreach to-do goal
        const todoList = todoGoals.length > 0 ? todoGoals.reverse().map((goal) => (
            <GoalInput goal={goal} key={goal._id}/>
        )) : null; // can't be null because there is the new Goals todoGoals

        // render html foreach done goal
        const doneList = doneGoals.length > 0 ? doneGoals.map((goal) => (
            <GoalInput goal={goal} key={goal._id}/>
        )) : null;


        // return component's html
        return (
            <div>
                <div className="row">
                    <div className="col-xs-12">
                        <ListGroup>
                            {todoList}
                        </ListGroup>
                    </div>
                </div>
                {doneList !== null ? (
                    <div className="row">
                        <div className="col-xs-12">
                            <ListGroup>
                                {doneList}
                            </ListGroup>
                        </div>
                    </div>
                ) : null}
            </div>
        );
    }
});

module.exports = GoalList;