const React = require('react');
const GoalInput = require('./GoalInput.jsx');
const GoalList = require('./GoalList.jsx');

const GoalRoot = React.createClass({

    render: function () {
        console.log('ok');
        return (
            <div className="row col-xs-12">

                <div className="row">
                    <div className="col-xs-12">
                        <GoalInput/>
                    </div>
                </div>

                <div className="row">
                    <div className="col-xs-12">
                        <GoalList/>
                    </div>
                </div>

            </div>
        );
    }

});

module.exports = GoalRoot;