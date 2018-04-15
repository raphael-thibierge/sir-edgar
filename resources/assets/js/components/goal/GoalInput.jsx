import React from 'react';
import PropTypes from 'prop-types';
import GoalRender from './GoalRender';
import {
    FormGroup,
    FormControl,
    ListGroupItem,
    Button,
    Badge,
    Glyphicon,
    OverlayTrigger,
    Popover

} from 'react-bootstrap';



/**
 *
 * React component managing goal input
 */
export default class GoalInput extends React.Component{

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
            title: '',
            score: 1,
            editMode: false,
        };
    }

    componentDidMount(){
        if (this.props.goal._id === null){
            this.setEditMode();
        }
    }


    /**
     * Return a object containing all form values
     *
     * @returns {{title, score: (number|*)}}
     */
    getFormValues(){
        return {
            title: this.state.title,
            score: this.state.score,
        }
    }

    /**
     * Update this.state.title value when user edit title score value
     *
     * @param e
     */
    onTitleChange(e) {
        this.setState({ title: e.target.value });
    }

    /**
     * Update this.state.score when user edit score input value
     *
     * @param e
     */
    onScoreChange(e){
        this.setState({ score: e.target.value });
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



    editModeRender(){
        return (
            <ListGroupItem key="input" style={{height: 57}}>
                <FormGroup
                    controlId="formBasicText"
                >
                    <div className="col-xs-8">
                        <FormControl
                            type="text"
                            value={this.state.title}
                            placeholder="New goal"
                            onChange={this.onTitleChange.bind(this)}
                            onKeyPress={this.handleKeyPress.bind(this)}
                        />
                    </div>
                    <div className="col-xs-3">

                        <FormControl
                            type="number"
                            value={this.state.score}
                            min={0}
                            max={5}
                            onChange={this.onScoreChange.bind(this)}
                            onKeyPress={this.handleKeyPress.bind(this)}
                        />
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

    setEditMode() {
        this.setState({
            editMode: true,
            title: this.props.goal.title,
            score: this.props.goal.score,
        });
    }

    setDisplayMode() {

        if (this.props.goal._id !== null){
            // update goal
            this.props.goal.update(this.state.title, this.state.score);
            this.setState({
                editMode: false,
            });
        } else {
            // add goal
            this.props.goal.create(this.state.title, this.state.score, this.props.goal.project_id);
            this.setEditMode();
        }

    }


    /**
     * Render component's HTML code
     *
     * @returns {XML}
     */
    render() {
        return this.state.editMode === true ? this.editModeRender() : <GoalRender goal={this.props.goal}/>;
    }
};

/**
 * Define required component's properties
 */
GoalInput.propTypes = {
/**
 * Method to call when the new goal has been send to server successfully
 */
   goal: PropTypes.object.isRequired,
};