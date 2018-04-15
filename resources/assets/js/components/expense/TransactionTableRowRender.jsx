import React from 'react';
import {Button, Glyphicon} from 'react-bootstrap';
import CreateFinancialTransactionModal from "../financial/CreateFinancialTransactionModal";
import PropTypes from 'prop-types';

export default class TransactionTableRowRender extends React.Component {
    render() {
        const transaction = this.props.transaction;
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
                        onSave={this.onUpdate.bind(this)}
                    />
                    <Button bsSize={'xs'} bsStyle={'danger'} onClick={this.onDelete.bind(this, transaction)}>
                        <Glyphicon glyph={'trash'}/>
                    </Button>

                </td>
                <td>{Array.isArray(transaction.tags) ? transaction.tags.join(', ') : transaction.tags}</td>
            </tr>
        );
    }
}

TransactionTableRowRender.propTypes = {
    transaction: PropTypes.object
};