import React from 'react';
import {Button, Glyphicon} from 'react-bootstrap';
import CreateFinancialTransactionModal from "../financial/CreateFinancialTransactionModal";
import Tools from '../Tools';

export default class ExpenseTable extends React.Component {

    onUpdate(transaction){
        if (typeof this.props.onUpdate === 'function'){
            this.props.onUpdate(transaction);
        }
    }

    onDelete(transaction){
        if (typeof this.props.onDelete === 'function'){
            this.props.onDelete(transaction);
        }
    }

    dateLineRender(date, total){

        const style = {
            //borderTop: '30px solid transparent',
            //backgroundClip: 'padding-box'
        };

        return (
            <tr key={date.toISOString()} className="active" style={style}>
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

        let previousHour = new Date();
        previousHour.setHours(previousHour.getHours() -1 );

        this.props.expenses.forEach((expense) => {
            let date = expense.date;

            if (previous === null){
                previous = date;
            }

            if (date.toLocaleDateString() !== previous.toLocaleDateString()){

                expensesRended.push(this.dateLineRender(previous, total));

                // reset daily total expense
                previous = date;
                total = 0;
            }

            if (expense.type === 'expense'){
                total -= expense.price;
            } else {
                total += expense.price;
            }

            expensesRended.push(
                <tr key={expense._id} className={expense.type === 'entrance' ? 'success' : expense.updated_at > previousHour ? 'info' :  null}>
                    <td>{expense.title}</td>
                    <td>{expense.price}</td>
                    <td>{expense.currency}</td>
                    <td>{expense.date.toLocaleTimeString()}</td>
                    <td>
                        <CreateFinancialTransactionModal
                            expense={expense}
                            onSave={this.onUpdate.bind(this)}
                        />
                        <Button bsSize={'xs'} bsStyle={'danger'} onClick={this.onDelete.bind(this, expense)}>
                            <Glyphicon glyph={'trash'}/>
                        </Button>

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
