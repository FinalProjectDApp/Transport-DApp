import React, { Component } from 'react';
import { AccountData, ContractData, ContractForm } from 'drizzle-react-components'
import { storageRef } from '../firebase'

class home extends Component {
    constructor(props, context) {
        super(props)
        this.state = {
            category: '',
            description: '',
            bill: '',
            total: '0',
            urlImage: ''
        }
        // this.contracts = context.drizzle.contracts
    }
    componentDidMount = () =>{
        console.log('ini contracts:', this.props)
    }
    handleForm = (form, val)=>{
        if(form === 'bill') {
            this.uploadBill(val)
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
                    urlImage: downloadURL
                })
            });
        });
    }

    submitForm=()=>{
        this.props.addTransaction(this.state.category, this.state.description, this.state.bill, this.state.total)
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
                            <option value="Food & Beverage">Food & Beverage</option>
                            <option value="Transportation">Transportation</option>
                            <option value="Accomodation">Accomodation</option>
                            <option value="Entertainment">Entertainment</option>
                            <option value="Misc.">Misc.</option>
                        </select>
                    </div>
                    <div className="ui field">
                        <label>Description</label>
                        <textarea onChange={(e)=>this.handleForm('description', e.target.value)}></textarea>
                    </div>
                    <div className="ui field">
                        <label>Bill / Invoice</label>
                        <input type="file" onChange={(e)=>this.handleForm('bill', e.target.files[0])}/>
                    </div>
                    <div className="ui field">
                        <label>Total Expense</label>
                        <input type="number" onChange={(e)=>this.handleForm('total', e.target.value)}/>
                    </div>
                    <div className="actions">
                        <div className="ui blue button" onClick={this.submitForm} >Save</div>
                        <div className="ui red button" >Cancel</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default home;