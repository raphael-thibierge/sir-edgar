import React from 'react';
import {} from 'react-bootstrap';
import CreateFinancialTransactionModal from "../financial/CreateFinancialTransactionModal";

export default class ExpenseTable extends React.Component {

    onUpdate(transaction){
        if (typeof this.props.onUpdate === 'function'){
            this.props.onUpdate(transaction);
        }
    }


    render(){

        console.log(this.props.expenses);

        return (
            <div className="row">
                <div className="col-xs-12">
                    <div className="table-responsive">
                        <table className="table table-bordered table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>Price</th>
                                    <th>Currency</th>
                                    <th>Title</th>
                                    <th>Tags</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.props.expenses.reverse().map((expense) => (
                                    <tr key={expense._id} className={expense.type === 'entrance' ? 'success' : null}>
                                        <td>{expense.price}</td>
                                        <td>{expense.currency}</td>
                                        <td>{expense.title}</td>
                                        <td>{Array.isArray(expense.tags) ? expense.tags.join(', ') : expense.tags}</td>
                                        <td>{expense.created_at}</td>
                                        <td>
                                            <CreateFinancialTransactionModal
                                                expense={expense}
                                                onSave={this.onUpdate.bind(this)}
                                            />
                                        </td>
                                    </tr>
                                ))}
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
