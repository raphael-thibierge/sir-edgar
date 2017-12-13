import React from 'react';
import {} from 'react-bootstrap';

export default class ExpenseTable extends React.Component {

    render(){
        return (
            <div className="raw">
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
                                </tr>
                            </thead>
                            <tbody>
                                {this.props.expenses.reverse().map((expense) => (
                                    <tr key={expense._id}>
                                        <td>{expense.price}</td>
                                        <td>{expense.currency}</td>
                                        <td>{expense.title}</td>
                                        <td>{Array.isArray(expense.tags) ? expense.tags.join(', ') : expense.tags}</td>
                                        <td>{expense.created_at}</td>
                                    </tr>
                                ))}
                                <tr><td colSpan={5}></td></tr>
                                <tr>
                                    <td>{this.props.expenses.sum('price')}</td>
                                    <td colSpan="4"> Total</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

}
