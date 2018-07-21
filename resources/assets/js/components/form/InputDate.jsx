import React from 'react';
import PropTypes from 'prop-types';
import {FormControl, FormGroup, ControlLabel, HelpBlock } from 'react-bootstrap';
import Datetime from 'react-datetime';

export default class InputDate extends React.Component {

    getError(){
        return this.props.errors && this.props.errors !== null
            && Array.isArray(this.props.errors[this.props.name])
        ? this.props.errors[this.props.name][0] : null
    }

    getValidationState() {

        if (this.props.errors && this.props.errors !== null){
            if (Array.isArray(this.props.errors[this.props.name])){
                return 'error';
            } else if (this.props.value !== null && this.props.value !== ''){
                return 'success'
            }
        }

        return null;
    }

    onChange(day){
        const date =day && day !== '' ? day.toDate(): null;
        this.props.onChange(date);
    }

    render(){
        return (
            <FormGroup validationState={this.getValidationState()}>
                {this.props.title && (
                    <ControlLabel>{this.props.title}</ControlLabel>
                )}
                <Datetime
                    onChange={this.onChange.bind(this)}
                    value={this.props.value}
                    isValidDate={this.getValidationState.bind(this)}
                    input={FormControl}
                />
                <FormControl.Feedback />
                {this.getError() !== null && <HelpBlock>{this.getError()}</HelpBlock>}
            </FormGroup>
        );
    }
}

InputDate.defaultProps = {
    errors: null,
    autoFocus: false
};

InputDate.propTypes = {
    title: PropTypes.string,
    name: PropTypes.string.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onKeyPress: PropTypes.func,
    errors: PropTypes.object,
    autoFocus: PropTypes.bool
};