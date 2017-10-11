// get react from dependencies
const React = require('react');
const ReactDOM = require('react-dom');

import AppRoot from './AppRoot';

ReactDOM.render(
    React.createElement(AppRoot, {}),
    document.getElementById('app-root')
);