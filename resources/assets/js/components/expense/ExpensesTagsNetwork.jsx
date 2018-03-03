//const vis = require('vis');
//const Glyphicon = require('react-bootstrap').Glyphicon;
import {ForceGraph, ForceGraphNode, ForceGraphLink} from 'react-vis-force';

import React from 'react';

export default class ExpensesTagsNetwork extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            arrows: [],
            nodes: [],
            loaded: false,
        }
    }

    componentDidMount(){
        $.get('/test2')
            .catch(error => {
                alert(error.statusText);
                console.error(error);
            })
            .then(responseJSON => {
                if (responseJSON.status === 'success'){

                    const data = responseJSON.data;
                    console.log(data);
                    this.setState({
                        arrows: data.arrows,
                        nodes: data.nodes,
                        loaded: true,
                    });
                }
            });
    }


    render() {

        if(this.state.loaded === false){
            return (
                <p>Loading...</p>
            );
        }


        const nodes = this.state.nodes.map(node =>
            <ForceGraphNode key={node.id} node={node} fill="red" />
        );

        let arrowIterator = 0;
        const arrows = this.state.arrows.map(arrow =>{ arrowIterator++;
            return (<ForceGraphLink key={arrowIterator} link={{ source: arrow.from, target: arrow.to}} />);

        });

        const zoomOptions = {
            minScale: 200,
            maxScale: 10000000,
        };

        const options = {
            height: 800, width: 1000,
            animate: true,
            strength: {
                collide: 8,
            }
        };

        return (
            <div className="row">
                <div className="col-xs-12">
                    <ForceGraph zoom showLabels={true} simulationOptions={options}>
                        {nodes}
                        {arrows}

                    </ForceGraph>
                </div>
            </div>
        );
    }
}