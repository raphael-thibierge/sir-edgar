import React from 'react';
import {ProgressBar, Panel} from 'react-bootstrap';
import BudgetEditModal from './BudgetEditModal'

export default class Budget extends React.Component {
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

        console.log('--');
        console.log('expected:' + progressExpected);
        console.log('progress:' + progress);
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
                    <div className="col-xs-12">
                        {progressBar}
                    </div>
                </div>
            </Panel>
        );
    }

}