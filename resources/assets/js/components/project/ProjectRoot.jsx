import React from 'react';
import ProjectRender from './ProjectRender.jsx';
import Goal from '../goal/Goal';
import GoalsGraph from '../goal/GoalsGraph.jsx';
import ScoreGoal from '../scoreGoal/scoreGoal.jsx';
import ResponsiveSideBar from '../generic/ResponsiveSideBar.jsx';
import NewProjectRoot from '../project/NewProjectRoot.jsx';
import BudgetRoot from '../budget/BudgetRoot';
import ExpenseRoot from '../expense/ExpenseRoot';
const Network = require('../Network/Network.jsx');
import PriceRoot from '../coinbase/PriceRoot';
import TagFrequencyChart from '../expense/TagFrequencyChart';
import axios from 'axios';
/**
 * Main component managing goals
 */
export default class ProjectRoot extends React.Component {


    constructor(props){
        super(props);
        this.state = this.getInitialState();
        this.projectMap={};
    }

    /**
     * Define component initial state
     *
     * @returns {{goals: Array}}
     */
    getInitialState(){
        return {
            projects: [],
            newProjectCollapseOpen: false,
            newProjectTitle: '',
            view: 'stats',
        };
    }

    /**
     * Method called when component is mounted in html
     * Loads goal list in AJAX
     */
    componentDidMount(){
        this.request();
    }

    /**
     * AJAX request to get goals from server
     */
    request(){
        axios.get('/projects')
            .then(response => response.data)
            .then(this.onSuccess.bind(this))
            .catch(error => {
                console.error(error.response);
                alert('Projects loading failed')
            });
    }

    /**
     * AJAX goal loading success method that store returned goals in component state
     * @param response
     */
    onSuccess(response) {
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
                    goal.project_id = projects[projectIterator]._id;
                    goals[goalIterator] = goal;
                }

                projects[projectIterator].goals = goals;
            }

            this.setState({
                projects: projects
            });
        }
    }

    onProjectSaved(project){

        let projects = this.state.projects;
        this.projectMap[project._id] = projects.length;
        projects.push(project);

        this.setState({
            view: 'projects/' + project._id,
            projects: projects,
            newProjectCollapseOpen: false,
            newProjectTitle: '',
        });
    }




    viewRender(){
        const view = this.state.view;

        if (typeof view === 'undefined')
            return null;

        let viewPathParts = view.split('/');
        if (viewPathParts.length === 2){
            switch (viewPathParts[0]){
                case 'projects':
                    const project = this.state.projects[this.projectMap[viewPathParts[1]]];
                    return <ProjectRender
                        project={project}
                        onProjectUpdate={this.updateProject.bind(this)}
                    />;
                    break;

                default:
                    return null;
                    break;
            }
        }

        switch (view){
            case 'stats':
                return <GoalsGraph
                    projectCurrentNumber={this.state.projects.length}
                    ref="goalGraph"/>;
                break;

            case 'new_project':
                return <NewProjectRoot
                    onNewProjectClick={this.onProjectSaved.bind(this)}
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
                        return goal.today === true;
                    }));
                });

                return (
                    <ProjectRender
                        project={importantProject}
                        onProjectUpdate={this.updateProject.bind(this)}
                    />
                );
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

                return <ProjectRender project={allGoalsProject} onProjectUpdate={this.updateProject.bind(this)}/>;
                break;

            case 'budgets':
                return <BudgetRoot/>;
                break;

            case 'expenses':
                return <ExpenseRoot/>;
                break;

            case 'expense_stats':
                return <Network route={'/expenses-graph-data'}/>;
                break;

            case 'tags_frequency':
                return <TagFrequencyChart/>;
                break;

            case 'coinbase':
                return <PriceRoot/>;
                break;

            default:
                return null;
        }
    }

    indexOfProject(projectId){
        return this.state.projects.indexOf(this.state.projects.find(p => p._id === projectId));
    }

    updateProject(project){

        let projects = this.state.projects;
        //let self=this;

        if (project._id === 'today' || project._id === 'all_goals'){

            project.goals.forEach(goal => {

                const index = this.indexOfProject(goal.project_id);
                const goals = projects[index].goals;
                const goalIndex = goals.indexOf(goals.find(g => g._id === goal._id));
                if (goalIndex === -1){
                    goals.push(goal);
                }
                else if (goal.is_deleted){
                    goals.splice(goalIndex, 1);
                } else {
                    goals[goalIndex] = goal;
                }

                projects[index].goals = goals;

            });

        } else {
            projects[this.indexOfProject(project._id)] = project;
        }

        this.setState({projects: projects});
    }


    /**
     * Render method, returning HTML code for goal input and list
     *
     * @returns {XML}
     */
    render() {

        return (
            <div className="row">


                <div className=" col-xs-12 col-sm-3 col-md-3 col-lg-3">
                    <ResponsiveSideBar
                        projects={this.state.projects}
                        onItemSelection={(selected) => {if (selected !== 'projects') this.setState({view: selected})}}
                        selected={this.state.view}
                    />
                </div>

                <div className="col-xs-12 col-sm-9">

                    {this.state.view !== 'expenses' && this.state.view !== 'budgets'  && this.state.view !== 'coinbase' && this.state.view !== 'expense_stats'  && this.state.view !== 'tags_frequency'? (
                        <ScoreGoal/>
                    ): null}


                    {this.viewRender()}

                </div>
            </div>
        );
    }

};