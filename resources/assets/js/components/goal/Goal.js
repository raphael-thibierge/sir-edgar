import Tools from '../Tools';

export default class Goal {

    constructor(goal = null){

        this._id=null;
        this.title='';
        this.score=1;
        this.completed_at=null;
        this.is_completed=false;
        this.routes=null;
        this.today=false;

        this.due_date=null;
        this.estimated_time=null;
        this.time_spent=null;
        this.priority=null;
        this.notes=null;

        if (goal !== null){
            this.fillData(goal);
        }
    }

    fillData(goalData){
        const TIMEZONE_OFFSET = new Date().getTimezoneOffset();

        const MS_PER_MINUTES = 60000;

        Object.keys(goalData).forEach((key) => {

            if (key === 'due_date' || key === 'created_at' || key === 'completed_at'){

                const value = goalData[key];
                if (typeof value !== "undefined" && value !== null){
                    this[key] = new Date (Tools.dateFormater(value) - TIMEZONE_OFFSET*MS_PER_MINUTES);
                }


            } else {
                this[key] = goalData[key];
            }
        });
    }

    sendUpdate(){

    }

    updateView(){
        if (typeof this.forceUpdate === 'function'){
            this.forceUpdate();
        }
    }

    setCompleted(){
        const request = $.ajax({
            url: this.routes.complete,
            cache: false,
            method: 'POST',
            data: {
                _token: window.token,
            },
            // when server return success
            success: function (response) {
                // check status
                if (response.status && response.status === 'success'){
                    this.is_completed = true;
                    this.updateView();
                } else {
                    this.onError(response);
                }
            }.bind(this), // bind is used to call method in this component
            error: this.onError,
        });
    }

    setToday(){
        const request = $.ajax({
            url: this.routes.set_today,
            cache: false,
            method: 'POST',
            data: {
                today: !this.today,
                _token: window.token,
            },
            // when server return success
            success: function (response) {
                console.log('today success');
                console.log(response);
                // check status
                if (response.status && response.status === 'success'){
                    this.today = !this.today;
                    this.updateView();
                } else {
                    this.onError(response);
                }
            }.bind(this), // bind is used to call method in this component
            error: this.onError,
        });
    }

    onError(response) {
        alert(error.statusText);
        console.error(response);
    }

    update(title, score){

        if (title == ""){
            alert("Goal's title can't be empty !");
            return;
        }

        const request = $.ajax({
            url: this.routes.update,
            cache: false,
            method: 'POST',
            data: {
                title: title,
                score: score,
                token: window.token,
                method: 'PATCH',
                _method: 'PATCH',
                _token: window.token,

            },
            // when server return success
            success: function (response) {
                // check status
                if (response.status && response.status === 'success'){
                    this.title = title;
                    this.score = score;
                    this.updateView();
                } else {
                    this.onError(response);
                }
            }.bind(this), // bind is used to call method in this component
            error: this.onError,
        });

    }

    updateDetails(title, score, due_date, estimated_time, time_spent, priority, notes){

        const request = $.ajax({
            url: this.routes.update_details,
            cache: false,
            method: 'POST',
            data: {
                token: window.token,
                method: 'PATCH',
                _method: 'PATCH',
                _token: window.token,
                due_date: due_date,
                estimated_time: estimated_time,
                time_spent: time_spent,
                priority: priority,
                notes: notes,
                title: title,
                score: score,

            },
            // when server return success
            success: function (response) {
                // check status
                if (response.status && response.status === 'success'){
                    this.due_date = due_date;
                    this.estimated_time = estimated_time;
                    this.time_spent = time_spent;
                    this.priority = priority;
                    this.notes = notes;
                    this.title = title;
                    this.score = score;

                    this.updateView();
                } else {
                    this.onError(response);
                }
            }.bind(this), // bind is used to call method in this component
            error: this.onError,
        });

    }

};