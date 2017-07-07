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
            title: '',
            score: 1,
        };
    },

    getValue: function (){
        return {
            title: this.state.title,
            score: this.state.score,
        }
    },

    onTitleChange(e) {
        this.setState({ title: e.target.value });
    },

    onScoreChange(e){
        this.setState({ score: e.target.value });
    },

    handleKeyPress: function(target) {
        // when pressing enter key
        if(target.charCode==13){
            this.onEnterPress();
        }
    },

    onEnterPress(){

        let data = this.getValue();
        data._token = window.token;

        const request = $.ajax({
            url: 'http://localhost:8000/goals',
            dataType: 'json',
            method: 'POST',
            data: data,
            success: this.onSuccess,
            error: this.onError,

        });
    },

    onSuccess: function (response) {

        if (response.status && response.status == 'success'){

            const goal = response.data.goal;

            if (typeof this.props.onStoreSuccess == 'function'){
                this.props.onStoreSuccess(goal);
            }

            this.setState({
                title: ''
            })

        }
    },

    onError: function (response) {
        alert('error');
        console.error(response);
    },

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