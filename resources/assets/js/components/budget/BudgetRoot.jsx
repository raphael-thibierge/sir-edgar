import React from 'react';
import {} from 'react-bootstrap';
import Budget from './Budget';
import BudgetCreateModal from './BudgetCreateModal';

export default class BudgetRoot extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            display: false,
        }
    }

    render(){
        return (
            <div className="row">
                <div className="col-xs-12">
                    <div className="row">
                        <div className="col-xs-12">
                            <BudgetCreateModal onCreate={this.props.onCreate}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12">
                            {this.props.budgets.map((budget) => (
                                <Budget key={budget._id} budget={budget} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}
