import React from 'react';
import {} from 'react-bootstrap';
import CreateFinancialTransactionModal from "../financial/CreateFinancialTransactionModal";
import Tools from '../Tools';

export default class ExpenseTable extends React.Component {

    onUpdate(transaction){
        if (typeof this.props.onUpdate === 'function'){
            this.props.onUpdate(transaction);
        }
    }

    render(){

        let expensesRended = [];


        let previous = null;
        this.props.expenses.reverse().forEach((expense) => {

            let date = Tools.dateFormater(expense.created_at);

            if (previous === null || date.toLocaleDateString() !== previous.toLocaleDateString()){

                console.log(date);
                expensesRended.push(
                    <tr key={date.toTimeString()} className="active">
                        <td colSpan={3}>
                            <h4>
                                {Tools.getDaysOfWeek()[date.getDay()]}
                                {',  the '}
                                {Tools.getDaySuffix(date)}
                            </h4></td>
                        <td colSpan={2}></td>
                        <td>
                            <h4>
                                {Tools.getMonthsOfYear()[date.getMonth()]}
                                {' '}
                                {date.getFullYear()}
                            </h4>
                        </td>
                    </tr>
                );

                previous = date;
            }

            expensesRended.push(
                <tr key={expense._id} className={expense.type === 'entrance' ? 'success' : null}>
                    <td>{expense.title}</td>
                    <td>{expense.price}</td>
                    <td>{expense.currency}</td>
                    <td>{Tools.dateFormatWithOffset(expense.created_at).toLocaleTimeString()}</td>
                    <td>
                        <CreateFinancialTransactionModal
                            expense={expense}
                            onSave={this.onUpdate.bind(this)}
                        />
                    </td>
                    <td>{Array.isArray(expense.tags) ? expense.tags.join(', ') : expense.tags}</td>
                </tr>
            );
        });


        return (
            <div className="row">
                <div className="col-xs-12">
                    <div className="table-responsive">
                        <table className="table">
                            <tbody>
                                {expensesRended}
                                <tr><td colSpan={6}></td></tr>
                                <tr>
                                    <td>{this.props.expenses.totalTransactions()}</td>
                                    <td colSpan={5}> Total</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

}
