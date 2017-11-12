// get react from dependencies
const React = require('react');
const ReactDOM = require('react-dom');

import AppRoot from './AppRoot';

import 'react-datetime/css/react-datetime.css';


Array.prototype.sum = function (prop) {
    let total = 0;
    for ( let i = 0, _len = this.length; i < _len; i++ ) {
        total += this[i][prop];
    }
    return parseFloat(total.toFixed(2));
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

    }
}


