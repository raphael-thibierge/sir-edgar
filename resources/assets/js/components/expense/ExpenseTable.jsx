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

    dateLineRender(date, total){

        const style = {
            borderTop: '50px solid transparent',
            backgroundClip: 'padding-box'
        };

        return (
            <tr key={date.toTimeString()} className="active" style={style}>
                <td >
                    <h4>
                        {Tools.getDaysOfWeek()[date.getDay()]}
                        {',  the '}
                        {Tools.getDaySuffix(date)}
                    </h4></td>
                <td><h4>{Math.round(total*100)/100}</h4></td>
                <td><h4>CAD</h4></td>
                <td></td>
                <td colSpan={2}>
                    <h4>
                        {Tools.getMonthsOfYear()[date.getMonth()]}
                        {' '}
                        {date.getFullYear()}
                    </h4>
                </td>
            </tr>
        );
    }

    render(){

        let expensesRended = [];


        let previous = null;
        let total  = 0;

        this.props.expenses.forEach((expense) => {
            let date = Tools.dateFormater(expense.date);
            console.log(date);

            if (previous === null){
                previous = date;
            }

            if (expense.type === 'expense'){
                total -= expense.price;
            } else {
                total += expense.price;
            }

            if (date.toLocaleDateString() !== previous.toLocaleDateString()){

                expensesRended.push(this.dateLineRender(previous, total));

                // reset daily total expense
                previous = date;
                total = 0;
            }


            expensesRended.push(
                <tr key={expense._id} className={expense.type === 'entrance' ? 'success' : null}>
                    <td>{expense.title}</td>
                    <td>{expense.price}</td>
                    <td>{expense.currency}</td>
                    <td>{Tools.dateFormater(expense.date).toLocaleTimeString()}</td>
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

        if (this.props.expenses.length > 0){
            expensesRended.push(this.dateLineRender(previous, total));
        }

        return (
            <div className="row">
                <div className="col-xs-12">
                    <div className="table-responsive">
                        <table className="table">
                            <tbody>
                                {expensesRended.reverse()}
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
