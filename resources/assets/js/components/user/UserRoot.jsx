import React from 'react';
import PropTypes from 'prop-types';
import {FormGroup, Checkbox, Alert, Button} from 'react-bootstrap';
import Tools from '../Tools';
import axios from 'axios';

export default class UserRoot extends React.Component {


    constructor(props){
        super(props);

        this.state = {
            loaded: false,
            email_daily_report: props.user.email_daily_report,
            email_weekly_report: props.user.email_weekly_report,
            timezone: props.user.timezone,
            status: null,
        };
    }

    saveChanges(){

        this.setState({
            status: 'saving',
        });

        axios.post('/account/update', {
                email_daily_report: this.state.email_daily_report,
                email_weekly_report: this.state.email_weekly_report,
                timezone: this.state.timezone,
            })
            .then(response => response.data)
            .then(response => {
                if (response.status === 'success'){

                    // get response data
                    this.setState({
                        status: 'saved',
                        user: response.data.user,
                    });
                }
            })
            .catch(error => {
                console.error(error.response);
                alert('Update account failed !')
            });
    }


    render(){

        const user = this.props.user;
        return (
            <div className="row">
                <div className="col-xs-12">

                    <div className="row">
                        <div className="col-xs-12">
                            <h1 className={'page-header'}>
                                Account settings {user.admin === true ? <small><em>Admin</em></small> : null}
                            </h1>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-xs-12">
                            <h2>Information</h2>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-xs-12">
                            <table className="table">
                                <tbody>
                                    <tr>
                                        <td>Name</td>
                                        <td>{user.name}</td>
                                    </tr>
                                    <tr>
                                        <td>Email</td>
                                        <td>{user.email}</td>
                                    </tr>
                                    <tr>
                                        <td>Timezone</td>
                                        <td>

                                            <select
                                                name=""
                                                id=""
                                                className="form-control"
                                                onChange={(e) => this.setState({ timezone: e.target.value})}
                                            >
                                                {Tools.getTimezoneList().map(
                                                    timezone =>
                                                        <option value={timezone} key={timezone} selected={timezone===user.timezone}>
                                                            {timezone}
                                                        </option>
                                                )}
                                            </select>

                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-xs-12">
                            <h2>Email reports</h2>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-xs-12">
                            <FormGroup>
                                <Checkbox
                                    checked={this.state.email_daily_report}
                                    onChange={(e) => {this.setState({email_daily_report: !this.state.email_daily_report})}}
                                >Daily</Checkbox>

                                <Checkbox
                                    checked={this.state.email_weekly_report}
                                    onChange={(e) => {this.setState({email_weekly_report: !this.state.email_weekly_report})}}
                                >Weekly</Checkbox>
                            </FormGroup>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-xs-12">
                            <h2>Messenger account</h2>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-xs-12">
                            {user.messenger_sender_id && user.messenger_sender_id !== null ? (
                                <Alert bsStyle={'success'}>
                                    Your account is linked !
                                </Alert>
                            ): (
                                <Alert bsStyle={'danger'}>
                                    <strong>Your account is not linked.</strong>
                                    <ul>
                                        <li>Look for SirEdgar page on facebook</li>
                                        <li>Send the message 'Login'</li>
                                        <li>Authenticate yourself</li>
                                    </ul>
                                </Alert>
                            )}
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-xs-12">
                            <h2>API accounts</h2>
                        </div>
                    </div>

                    {/*<div className="row">
                        <div className="col-xs-12">
                            <ul>
                                {user.o_auth_connections.map((connection) => (
                                    <li key={connection.id}>
                                        {connection.service}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>*/}

                    <br/>

                    <div className="row">
                        <div className="col-xs-12">
                            <Button
                                bsStyle="success"
                                onClick={this.saveChanges.bind(this)}
                            >Save changes</Button>
                        </div>
                    </div>

                    {this.state.status === 'saving' ?
                        <Alert>Saving...</Alert>
                        : this.state.status === 'saved'  ?
                            <Alert bsStyle={'success'} >Settings saved</Alert>
                            : null}

                </div>
            </div>
        )


    }


}

UserRoot.propTypes = {
    user: PropTypes.object.isRequired,
};