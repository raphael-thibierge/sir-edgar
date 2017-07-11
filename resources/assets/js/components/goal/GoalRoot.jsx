const React = require('react');
const GoalInput = require('./GoalInput.jsx');
const GoalList = require('./GoalList.jsx');

/**
 * Main component managing goals
 */
const GoalRoot = React.createClass({

    /**
     * Inserts a goal in the goal list og GoalList component
     * @param goal
     */
    addToList: function (goal) {
        this.refs.goalList.addToList(goal)
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
                        />
                    </div>
                </div>

            </div>
        );
    }

});

module.exports = GoalRoot;