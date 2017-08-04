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
const ProjectRoot = React.createClass({

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
        console.log('yolo');
        const request = $.ajax({
            url: './projects',
            cache: false,
            method: 'GET',
            success: this.onSuccess,
            error: (error) => {console.error(error.message); alert(error)},
        });
    },

    /**
     * AJAX goal loading success method that store returned goals in component state
     * @param response
     */
    onSuccess: function (response) {
        if (response.status && response.status == 'success'){
            console.log(response.data.projects);
            this.setState({
                projects: response.data.projects
            });
        }
    },

    addToList(goal){

    },


    /**
     * Render method, returning HTML code for goal input and list
     *
     * @returns {XML}
     */
    render: function () {

        const projects = this.state.projects.map((project) => {

            const addToList = function (goal) {
                this.addToList(goal)
            }

            return(
                <Panel header={project.title} eventKey={project.id} collapsible>
                    <GoalInput
                        onStoreSuccess={this.refs[project.id + '_goals'].addToList}
                    />
                    <GoalList
                        ref={project.id + '_goals'}
                        goals={project.goals}
                        _addToList=""
                    />
                </Panel>
            )
        });

        return (
            <div className="row col-xs-12">
                <div className="row">
                    <Accordion>
                        {projects}
                    </Accordion>
                </div>

            </div>
        );
    }

});

module.exports = ProjectRoot;