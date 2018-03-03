const vis = require('vis');
const uuid = require('uuid');
const React = require('react');
const Alert = require('react-bootstrap').Alert;
const Glyphicon = require('react-bootstrap').Glyphicon;

const options = {
    autoResize: true,
    nodes: {
        shape: 'dot',
        scaling: {
            min: 10,
            max: 30
        },
        font: {
            size: 14,
            face: 'Tahoma'
        }
    },
    edges: {
        width: 1,
        //color: {inherit: 'from'},
        shadow: false,
        smooth: false,
        //physics: true,
        // can't be used on big website
        //arrows : 'to',
    },
    physics: {
        stabilization: {
            enabled: false,
            fit: true,
            updateInterval: 100,
            iterations: 2000,
        },
        barnesHut: {
            gravitationalConstant: -2500,
            springConstant: 0.01,
            springLength: 300,
            centralGravit: 1.6
        },
        solver: 'barnesHut',
        adaptiveTimestep: true,

    },
    interaction: {
        tooltipDelay: 200,
        hideEdgesOnDrag: false,
        dragNodes: true,
        navigationButtons: true,
    },
    layout: {
        improvedLayout: true,
        hierarchical: false,
    }
};

var Graph = React.createClass({

    defaultProps: {
        graph: {}
    },

    identifier: 'network-graph',

    getInitialState: function () {
        return {
            style: {
                width: '100%',
                height: '800px'
            },
            hideAlert: false,
        };
    },

    componentDidMount: function () {
        this.updateGraph();
    },

    componentDidUpdate: function () {
        this.updateGraph();
    },

    updateGraph: function () {
        let container = document.getElementById(this.identifier);

        this.network = new vis.Network(container, this.props.graph, options);

    },

    render() {
        const {style} = this.state;
        return (
            <div id={this.identifier} style={this.state.style}></div>
        );
    }
});

//export default Graph;
module.exports = Graph;
