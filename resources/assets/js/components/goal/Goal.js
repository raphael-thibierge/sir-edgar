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

};