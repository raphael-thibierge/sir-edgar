const GoalList = require("../goal/GoalList");

const React = require('react');
const Accordion = require('react-bootstrap').Accordion;
const Button = require('react-bootstrap').Button;
const Glyphicon = require('react-bootstrap').Glyphicon;
const Collapse = require('react-bootstrap').Collapse;
const FormGroup = require('react-bootstrap').FormGroup;
const FormControl = require('react-bootstrap').FormControl;
const ProjectRender = require('./ProjectRender.jsx');
const Goal = require('../goal/Goal');
const GoalsGraph = require('../goal/GoalsGraph.jsx');
const ScoreGoal = require('../scoreGoal/scoreGoal.jsx');
const ResponsiveSideBar = require('../generic/ResponsiveSideBar.jsx');
const NewProjectRoot = require('../project/NewProjectRoot.jsx');

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
            projects: [],
            newProjectCollapseOpen: false,
            newProjectTitle: '',
            view: 'stats',
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

            if (projects.length === 0){
                this.setState({
                    view: 'new_project',
                    projects: []
                })
            }


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


    onNewProjectClick: function (title) {
        const url = 'projects';
        $.ajax({
            url: url,
            cache: false,
            method: 'POST',
            datatype: 'json',
            data: {
                title: title,
                _token: window.token
            },
            success: function (response) {

                if (response.status === 'success') {

                    let project = response.data.project;

                    let projects = this.state.projects;
                    this.projectMap[project._id] = projects.length;
                    projects.push(project);

                    this.setState({
                        view: project._id,
                        projects: projects,
                        newProjectCollapseOpen: false,
                        newProjectTitle: '',
                    });
                }

            }.bind(this),
            error: (error)=> {alert('Creating project failed'); console.error(error)},
        });

    },

    viewRender(){
        const view = this.state.view;

        if (typeof view === 'undefined')
            return null;

        switch (view){
            case 'stats':
                return <GoalsGraph
                    projectCurrentNumber={this.state.projects.length}
                    ref="goalGraph"/>;
                break;

            case 'new_project':
                return <NewProjectRoot
                    onNewProjectClick={this.onNewProjectClick}
                    projectCurrentNumber={this.state.projects.length}
                />;
                break;

            case 'important':
                let importantProject = {
                    _id: 'today',
                    title: 'Important Goals',
                    goals: []
                };

                this.state.projects.map((project) => {
                    importantProject.goals = importantProject.goals.concat(project.goals.filter((goal) => {
                        return goal.today === true && goal.is_completed === false;
                    }));
                });

                return <ProjectRender
                    project={importantProject}
                    />;
                break;

            case 'all_goals':
                let allGoalsProject = {
                    _id: 'all_goals',
                    title: 'All goals',
                    goals: []
                };

                this.state.projects.map((project) => {project.goals.map(goal => {
                    allGoalsProject.goals.push(goal);
                })});

                return <ProjectRender
                    project={allGoalsProject}
                    />;
                break;

            default:
                const project = this.state.projects[this.projectMap[this.state.view]];
                return <ProjectRender
                        project={project}
                        createGoal={this.addGoal}
                    />;
                return
        }
    },


    /**
     * Render method, returning HTML code for goal input and list
     *
     * @returns {XML}
     */
    render: function () {


        return (
            <div className="row">


                <div className=" col-xs-12 col-sm-3 col-md-3 col-lg-3">
                    <ResponsiveSideBar
                        projects={this.state.projects}
                        onItemSelection={(selected) => {this.setState({view: selected})}}
                        selected={this.state.view}
                    />
                </div>

                <div className="col-xs-12 col-sm-9">

                    <ScoreGoal/>

                    {this.viewRender()}

                </div>
            </div>
        );
    }

});

module.exports = ProjectRoot;