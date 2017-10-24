import React from 'react';
import {
    FormControl, FormGroup, ControlLabel, Modal, Button, Glyphicon, Alert
} from 'react-bootstrap';

export default class BudgetCreateModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.defaultState();
    }

    defaultState(){
        return {
            display: false,
            loading: false,
            name: '',
            amount: '',
            currency : 'CAD',
            period : 'week',
            tags: '',
            error: false,
        };
    }

    onSave(){

        this.setState({
            loading: true
        });

        console.log(window.token);

        $.post('./budgets', {
            name: this.state.name,
            amount: this.state.amount,
            currency: this.state.currency,
            period: this.state.period,
            tags: this.state.tags,
            _token: window.token,
        }).catch(error => {
            this.state({
                error: true,
                loading: false,
            });
            console.error(error);
        }).then(responseJSON => {

            if (responseJSON.status === 'success') {
                // get response data
                const data = responseJSON.data;

                this.setState(this.defaultState());

                this.props.onCreate(data.budget);
            } else {
                this.setState({
                    error: true,
                    loading: false,
                });
                console.error(responseJSON);
            }
        });
    }

    hide(){
        this.setState(this.state.error ? this.defaultState() : {display: false});
    }


    render(){

        return (

            <span>
                <Button bsStyle="default" onClick={()=>{this.setState({ display: true })}}>
                    <Glyphicon glyph="plus"/>
                </Button>
                <Modal
                    aria-labelledby="contained-modal-title-lg"
                    show={this.state.display}
                    onHide={this.hide.bind(this)}
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-lg">
                            <strong>
                                Create a new budget
                            </strong>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {(this.state.loading) ? (
                            <Alert bsStyle="info">
                                Creating your budget....
                            </Alert>
                        ) : (
                            <div className="row">
                                <div className="col-xs-12">

                                {this.state.error ? (
                                    <Alert bsStyle="danger">
                                        Creating budget failed...
                                    </Alert>
                                ): null}

                                <FormGroup>
                                    <ControlLabel>Name</ControlLabel>
                                    <FormControl
                                        componentClass='input'
                                        type="text"
                                        value={this.state.name}
                                        placeholder="Name"
                                        onChange={(e) => {this.setState({ name: e.target.value })}}
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <ControlLabel>Tags to track</ControlLabel>
                                    <FormControl
                                        componentClass='input'
                                        type="text"
                                        value={this.state.tags}
                                        placeholder="tag1 tag2"
                                        onChange={(e) => {this.setState({ tags: e.target.value })}}
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <ControlLabel>Amount intent</ControlLabel>
                                    <FormControl
                                        componentClass='input'
                                        type="number"
                                        placeholder={100}
                                        min={0}
                                        value={this.state.amount}
                                        onChange={(e) => {this.setState({ amount: e.target.value })}}
                                    />
                                </FormGroup>

                                 <FormGroup controlId="formControlsSelect">
                                    <ControlLabel>Currency</ControlLabel>
                                    <FormControl
                                        componentClass="select"
                                        placeholder="select"
                                        value={this.state.currency}
                                        onChange={(e) => {this.setState({ currency: e.target.value })}}
                                    >
                                        <option value="CAD">Canadian dollar</option>
                                        <option value="€">Euro</option>
                                  </FormControl>
                                </FormGroup>

                                <FormGroup controlId="formControlsSelect">
                                    <ControlLabel>Period</ControlLabel>
                                    <FormControl
                                        componentClass="select"
                                        placeholder="select"
                                        value={this.state.period}
                                        onChange={(e) => {this.setState({ period: e.target.value })}}
                                    >
                                        <option value="week">week</option>
                                        <option value="month">month</option>
                                  </FormControl>
                                </FormGroup>
                                </div>
                            </div>
                            )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => {this.setState(this.defaultState())}}>Cancel</Button>
                        <Button bsStyle="success" onClick={this.onSave.bind(this)}>Save</Button>
                    </Modal.Footer>
                </Modal>
            </span>

        );
    }

}
