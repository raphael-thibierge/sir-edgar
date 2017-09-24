class Goal {

    constructor(goal = null){

        this._id=null;
        this.title='';
        this.score=1;
        this.completed_at=null;
        this.is_completed=false;
        this.routes=null;
        this.today=false;

        if (goal !== null){
            this.fillData(goal);
        }
    }

    fillData(goalData){
        Object.keys(goalData).forEach((key) => {
            this[key] = goalData[key];
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
                today: !this.today
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
        alert('error');
        console.error(response);
        console.error(response.responseText);
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


};

module.exports = Goal;