import React from 'react';
import PropTypes from 'prop-types';
import {Modal, Button, Glyphicon, Alert, FormGroup} from 'react-bootstrap';

import InputText from '../form/InputText'
import InputSelect from '../form/InputSelect'
import InputNumber from "../form/InputNumber";

export default class BudgetModal extends React.Component {

    constructor(props) {
        super(props);
        console.log('budget');
        console.log(this.props.budget);
        if (this.props.budget){
            this.state = this.props.budget;
            this.state.tags = Array.isArray(this.state.tags) ? this.state.tags.join(' '): this.state.tags;
            this.state.display = false;
            this.state.loading = false;
            this.state.error = false;
            this.state.errors = null;
        } else {
            this.state = this.defaultState();
        }
        console.log(this.state);

    }

    defaultState(){
        return {
            _id: null,
            display: false,
            loading: false,
            name: '',
            amount: '',
            currency : 'CAD',
            period : 'week',
            tags: '',
            error: false,
            errors: null,
        };
    }

    budgetExist(){
        return this.state._id !== null ;
    }

    onCreate(){

        this.setState({
            loading: true
        });


        $.post('./budgets', {
            name: this.state.name,
            amount: this.state.amount,
            currency: this.state.currency,
            period: this.state.period,
            tags: this.state.tags,
            _token: window.token,
        }).catch(error => {
            console.log(error);
            this.setState({
                errors: error.responseJSON.errors,
                error: true,
                loading: false,
            });
            console.error(error);
        }).then(responseJSON => {

            if (responseJSON.status === 'success') {
                // get response data
                const data = responseJSON.data;

                this.setState(this.defaultState());

                if (typeof this.props.onCreate === 'function'){
                    this.props.onCreate(data.budget);
                }

            } else {
                this.setState({
                    errors: error.responseJSON.errors,
                    error: true,
                    loading: false,
                });
                console.error(responseJSON);
            }
        });
    }

    onDelete(){

        this.setState({
            loading: true
        });

        $.post('./budgets/'+this.state._id, {
            _token: window.token,
            _method: 'DELETE',
        }).catch(error => {
            this.state({
                error: true,
                loading: false,
            });
            console.error(error);
        }).then(responseJSON => {

            if (responseJSON.status === 'success') {
                // get response data
                if (typeof this.props.onDelete === 'function'){
                    this.props.onDelete(this.state._id);
                }
                this.setState({
                    error: false,
                    loading: false,
                    display: false,
                });
            } else {
                this.setState({
                    error: true,
                    loading: false,
                },);
                console.error(responseJSON);
            }
        });
    }

    onUpdate(){

        this.setState({
            loading: true
        });

        $.post('./budgets/'+this.state._id, {
            name: this.state.name,
            amount: this.state.amount,
            currency: this.state.currency,
            period: this.state.period,
            tags: this.state.tags.trim().split(' '),
            _token: window.token,
            _method: 'PUT',
        }).catch(error => {
            this.setState({
                error: true,
                loading: false,
                errors: error.responseJSON.errors,
            });
            console.error(error.responseJSON);
        }).then(responseJSON => {

            if (responseJSON.status === 'success') {
                // get response data
                if (typeof this.props.onUpdate === 'function'){
                    this.props.onUpdate(responseJSON.data.budget);
                }
                this.setState({
                    error: false,
                    loading: false,
                    display: false,
                });
            } else {
                this.setState({
                    error: true,
                    loading: false,
                    display: false,
                    errors: error.responseJSON.errors,
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
                {this.budgetExist() ? (
                    <a onClick={()=>{this.setState({ display: true })}}>
                        {this.state.name}
                    </a>
                ) : (
                    <Button bsStyle="default" onClick={()=>{this.setState({ display: true })}}>
                        <Glyphicon glyph="plus"/> New budget
                    </Button>
                )}
                <Modal
                    aria-labelledby="contained-modal-title-lg"
                    show={this.state.display}
                    onHide={this.hide.bind(this)}
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-lg">
                            <strong>
                                {this.budgetExist() ? 'Edit budget' : 'Create a new budget'}
                            </strong>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {(this.state.loading) ? (
                            <Alert bsStyle="info">
                                {this.budgetExist() ? 'Editing your budget...' : 'Creating your budget...'}
                            </Alert>
                        ) : (
                            <div className="row">
                                <div className="col-xs-12">

                                    {this.state.error ? (
                                        <Alert bsStyle="danger">
                                            {this.budgetExist() ? 'Updating budget failed...' : 'Creating budget failed...'}
                                        </Alert>
                                    ): null}

                                    <InputText
                                        title={'Name'}
                                        name={'name'}
                                        placeholder={'Budget\'s name'}
                                        value={this.state.name}
                                        onChange={(value) => {this.setState({ name: value })}}
                                        errors={this.state.errors}
                                        autoFocus
                                    />

                                    <InputText
                                        title={'Tags to track'}
                                        name={'tags'}
                                        placeholder={'Budget\'s tags separated by spaces and without #'}
                                        value={this.state.tags}
                                        onChange={(value) => {this.setState({ tags: value.replace('#', '') })}}
                                        errors={this.state.errors}
                                    />

                                    <InputNumber
                                        title={'Amount intent'}
                                        name={'amount'}
                                        placeholder={100}
                                        min={0}
                                        value={this.state.amount}
                                        onChange={(value) => {this.setState({ amount: value })}}
                                        errors={this.state.errors}
                                    />

                                    <InputSelect
                                        title={'Currency'}
                                        name={'currency'}
                                        onChange={(value) => {this.setState({ currency: value })}}
                                        options={['CAD', 'EUR']}
                                        value={this.state.currency}
                                        errors={this.state.errors}
                                    />


                                    <InputSelect
                                        title={'Period'}
                                        name={'period'}
                                        onChange={(value) => {this.setState({ period: value })}}
                                        options={['week', 'month']}
                                        value={this.state.period}
                                        errors={this.state.errors}
                                    />

                                    {this.budgetExist() && (
                                        <FormGroup controlId="formControlsDelete">
                                            <Button onClick={this.onDelete.bind(this)} bsStyle="danger" className="col-xs-12">Delete</Button>
                                        </FormGroup>
                                    )}
                                </div>
                            </div>
                            )}
                    </Modal.Body>
                    <Modal.Footer>
                        {this.budgetExist() ? (
                            <Button onClick={() => {this.setState({display: false})}}>Cancel</Button>
                        ) : (
                            <Button onClick={() => {this.setState(this.defaultState())}}>Cancel</Button>
                        )}
                        {this.budgetExist() ? (
                            <Button bsStyle="success" onClick={this.onUpdate.bind(this)}>Save</Button>
                        ) : (
                            <Button bsStyle="success" onClick={this.onCreate.bind(this)}>Save</Button>
                        )}
                    </Modal.Footer>
                </Modal>
            </span>

        );
    }

}

BudgetModal.propTypes = {
    budget: PropTypes.object,
    onDelete: PropTypes.func,
    onCreate: PropTypes.func,
    onUpdate: PropTypes.func
};