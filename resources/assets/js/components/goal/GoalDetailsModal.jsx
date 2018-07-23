import React from 'react';
import {FormGroup, Button, Modal} from 'react-bootstrap';
import GoalRender from './GoalRender';
import PropTypes from 'prop-types';
import InputText from '../form/InputText';
import InputNumber from '../form/InputNumber';
import InputTextArea from '../form/InputTextArea';
import InputDate from '../form/InputDate';

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
            completed_at: null,
            today: false,
            errors:null,
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
            is_completed: goal.is_completed,
            completed_at: goal.completed_at,
            today: goal.today,
            setToday: function () {
                this.setState({
                    today: !this.state.today
                })
            }.bind(this)
        });
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


        const request = $.ajax({
            url: '/goals/' + this.props.goal._id,
            cache: false,
            method: 'POST',
            data: {
                _method: 'PATCH',
                _token: window.token,
                due_date: this.state.due_date,
                estimated_time: this.state.estimated_time,
                time_spent: this.state.time_spent,
                priority: this.state.priority,
                notes: this.state.notes,
                title: this.state.title,
                score: this.state.score,
                today: this.state.today,
                completed_at: this.state.completed_at,

            },
            // when server return success
            success: function (response) {
                // check status
                if (response.status && response.status === 'success'){

                    const goal = response.data.goal;

                    this.props.onGoalUpdate(goal);

                    this.setState({
                        display: false
                    });
                } else {
                    this.onError(response);
                }
            }.bind(this), // bind is used to call method in this component
            error: this.onError.bind(this),
        });


    }

    onError(error){
        console.error(error);
        this.setState({
            errors: error.responseJSON.errors
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
                                <GoalRender goal={this.state} />
                            </strong>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <FormGroup>
                            <InputText
                                title={'Title'}
                                name={'title'}
                                placeholder={'Goal or task you want to achieve'}
                                onChange={(value) => {this.setState({ title: value })}}
                                errors={this.state.errors}
                                value={this.state.title}
                                onKeyPress={this.handleKeyPress.bind(this)}
                                autoFocus
                        />
                        </FormGroup>

                        <FormGroup>
                            <div className="row">
                                <div className="col-xs-6">
                                    <InputNumber
                                        title={'Score'}
                                        name={'score'}
                                        placeholder={'1'}
                                        onChange={(value) => {this.setState({ score: value })}}
                                        errors={this.state.errors}
                                        value={this.state.score}
                                        onKeyPress={this.handleKeyPress.bind(this)}
                                        max={5}
                                        min={0}
                                    />
                                </div>

                                <div className="col-xs-6">
                                    <InputNumber
                                        title={'Priority'}
                                        name={'priority'}
                                        placeholder={'1'}
                                        onChange={(value) => {this.setState({ priority: value })}}
                                        errors={this.state.errors}
                                        value={this.state.priority}
                                        onKeyPress={this.handleKeyPress.bind(this)}
                                        max={3}
                                        min={0}
                                    />
                                </div>
                            </div>
                        </FormGroup>

                        <FormGroup>
                            <div className="row">
                                <div className="col-xs-6">
                                    <InputNumber
                                        title={'Estimated time (min)'}
                                        name={'estimated_time'}
                                        placeholder={'15'}
                                        onChange={(value) => {this.setState({ estimated_time: value })}}
                                        errors={this.state.errors}
                                        value={this.state.estimated_time}
                                        onKeyPress={this.handleKeyPress.bind(this)}
                                        min={0}
                                    />
                                </div>

                                <div className="col-xs-6">
                                    <InputNumber
                                        title={'Time spent (min)'}
                                        name={'time_spent'}
                                        placeholder={'15'}
                                        onChange={(value) => {this.setState({ time_spent: value })}}
                                        errors={this.state.errors}
                                        value={this.state.time_spent}
                                        onKeyPress={this.handleKeyPress.bind(this)}
                                        min={0}
                                    />
                                </div>
                            </div>

                        </FormGroup>

                         <FormGroup>
                            <div className="row">
                                <div className="col-xs-6">
                                    <InputDate
                                        title={'Due date'}
                                        name={'due_date'}
                                        onChange={value => {this.setState({due_date: value})}}
                                        value={this.state.due_date}
                                        errors={this.state.errors}
                                    />
                                </div>
                                <div className="col-xs-6">
                                    <InputDate
                                        title={'Completed at date'}
                                        name={'completed_at'}
                                        onChange={value => {this.setState({completed_at: value})}}
                                        value={this.state.completed_at}
                                        errors={this.state.errors}
                                    />
                                </div>
                            </div>
                        </FormGroup>

                        <FormGroup>
                            <InputTextArea
                                title={'Notes'}
                                name={'notes'}
                                placeholder={'Some notes about goal'}
                                onChange={value => {this.setState({notes: value})}}
                                value={this.state.notes}
                                rows={5}
                                errors={this.state.erros}
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
    goal: PropTypes.object.isRequired,
    onGoalUpdate: PropTypes.func.isRequired,
}