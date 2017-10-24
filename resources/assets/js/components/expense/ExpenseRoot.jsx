import React from 'react';
import ExpenseTable from './ExpenseTable';
import DayPicker from 'react-day-picker';


export default class ExpenseRoot extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            start_date: null,
            end_date: null,
        }

    }

    componentDidMount(){

    }

    filter(){
        console.log(this.state.start_date);
        return this.props.expenses.filter((expense) => {

            // expense created at
            var expense_date = new Date(expense.created_at);
            expense_date.setMinutes(expense_date.getMinutes() - expense_date.getTimezoneOffset());

            if (this.state.start_date !== null){
                const start = new Date(this.state.start_date);
                if ( expense_date < start){
                    return false;
                }
            }

            if (this.state.end_date !== null){

                const end = new Date(this.state.end_date);

                if ( expense_date > end){
                    return false;
                }
            }
            return true;
        });
    }

    render(){

        const expenses = this.filter();

        return (
            <div className="row">
                <div className="col-xs-12">

                    {this.props.length == 0 ? (
                        <div className="alert alert-info">
                            Add your expenses with SirEdagr's messenger bot
                        </div>
                    ):(
                        <div>
                            <div className="col-xs-6">
                                <DayPicker
                                    modifiersStyles={{marginLeft: 0}}
                                    selectedDays={[this.state.start_date]}
                                    onDayClick={(day) => {this.setState({start_date: day})}}
                                    firstDayOfWeek={1}
                                    numberOfMonths={1}
                                    fixedWeeks
                                />
                            </div>

                            <div className="col-xs-6">
                                <DayPicker
                                    modifiersStyles={{marginRight: 0}}
                                    selectedDays={[this.state.end_date]}
                                    onDayClick={(day) => {this.setState({end_date: day})}}
                                    firstDayOfWeek={1}
                                    numberOfMonths={1}
                                    fixedWeeks
                                />
                            </div>

                            <ExpenseTable expenses={expenses}/>
                        </div>
                    )}
                </div>
            </div>
        );
    }

}
