const React = require('react');
const FormControl = require('react-bootstrap').FormControl;
const FormGroup = require('react-bootstrap').FormGroup;
const ControlLabel = require('react-bootstrap').ControlLabel;
const HelpBlock = require('react-bootstrap').HelpBlock;
const Button = require('react-bootstrap').Button;
const Modal = require('react-bootstrap').Modal;
const Glyphicon = require('react-bootstrap').Glyphicon;
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

        console.log(this.props.goal);

        this.setState({
            due_date: new Date(this.props.goal.due_date),
            estimated_time: this.props.goal.estimated_time,
            time_spent: this.props.goal.time_spent,
            priority: this.props.goal.priority,
            notes: this.props.goal.notes,
        })

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
            <Button bsStyle="default" bsSize="xs" onClick={()=>{this.setState({ display: true })}}>
                <Glyphicon glyph="cog"/>
            </Button>
            <Modal
                bsSize="medium"
                aria-labelledby="contained-modal-title-lg"
                show={this.state.display}
                onHide={()=> {this.setState({display: false})}}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-lg">
                        <strong>
                            {this.props.goal.title}
                        </strong>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <FormGroup>
                        <ControlLabel>Due Date</ControlLabel><br/>
                        <DayPicker
                            selectedDays={[this.state.due_date]}
                            onDayClick={(day) => {this.setState({due_date: day})}}
                        />
                    </FormGroup>

                    <FormGroup>
                        <ControlLabel>Estimed time (min) to complete goal</ControlLabel>
                        <FormControl
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
                        <ControlLabel>Time (min) spent to complete goal</ControlLabel>
                        <FormControl
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
                        <ControlLabel>Priority</ControlLabel>
                        <FormControl
                            componentClass='input'
                            type="number"
                            value={this.state.priority}
                            min={0}
                            max={5}
                            placeholder=""
                            onChange={(e) => {this.setState({ priority: e.target.value })}}
                            onKeyPress={this.handleKeyPress}
                        />
                    </FormGroup>

                    <FormGroup>
                        <ControlLabel>Notes</ControlLabel>
                        <FormControl
                            componentClass="textarea"
                            placeholder="textarea"
                            onChange={(e) => {this.setState({ notes: e.target.value })}}
                            value={this.state.notes}
                        />
                    </FormGroup>


                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={()=> {this.setState({display: false})}}>Cancel</Button>
                    <Button bsStyle="success" onClick={this.onSave}>Save</Button>
                </Modal.Footer>
            </Modal>
            </span>
        )
    }
});

module.exports = GoalsDetailsModal;