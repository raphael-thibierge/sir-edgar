const React = require('react');
const GoalInput = require('./GoalInput.jsx');
const GoalList = require('./GoalList.jsx');
const GoalsGraph = require('./GoalsGraph.jsx');

/**
 * Main component managing goals
 */
const GoalRoot = React.createClass({

    /**
     * Inserts a goal in the goal list og GoalList component
     * @param goal
     */
    addToList: function (goal) {
        //this.refs.goalList.addToList(goal)

        /*

        addToList: function (goal) {

            let goals = this.state.goals;
            goals.push(goal);
            this.setState({
                goals: goals
            });
        },
         */
    },

    onGoalCompleted: function (goal) {
        //this.refs.goalGraph.increaseTodayScore(goal.score);
    },

    onGoalDeleted: function (goal) {
        //this.refs.goalGraph.deleteGoal(goal);
    },


    /**
     * Render method, returning HTML code for goal input and list
     *
     * @returns {XML}
     */
    render: function () {
        return (
            <div className="row col-xs-12">
                <div className="row">
                    <div className="col-xs-12">
                        <GoalInput
                            onStoreSuccess={this.addToList}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        <GoalList
                            ref="goalList"
                            onGoalCompleted={this.onGoalCompleted}
                            onGoalDeleted={this.onGoalDeleted}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        <GoalsGraph
                            ref="goalGraph"
                        />
                    </div>
                </div>

            </div>
        );
    }

});

module.exports = GoalRoot;