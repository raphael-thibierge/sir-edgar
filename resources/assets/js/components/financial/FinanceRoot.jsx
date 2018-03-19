import React from 'react';
import {Image, Tabs, Tab} from 'react-bootstrap';
import ExpenseRoot from "../expense/ExpenseRoot";
import BudgetRoot from "../budget/BudgetRoot";
import TagFrequencyChart from  '../expense/TagFrequencyChart';

export default class FinanceRoot extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tab: 2,
        };
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
                            <BudgetRoot />
                        </Tab>

                        <Tab eventKey={2} title="Expenses">
                            <div className="row">
                                <div className="col-xs-12">
                                    <ExpenseRoot />
                                </div>
                            </div>
                        </Tab>
                    </Tabs>
                </div>
            </div>
        );
    }
}
