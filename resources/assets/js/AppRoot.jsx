import React from 'react';
import {Image} from 'react-bootstrap';
import Echo from "laravel-echo";

window.pusher = require('pusher-js');

const ProjectRoot = require('./components/project/ProjectRoot.jsx');

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

                    window.user_id = data.user._id;

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

        if (this.state.loaded === false && this.state.user === null){
            return (
                <div className="row">
                    <div className="col-xs-12">
                        <Image src="/images/logo.png" rounded circle responsive thumbnail/>
                    </div>
                </div>
            );
        }

        return (
            <ProjectRoot user={this.state.user}/>
        );
    }

}