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
        this.completed_at=null;

        if (goal !== null){
            this.fillData(goal);
        }
    }

    fillData(goalData){
        Object.keys(goalData).forEach((key) => {

            if (key === 'due_date' || key === 'created_at' || key === 'completed_at'){

                const value = goalData[key];
                if (typeof value !== "undefined" && value !== null){
                    this[key] = Tools.dateFormatWithOffset(value);
                }

            } else {
                this[key] = goalData[key];
            }
        });
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
                    this.completed_at = Tools.dateFormatWithOffset(response.data.goal.completed_at);
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
                    this.today = response.data.goal.today;
                    this.updateView();
                } else {
                    this.onError(response);
                }
            }.bind(this), // bind is used to call method in this component
            error: this.onError,
        });
    }

    onError(error) {
        alert(error.statusText);
        console.error(error);
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

    updateDetails(title, score, due_date, estimated_time, time_spent, priority, notes, today, completed_at){

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
                today: today,
                completed_at: completed_at,

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
                    this.today = today;
                    this.completed_at = completed_at;
                    this.is_completed = completed_at !== null;

                    this.updateView();
                } else {
                    this.onError(response);
                }
            }.bind(this), // bind is used to call method in this component
            error: this.onError,
        });

    }

};