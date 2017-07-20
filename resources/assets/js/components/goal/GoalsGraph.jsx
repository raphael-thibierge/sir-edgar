const React = require('react');
const Chart = require('react-google-charts').Chart;

const GoalsGraph = React.createClass({


    getInitialState(){
        return{
            data: []
        }
    },


    /**
     * Method called when component is mounted
     * Loads total score per day list in AJAX
     */
    componentDidMount: function () {
        this.request();
    },


    /**
     * AJAX request to get goals from server
     */
    request: function(){
        const request = $.ajax({
            url: './goals/score',
            cache: false,
            method: 'GET',
            success: this.onSuccess,
            error: this.onError,
        });
    },


    sameDay(date1, date2){
        return (
        date1.getDate() == date2.getDate()
            && date1.getMonth() == date2.getMonth()
            && date1.getFullYear() == date2.getFullYear()
        );
    },

    /**
     * AJAX goal loading success method that store returned goals in component state
     * @param response
     */
    onSuccess: function (response) {
        if (response.status && response.status == 'success'){

            const scores = response.data.scores;

            let data = [['Day', 'Score']];

            let date = new Date(response.data.firstDate);
            let lastDate = new Date;
            lastDate.setDate(lastDate.getDate() + 1);

            do  {

                const dateAsString = date.toISOString().slice(0,10);

                data.push([
                    dateAsString,
                    (scores[dateAsString] ? scores[dateAsString] : 0)
                ]);

                date.setDate(date.getDate() + 1);

            } while (this.sameDay(date, lastDate) == false);


            for (let i=0; i<scores.length; i++){
                const score = scores[i];
                data.push([
                    score.date,
                    score.score,
                ]);
            }


            this.setState({
                data: data
            });
        }
    },

    /**
     * alert user when an ajax request failed
     * @param response
     */
    onError: function (response) {
        alert('error');
        console.error(response);
    },


    increaseTodayScore(score){
        data = this.state.data;
        const today = (new Date).toISOString().slice(0, 10);
        if (data.length > 1){
            let value = data[data.length-1];
            value[1]= value[1] + score;
            data[data.length-1] = value;
            this.setState({
                data: data
            });
        }
    },

    deleteGoal(goal){
        console.log(goal);
        if (goal && goal.is_completed){
            let data = this.state.data;

            if (goal.completed_at){
                const goalDate = goal.completed_at.slice(0,10);
                for (let i = 0; i < data.length; i++){
                    let value = data[i];
                    if (value[0] == goalDate){
                        value[1] = value[1] - goal.score;
                        data[i] = value;
                    }
                }

                this.setState({
                    data: data
                });
            } else {
                this.increaseTodayScore(-goal.score);
            }
        }

    },

    render(){
        return (
            <div className="row">
                <div className="col-xs-12">
                    <h2>Completed goals stats</h2>
                </div>
                <div className="col-xs-12">
                    <Chart
                        chartType="ColumnChart"
                        data={this.state.data}
                        options={{}}
                        graph_id="ScatterChart"
                        width="100%"
                        height="400px"
                        legend_toggle
                    />
                </div>
            </div>

        )
    }
});

module.exports = GoalsGraph;