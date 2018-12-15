import React, { Component } from 'react';
import { AccountData, ContractData, ContractForm } from 'drizzle-react-components'
import { storageRef } from '../firebase'
import axios from 'axios'

class home extends Component {
    constructor(props, context) {
        super(props)
        this.state = {
            category: '',
            description: '',
            bill: '',
            total: '0',
            status: '',
            loading: false,
            message: ''
        }
        // this.contracts = context.drizzle.contracts
    }
    componentDidMount = () =>{
        console.log('ini contracts:', this.props)
    }
    handleForm = (form, val)=>{
        if(form === 'bill') {
            this.setState({loading: true}, ()=>{
                this.uploadBill(val)
            })
        } else {
            this.setState({
                [form]:val
            })
        }
        console.log(this.state)
    }

    uploadBill=(file)=>{
        var uploadTask = storageRef.child('images/' + file.name).put(file)
        uploadTask.on('state_changed', (snapshot) => {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
        }, (error) => {
                console.log(error);
        }, () => {
            uploadTask.snapshot.ref.getDownloadURL()
            .then((downloadURL) => {
                console.log('File available at', downloadURL);
                this.setState({
                    bill: downloadURL
                })
                this.checkBill(downloadURL)
            });
        });
    }

    checkBill=(image)=>{
        console.log('this.state.loading', this.state.loading)
        axios.post(`https://vision.googleapis.com/v1/images:annotate?key=AIzaSyCyU2L9n0NxjunT1bfAH8-ruvVAJCJlBjw`, {
            "requests": [
            {
                'image': {
                'source': {
                    'imageUri': image
                }
                },
                'features': [
                {
                    'type': 'TEXT_DETECTION'
                }
                ]
            }
            ]
        })
        .then((result) => {
            let input = Number(this.state.total)
            let text = result.data.responses[0].fullTextAnnotation.text
            let arr = text.split('\n')
            let newArr=[]
            var numberPattern = /\d+/g;
            arr.forEach(el => {
            let newEl = el.match(numberPattern)
            if(newEl) {
                newArr.push(Number(newEl.join('')))
            }
            });
            console.log(arr, 'new Arr:', newArr, input)
            console.log('Result:', newArr.indexOf(input) !== -1)
            if(newArr.indexOf(input) !== -1) {
                this.setState({status: 'OK', message: 'Upload Bill Success..'})
            } else {
                this.setState({status: 'Different', message: 'We found there is difference between the total you input and the total in the bill. Please make adjustment by creating new transaction with category adjustment!'})
            }
            this.setState({loading: false})
        }).catch((err) => {
            console.log(err)
            this.setState({loading: false})
        });
    }

    submitForm=()=>{
        this.props.addTransaction(this.state.category, this.state.description, this.state.bill, this.state.total, this.state.status)
    }
    clearForm=()=>{
        this.setState({
            category: '',
            description: '',
            bill: '',
            total: '0',
            status: '',
            loading: false,
            message: ''
        })
    }
    render() {
        return (
            <div className="ui container">
                <div className="ui form segment">
                    <div className="ui header">
                        <h3>Input New Transaction</h3>
                    </div>
                    <div className="ui field">
                        <label>Category</label>
                        <select className="ui search dropdown" onChange={(e)=>this.handleForm('category', e.target.value)}>
                            <option value="Food & Beverage" selected>Food & Beverage</option>
                            <option value="Transportation">Transportation</option>
                            <option value="Accomodation">Accomodation</option>
                            <option value="Entertainment">Entertainment</option>
                            <option value="Misc.">Misc.</option>
                            <option value="Adjustment" style={{color:'maroon'}}>Adjustment</option>
                        </select>
                    </div>
                    <div className="ui field">
                        <label>Description</label>
                        <textarea 
                            onChange={(e)=>this.handleForm('description', e.target.value)}
                            value={this.state.description}></textarea>
                    </div>
                    <div className="ui field">
                        <label>Total Expense</label>
                        <input type="number" 
                            onChange={(e)=>this.handleForm('total', e.target.value)}
                            value={this.state.total}/>
                    </div>
                    <div className="ui field">
                        <label>Bill / Invoice</label>
                        <input type="file" onChange={(e)=>this.handleForm('bill', e.target.files[0])}/>
                    </div>
                    <div className="actions">
                        {this.state.loading && <div className="ui segment">
                            <div className="ui active inverted dimmer">
                                <div className="ui text loader">Uploading File..</div>
                            </div>
                            <p>Uploading File..</p>
                        </div>}
                        {!this.state.loading && <div className="ui blue button" onClick={this.submitForm} >Save</div>}
                        <div className="ui red button" onClick={this.clearForm}>Cancel</div>
                    </div>
                </div>
            </div>
        );
    }
}



export default home;