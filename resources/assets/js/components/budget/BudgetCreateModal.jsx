import React from 'react';
import {
    FormControl, FormGroup, ControlLabel, Modal, Button, Glyphicon, Alert
} from 'react-bootstrap';

import InputText from '../form/InputText'
import InputSelect from '../form/InputSelect'
import InputNumber from "../form/InputNumber";

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
            errors: null,
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
                    <Glyphicon glyph="plus"/> New budget
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
                                Creating your budget...
                            </Alert>
                        ) : (
                            <div className="row">
                                <div className="col-xs-12">

                                    {this.state.error ? (
                                        <Alert bsStyle="danger">
                                            Creating budget failed...
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
