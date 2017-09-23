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


    onNewProjectClick: function () {
        const title = this.state.newProjectTitle;
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
                console.log(response);

                if (response.status === 'success') {

                    let project = response.data.project;

                    let projects = this.state.projects;
                    this.projectMap[project._id] = projects.length;
                    projects.push(project);

                    this.setState({
                        projects: projects,
                        newProjectCollapseOpen: false,
                        newProjectTitle: '',
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


        return (
            <div className="row col-xs-12">

                <ScoreGoal />

                <div className="row">
                    <Button
                        bsStyle="success"
                        onClick={ ()=> this.setState({ newProjectCollapseOpen: !this.state.newProjectCollapseOpen })}
                    >
                        New project
                    </Button>
                    <Collapse in={this.state.newProjectCollapseOpen}>
                        <div className="well">
                            <div className="row">
                                <div className="col-xs-12">
                                    <FormGroup
                                        style={{marginDown: '10px'}}
                                        controlId="formBasicText"
                                    >
                                        <div className="col-xs-11">
                                            <FormControl
                                                type="text"
                                                value={this.state.newProjectTitle}
                                                placeholder="Project title"
                                                onChange={(e)=> this.setState({ newProjectTitle: e.target.value})}
                                            />
                                        </div>
                                        <div className="col-xs-1">

                                            <Button bsSize="sm" bsStyle="success"
                                                    onClick={this.onNewProjectClick}
                                            >
                                                <Glyphicon glyph="ok"/>
                                            </Button>
                                        </div>
                                    </FormGroup>

                                </div>
                            </div>
                        </div>
                    </Collapse>
                </div>

                <br/>

                <div className="row">
                    <Accordion>
                        {importantProject.goals.length > 0 ? (
                            <ProjectRender
                                project={importantProject}
                                key={importantProject._id}
                            />
                        ): null}

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