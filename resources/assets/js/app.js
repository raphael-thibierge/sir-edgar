// get react from dependencies
const React = require('react');
const ReactDOM = require('react-dom');
const Network = require('./components/Network/Network.jsx');
import AppRoot from './AppRoot';

import 'react-datetime/css/react-datetime.css';


Array.prototype.sum = function (prop) {
    let total = 0;
    for ( let i = 0, _len = this.length; i < _len; i++ ) {
        total += this[i][prop];
    }
    return parseFloat(total.toFixed(2));
};

Date.prototype.monthDays= function(){
    const d= new Date(this.getFullYear(), this.getMonth()+1, 0);
    return d.getDate();
};

if (window.app){
    switch (window.app){
        case 'finance':
            ReactDOM.render(
                React.createElement(AppRoot, {app: 'finance'}),
                document.getElementById('app-finance')
            );
            break;

        case 'productivity':
            ReactDOM.render(
                React.createElement(AppRoot, {app: 'productivity'}),
                document.getElementById('app-productivity')
            );
            break;

        case 'user':
            ReactDOM.render(
                React.createElement(AppRoot, {app: 'user'}),
                document.getElementById('app-user')
            );
            break;

        case 'network':
            ReactDOM.render(
                React.createElement(Network, {route: '/test2'}),
                document.getElementById('network')
            );
            break;

    }
}

/**
 *
 * PASSPORT
 *
 */
Vue.component(
    'passport-clients',
    require('./components/passport/Clients.vue')
);

Vue.component(
    'passport-authorized-clients',
    require('./components/passport/AuthorizedClients.vue')
);

Vue.component(
    'passport-personal-access-tokens',
    require('./components/passport/PersonalAccessTokens.vue')
);


