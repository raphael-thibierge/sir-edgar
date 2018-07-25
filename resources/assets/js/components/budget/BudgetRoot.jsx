import React from 'react';
import {PanelGroup, Glyphicon} from 'react-bootstrap';
import Budget from './Budget';
import BudgetModal from './BudgetModal';
import axios from 'axios';

export default class BudgetRoot extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            display: false,
            loaded: false,
            budgets: [],
        }
    }

    componentDidMount(){
        axios.get('/budgets')
            .then(response => response.data)
            .then(responseJSON => {
                if (responseJSON.status === 'success'){
                    // get response data
                    const data = responseJSON.data;

                    this.setState({
                        loaded: true,
                        budgets: data.budgets,
                    });
                }
            })
            .catch(error => {
                alert(error.statusText);
                console.error('Fail to load financial data ');
            });
    }

    onBudgetCreated(budget){
        let budgets = this.state.budgets;
        budgets.push(budget);
        this.setState({
            budgets: budgets
        });
    }

    onBudgetDeleted(budgetId){

        let budgets = [];

        this.state.budgets.forEach((budget) => {
            if (budget._id !== budgetId){
                budgets.push(budget);
            }
        });

        this.setState({
            budgets: budgets
        });

    }

    onBudgetEdited(budgetEdited){

        let budgets = [];

        this.state.budgets.forEach((budget) => {
            if (budget._id === budgetEdited._id){
                budgets.push(budgetEdited);
            } else {
                budgets.push(budget);
            }
        });

        this.setState({
            budgets: budgets
        });

    }

    render(){
        return (
            <div className="row">
                <div className="col-xs-12">

                    <div className="row">
                        <div className="col-xs-12">
                            <h1 className="page-header finance-page-header">Budgets</h1>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-xs-12">
                            <BudgetModal onCreate={this.onBudgetCreated.bind(this)}/>
                        </div>
                    </div>
                    <br/>
                    <div className="row">
                        <div className="col-xs-12">
                            <PanelGroup>
                            {this.state.budgets.map((budget) => (
                                <Budget
                                    key={budget._id}
                                    budget={budget}
                                    onDelete={this.onBudgetDeleted.bind(this)}
                                    onEdit={this.onBudgetEdited.bind(this)}
                                />
                            ))}
                            </PanelGroup>
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
                </div>
            </div>
        );
    }
}