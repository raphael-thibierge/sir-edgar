const React = require('react');
const ProgressBar = require('react-bootstrap').ProgressBar;
const AjaxEditableValue = require('../generic/AjaxEditableValue.jsx');

const ScoreGoal = React.createClass({

    getInitialState: function(){
        return {
            score: 0,
            scoreGoal: 1,
        }
    },

    componentDidMount: function(){
        this.request();

        // reset score at 00:00:00
        const now = new Date();
        const nextDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()+1, 0, 0, 0, 0);
        const millisTill10 =  nextDate - now;
        setTimeout(this.setState.bind(this, {score: 0}), millisTill10);
    },


    /**
     * AJAX request to get goals from server
     */
    request: function(){
        const request = $.ajax({
            url: './goals/current-score',
            cache: false,
            method: 'GET',
            success: (response) => {

                if (response && response.status === 'success'){
                    this.setState({
                        score: response.data.score,
                        scoreGoal: response.data.daily_score_goal,
                    })
                }

            },
            error: (error) => {console.error(error.message); alert(error)},
        });
    },


    render: function(){

        const progressValue = Math.floor((this.state.score / this.state.scoreGoal) * 100 );

        const barValue = progressValue < 3 ?  3 : progressValue > 100 ? 100 : progressValue;

        const color = progressValue >= 100 ? "success" : "primary";

        return (
            <div>
                <div className="row">
                    <div className="col-xs-6 col-xs-offset-6 text-right">
                        <small style={{marginRight: 5}}>Score goal : </small>
                        <span>

                        <AjaxEditableValue
                            value={this.state.scoreGoal.toString()}
                            ajaxURI="./user/update-daily-score-goal"
                            onSuccess={(newScore) => {this.setState({scoreGoal: newScore})}}
                            inputName="daily_score_goal"
                            type="number"
                            classNameLink="text-right"
                        ></AjaxEditableValue>
                        </span>
                    </div>
                </div>

                <div className="row">
                    <div className="col-xs-12">
                        <ProgressBar now={barValue} bsStyle={color} label={`${progressValue}%`}/>
                    </div>
                </div>
            </div>
        )

    }
});

module.exports = ScoreGoal;