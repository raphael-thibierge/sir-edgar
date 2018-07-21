import React from 'react';
import PropTypes from 'prop-types';
import InputText from '../form/InputText'
import {FormGroup, FormControl, Button, Glyphicon } from 'react-bootstrap';


export default class NewProjectRoot extends React.Component{

    constructor(props){
        super(props);
        this.state = this.getInitialState();
    }

    getInitialState(){

        return {
            newProjectTitle: '',
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
        if(target.charCode==13){
            this.onClick();
        }
    }

    onNewProjectClick(title) {
        const url = 'projects';
        $.ajax({
            url: url,
            cache: false,
            method: 'POST',
            datatype: 'json',
            data: {
                title: title,
                _token: window.token
            },
            success: function (response) {

                if (response.status === 'success') {

                    let project = response.data.project;
                    project.goals = [];

                    this.props.onNewProjectClick(project);
                }

            }.bind(this),
            error: (error)=> {
                //alert('Creating project failed');
                console.error(error.responseJSON);
                this.setState({
                    errors: error.responseJSON.errors
                })
            },
        });

    }


    onClick(){
        this.onNewProjectClick(this.state.newProjectTitle);
    }

    render() {
        return (
            <div className="row">
                <div className="col-xs-12">

                    <div className="row">
                        <div className="col-xs-12">
                            <h1 className="page-header productivity-page-header">
                                Create a new project
                            </h1>
                        </div>
                    </div>

                    {this.props.projectCurrentNumber === 0 ? (
                        <div className="row">
                            <div className="col-xs-12">
                                <div className="alert alert-info">
                                    <Glyphicon glyph="info-sign"/>
                                    <strong> Welcome ! </strong>
                                    You don't have any project yet !
                                    Create your first one to add goal inside and start completing them !
                                </div>
                            </div>
                        </div>

                    ): null}

                    <div className="row">
                        <div className="col-xs-12">
                            <div className="alert alert-warning">
                                <Glyphicon glyph="info-sign"/>
                                <strong> Wait ! </strong>
                                A project is not a goal or task, and can't be completed ! It's a container, like a list.
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-xs-12">
                            <FormGroup
                                style={{marginDown: '10px', marginLeft: -15}}
                                controlId="formBasicText"
                            >
                                <div className="col-xs-11">

                                    <InputText
                                        name={'title'}
                                        value={this.state.newProjectTitle}
                                        onChange={(value) => this.setState({newProjectTitle: value})}
                                        placeholder="Project's title"
                                        errors={this.state.errors}
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

                </div>
            </div>
        );
    }
};


NewProjectRoot.propTypes = {
    onNewProjectClick: PropTypes.func.isRequired,
    projectCurrentNumber: PropTypes.number.isRequired
};