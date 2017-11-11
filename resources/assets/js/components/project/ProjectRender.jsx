import React from 'react';
import GoalList from '../goal/GoalList';
import AjaxEditableValue from '../generic/AjaxEditableValue';
import PropTypes from 'prop-types';
/**
 * Main component managing goals
 */
export default class ProjectRender extends React.Component{

     /* propTypes:{
        project: PropTypes.object.isRequired,
        onTitleChange: PropTypes.func,
    },*/

    constructor(props){
        super(props);
        this.state = this.getInitialState();
    }

    /**
     * Define component initial state
     *
     * @returns {{}}
     */
    getInitialState() {
        return {};
    }

    editTitle(title){
        if (typeof this.props.onTitleChange === 'function'){
            this.props.onTitleChange(title, this.props.project._id)
        }
    }

    /**
     * Render method, returning HTML code for goal input and list
     *
     * @returns {XML}
     */
    render() {

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
                                    onSuccess={this.editTitle.bind(this)}
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

};