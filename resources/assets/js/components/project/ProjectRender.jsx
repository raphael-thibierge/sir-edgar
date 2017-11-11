const React = require('react');
const GoalList = require('../goal/GoalList.jsx');
const AjaxEditableValue = require('../generic/AjaxEditableValue.jsx');
const PropTypes = require('prop-types').PropTypes;
/**
 * Main component managing goals
 */
const ProjectRender = React.createClass({

    propTypes:{
        project: PropTypes.object.isRequired,
        onTitleChange: PropTypes.func,
    },

    /**
     * Define component initial state
     *
     * @returns {{}}
     */
    getInitialState: function () {
        return {};
    },

    editTitle: function(title){
        if (typeof this.props.onTitleChange === 'function'){
            this.props.onTitleChange(title, this.props.project._id)
        }
    },

    /**
     * Render method, returning HTML code for goal input and list
     *
     * @returns {XML}
     */
    render: function () {

        const project = this.props.project;

        return (
            <div className="row">
                <div className="col-xs-12">
                    <div className="page-heading">
                        <div className="h1">
                            {typeof project.routes !== "undefined" ?
                                <AjaxEditableValue
                                    value={this.props.project.title}
                                    ajaxURI={project.routes.update}
                                    inputName="title"
                                    method="PUT"
                                    onSuccess={this.editTitle}
                                /> : this.props.project.title
                            }
                            </div>
                    </div>
                    <GoalList
                        goals={project.goals}
                        createGoal={this.props.createGoal}
                        project_id={project._id}
                    />

                </div>
            </div>
        );
    }

});

module.exports = ProjectRender;