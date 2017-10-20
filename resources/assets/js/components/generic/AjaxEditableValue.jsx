const React = require('react');
const Input = require('reactstrap').Input;
const Button = require('reactstrap').Button;
const Form = require('reactstrap').Form;

const PropTypes = require('prop-types');

const AjaxEditableValue = React.createClass({

    getInitialState(){
        return {
            value: '',
            edit: false,
        }

    },


    validate(){
        if (this.props.ajaxURI ){


            let data = {
                _token: window.token
            };

            if (this.props.method === 'PUT'){
                data.method = this.props.method;
                data._method = this.props.method;
            }

            if (this.props.inputName){
                data[this.props.inputName] = this.state.value;
            } else {
                data['value'] = this.state.value;
            }


            const request = $.ajax({
                url: this.props.ajaxURI,
                cache: false,
                method: 'POST',
                data: data,
                success: (response) => {
                    if (response.status && response.status === 'success'){

                        this.setState({
                            edit: false
                        });

                        if (typeof this.props.onSuccess === 'function'){
                            this.props.onSuccess(this.state.value);
                        }

                    }

                },
                error: (error) => {console.error(error.message); alert(error)},
            });

        }
    },

    /**
     * Called when the user hit a keyboard key in input
     *
     * @param target
     */
    handleKeyPress: function(target) {
        // when pressing enter key
        if(target.charCode==13){
            this.validate();
        }
    },

    editModeRender: function () {
        return (
            <div style={{marginBottom: '10px'}}>
                <Form inline>

                <div className="col-sm-10">
                    <Input
                        type={this.props.type}
                        value={this.state.value}
                        placeholder=""
                        onChange={(e) => {this.setState({ value: e.target.value })}}
                        onKeyPress={this.handleKeyPress}
                    />
                </div>

                <div className="col-sm-1">

                    <Button size="sm" color="success" onClick={this.validate}>
                        OK
                    </Button>
                </div>
                </Form>
            </div>
        );
    },

    setEditMode(){
        this.setState({
            value: this.props.value,
            edit: true,
        });
    },


    displayModeRender: function () {

        return (
            <a onClick={this.setEditMode}>
                <span className={this.props.classNameLink} style={this.props.style}>
                    <strong>
                        {this.props.value}
                    </strong>
                </span>
            </a>
        );
    },

    render(){
        return this.state.edit === true ? this.editModeRender() : this.displayModeRender();
    },

    defaultProps: {
        type: 'text',
        style: {},
        classNameLink: '',
        method: 'POST'

    },
});

AjaxEditableValue.propTypes = {
    onSuccess: PropTypes.func,
    ajaxURI: PropTypes.string,
    inputName: PropTypes.string,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]).isRequired,
    type: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    method: PropTypes.oneOf(['GET', 'POST', 'PATCH', 'PUT', 'DELETE'])


};

module.exports = AjaxEditableValue;