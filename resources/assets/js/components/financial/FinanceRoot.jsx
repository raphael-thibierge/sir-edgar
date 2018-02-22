import React from 'react';
import {Image, Tabs, Tab} from 'react-bootstrap';
import ExpenseRoot from "../expense/ExpenseRoot";
import BudgetRoot from "../budget/BudgetRoot";

export default class FinanceRoot extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            budgets: [],
            expenses: [],
            tab: 2,
        };
    }

    componentDidMount(){

        $.get('/financial-data')
            .catch(error => {
                alert(error.statusText);
                console.error(error);
            })
            .then(responseJSON => {
                if (responseJSON.status === 'success'){
                    // get response data
                    const data = responseJSON.data;

                    this.setState({
                        loaded: true,
                        budgets: data.budgets,
                        expenses: data.expenses,
                    });
                }
            });
    }

    onBudgetCreated(budget){
        let budgets = this.state.budgets;
        budgets.push(budget);
        this.setState({
            budgets: budgets
        });
    }

    handleSelect(eventKey) {
        event.preventDefault();
        this.setState({
            tab: eventKey
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

        if (this.state.loading === false){
            return (
                <div className="row">
                    <div className="col-xs-12">
                        <Image src="/images/logo.png" rounded circle responsive thumbnail/>
                    </div>
                </div>
            );
        }

        return (
            <div className="row">
                <div className="col-xs-12">
                    <Tabs activeKey={this.state.tab} onSelect={this.handleSelect.bind(this)}  id="page-tabs" justified>
                        <Tab eventKey={1} title="Budgets">
                            <br/>
                            <BudgetRoot
                                hide
                                budgets={this.state.budgets}
                                onCreate={this.onBudgetCreated.bind(this)}
                                onDelete={this.onBudgetDeleted.bind(this)}
                                onEdit={this.onBudgetEdited.bind(this)}
                            />
                        </Tab>

                        <Tab eventKey={2} title="Expenses">
                            <div className="row">
                                <div className="col-xs-12">
                                    <ExpenseRoot
                                        expenses={this.state.expenses}
                                    />
                                </div>
                            </div>

                        </Tab>
                    </Tabs>
                </div>
            </div>

        );

    }

}
