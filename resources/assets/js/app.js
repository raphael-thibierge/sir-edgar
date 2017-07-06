const React = require('react');
const ReactDOM = require('react-dom');


const GoalRoot = require('./components/goal/GoalRoot.jsx');

var reactComponent = GoalRoot;
var props = {};
var container = 'goal-root';

ReactDOM.render(
    React.createElement(reactComponent, props),
    document.getElementById(container)
);