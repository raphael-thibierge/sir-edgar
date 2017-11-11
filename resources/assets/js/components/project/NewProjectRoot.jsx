import React from 'react';
import PropTypes from 'prop-types';

import {FormGroup, FormControl, Button, Glyphicon } from 'react-bootstrap';


export default class NewProjectRoot extends React.Component{

    constructor(props){
        super(props);
        this.state = this.getInitialState();
    }

    getInitialState(){

        return {
            newProjectTitle: ''
        };
    }

    /**
     * Called when the user hit a keyboard key in input
     *
     * @param target
     */
    handleKeyPress(target) {
        // when pressing enter key
        if(target.charCode==13){
            this.onClick();
        }
    }


    onClick(){
        this.props.onNewProjectClick(this.state.newProjectTitle);
    }

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
                                onKeyPress={this.handleKeyPress.bind(this)}
                            />
                        </div>
                        <div className="col-xs-1">

                        <Button bsSize="sm" bsStyle="success"
                                onClick={this.onClick.bind(this)}
                        >
                            <Glyphicon glyph="ok"/>
                        </Button>
                    </div>
                </FormGroup>

                </div>
            </div>
        );
    }
};

/*
NewProjectRoot.propTypes = {
    onNewProjectClick: PropTypes.func.isRequired,
    projectCurrentNumber: PropTypes.number.isRequired
};*/