import React from 'react';
import {PanelGroup, Glyphicon} from 'react-bootstrap';
import Budget from './Budget';
import BudgetCreateModal from './BudgetCreateModal';

export default class BudgetRoot extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            display: false,
        }
    }

    render(){
        return (
            <div className="row">
                <div className="col-xs-12">

                    <div className="row">
                        <div className="col-xs-12">
                            <h1 className="page-header finance-page-header">Expenses</h1>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-xs-12">
                            <div className="alert alert-info">
                                <p>
                                    <Glyphicon glyph="info-sign"/> <strong>Track your budgets</strong>,
                                    <ul>
                                        <li>Use #tags in your expense name</li>
                                        <li>Create budget with one or many tags</li>
                                        <li>No tags in budget will consider all expenses</li>
                                    </ul>
                                </p>
                                <p>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-xs-12">
                            <BudgetCreateModal onCreate={this.props.onCreate}/>
                        </div>
                    </div>
                    <br/>
                    <div className="row">
                        <div className="col-xs-12">
                            <PanelGroup>
                            {this.props.budgets.map((budget) => (
                                <Budget
                                    key={budget._id}
                                    budget={budget}
                                    onDelete={this.props.onDelete}
                                    onEdit={this.props.onEdit}
                                />
                            ))}
                            </PanelGroup>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}
