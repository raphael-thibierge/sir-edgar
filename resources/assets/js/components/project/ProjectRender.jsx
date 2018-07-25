import React from 'react';
import GoalList from '../goal/GoalList';
import ProjectDetailsModal from './ProjectDetailsModal';
import PropTypes from 'prop-types';
/**
 * Main component managing goals
 */
export default class ProjectRender extends React.Component{


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
        if (typeof this.props.onProjectUpdate === 'function'){
            this.props.onProjectUpdate(project)
        }
    }

    createGoal(goal){
        let project = this.props.project;
        project.goals.push(goal);
        this.props.onProjectUpdate(project);
    }

    updateGoal(goal){
        let project = this.props.project;
        const index = project.goals.indexOf(project.goals.find(g => g._id === goal._id));

        if (goal.is_deleted){
            project.goals.splice(index, 1);
        } else {
            project.goals[index] = goal;
        }

        this.props.onProjectUpdate(project);
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
                                {project._id !== 'today' ?

                                    <ProjectDetailsModal
                                        project={project}
                                        onProjectUpdate={this.editProject.bind(this)}
                                    />
                                     : project.title
                                }
                            </h1>
                        </div>
                    </div>

                    {project.is_archived &&
                    <div className="row">
                        <div className="col-xs-12">
                            <div className="alert alert-danger">
                                <p><strong>This project has been archived !</strong></p>
                                <p>
                                    You will not be able to see it again after selecting another project. It's the last time to unarchived it.
                                </p>
                            </div>
                        </div>
                    </div>
                    }

                    <div className="row">
                        <div className="col-xs-12">
                            <GoalList
                                goals={project.goals ? project.goals : []}
                                createGoal={this.createGoal.bind(this)}
                                project_id={project._id}
                                onGoalUpdate={this.updateGoal.bind(this)}
                            />
                        </div>
                    </div>


                </div>
            </div>
        );
    }

};

ProjectRender.propTypes = {
    project: PropTypes.object.isRequired,
    onTitleChange: PropTypes.func,
    onProjectUpdate: PropTypes.func.isRequired,
};
