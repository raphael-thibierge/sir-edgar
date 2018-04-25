import React from 'react';
import {Button, Glyphicon, Label} from 'react-bootstrap';
import CreateFinancialTransactionModal from "../financial/CreateFinancialTransactionModal";
import PropTypes from 'prop-types';

export default class TransactionTableRowRender extends React.Component {
    render() {
        const transaction = this.props.transaction;
        let previousHour = new Date();
        previousHour.setHours(previousHour.getHours() -1 );

        const verticalAlignStyle = {
            verticalAlign: 'middle'
        };

        return (
            <tr key={transaction._id}
                className={transaction.type === 'entrance' ? 'success' : transaction.updated_at > previousHour ? 'info' : null}>
                <td style={verticalAlignStyle}>{transaction.date.toLocaleTimeString()}</td>
                <td  className={'text-left'}>
                    <div>{transaction.title}</div>
                    <div>
                        {transaction.tags.map((tag) => (
                            <Label key={tag} bsStyle={'default'} style={{marginRight: 5}}>
                                {tag}
                            </Label>
                        ))}
                    </div>
                </td>
                <td style={verticalAlignStyle}>
                    {transaction.price}
                </td>
                <td style={verticalAlignStyle}>
                    {transaction.currency}
                </td>
                <td style={verticalAlignStyle}>
                    <CreateFinancialTransactionModal
                        expense={transaction}
                        onSave={this.props.onUpdate}
                    />
                    <Button bsSize={'xs'} bsStyle={'danger'} onClick={this.props.onDelete}>
                        <Glyphicon glyph={'trash'}/>
                    </Button>

                </td>
            </tr>
        );
    }
}

TransactionTableRowRender.propTypes = {
    transaction: PropTypes.object.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};