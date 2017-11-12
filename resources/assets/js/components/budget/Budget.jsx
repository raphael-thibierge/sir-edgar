import React from 'react';
import {ProgressBar} from 'react-bootstrap';
import BudgetEditModal from './BudgetEditModal'

export default class Budget extends React.Component {
    render(){

        const progress =Math.floor((this.props.budget.total/this.props.budget.amount)*100);

        return (
            <div>
                <div className="row">
                    <div className="col-xs-4">
                        <span style={{marginLeft: 5}}>
                            {this.props.budget.total}
                            <small> {this.props.budget.currency}</small>
                        </span>
                    </div>
                    <div className="col-xs-4 text-center">
                        <BudgetEditModal
                            budget={this.props.budget}
                            onDelete={this.props.onDelete}
                            onEdit={this.props.onEdit}
                        />
                        <small> /{this.props.budget.period}</small>
                    </div>
                    <div className="col-xs-4 text-right">
                        <span style={{marginRight: 5}}>
                            {this.props.budget.amount}
                            <small> {this.props.budget.currency}</small>
                        </span>
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