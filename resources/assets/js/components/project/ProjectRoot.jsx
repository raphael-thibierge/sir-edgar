const React = require('react');
const Accordion = require('react-bootstrap').Accordion;
const Button = require('react-bootstrap').Button;
const ProjectRender = require('./ProjectRender.jsx');
const Goal = require('../goal/Goal');
const GoalsGraph = require('../goal/GoalsGraph.jsx');

/**
 * Main component managing goals
 */
const ProjectRoot = React.createClass({

    projectMap:{},


    /**
     * Define component initial state
     *
     * @returns {{goals: Array}}
     */
    getInitialState: function () {
        return {
            projects: []
        };
    },

    /**
     * Method called when component is mounted in html
     * Loads goal list in AJAX
     */
    componentDidMount: function () {
        this.request();
    },

    /**
     * AJAX request to get goals from server
     */
    request: function(){
        const request = $.ajax({
            url: './projects',
            cache: false,
            method: 'GET',
            success: this.onSuccess,
            error: (error) => {console.error(error.message); alert(error)},
        });
    },

    /**
     * AJAX request to create new project
     */
    newProject: function(){
        const request = $.ajax({
            url: './projects',
            cache: false,
            method: 'POST',
            success: function(response){
                if (response.status && response.status === 'success'){
                    let projects = this.state.projects;
                    projects.push(response.data.project);
                    this.setState({
                        projects: projects
                    });
                }
            },
            error: (error) => {console.error(error.message); alert(error)},
        });
    },

    formatGoal(goal){

    },

    /**
     * AJAX goal loading success method that store returned goals in component state
     * @param response
     */
    onSuccess: function (response) {
        if (response.status && response.status === 'success'){

            let projects = response.data.projects;

            for (let projectIterator=0; projectIterator < projects.length; projectIterator++ ){

                this.projectMap[projects[projectIterator]._id] = projectIterator;

                let goals = projects[projectIterator].goals;

                for (let goalIterator=0; goalIterator < goals.length; goalIterator++){

                    let goal = new Goal(goals[goalIterator]);
                    goal.forceUpdate = this.forceUpdate.bind(this);
                    goal.project_id = projects[projectIterator]._id;
                    goal.remove = this.deleteGoal.bind(this, goal);
                    goals[goalIterator] = goal;
                }

                projects[projectIterator].goals = goals;
            }


            this.setState({
                projects: projects
            });
        }
    },

    deleteGoal: function (goalToDelete) {
        $.ajax({
            url: goalToDelete.routes.destroy,
            cache: false,
            method: 'POST',
            datatype: 'json',
            data: {
                method: 'DELETE',
                _method: 'DELETE'
            },
            success: function (goal) {

                let projects = this.state.projects;

                const project_id = goal.project_id;
                let project = projects[this.projectMap[project_id]];
                const oldGoals= project.goals;

                let goals = [];
                for (let goalIterator=0; goalIterator < project.goals.length; goalIterator++){
                    if (project.goals[goalIterator]._id !== goal._id){
                        goals.push(project.goals[goalIterator]);
                    }
                }

                project.goals = goals;
                projects[this.projectMap[project_id]] = project;

                this.setState({
                    projects: projects
                });

            }.bind(this, goalToDelete),
            error: this.onError,
        });

    },

    addGoal: function (title, score, project_id) {

        const url = './goals';

        $.ajax({
            url: url,
            cache: false,
            method: 'POST',
            datatype: 'json',
            data: {
                title: title,
                score: score,
                project_id: project_id,
            },
            success: function (response) {


                if (response.status === 'success') {

                    let goal = response.data.goal;

                    console.log(goal);

                    let projects = this.state.projects;

                    const project_id = goal.project_id;
                    let project = projects[this.projectMap[project_id]];

                    goal = new Goal(goal);
                    goal.forceUpdate = this.forceUpdate.bind(this);
                    goal.remove = this.deleteGoal.bind(this, goal);

                    project.goals.push(goal);
                    projects[this.projectMap[project_id]] = project;

                    this.setState({
                        projects: projects
                    });
                }

            }.bind(this),
            error: this.onError,
        });


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
                    <Accordion>
                        {this.state.projects.map((project) => (
                            <ProjectRender
                                project={project}
                                createGoal={this.addGoal}
                                key={project._id}
                            />
                        ))}
                    </Accordion>
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

module.exports = ProjectRoot;