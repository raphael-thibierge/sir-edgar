const React = require('react');
const PropTypes = require('prop-types').PropTypes;
const FormGroup = require('react-bootstrap').FormGroup;
const FormControl = require('react-bootstrap').FormControl;
const Button = require('react-bootstrap').Button;
const Glyphicon = require('react-bootstrap').Glyphicon;


const NewProjectRoot = React.createClass({


    getInitialState(){

        return {
            newProjectTitle: ''
        };
    },

    /**
     * Called when the user hit a keyboard key in input
     *
     * @param target
     */
    handleKeyPress: function(target) {
        // when pressing enter key
        if(target.charCode==13){
            this.onClick();
        }
    },


    onClick(){
        this.props.onNewProjectClick(this.state.newProjectTitle);
    },

    render() {
        return (
            <div className="row">
                <div className="col-xs-12">

                    {this.props.projectCurrentNumber === 0 ? (
                        <div>

                            <div className="alert alert-info">
                                <Glyphicon glyph="info-sign"/>
                                <strong> Welcome ! </strong>
                                You don't have any project yet !
                                Create your first one to add goal inside and start completing them !
                            </div>
                            <div className="alert alert-warning">
                                <Glyphicon glyph="info-sign"/>
                                <strong> Wait ! </strong>
                                A project is not a goal or task, and can't be completed ! It's a container, like a list.
                            </div>
                        </div>
                    ) : null}

                    <FormGroup
                        style={{marginDown: '10px'}}
                        controlId="formBasicText"
                    >
                        <div className="col-xs-11">
                            <FormControl
                                type="text"
                                value={this.state.newProjectTitle}
                                placeholder="Project title"
                                onChange={(e) => this.setState({newProjectTitle: e.target.value})}
                                onKeyPress={this.handleKeyPress}
                            />
                        </div>
                        <div className="col-xs-1">

                        <Button bsSize="sm" bsStyle="success"
                                onClick={this.onClick}
                        >
                            <Glyphicon glyph="ok"/>
                        </Button>
                    </div>
                </FormGroup>

                </div>
            </div>
        );
    }
});

NewProjectRoot.propTypes = {
    onNewProjectClick: PropTypes.func.isRequired,
    projectCurrentNumber: PropTypes.number.isRequired
};

module.exports = NewProjectRoot;
