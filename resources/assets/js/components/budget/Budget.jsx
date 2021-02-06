import React from 'react';
import {ProgressBar, Panel} from 'react-bootstrap';
import BudgetModal from './BudgetModal'
import Tools from '../Tools';
import TagFrequencyChartAjax from '../expense/TagFrequencyChartAjax';

export default class Budget extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            showExpenses: false,
        }
    }

    render(){

        const progress = Math.floor((this.props.budget.total/this.props.budget.amount)*100);


        const today = new Date();

        let days = 1;
        let nbDays = 1;
        if (this.props.budget.period === 'week'){
            days = 7;
            nbDays = today.getDay() > 0 ? today.getDay() : 7;

        } else {
            days = today.monthDays();
            nbDays = today.getDate();
        }
        const expensePerDayExpected = this.props.budget.amount / days;
        const expenseExpected = nbDays * expensePerDayExpected;
        const progressExpected = Math.floor((expenseExpected/this.props.budget.amount)*100);

        let progressBar = null;
        if (progressExpected < progress){
            const value = progress - progressExpected;
            let now;

            if (progress >= 100){
                now = 100 - progressExpected
            } else {
                now = progress - progressExpected;
            }

            progressBar = progressExpected < 100 ?
                (
                    <ProgressBar>
                        <ProgressBar key={1} striped active now={progressExpected > 100 ? 100 : progressExpected} bsStyle="warning" label={`${progressExpected}%`}/>
                        <ProgressBar key={2} striped active now={now < 4 ? 4 : now} bsStyle="danger" label={`${progress}%`} />
                    </ProgressBar>
                ): (
                    <ProgressBar key={2} striped active now={100} bsStyle="danger" label={`${progress}%`} />
                )

        } else if (progressExpected > progress){
            const diff = progressExpected-progress;
            progressBar = (
                <ProgressBar>
                    <ProgressBar key={2} striped active now={progress} bsStyle="success" label={`${progress}%`} />
                    <ProgressBar key={1} now={diff < 4 ? 4 : diff } bsStyle="info" label={`${progressExpected}%`}/>
                </ProgressBar>
            );
        } else {
            progressBar = (
                <ProgressBar>
                    <ProgressBar key={2} striped active now={progress < 4 ? 4 : progress} bsStyle="warning" label={`${progress}%`} />
                </ProgressBar>
            );
        }

        return (
            <Panel>
                <div className="row">

                    <div className="col-xs-4">
                        <span style={{marginLeft: 5}}>
                            {Math.round(this.props.budget.total*100)/100}
                            <small> {this.props.budget.currency}</small>
                        </span>
                    </div>
                    <div className="col-xs-4 text-center">
                        <BudgetModal
                            budget={this.props.budget}
                            onDelete={this.props.onDelete}
                            onUpdate={this.props.onEdit}
                        />
                        <small> /{this.props.budget.period}</small>
                    </div>
                    <div className="col-xs-4 text-right">
                        <span style={{marginRight: 5}}>
                            {Math.floor(this.props.budget.amount*100/100)}
                            <small> {this.props.budget.currency}</small>
                        </span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        {progressBar}
                    </div>
                </div>

                <div className="row">
                    <div className="col-xs-12">
                        <TagFrequencyChartAjax
                            tags={Array.isArray(this.props.budget.tags) ?
                                this.props.budget.tags.join(' ') : this.props.budget.tags }
                            height={'110px'}
                        />
                    </div>
                </div>

                {this.props.budget.expenses.length >0 ?
                <div className="row">
                    <div className="col-xs-12">
                        <a onClick={this.setState.bind(this, {showExpenses: !this.state.showExpenses})}>
                            {this.state.showExpenses ?
                                'Hide expenses...' :
                                'Show expenses...'
                            }
                        </a>
                        {this.state.showExpenses ?
                        <ul>
                            {this.props.budget.expenses.map(expense => (
                                <li>
                                    {Tools.dateFormatWithOffset(expense.date).toLocaleDateString()} : {' '}
                                    {expense.title}, {expense.price} {expense.currency}
                                </li>
                            ))}
                        </ul>
                        : null}
                    </div>

                </div>
                : null}
            </Panel>
        );
    }

}