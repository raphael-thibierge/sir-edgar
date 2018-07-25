import React from 'react';
import {FormControl, Button, Glyphicon} from 'react-bootstrap';
import PropTypes from 'prop-types';
import axios from 'axios';

export default class AjaxEditableValue extends React.Component {

    constructor(props){
        super(props);
        this.state = this.getInitialState();
        this.defaultProps = {
            type: 'text',
            style: {},
            classNameLink: '',
            method: 'POST'

        };
    }

    getInitialState(){
        return {
            value: '',
            edit: false,
        }

    }

    validate(e){
        e.preventDefault();

        if (this.props.ajaxURI ){


            let data = {
                _token: window.token
            };

            if (this.props.method === 'PUT'){
                data.method = this.props.method;
                data._method = this.props.method;
            }

            if (this.props.inputName){
                data[this.props.inputName] = this.state.value;
            } else {
                data['value'] = this.state.value;
            }


            axios.post(this.props.ajaxURI, data)
                .then(response => response.data)
                .then(response => {
                    if (response.status && response.status === 'success'){

                        this.setState({
                            edit: false
                        });

                        if (typeof this.props.onSuccess === 'function'){
                            this.props.onSuccess(this.state.value);
                        }

                    }

                })
                .catch(error => {console.error(error.response); alert(error.statusText)});
        }
    }

    /**
     * Called when the user hit a keyboard key in input
     *
     * @param target
     */
    handleKeyPress(target) {
        // when pressing enter key
        if(target.charCode==13){
            this.validate();
        }
    }

    editModeRender() {
        return (
            <div style={{marginBottom: '10px'}}>

                <div className="col-xs-10">
                    <FormControl
                        type={this.props.type}
                        value={this.state.value}
                        placeholder=""
                        onChange={(e) => {this.setState({ value: e.target.value })}}
                        onKeyPress={this.handleKeyPress.bind(this)}
                        autoFocus
                    />
                </div>

                <div className="col-xs-1">

                    <Button bsSize="sm" bsStyle="success" onClick={this.validate.bind(this)}>
                        <Glyphicon glyph="ok"/>
                    </Button>
                </div>
            </div>
        );
    }

    setEditMode(){
        this.setState({
            value: this.props.value,
            edit: true,
        });
    }


    displayModeRender() {

        return (
            <a onClick={this.setEditMode.bind(this)} style={{cursor: 'pointer'}}>
                <span className={this.props.classNameLink} style={this.props.style}>
                    <strong>
                        {this.props.value}
                    </strong>
                </span>
            </a>
        );
    }

    render(){
        return this.state.edit === true ? this.editModeRender() : this.displayModeRender();
    }
};


AjaxEditableValue.propTypes = {
    onSuccess: PropTypes.func,
    ajaxURI: PropTypes.string,
    inputName: PropTypes.string,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]).isRequired,
    type: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    method: PropTypes.oneOf(['GET', 'POST', 'PATCH', 'PUT', 'DELETE'])
};