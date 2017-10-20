const React = require('react');
const Input = require('reactstrap').Input;
const FormGroup = require('reactstrap').FormGroup;
const Label = require('reactstrap').Label;
const Button = require('reactstrap').Button;
const Modal = require('reactstrap').Modal;
const ModalHeader = require('reactstrap').ModalHeader;
const ModalBody = require('reactstrap').ModalBody;
const ModalFooter = require('reactstrap').ModalFooter;
const DayPicker = require('react-day-picker');
const DateUtils = require('react-day-picker').DateUtils;

/**
 * React component managing goal input
 */
const GoalsDetailsModal = React.createClass({

    /**
     * Define required component's properties
     */
    propTypes: {
        /**
         * Method to call when the new goal has been send to server successfully
         */
        goal: React.PropTypes.object.isRequired,
    },

    /**
     * Return component initial state
     * Called when mounting component
     *
     * @returns {{title: string, score: number}}
     */
    getInitialState() {
        return {
            display: false,
            due_date: null,
            estimated_time:null,
            time_spent:null,
            priority:null,
            notes: null,

        };
    },

    componentDidMount(){

        const goal = this.props.goal;

        const diff = Math.floor((new Date() - goal.created_at ) / 1000);

        this.setState({
            due_date: goal.due_date !== null ? new Date(goal.due_date) : null,
            estimated_time: goal.estimated_time,
            time_spent: goal.time_spent,
            priority: goal.priority,
            notes: goal.notes,
            display: diff < 3,
        })

    },

    /**
     * Called when the user hit a keyboard key in input
     *
     * @param target
     */
    handleKeyPress: function(target) {
        // when pressing enter key
        if(target.charCode===13){
            this.onSave();
        }
    },

    onSave(){
        this.props.goal.updateDetails(
            this.state.due_date,
            this.state.estimated_time,
            this.state.time_spent,
            this.state.priority,
            this.state.notes
        );

        this.setState({
            display: false
        });
    },


    handleDayClick(day) {
        const range = DateUtils.addDayToRange(day, this.state);
        this.setState(range);
    },


    /**
     * Render component's HTML code
     *
     * @returns {XML}
     */
    render() {


        const from = this.state.from;
        const to = this.state.to;

        return (
            <span className="text-left" style={{marginLeft : '5px', marginRight:'10px'}} >
            <Button color="default" size="sm" onClick={()=>{this.setState({ display: true })}}>
                D
            </Button>
            <Modal
                size="lg"
                aria-labelledby="contained-modal-title-lg"
                isOpen={this.state.display}
                toggle={()=> {this.setState({display: !this.state.display})}}
            >
                <ModalHeader toggle={()=> {this.setState({display: !this.state.display})}}>
                    <strong>
                        {this.props.goal.title}
                    </strong>
                </ModalHeader>
                <ModalBody>

                    <FormGroup>
                        <Label>Due Date</Label><br/>
                        <DayPicker
                            selectedDays={[this.state.due_date]}
                            onDayClick={(day) => {this.setState({due_date: day})}}
                            firstDayOfWeek={1}
                            numberOfMonths={2}
                            fixedWeeks
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label>Estimed time (min) to complete goal</Label>
                        <Input
                            componentClass='input'
                            type="number"
                            min={0}
                            value={this.state.estimated_time}
                            placeholder=""
                            onChange={(e) => {this.setState({ estimated_time: e.target.value })}}
                            onKeyPress={this.handleKeyPress}
                         />
                    </FormGroup>

                    <FormGroup>
                        <Label>Time (min) spent to complete goal</Label>
                        <Input
                            componentClass='input'
                            type="number"
                            min={0}
                            value={this.state.time_spent}
                            placeholder=""
                            onChange={(e) => {this.setState({ time_spent: e.target.value })}}
                            onKeyPress={this.handleKeyPress}
                        />
                    </FormGroup>

                     <FormGroup>
                        <Label>Priority</Label>
                        <Input
                            componentClass='input'
                            type="number"
                            value={this.state.priority}
                            min={0}
                            max={3}
                            placeholder=""
                            onChange={(e) => {this.setState({ priority: e.target.value })}}
                            onKeyPress={this.handleKeyPress}
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label>Notes</Label>
                        <Input
                            componentClass="textarea"
                            placeholder="textarea"
                            onChange={(e) => {this.setState({ notes: e.target.value })}}
                            value={this.state.notes}
                        />
                    </FormGroup>


                </ModalBody>
                <ModalFooter>
                    <Button onClick={()=> {this.setState({display: false})}}>Cancel</Button>
                    <Button color="success" onClick={this.onSave}>Save</Button>
                </ModalFooter>
            </Modal>
            </span>
        )
    }
});

module.exports = GoalsDetailsModal;