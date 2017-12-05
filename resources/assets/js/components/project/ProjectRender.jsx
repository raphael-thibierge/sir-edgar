import React from 'react';
import GoalList from '../goal/GoalList';
import AjaxEditableValue from '../generic/AjaxEditableValue';
import ProjectDetailsModal from './ProjectDetailsModal';
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

    editProject(project){
        if (typeof this.props.editProject === 'function'){
            this.props.editProject(project)
        }
    }

    /**
     * Render method, returning HTML code for goal input and list
     *
     * @returns {XML}
     */
    render() {

        const project = this.props.project;
        console.log(project);

        return (
            <div className="row">
                <div className="col-xs-12">

                    <div className="row">
                        <div className="col-xs-12">
                            <h1 className="page-header productivity-page-header">
                                {typeof project.routes !== "undefined" ?

                                    <ProjectDetailsModal
                                        project={project}
                                        onProjectUpdate={this.editProject.bind(this)}
                                    />
                                     : project.title
                                }
                            </h1>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-xs-12">
                            <GoalList
                                goals={project.goals}
                                createGoal={this.props.createGoal}
                                project_id={project._id}
                            />
                        </div>
                    </div>


                </div>
            </div>
        );
    }

};