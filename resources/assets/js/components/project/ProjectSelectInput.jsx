import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import InputSelect from '../form/InputSelect';

export default class ProjectSelectInput extends React.Component {

    constructor(props){
        super(props);
        this.state= {
            projects: [],
            loaded: false,
        }
    }

    componentDidMount(){
        axios.get('projects/ids')
            .then(response => response.data)
            .then(response => {
                if (response.status === 'success'){
                    this.setState({
                        projects: response.data.projects
                    }, this.props.onChange.bind(null, Object.keys(response.data.projects)[0]));
                } else {
                    alert('Project list loading failed')
                }
            })
            .catch(error => {
                console.error(error.resonse);
                alert('Project list loading failed')
            })
    }


    render(){
        return (
            <InputSelect
                title={this.props.title}
                name={'project_id'}
                value={this.props.value}
                onChange={this.props.onChange}
                options={this.state.projects}
                errors={this.props.errors}
                autoFocus={this.props.autoFocus}
            />
        )
    }
}

ProjectSelectInput.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    errors: PropTypes.object,
    title: PropTypes.string,
    autoFocus: PropTypes.bool
};