import React from 'react';
import {FormControl, FormGroup, ControlLabel, Button, Modal, Glyphicon, Badge } from 'react-bootstrap';
import Datetime from 'react-datetime';

/**
 * React component managing goal input
 */
export default class CreateFinancialTransactionModal extends React.Component{

    constructor(props){
        super(props);
        this.state = this.getInitialState();

    }

    /**
     * Return component initial state
     * Called when mounting component
     *
     * @returns {{title: string, score: number}}
     */
    getInitialState() {

        const date = new Date();
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);

        return {
            _id: null,
            display: false,
            title: null,
            description: null,
            type: 'expense',
            tags: null,
            currency: 'CAD',
            price: 0.0,
            created_at: date,

        };
    }

    componentDidMount(){
        if (this.expenseExists()){
            const expense = this.props.expense;
            this.setState({
                _id: expense._id,
                test: true,
                title: expense.title,
                description: expense.description ? expense.description : '',
                type: expense.type,
                tags: Array.isArray(expense.tags) ? expense.tags.join(' ') : '',
                currency: expense.currency,
                price: expense.price,
                created_at: expense.created_at,
            });
        }
    }

    /**
     * Called when the user hit a keyboard key in input
     *
     * @param target
     */
    handleKeyPress(target) {
        // when pressing enter key
        if(target.charCode===13){
            this.onSave();
        }
    }

    onError(err){
        console.error(err.responseJSON);
        alert('Saving transaction failed !')
    }

    expenseExists(){
        return typeof this.props.expense !== 'undefined';
    }

    onSave(){


        const tags = this.state.tags !== null && this.state.tags !== '' ?
            this.state.tags.split(' ').filter(tag => tag !== null && tag !== '' && tag !== ' ') : null;
        const data = {
            _method: this.expenseExists() ? 'PUT' : 'POST',
            _token: window._token,
            title: this.state.title,
            description: this.state.description !== '' ? this.state.description : null,
            type: this.state.type,
            currency: this.state.currency,
            price: this.state.price,
            tags: tags,
            created_at: this.state.created_at,
        };


        const uri = '/financial-transactions' + (this.expenseExists() ? ('/' + this.state._id) : '' );

        const request = $.ajax({
            url: uri,
            cache: false,
            method: 'POST',
            data: data,
            // when server return success
            success: function (response) {
                // check status
                if (response.status && response.status === 'success'){

                    if (typeof this.props.onSave === 'function'){
                        this.props.onSave(response.data.transaction)
                    }

                    if (this.expenseExists()){
                        this.setState({display: false});
                    } else {
                        this.setState(this.getInitialState());
                    }

                } else {
                    this.onError(response);
                }
            }.bind(this), // bind is used to call method in this component
            error: this.onError.bind(this),
        });

    }



    /**
     * Render component's HTML code
     *
     * @returns {XML}
     */
    render() {


        return (
            <span className="text-left" style={{marginLeft : '5px', marginRight:'10px'}} >
                {!this.expenseExists() ?
                    <Button onClick={() => {this.setState({display: true})}}>
                        New transaction
                    </Button>
                    :
                    <Button bsSize={'xs'} onClick={() => {this.setState({display: true})}}>
                        <Glyphicon glyph={'pencil'}/>
                    </Button>
                }
                <Modal
                    aria-labelledby="contained-modal-title-lg"
                    show={this.state.display}
                    onHide={()=> {this.setState({display: false})}}
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-lg">
                            New transaction
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <FormGroup>
                            <ControlLabel>Title</ControlLabel>
                            <FormControl
                                componentClass='input'
                                value={this.state.title}
                                placeholder="Transaction title"
                                onChange={(e) => {this.setState({ title: e.target.value })}}
                                onKeyPress={this.handleKeyPress.bind(this)}
                                autoFocus
                            />
                        </FormGroup>

                        <FormGroup>
                            <ControlLabel>Tags</ControlLabel>
                            <FormControl
                                componentClass='input'
                                value={this.state.tags}
                                placeholder="tags"
                                onChange={(e) => {this.setState({ tags: e.target.value })}}
                                onKeyPress={this.handleKeyPress.bind(this)}
                            />
                        </FormGroup>

                        <FormGroup>
                            <div className="row">
                                <div className="col-xs-6">
                                    <ControlLabel>Amount</ControlLabel>
                                    <FormControl
                                        componentClass='input'
                                        type="number"
                                        min={0}
                                        value={this.state.price}
                                        onChange={(e) => {this.setState({ price: e.target.value })}}
                                        onKeyPress={this.handleKeyPress.bind(this)}
                                    />
                                </div>

                                <div className="col-xs-6">
                                    <ControlLabel>Currency</ControlLabel>
                                    <FormControl
                                        componentClass='input'
                                        type="text"
                                        value={this.state.currency}
                                        placeholder="Currency"
                                        onChange={(e) => {this.setState({ currency: e.target.value })}}
                                        onKeyPress={this.handleKeyPress.bind(this)}
                                    />
                                </div>
                            </div>
                        </FormGroup>
                        <FormGroup>
                            <div className="row">
                                <div className="col-xs-6">
                                    <ControlLabel>Type</ControlLabel>
                                    <FormControl
                                        componentClass='select'
                                        options={['expense', 'entrance']}
                                        value={this.state.type}
                                        placeholder="Currency"
                                        onChange={(e) => {this.setState({ type: e.target.value })}}
                                        onKeyPress={this.handleKeyPress.bind(this)}
                                    >
                                        <option value="expense" selected>expense</option>
                                        <option value="entrance">entrance</option>
                                    </FormControl>
                                </div>
                                <div className="col-xs-6">
                                    <ControlLabel>Date</ControlLabel><br/>
                                    <Datetime
                                        onChange={(day) => {this.setState({created_at: day && day !== '' ? day.toDate(): null})}}
                                        value={this.state.created_at}
                                    />
                                </div>

                            </div>
                        </FormGroup>

                        <FormGroup>
                            <ControlLabel>Description</ControlLabel>
                            <FormControl
                                componentClass="textarea"
                                placeholder="textarea"
                                onChange={(e) => {this.setState({ description: e.target.value })}}
                                value={this.state.description}
                                rows={5}
                            />
                        </FormGroup>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={()=> {this.setState({display: false})}}>Cancel</Button>
                        <Button bsStyle="success" onClick={this.onSave.bind(this)}>Save</Button>
                    </Modal.Footer>
                </Modal>
            </span>
        )
    }
};