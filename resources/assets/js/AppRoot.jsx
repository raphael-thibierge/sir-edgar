import React from 'react';
import {Image} from 'react-bootstrap';
import Echo from "laravel-echo";

window.pusher = require('pusher-js');
import ProjectRoot from './components/project/ProjectRoot.jsx';
import FinanceRoot from './components/financial/FinanceRoot';
import UserRoot from './components/user/UserRoot';

export default class AppRoot extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            user: null,
        };
    }

    componentDidMount(){

        $.get('/app/load')
            .catch(error => {
                alert('Failed to load app...');
                console.error(error);
            })
            .then(responseJSON => {
                if (responseJSON.status === 'success'){
                    // get response data
                    const data = responseJSON.data;

                    window.user_id = data.user.id;

                    window.Echo = new Echo({
                        broadcaster: 'pusher',
                        key: data.pusher.key,
                        cluster: data.pusher.cluster,
                        encrypted: true,
                    });

                    this.setState({
                        loaded: true,
                        user: data.user,
                    });
                }
            });

    }

    componentWillUnmount(){

        // disconnect pusher
        if (window.pusher){
            window.pusher.disconnect();
        }
    }

    render(){

        if (this.state.loading === false || this.state.user === null){
            return (
                <div className="row">
                    <div className="col-xs-12">
                        <Image src="/images/logo-min.png" rounded circle responsive thumbnail/>
                    </div>
                </div>
            );
        }

        if (this.props.app == 'productivity'){
            return (
                <ProjectRoot user={this.user}/>
            )
        }

        if (this.props.app == 'finance'){
            return (
                <FinanceRoot user={this.state.user}/>
            );
        }

        if (this.props.app == 'user'){
            return (
                <UserRoot user={this.state.user}/>
            );
        }



    }

}
