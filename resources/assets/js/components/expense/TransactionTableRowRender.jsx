import React from 'react';
import {Button, Glyphicon} from 'react-bootstrap';
import CreateFinancialTransactionModal from "../financial/CreateFinancialTransactionModal";
import PropTypes from 'prop-types';

export default class TransactionTableRowRender extends React.Component {
    render() {
        const transaction = this.props.transaction;
        let previousHour = new Date();
        previousHour.setHours(previousHour.getHours() -1 );
        return (
            <tr key={transaction._id}
                className={transaction.type === 'entrance' ? 'success' : transaction.updated_at > previousHour ? 'info' : null}>
                <td>{transaction.title}</td>
                <td>{transaction.price}</td>
                <td>{transaction.currency}</td>
                <td>{transaction.date.toLocaleTimeString()}</td>
                <td>
                    <CreateFinancialTransactionModal
                        expense={transaction}
                        onSave={this.props.onUpdate}
                    />
                    <Button bsSize={'xs'} bsStyle={'danger'} onClick={this.props.onDelete}>
                        <Glyphicon glyph={'trash'}/>
                    </Button>

                </td>
                <td>{Array.isArray(transaction.tags) ? transaction.tags.join(', ') : transaction.tags}</td>
            </tr>
        );
    }
}

TransactionTableRowRender.propTypes = {
    transaction: PropTypes.object.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};