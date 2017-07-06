const React = require('react');
const GoalInput = require('./GoalInput.jsx');
const GoalList = require('./GoalList.jsx');

const GoalRoot = React.createClass({


    addToList: function (goal) {
        this.refs.goalList.addToList(goal)
    },

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