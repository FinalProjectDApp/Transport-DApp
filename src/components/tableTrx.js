import React, { Component } from 'react';
import { AccountData, ContractData, ContractForm } from 'drizzle-react-components'

class table extends Component {
    state = {
       showImage: false,
       index: 0
    }
    componentDidMount = ()=>{
        console.log('transactions in table:', this.props.transactions)
    }

    handleClickImage=(i) =>{
        if(this.state.showImage) {
            this.setState({
                showImage: false,
                index: 0
            })
        } else {
            this.setState({
                showImage: true,
                index: i
            })
        }
    }
    render() {
        return (
            <div className="ui container">
                <table className="ui celled table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Category</th>
                            <th>Description</th>
                            <th>Bill Image</th>
                            <th>Total</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.transactions.map((el, i)=>{
                            return (
                                <tr key={i}>
                                    <td>{i+1}</td>
                                    <td>{el[1]}</td>
                                    <td>{el[2]}</td>
                                    <td><span onClick={()=>this.handleClickImage(i) } style={{color: 'blue', cursor:'pointer'}}>Show/Hide</span><br/>
                                        {this.state.showImage && i == this.state.index && <img src={el[3]} style={{height:'300px', width:'200px'}} />}
                                    </td>
                                    <td>{el[4].c[0]}</td>
                                    <td>{el[5]}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        );
    }
}


export default table;