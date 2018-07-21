import React from 'react';
import PropTypes from 'prop-types';
import {FormControl, FormGroup, ControlLabel, HelpBlock } from 'react-bootstrap';

export default class InputNumber extends React.Component {

    getError(){
        return this.props.errors && this.props.errors !== null
            && Array.isArray(this.props.errors[this.props.name])
        ? this.props.errors[this.props.name][0] : null
    }

    getValidationState() {

        if (this.props.errors && this.props.errors !== null){
            if (Array.isArray(this.props.errors[this.props.name])){
                return 'error';
            } else if (this.props.value !== null){
                return 'success'
            }
        }

        return null;
    }

    render(){
        return (
            <FormGroup validationState={this.getValidationState()}>
                {this.props.title && (
                    <ControlLabel>{this.props.title}</ControlLabel>
                )}
                <FormControl
                    componentClass='input'
                    type={'number'}
                    value={this.props.value}
                    placeholder={this.props.placeholder}
                    onChange={(e) => {this.props.onChange(e.target.value)}}
                    onKeyPress={this.props.onKeyPress}
                    autoFocus={this.props.autoFocus}
                    max={this.props.max}
                    min={this.props.min}
                />
                <FormControl.Feedback />
                {this.getError() !== null && <HelpBlock>{this.getError()}</HelpBlock>}
            </FormGroup>
        );
    }
}

InputNumber.defaultProps = {
    errors: null,
    autoFocus: false,
    max: null,
    min: null,
};

InputNumber.propTypes = {
    title: PropTypes.string,
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.number,
    onChange: PropTypes.func.isRequired,
    onKeyPress: PropTypes.func,
    errors: PropTypes.object,
    autoFocus: PropTypes.bool,
    max: PropTypes.number,
    min: PropTypes.number,
};