import React from 'react';
import ExpenseTable from './ExpenseTable';
import DayPicker from 'react-day-picker';
import Tools from '../Tools'
import CreateFinancialTransactionModal from "../financial/CreateFinancialTransactionModal";
import {Glyphicon} from 'react-bootstrap';

export default class ExpenseRoot extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            start_date: null,
            end_date: null,
            transactions: [],
        }

    }

    onSave(transaction){
        let transactions = this.state.transactions;
        transactions.push(transaction);
        this.setState({transactions: transactions});
    }

    componentDidMount(){
        $.get('/financial-transactions')
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
                        transactions: data.transactions,
                    });
                }
            });
    }

    filter(){
        return this.state.transactions.filter((expense) => {

            // expense created at
            var expense_date = Tools.dateFormater(expense.created_at);
            expense_date.setMinutes(expense_date.getMinutes() - expense_date.getTimezoneOffset());

            if (this.state.start_date !== null){
                const start = new Date(this.state.start_date);
                if ( expense_date < start){
                    return false;
                }
            }

            if (this.state.end_date !== null){

                const end = new Date(this.state.end_date);

                if ( expense_date > end){
                    return false;
                }
            }
            return true;
        });
    }

    render(){

        const transactions = this.filter();

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
                                <p><Glyphicon glyph="info-sign"/> When spending money, <strong>ask edgar on messenger</strong> to save it :</p>
                                <p><em>"Add a new expense of 10.2 CAD #lunch at #restaurant with #friends"</em></p>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-xs-12">
                            <CreateFinancialTransactionModal
                                onSave={this.onSave.bind(this)}
                            />
                        </div>
                    </div>

                    {this.state.transactions.length > 0 ? (
                        <div className="row text-center">
                            <div className="col-xs-6">
                                <DayPicker
                                    title="Start"
                                    modifiersStyles={{marginLeft: 0}}
                                    selectedDays={[this.state.start_date]}
                                    onDayClick={(day) => {this.setState({start_date: day})}}
                                    firstDayOfWeek={1}
                                    numberOfMonths={1}
                                    fixedWeeks
                                />
                            </div>

                            <div className="col-xs-6">
                                <DayPicker
                                    modifiersStyles={{marginRight: 0}}
                                    selectedDays={[this.state.end_date]}
                                    onDayClick={(day) => {this.setState({end_date: day})}}
                                    firstDayOfWeek={1}
                                    numberOfMonths={1}
                                    fixedWeeks
                                />
                            </div>

                            <ExpenseTable expenses={transactions}/>
                        </div>
                    ): null}
                </div>
            </div>
        );
    }

}
