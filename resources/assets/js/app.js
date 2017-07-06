const React = require('react');
const ReactDOM = require('react-dom');


const Test = require('./Test.jsx');

var reactComponent = Test;
var props = {};
var container = 'test';

ReactDOM.render(
    React.createElement(reactComponent, props),
    document.getElementById(container)
);