// get react from dependencies
const React = require('react');
const ReactDOM = require('react-dom');

// get Goal react component
const GoalRoot = require('./components/goal/GoalRoot.jsx');
const ProjectRoot = require('./components/project/ProjectRoot.jsx');

// default react component
const reactComponent = GoalRoot;
// react component properties
const props = {};
// container (div) to insert component in
const container = 'goal-root';



ReactDOM.render(
    React.createElement(ProjectRoot, props),
    document.getElementById('project-root')
);