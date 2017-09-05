const React = require('react');
const FormGroup = require('react-bootstrap').FormGroup;
const FormControl = require('react-bootstrap').FormControl;
const HelpBlock = require('react-bootstrap').HelpBlock;
const ListGroupItem = require('react-bootstrap').ListGroupItem;
const Button = require('react-bootstrap').Button;
const Badge = require('react-bootstrap').Badge;
const Glyphicon = require('react-bootstrap').Glyphicon;

/**
 * React component managing goal input
 */
const GoalInput = React.createClass({

    /**
     * Define required component's properties
     */
    propTypes: {
        /**
         * Method to call when the new goal has been send to server successfully
         */
        goal: React.PropTypes.object.isRequired,
    },

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
    },

    componentDidMount(){
        if (this.props.goal._id === null){
            this.setEditMode();
        }
    },


    /**
     * Return a object containing all form values
     *
     * @returns {{title, score: (number|*)}}
     */
    getFormValues: function (){
        return {
            title: this.state.title,
            score: this.state.score,
        }
    },

    /**
     * Update this.state.title value when user edit title score value
     *
     * @param e
     */
    onTitleChange(e) {
        this.setState({ title: e.target.value });
    },

    /**
     * Update this.state.score when user edit score input value
     *
     * @param e
     */
    onScoreChange(e){
        this.setState({ score: e.target.value });
    },

    /**
     * Called when the user hit a keyboard key in input
     *
     * @param target
     */
    handleKeyPress: function(target) {
        // when pressing enter key
        if(target.charCode==13){
            this.onEnterPress();
        }
    },

    /**
     * Send form values to server when user hit enter key in input
     */
    onEnterPress(){

        this.setDisplayMode();
    },

    /**
     * Calls onStoreSuccess function when data has been send to server success successfully.
     *
     * @param response
     */
    onSuccess: function (response) {

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
    },

    /**
     * Called when server return error while trying to send form's data
     * @param response
     */
    onError: function (response) {
        alert('error');
        console.error(response);
    },

    /**
     * AJAX request to notify server that user has complete a goal
     * @param goal
     */
    onCompleteGoalClick: function(goal){

    },


    editModeRender: function () {
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
                            onChange={this.onTitleChange}
                            onKeyPress={this.handleKeyPress}
                        />
                    </div>
                    <div className="col-xs-3">

                        <FormControl
                            type="number"
                            value={this.state.score}
                            min={1}
                            max={5}
                            onChange={this.onScoreChange}
                            onKeyPress={this.handleKeyPress}
                        />
                    </div>
                    <div className="col-xs-1">

                        <Button bsSize="sm" bsStyle="success" onClick={this.setDisplayMode}>
                            <Glyphicon glyph="ok"/>
                        </Button>
                    </div>
                </FormGroup>
            </ListGroupItem>
        );
    },

    setEditMode: function () {
        this.setState({
            editMode: true,
            title: this.props.goal.title,
            score: this.props.goal.score,
        });
    },

    setDisplayMode: function () {

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

    },


    displayModeRender: function () {

        /**
         * Compute number of days difference from today
         *
         * @returns {*}
         * @param goal
         */
        function daydiffString(goal) {

            if (!goal.created_at){
                return null;
            }

            const first = new Date(goal.created_at.slice(0,10));


            const second = new Date();
            let value = Math.round((second-first)/(1000*60*60*24));

            if (value <= 0){
                return null;
            }

            return (
                <small>
                    <strong>
                        <em className={value >= 7 ? 'text-danger' : value >= 3 ? 'text-warning' : ''}>
                            ...{value}{value > 1 ? ' days' : ' day'} ago
                        </em>
                    </strong>
                </small>
            );

        }

        const goal = this.props.goal;

        return (goal.is_completed === false) ? (
            <ListGroupItem key={goal._id} bsStyle={goal.today === true ? 'warning' : 'default'}>

                <span className="text-left">
                    <Button
                        onClick={typeof goal.remove === 'function' ? goal.remove: null}
                        bsSize="xs"
                        bsStyle="danger"
                    ><Glyphicon glyph="trash"/></Button>
                </span>

                <span className="text-left" style={{marginLeft : '10px'}}>
                    <Button
                        onClick={typeof goal.setCompleted === 'function' ? goal.setCompleted.bind(goal): null}
                        bsSize="xs"
                        bsStyle="success"
                    ><Glyphicon glyph="ok"/></Button>
                </span>

                <span className="text-left" style={{marginLeft : '10px'}}>
                    <Button
                        onClick={typeof goal.setToday === 'function' ? goal.setToday.bind(goal): null}
                        bsSize="xs"
                        bsStyle="warning"
                    ><Glyphicon glyph="warning-sign"/></Button>
                </span>

                <a style={{marginLeft : '10px', marginRight: '10px'}} onClick={this.setEditMode}>
                    {goal.title}
                </a>

                {daydiffString(goal)}

                <Badge>{goal.score}</Badge>

            </ListGroupItem>
        ) : (
            <ListGroupItem key={goal._id} bsStyle="success">
                <span className="text-left">
                    <Button
                        onClick={typeof goal.remove === 'function' ? goal.remove: null}
                        bsSize="xs"
                        bsStyle="danger"
                    ><Glyphicon glyph="trash"/></Button>
                </span>
                <a style={{marginLeft : '10px'}}onClick={this.setEditMode}>
                    {goal.title}
                </a>
                <Badge>{goal.score}</Badge>
            </ListGroupItem>
        );
    },


    /**
     * Render component's HTML code
     *
     * @returns {XML}
     */
    render() {
        return this.state.editMode === true ? this.editModeRender() : this.displayModeRender();
    }
});

module.exports = GoalInput;