import React from 'react';
import {FormControl, FormGroup, ControlLabel, Button, Modal, Glyphicon, Badge } from 'react-bootstrap';

/**
 * React component managing goal input
 */
export default class ProjectDetailsModal extends React.Component{

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
            display: false,
            title: '',
            is_archived: false,
        };
    }

    componentDidMount(){

        const project = this.props.project;

        this.setState({
            title: project.title,
            is_archived: project.is_archived,
        })

    }

    /**
     * Called when the user hit a keyboard key in input
     *
     * @param target
     */
    handleKeyPress(target) {
        // when pressing enter key
        if(target.charCode===13){
            this.onSave();
        }
    }

    onSave(){

        const request = $.ajax({
            url: this.props.project.routes.update,
            cache: false,
            method: 'POST',
            data: {
                _token: window.token,
                _method: 'PUT',
                title: this.state.title,
                is_archived: this.state.is_archived,
            },
            success: (response) => {
                if (response.status && response.status === 'success'){

                    this.setState({
                        display: false
                    }, this.props.onProjectUpdate.bind(null, {
                        title: this.state.title,
                        is_archived: this.state.is_archived,
                        _id: this.props.project._id
                    }));
                }

            },
            error: (error) => {console.error(error.message); alert(error)},
        });

        console.log(request);

    }

    componentWillReceiveProps(nextProps){
        this.setState({
            title: nextProps.project.title,
            is_archived: nextProps.project.is_archived,
        })
    }

    /**
     * Render component's HTML code
     *
     * @returns {XML}
     */
    render() {
        return (
            <span className="text-left" >
                <a onClick={() => {this.setState({display: true})}}>
                    {this.state.title}
                </a>
                <Modal
                    aria-labelledby="contained-modal-title-lg"
                    show={this.state.display}
                    onHide={()=> {this.setState({display: false})}}
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-lg">
                            {this.state.title}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <FormGroup>
                            <ControlLabel>Project</ControlLabel>
                            <FormControl
                                componentClass='input'
                                value={this.state.title}
                                placeholder="Your project title"
                                onChange={(e) => {this.setState({ title: e.target.value })}}
                                onKeyPress={this.handleKeyPress.bind(this)}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Button className="col-xs-12" bsStyle={this.state.is_archived? 'warning' : 'danger'} onClick={this.setState.bind(this, {is_archived: !this.state.is_archived})}>
                                {!this.state.is_archived? 'Archive project' : 'Un-archive project'}
                            </Button>
                        </FormGroup>
                        <br/>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={()=> {this.setState({display: false})}}>Cancel</Button>
                        <Button bsStyle="success" onClick={this.onSave.bind(this)}>Save</Button>
                    </Modal.Footer>
                </Modal>
            </span>
        )
    }
};