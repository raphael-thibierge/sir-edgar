const React = require('react');
const FormControl = require('react-bootstrap').FormControl;
const Button = require('react-bootstrap').Button;
const Glyphicon = require('react-bootstrap').Glyphicon;

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

                <div className="col-xs-10">
                    <FormControl
                        type={this.props.type}
                        value={this.state.value}
                        placeholder=""
                        onChange={(e) => {this.setState({ value: e.target.value })}}
                        onKeyPress={this.handleKeyPress}
                    />
                </div>

                <div className="col-xs-1">

                    <Button bsSize="sm" bsStyle="success" onClick={this.validate}>
                        <Glyphicon glyph="ok"/>
                    </Button>
                </div>
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
            <a onClick={this.setEditMode} style={{cursor: 'pointer'}}>
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
        classNameLink: ''

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
    style: PropTypes.object


};

module.exports = AjaxEditableValue;