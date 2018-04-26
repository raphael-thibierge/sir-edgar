import React from 'react';
import PropTypes from 'prop-types';
import {ListGroup, ListGroupItem,Button,Badge,Glyphicon } from 'react-bootstrap';
import Tools from '../Tools';

import GoalInput from './GoalInput.jsx';
/**
 * React component managing goal lists
 */
export default class GoalList extends React.Component{

    constructor(props){
        super(props);
    }

    /**
     * Component's HTML render method
     *
     * @returns {XML}
     */
    render(){

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



        function compareToday(firstGoal, secondGoal){
            if (firstGoal.today === true && secondGoal.today === false){
                return -1;
            } else if (firstGoal.today === false && secondGoal.today === true ) {
                return 1;
            }
            return 0;
        }

        function comparePriority(firstGoal, secondGoal){

            if (firstGoal.priority !== null && secondGoal.priority !== null){

                if (firstGoal.priority > secondGoal.priority){
                    return -1;
                } else if (firstGoal.priority < secondGoal.priority){
                    return 1;
                }
                return 0;
            }

        }

        function compareCreatedAt(firstGoal, secondGoal) {
            const firstDate = Tools.dateFormater(firstGoal.created_at);
            const secondDate = Tools.dateFormater(secondGoal.created_at);
            // is older
            if (firstGoal < secondGoal){
                return -1;
            } else if (firstGoal > secondGoal){
                return 1;
            }
            return 0;
        }

        todoGoals.sort((firstGoal, secondGoal) => {

            let compareValue = compareToday(firstGoal, secondGoal);

            if (compareValue === 0){
                compareValue = comparePriority(firstGoal, secondGoal);

                if (compareValue === 0){
                    compareValue = compareCreatedAt(firstGoal, secondGoal)
                }
            }

            return compareValue;
        });

        if (typeof this.props.createGoal === 'function'){
            todoGoals.unshift(newGoal);
        }


        // render html foreach to-do goal
        const todoList = todoGoals.length > 0 ? todoGoals.map((goal) => (
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
};

GoalList.propTypes = {
    goals: PropTypes.array.isRequired,
    createGoal: PropTypes.func,
    project_id: PropTypes.string.isRequired,
};