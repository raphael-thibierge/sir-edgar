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
            tab: 1,
        };
    }

    componentDidMount(){

        $.get('/financial-data')
            .catch(error => {
                alert('Failed to load app...');
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

    onBudgetCreate(budget){
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
                                onCreate={this.onBudgetCreate.bind(this)}
                            />
                        </Tab>

                        <Tab eventKey={2} title="Expenses">
                            <br/>
                            <ExpenseRoot
                                expenses={this.state.expenses}
                            />
                        </Tab>
                    </Tabs>
                </div>
            </div>

        );

    }

}
