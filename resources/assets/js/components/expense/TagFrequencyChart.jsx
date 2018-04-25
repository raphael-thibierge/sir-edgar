import React from 'react';
import { Chart } from 'react-google-charts';
import { FormGroup, FormControl, Label, Button} from 'react-bootstrap';
import TagFrequencyChartAjax from './TagFrequencyChartAjax';
import Network from '../Network/Network';


export default class TagFrequencyChart extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            tags: '',
        };
        this.inputValue = '';
    }

    /**
     * Called when the user hit a keyboard key in input
     *
     * @param target
     */
    handleKeyPress(target) {
        // when pressing enter key
        if(target.charCode===13){
            this.onLoadButtonClick();
        }
    }

    onLoadButtonClick(){
        this.setState({
            tags: this.inputValue,
        });
    }

    render(){

        return (
            <div className="row">
                <div className="col-xs-12">

                    <div className="row">
                        <div className="col-xs-12">
                            <h1 className="page-header finance-page-header">Tags stats</h1>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-xs-10">

                            <FormGroup>
                                <FormControl
                                    type={'text'}
                                    placeholder={'Tag to track'}
                                    ref={'input'}
                                    value={this.state.inputValue}
                                    onChange={((e) => {
                                        this.inputValue = e.target.value;
                                    }).bind(this)}
                                    onKeyPress={this.handleKeyPress.bind(this)}
                                />
                            </FormGroup>

                        </div>
                        <div className="col-xs-2">
                            <FormGroup>
                                <Button
                                    bsColor={'success'}
                                    onClick={this.onLoadButtonClick.bind(this)}
                                >Load !</Button>
                            </FormGroup>
                        </div>
                    </div>

                    <TagFrequencyChartAjax tags={this.state.tags}/>

                    {this.state.tags.length > 0 && (
                        <Network route={'/expenses-graph-data?tags=' + this.state.tags.replace(' ', ',')}/>
                    )}

                </div>
            </div>
        );
    }

}