const React = require('react');
const FormGroup = require('react-bootstrap').FormGroup;
const FormControl = require('react-bootstrap').FormControl;

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
        onStoreSuccess: React.PropTypes.func.isRequired,
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
        };
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

        let data = this.getFormValues();
        data._token = window.token;

        const request = $.ajax({
            url: './goals',
            dataType: 'json',
            method: 'POST',
            data: data,
            success: this.onSuccess,
            error: this.onError,

        });
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
     * Render component's HTML code
     *
     * @returns {XML}
     */
    render() {
        return (
            <div className="">
                <FormGroup
                    controlId="formBasicText"
                >
                    <div className="col-xs-9">
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
                </FormGroup>
            </div>
        );
    }
});

module.exports = GoalInput;