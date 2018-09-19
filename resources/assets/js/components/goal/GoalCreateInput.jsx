import React from 'react';
import PropTypes from 'prop-types';
import InputText from '../form/InputText'
import InputNumber from '../form/InputNumber'
import ProjectSelectInput from '../project/ProjectSelectInput'
import {
    FormGroup,
    ListGroupItem,
    Button,
    Glyphicon,
} from 'react-bootstrap';
import axios from 'axios';
import Goal from './Goal.js';

/**
 *
 * React component managing goal input
 */
export default class GoalCreateInput extends React.Component{

    constructor(props){
        super(props);
        this.state = this.getInitialState();
        this.state.projectId = 'null';
    }

    /**
     * Return component initial state
     * Called when mounting component
     *
     * @returns {{title: string, score: number}}
     */
    getInitialState() {
        return {
            title: '',
            score: 1,
            errors: null,
        };
    }

    /**
     * Called when the user hit a keyboard key in input
     *
     * @param target
     */
    handleKeyPress(target) {
        // when pressing enter key
        if(target.charCode===13){
            this.onEnterPress();
        }
    }

    setDisplayMode() {

        const url = '/goals';

        axios.post(url, {
                title: this.state.title,
                score: this.state.score,
                project_id: this.props.projectId === 'today' || this.props.projectId === 'all_goals' ? this.state.project_id : this.props.projectId,
                today: this.props.projectId === 'today'
            })
            .then(response => response.data)
            .then(response => {

                if (response.status === 'success') {

                    let goal = new Goal(response.data.goal);

                    this.props.onCreate(goal);

                    this.setState(this.getInitialState());
                }

            })
            .catch(error =>  {

                if (error.response.data.errors){
                    this.setState({
                        errors: error.response.data.errors,
                    });
                } else {
                    alert(error.response.statusText);
                }
            })
    }


    /**
     * Send form values to server when user hit enter key in input
     */
    onEnterPress(){

        this.setDisplayMode();
    }

    /**
     * Calls onStoreSuccess function when data has been send to server success successfully.
     *
     * @param response
     */
    onSuccess(response) {

        // check response status
        if (response.status && response.status == 'success'){

            // get goal data from ajax respone
            const goal = response.data.goal;

            // call onStoreSuccess if is defined
            if (typeof this.props.onStoreSuccess == 'function'){
                this.props.onStoreSuccess(goal);
            }

            // reset component state
            this.setState(this.getInitialState());
        }
    }



    render(){
        return (
            <ListGroupItem key="input" style={{height: this.state.errors === null ? 57 : this.state.errors['score'] ? 103 : 80}}>
                <FormGroup
                    controlId="formBasicText"
                >
                    <div className="col-xs-8">
                        <InputText
                            name={'title'}
                            value={this.state.title}
                            onChange={value => {this.setState({ title: value })}}
                            errors={this.state.errors}
                            placeholder="Goal or task you want to achieve"
                            onKeyPress={this.handleKeyPress.bind(this)}
                            autoFocus
                        />
                    </div>
                    <div className="col-xs-3">
                        {this.props.projectId !== 'today' && this.props.projectId !== 'all_goals' ? (
                            <InputNumber
                                value={this.state.score}
                                placeholder={'Score'}
                                min={0}
                                max={5}
                                name={'score'}
                                onChange={value => {this.setState({score: value})}}
                                onKeyPress={this.handleKeyPress.bind(this)}
                                errors={this.state.errors}

                            />
                        ) : (
                            <ProjectSelectInput
                                value={this.state.project_id}
                                onChange={value => {this.setState({project_id: value})}}
                                errors={this.state.errors}
                            />
                        )}


                    </div>
                    <div className="col-xs-1">
                        <Button bsSize="sm" bsStyle="success" onClick={this.setDisplayMode.bind(this)}>
                            <Glyphicon glyph="ok"/>
                        </Button>
                    </div>
                </FormGroup>
            </ListGroupItem>
        );
    }
};

/**
 * Define required component's properties
 */
GoalCreateInput.propTypes = {
    /**
     * Method to call when the new goal has been send to server successfully
     */
    onCreate: PropTypes.func.isRequired,
    projectId: PropTypes.string.isRequired

};