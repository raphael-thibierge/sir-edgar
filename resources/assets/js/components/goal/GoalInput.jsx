const React = require('react');
const FormGroup = require('react-bootstrap').FormGroup;
const FormControl = require('react-bootstrap').FormControl;
const ControlLabel = require('react-bootstrap').ControlLabel;
const HelpBlock = require('react-bootstrap').HelpBlock;

const GoalInput = React.createClass({

    getInitialState() {
        return {
            value: ''
        };
    },

    getValue: function () {
        return this.state.value;
    },

    getValidationState() {
        const length = this.state.value.length;
        if (length > 10) return 'success';
        else if (length > 5) return 'warning';
        else if (length > 0) return 'error';
    },

    handleChange(e) {
        this.setState({ value: e.target.value });
    },

    handleKeyPress: function(target) {
        if(target.charCode==13){
            this.onEnterPress();
        }

    },

    onEnterPress(){
        const request = $.ajax({
            url: 'http://localhost:8000/goals',
            dataType: 'json',
            cache: false,
            method: 'POST',
            success: this.onSuccess,
            error: this.onError,
            dataType: 'json',
            data: {
                title: this.getValue(),
                score: 1,
                _token: window.token,

            }
        });
    },

    onSuccess: function (response) {
        alert('success');
    },

    onError: function (response) {
        alert('error');
        console.log(response);
    },

    render() {
        return (
            <div>
                <FormGroup
                    controlId="formBasicText"
                    validationState={this.getValidationState()}
                >
                    <ControlLabel>Working example with validation</ControlLabel>
                    <FormControl
                        type="text"
                        value={this.state.value}
                        placeholder="New goal"
                        onChange={this.handleChange}
                        onKeyPress={this.handleKeyPress}
                    />
                    <FormControl.Feedback />
                    <HelpBlock>Validation is based on string length.</HelpBlock>
                </FormGroup>
            </div>
        );
    }
});

module.exports = GoalInput;