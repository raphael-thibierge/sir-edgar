const React = require('react');
const Accordion = require('react-bootstrap').Accordion;
const Panel = require('react-bootstrap').Panel;
const ListGroup = require('react-bootstrap').ListGroup;
const ListGroupItem = require('react-bootstrap').ListGroupItem;
const Table = require('react-bootstrap').Table;
const GoalList = require('../goal/GoalList.jsx');
const GoalInput = require('../goal/GoalInput.jsx');

/**
 * Main component managing goals
 */
const ProjectRender = React.createClass({

    propTypes:{
        project: React.PropTypes.object.isRequired,
    },

    /**
     * Define component initial state
     *
     * @returns {{}}
     */
    getInitialState: function () {
        return {};
    },

    /**
     * Render method, returning HTML code for goal input and list
     *
     * @returns {XML}
     */
    render: function () {

        const project = this.props.project;

        return (
            <Panel header={project.title} eventKey={project.id} collapsible>
                <GoalList
                    goals={project.goals}
                    createGoal={this.props.createGoal}
                    project_id={project._id}
                />
            </Panel>
        );
    }

});

module.exports = ProjectRender;