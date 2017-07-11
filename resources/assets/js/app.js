// get react from dependencies
const React = require('react');
const ReactDOM = require('react-dom');

// get Goal react component
const GoalRoot = require('./components/goal/GoalRoot.jsx');

// default react component
const reactComponent = GoalRoot;
// react component properties
const props = {};
// container (div) to insert component in
const container = 'goal-root';

// insert (render) Goal component in div .goal-root in html page
ReactDOM.render(
    React.createElement(reactComponent, props),
    document.getElementById(container)
);