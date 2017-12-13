import React from 'react';

export const MoneyValueCard = (moneyValue) => (
    <div className="col-xs-12 col-sm-6 col-md-3">
        <table className="table" >
            <tbody>
                <tr><td>Spot price</td><td>{moneyValue.spot_price}</td></tr>
                <tr><td>Sell price</td><td>{moneyValue.sell_price}</td></tr>
                <tr><td>Buy price</td><td>{moneyValue.buy_price}</td></tr>
            </tbody>
        </table>
    </div>
);

