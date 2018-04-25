'use strict';
var React = require('react');
var Alert = require('react-bootstrap').Alert;

var Graph = require('./NetworkGraph.jsx');

var Network = React.createClass({

    propTypes: {
        route: React.PropTypes.string.isRequired,
    },

    getInitialState: function () {
        return {
            totalPages: 0,
            loaded: false,
            data: {
                nodes: [],
                edges: [],
            },
            loadingError: false,
        };
    },

    componentDidMount: function () {
        if (typeof this.props.route != 'undefined' && this.props.route != ''){
            this.request();
        } else {
            this.setState({
                loaded: true,
                loadingError: true,
            });
        }
    },

    componentWillReceiveProps(nextProps){
        this.setState(this.getInitialState(), this.componentDidMount.bind(this));
    },

    request: function () {
        var request = $.ajax({
            url: this.props.route,
            dataType: 'json',
            cache: false,
            method: 'GET',
            timeout: 60000, //60 sec
            success: this.handleAjaxRequest,
            error: this.ajaxRequestError,
        });
    },

    handleAjaxRequest: function (ajaxResponse) {

        if (ajaxResponse.status == 'success'){


            var self = this;
            console.log(ajaxResponse);
            this.setState({
                data: {
                    nodes: ajaxResponse.data.nodes,
                    edges: ajaxResponse.data.edges,
                },
            }, function () {

                self.setState({
                    loaded: true
                });

            });


        } else {
            this.ajaxRequestError(ajaxResponse);
        }
    },



    ajaxRequestError: function (errorResponse) {
        this.setState({
            loaded: true,
            loadingError: true,
        })
    },

    // return network render or error render depend if there was an error while loading data
    networkRender: function () {

        return this.state.loadingError == true ? (
            <Alert bsStyle="danger" className="col-xs-12 text-center">
                <p>There was an error while loading network data !</p>
                <p>Please try later</p>
            </Alert>
        ) : (
            <p></p>
        );
    },

    render: function(){

        var gifStyle = {
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto'
        };

        return (
            <div className="row">
                <div className="col-xs-12" id="network_div">
                   {this.state.loaded == false ?
                       <p>Loading...</p>
                       : <Graph graph={this.state.data}/>
                   }
                </div>
            </div>
        );
    },
});
module.exports = Network;