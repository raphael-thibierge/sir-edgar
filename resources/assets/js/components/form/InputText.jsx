import React from 'react';
import PropTypes from 'prop-types';
import {FormControl, FormGroup, ControlLabel, HelpBlock } from 'react-bootstrap';

export default class InputText extends React.Component {

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

    render(){
        return (
            <FormGroup validationState={this.getValidationState()}>
                {this.props.title && (
                    <ControlLabel>{this.props.title}</ControlLabel>
                )}
                <FormControl
                    componentClass='input'
                    type={'string'}
                    value={this.props.value}
                    placeholder={this.props.placeholder}
                    onChange={(e) => {this.props.onChange(e.target.value)}}
                    onKeyPress={this.props.onKeyPress}
                    autoFocus={this.props.autoFocus}
                />
                <FormControl.Feedback />
                {this.getError() !== null && <HelpBlock>{this.getError()}</HelpBlock>}
            </FormGroup>
        );
    }
}

InputText.defaultProps = {
    errors: null,
    autoFocus: false
};

InputText.propTypes = {
    title: PropTypes.string,
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onKeyPress: PropTypes.func,
    errors: PropTypes.object,
    autoFocus: PropTypes.bool
};