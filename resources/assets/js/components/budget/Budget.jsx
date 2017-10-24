import React from 'react';
import {ProgressBar} from 'react-bootstrap';


export default class Budget extends React.Component {
    render(){

        const progress =Math.floor((this.props.budget.total/this.props.budget.amount)*100);

        return (
            <div>
                <div className="row">
                    <div className="col-xs-4">
                        <small style={{marginLeft: 5}}>
                            Total : {this.props.budget.total} {this.props.budget.currency}
                            </small>
                    </div>
                    <div className="col-xs-4 text-center">
                        {this.props.budget.name}
                    </div>
                    <div className="col-xs-4 text-right">
                        <small style={{marginRight: 5}}
                        >Intent : {this.props.budget.amount} {this.props.budget.currency}
                        </small>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-14">
                        <ProgressBar now={progress > 100 ? 100 : progress} bsStyle={progress < 80 ? 'success' : progress < 100 ? 'warning' : 'danger'} label={`${progress}%`}/>
                    </div>
                </div>
            </div>
        );
    }

}