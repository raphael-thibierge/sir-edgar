import React from 'react';

import {
    FormGroup,
    FormControl,
    ListGroupItem,
    Button,
    Badge,
    Glyphicon,
    OverlayTrigger,
    Popover

} from 'react-bootstrap';


import GoalDetailsModal from './GoalDetailsModal';

/**
 *
 * React component managing goal input
 */
export default class GoalRender extends React.Component{


    deleteButtonRender(){
        return (
            <span className="text-left">
                <Button
                    onClick={typeof this.props.goal.remove === 'function' ? this.props.goal.remove: null}
                    bsSize="xs"
                    bsStyle="danger"
                ><Glyphicon glyph="trash"/></Button>
            </span>
        )
    }

    completeButtonRender(){
        return (
            <span className="text-left" style={{marginLeft : '5px'}}>
                <Button
                    onClick={typeof this.props.goal.setCompleted === 'function'
                        ? this.props.goal.setCompleted.bind(this.props.goal): null}
                    bsSize="xs"
                    bsStyle="success"
                ><Glyphicon glyph="ok"/></Button>
            </span>
        )
    }

    importantButtonRender(){
        return (
            <span className="text-left" style={{marginLeft : '5px'}}>
                <Button
                    onClick={typeof this.props.goal.setToday === 'function' ?
                        this.props.goal.setToday.bind(this.props.goal): null}
                    bsSize="xs"
                    bsStyle="warning"
                ><Glyphicon glyph="warning-sign"/></Button>
            </span>
        );
    }


    titleRender(){

        return typeof this.props.goal.updateDetails === 'function' ?
            (
                <GoalDetailsModal goal={this.props.goal}/>
            ) : (
                <a style={{marginLeft: 5}}>{this.props.goal.title}</a>
            );
    }

    notesRender(){

        const goal = this.props.goal;
        return goal.notes !== null && goal.notes !== "" ? (
            <span style={{marginLeft: 5}}>
                        <OverlayTrigger trigger={['hover', 'focus']} placement="bottom" overlay={(
                            <Popover id="popover-trigger-hover-focus" title="Notes">
                                {goal.notes}
                            </Popover>
                        )}>
                            <Glyphicon glyph="file"/>
                        </OverlayTrigger>
                    </span>
        ): null;
    }

    priorityRender(){
        const goal = this.props.goal;
        let priorityRender = "";
        if (goal.priority !== null){
            for (let i = 0; i < goal.priority; i++){
                priorityRender += "!";
            }

            priorityRender = <span className={"text-danger"} style={{marginLeft: 5}}><strong>{priorityRender}</strong></span>
        }
        return priorityRender;
    }

    dueDateRender(){
        const goal = this.props.goal;
        return typeof goal.due_date !== 'undefined' && goal.due_date !== null ? (
            <strong style={{marginLeft: 10}} className="text-right">
                <em className={
                    goal.due_date.toISOString().slice(0,10) === (new Date()).toISOString().slice(0,10)
                    || goal.due_date < new Date()
                        ? "text-danger" : ""} >
                    {goal.due_date.toISOString().slice(0,10)}
                </em>
            </strong>
        ) : null
    }

    estimatedTimeRender(){
        const goal = this.props.goal;
        return typeof goal.estimated_time !== 'undefined' && goal.estimated_time !== null && goal.estimated_time > 0 ? (
            <strong style={{marginLeft: 10}} className="text-right">
                <em className="text text-right" >
                    ~ {this.toHuman(goal.estimated_time)}
                </em>
            </strong>
        ) : null
    }

    timeSpentRender(){
        const goal = this.props.goal;
        return goal.time_spent !== null && goal.time_spent > 0 ? (
            <strong style={{marginLeft: 10}} className="text-right">
                <em className="text text-right" >
                    ... {this.toHuman(goal.time_spent)}
                </em>
            </strong>
        ) : null
    }

    toHuman(time){
        if (time === null){
            return null;
        }

        const minutes = time % 60;
        const hours = (time-minutes) / 60;

        let string = "";

        if (hours < 10) string += "0";
        string += hours.toString() + 'h';
        if (minutes < 10) string += "0";
        string += minutes.toString() ;

        return  string;

    }

    /**
     * Compute number of days difference from today
     *
     * @returns {*}
     */
    createdAtRender() {
        const goal = this.props.goal;

        if (!goal.created_at){
            return null;
        }

        const first = goal.created_at;

        const second = new Date();
        let value = Math.round((second-first)/(1000*60*60*24));

        if (value <= 0){
            return null;
        }

        return (
            <small style={{marginLeft: 10}}>
                <strong>
                    <em className={value >= 7 ? 'text-danger' : value >= 3 ? 'text-warning' : ''}>
                        ...{value}{value > 1 ? ' days' : ' day'} ago
                    </em>
                </strong>
            </small>
        );

    }

    scoreRender(){
        return (
            <Badge>{this.props.goal.score}</Badge>
        )
    }

    render() {

        const goal = this.props.goal;

        return (goal.is_completed === false) ? (
            <ListGroupItem key={goal._id} bsStyle={goal.today === true ? 'warning' : ''}>

                {this.deleteButtonRender()}
                {this.completeButtonRender()}
                {this.importantButtonRender()}
                {this.notesRender()}
                {this.priorityRender()}
                {this.titleRender()}
                {this.dueDateRender()}
                {this.estimatedTimeRender()}
                {this.createdAtRender()}
                {this.scoreRender()}

            </ListGroupItem>
        ) : (
            <ListGroupItem key={goal._id} bsStyle="success">
                {this.deleteButtonRender()}
                {this.notesRender()}
                {this.priorityRender()}
                {this.titleRender()}
                {this.timeSpentRender()}
                {this.scoreRender()}

            </ListGroupItem>
        );
    }
};