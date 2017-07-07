const React = require('react');
const FormGroup = require('react-bootstrap').FormGroup;
const FormControl = require('react-bootstrap').FormControl;
const ControlLabel = require('react-bootstrap').ControlLabel;
const HelpBlock = require('react-bootstrap').HelpBlock;

const GoalInput = React.createClass({

    propTypes: {
        onStoreSuccess: React.PropTypes.func.isRequired,
    },

    getInitialState() {
        return {
            value: '',
        };
    },

    getValue: function () {
        return this.state.value;
    },

    getValidationState() {
        return 'success';
        const length = this.state.value.length;
    },

    handleChange(e) {
        this.setState({ value: e.target.value });
    },

    handleKeyPress: function(target) {
        // when pressing enter key
        if(target.charCode==13){
            this.onEnterPress();
        }

    },

    onEnterPress(){
        const request = $.ajax({
            url: 'http://localhost:8000/goals',
            dataType: 'json',
            method: 'POST',
            success: this.onSuccess,
            error: this.onError,
            data: {
                title: this.getValue(),
                score: 1,
                _token: window.token,

            }
        });
    },

    onSuccess: function (response) {

        if (response.status && response.status == 'success'){

            const goal = response.data.goal;

            if (typeof this.props.onStoreSuccess == 'function'){
                this.props.onStoreSuccess(goal);
            }

            this.setState({
                value: ''
            })

        }
    },

    onError: function (response) {
        alert('error');
        console.error(response);
    },

    render() {
        return (
            <div>
                <FormGroup
                    controlId="formBasicText"
                >
                    <FormControl
                        type="text"
                        value={this.state.value}
                        placeholder="New goal"
                        onChange={this.handleChange}
                        onKeyPress={this.handleKeyPress}
                    />
                    <FormControl.Feedback />
                </FormGroup>
            </div>
        );
    }
});

module.exports = GoalInput;