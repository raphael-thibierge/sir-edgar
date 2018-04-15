import React from 'react';
import {FormControl, FormGroup, ControlLabel, Button, Modal, Glyphicon, Badge } from 'react-bootstrap';
import DayPicker from 'react-day-picker';
import Datetime from 'react-datetime';
import GoalRender from './GoalRender';

/**
 * React component managing goal input
 */
export default class GoalsDetailsModal extends React.Component{

    constructor(props){
        super(props);
        this.state = this.getInitialState();
    }

    /**
     * Return component initial state
     * Called when mounting component
     *
     * @returns {{title: string, score: number}}
     */
    getInitialState() {
        return {
            display: false,
            due_date: null,
            estimated_time:null,
            time_spent:null,
            priority:null,
            notes: null,
            title: '',
            score: 1,
            is_completed: false,
        };
    }

    componentDidMount(){

        const goal = this.props.goal;

        const diff = Math.floor((new Date() - goal.created_at ) / 1000);

        this.setState({
            title: goal.title,
            due_date: goal.due_date !== null ? new Date(goal.due_date) : null,
            estimated_time: goal.estimated_time,
            time_spent: goal.time_spent,
            priority: goal.priority,
            notes: goal.notes,
            display: diff < 3,
            score: goal.score,
            is_completed: goal.is_completed
        })

    }

    /**
     * Called when the user hit a keyboard key in input
     *
     * @param target
     */
    handleKeyPress(target) {
        // when pressing enter key
        if(target.charCode===13){
            this.onSave();
        }
    }

    onSave(){
        this.props.goal.updateDetails(
            this.state.title,
            this.state.score,
            this.state.due_date,
            this.state.estimated_time,
            this.state.time_spent,
            this.state.priority,
            this.state.notes,
        );

        this.setState({
            display: false
        });
    }

    onCancel(){
        this.componentDidMount()
    }

    /**
     * Render component's HTML code
     *
     * @returns {XML}
     */
    render() {


        const from = this.state.from;
        const to = this.state.to;

        return (
            <span className="text-left" style={{marginLeft : '5px', marginRight:'10px'}} >
                <a onClick={() => {this.setState({display: true})}}>
                    {this.state.title}
                </a>
                <Modal
                    aria-labelledby="contained-modal-title-lg"
                    show={this.state.display}
                    onHide={()=> {this.setState({display: false})}}
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-lg">
                            <strong>
                                <GoalRender goal={this.state}/>
                            </strong>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <FormGroup>
                            <ControlLabel>Goal</ControlLabel>
                            <FormControl
                                componentClass='input'
                                value={this.state.title}
                                placeholder="Your goal title"
                                onChange={(e) => {this.setState({ title: e.target.value })}}
                                onKeyPress={this.handleKeyPress.bind(this)}
                                autoFocus
                            />
                        </FormGroup>

                        <FormGroup>
                            <div className="row">
                                <div className="col-xs-6">
                                    <ControlLabel>Score</ControlLabel>
                                    <FormControl
                                        componentClass='input'
                                        type="number"
                                        min={0}
                                        max={5}
                                        value={this.state.score}
                                        placeholder=""
                                        onChange={(e) => {this.setState({ score: e.target.value })}}
                                        onKeyPress={this.handleKeyPress.bind(this)}
                                    />
                                </div>

                                <div className="col-xs-6">
                                    <ControlLabel>Priority</ControlLabel>
                                    <FormControl
                                        componentClass='input'
                                        type="number"
                                        value={this.state.priority}
                                        min={0}
                                        max={3}
                                        placeholder=""
                                        onChange={(e) => {this.setState({ priority: e.target.value })}}
                                        onKeyPress={this.handleKeyPress.bind(this)}
                                    />
                                </div>
                            </div>
                        </FormGroup>

                        <FormGroup>
                            <div className="row">
                                <div className="col-xs-6">
                                    <ControlLabel>Estimated time (min)</ControlLabel>
                                    <FormControl
                                        componentClass='input'
                                        type="number"
                                        min={0}
                                        value={this.state.estimated_time}
                                        placeholder=""
                                        onChange={(e) => {this.setState({ estimated_time: e.target.value })}}
                                        onKeyPress={this.handleKeyPress.bind(this)}
                                    />
                                </div>

                                <div className="col-xs-6">
                                    <ControlLabel>Time spent (min)</ControlLabel>
                                    <FormControl
                                        componentClass='input'
                                        type="number"
                                        min={0}
                                        value={this.state.time_spent}
                                        placeholder=""
                                        onChange={(e) => {this.setState({ time_spent: e.target.value })}}
                                        onKeyPress={this.handleKeyPress.bind(this)}
                                    />
                                </div>
                            </div>

                        </FormGroup>

                        <FormGroup>
                            <ControlLabel>Due Date</ControlLabel><br/>
                            <Datetime
                                onChange={(day) => {this.setState({due_date: day && day !== '' ? day.toDate(): null})}}
                                value={this.state.due_date}
                            />
                        </FormGroup>



                        <FormGroup>
                            <ControlLabel>Notes</ControlLabel>
                            <FormControl
                                componentClass="textarea"
                                placeholder="textarea"
                                onChange={(e) => {this.setState({ notes: e.target.value })}}
                                value={this.state.notes}
                                rows={5}
                            />
                        </FormGroup>


                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.onCancel.bind(this)}>Cancel</Button>
                        <Button bsStyle="success" onClick={this.onSave.bind(this)}>Save</Button>
                    </Modal.Footer>
                </Modal>
            </span>
        )
    }
};

/**
 * Define required component's properties
 */
GoalsDetailsModal.propTypes= {
    /**
     * Method to call when the new goal has been send to server successfully
     */
    goal: React.PropTypes.object.isRequired,
}