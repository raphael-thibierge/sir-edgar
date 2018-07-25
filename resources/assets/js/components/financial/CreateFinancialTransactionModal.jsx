import React from 'react';
import {FormGroup, Button, Modal, Glyphicon } from 'react-bootstrap';
import InputText from '../form/InputText'
import InputNumber from '../form/InputNumber'
import InputSelect from '../form/InputSelect'
import InputDate from '../form/InputDate'
import InputTextArea from '../form/InputTextArea'
import axios from 'axios';

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

        let date = new Date();
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
            date: date,
            errors: null

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
                date: expense.date ? expense.date : null,
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
            this.onSave(target);
        }
    }

    onError(err){
        console.error(err.responseJSON);
        alert('Saving transaction failed !')
        if (err.data.errors){
            this.setState({
                errors: err.responseJSON.errors
            })
        }
    }

    expenseExists(){
        return typeof this.props.expense !== 'undefined';
    }

    onSave(e){
        e.preventDefault();

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
            date: this.state.date.toISOString(),
        };


        const uri = '/financial-transactions' + (this.expenseExists() ? ('/' + this.state._id) : '' );

        (this.expenseExists() ? axios.put(uri, data) : axios.post(uri, data))
            .then(response => response.data)
            .then(response => {
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
                    alert('Fail to create transaction')
                }
            })
            .catch(error => {
                if (error.response.data.errors){
                    this.setState({
                        errors: error.response.data.errors
                    });
                } else {
                    console.error(error.response);
                    alert('Fail to create transaction')
                }
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

                        <InputText
                            name={'title'}
                            title={'Title'}
                            placeholder="Transaction's title"
                            value={this.state.title}
                            onChange={(value) => {this.setState({ title: value })}}
                            errors={this.state.errors}
                            onKeyPress={this.handleKeyPress.bind(this)}
                            autoFocus
                        />

                        <InputText
                            name={'tags'}
                            title={'Tags'}
                            placeholder="Transaction's tags separated by spaces"
                            value={this.state.tags}
                            onChange={(value) => {this.setState({
                                tags: value.toLowerCase().replace('-', '').replace('#', '')
                            })}}
                            errors={this.state.errors}
                            onKeyPress={this.handleKeyPress.bind(this)}
                        />



                        <FormGroup>
                            <div className="row">
                                <div className="col-xs-6">
                                    <InputNumber
                                        name={'price'}
                                        title={'Amount'}
                                        onChange={(value) => {this.setState({ price: value })}}
                                        value={this.state.price}
                                        min={0}
                                        errors={this.state.errors}
                                        onKeyPress={this.handleKeyPress.bind(this)}
                                    />
                                </div>

                                <div className="col-xs-6">
                                    <InputText
                                        name={'currency'}
                                        title={'Currency'}
                                        placeholder="Transaction's currency"
                                        value={this.state.currency}
                                        onChange={(value) => {this.setState({ currency: value })}}
                                        errors={this.state.errors}
                                        onKeyPress={this.handleKeyPress.bind(this)}
                                    />
                                </div>
                            </div>
                        </FormGroup>

                        <FormGroup>
                            <div className="row">
                                <div className="col-xs-6">
                                    <InputSelect
                                        title={'Type'}
                                        name={'type'}
                                        value={this.state.type}
                                        onChange={(value) => {this.setState({ type: value })}}
                                        options={['expense', 'entrance']}
                                        placeholder="Transaction's type"
                                        errors={this.state.errors}
                                        onKeyPress={this.handleKeyPress.bind(this)}
                                    />

                                </div>

                                <div className="col-xs-6">
                                    <InputDate
                                        title={'Date'}
                                        value={this.state.date}
                                        onChange={(day) => {this.setState({date: day})}}
                                        name={'date'}
                                        errors={this.state.errors}
                                    />
                                </div>

                            </div>
                        </FormGroup>

                        <InputTextArea
                            title={'Description'}
                            name={'description'}
                            onChange={(value) => {this.setState({ description: value })}}
                            value={this.state.description}
                            errors={this.state.errors}
                            rows={5}
                            placeholder={"Transaction's description"}
                        />

                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={(e)=> {e.preventDefault(); this.setState({display: false})}}>Cancel</Button>
                        <Button bsStyle="success" onClick={this.onSave.bind(this)}>Save</Button>
                    </Modal.Footer>
                </Modal>
            </span>
        )
    }
};