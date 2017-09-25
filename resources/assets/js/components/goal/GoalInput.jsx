const React = require('react');
const FormGroup = require('react-bootstrap').FormGroup;
const FormControl = require('react-bootstrap').FormControl;
const HelpBlock = require('react-bootstrap').HelpBlock;
const ListGroupItem = require('react-bootstrap').ListGroupItem;
const Button = require('react-bootstrap').Button;
const Badge = require('react-bootstrap').Badge;
const Glyphicon = require('react-bootstrap').Glyphicon;
const GoalDetailsModal = require('./GoalDetailsModal.jsx');

/**
 *
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
        if(target.charCode===13){
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
                            min={0}
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
                <small style={{marginLeft: 10}}>
                    <strong>
                        <em className={value >= 7 ? 'text-danger' : value >= 3 ? 'text-warning' : ''}>
                            ...{value}{value > 1 ? ' days' : ' day'} ago
                        </em>
                    </strong>
                </small>
            );

        }

        function toHuman(time){
            if (time === null){
                return null;
            }

            const minutes = time % 60;
            const hours = (time-minutes) / 60;

            let string = "";

            if (hours < 10) string += "0";
            string += hours.toString() + 'h';
            if (minutes < 10) string += "0";
            string += minutes.toString() ;

            return  string;

        }

        const goal = this.props.goal;
        let priorityRender = "";
        if (goal.priority !== null){
            for (let i = 0; i < goal.priority; i++){
                priorityRender += "!";
            }

            priorityRender = <span className={"text-danger"}><strong>{priorityRender}</strong></span>
        }


        return (goal.is_completed === false) ? (
            <ListGroupItem key={goal._id} bsStyle={goal.today === true ? 'warning' : 'default'}>

                <span className="text-left">
                    <Button
                        onClick={typeof goal.remove === 'function' ? goal.remove: null}
                        bsSize="xs"
                        bsStyle="danger"
                    ><Glyphicon glyph="trash"/></Button>
                </span>

                <span className="text-left" style={{marginLeft : '5px'}}>
                    <Button
                        onClick={typeof goal.setCompleted === 'function' ? goal.setCompleted.bind(goal): null}
                        bsSize="xs"
                        bsStyle="success"
                    ><Glyphicon glyph="ok"/></Button>
                </span>

                <span className="text-left" style={{marginLeft : '5px'}}>
                    <Button
                        onClick={typeof goal.setToday === 'function' ? goal.setToday.bind(goal): null}
                        bsSize="xs"
                        bsStyle="warning"
                    ><Glyphicon glyph="warning-sign"/></Button>
                </span>

                <GoalDetailsModal goal={goal}/>

                {priorityRender}

                <a style={{marginLeft : '5px'}} onClick={this.setEditMode}>
                    {goal.title}
                </a>


                {goal.due_date !== null && goal.due_date !== "1970-01-01 00:00:00" ? (
                    <strong style={{marginLeft: 10}} className="text-right">
                        <em className="text text-right" >
                            {(new Date(goal.due_date)).toISOString().slice(0,10)}
                        </em>
                    </strong>
                ) : null}

                {daydiffString(goal)}

                {goal.estimated_time !== null && goal.estimated_time > 0 ? (
                <strong style={{marginLeft: 10}} className="text-right">
                    <em className="text text-right" >
                        ... {toHuman(goal.estimated_time)}
                    </em>
                </strong>
                ) : null}


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

                <GoalDetailsModal goal={goal}/>

                {priorityRender}

                <a style={{marginLeft : '10px'}}onClick={this.setEditMode}>
                    {goal.title}
                </a>

                {goal.time_spent !== null && goal.time_spent > 0 ? (
                    <strong style={{marginLeft: 10}} className="text-right">
                        <em className="text text-right" >
                            ... {toHuman(goal.time_spent)}
                        </em>
                    </strong>
                ) : null}

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