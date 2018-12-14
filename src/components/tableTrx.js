import React, { Component } from 'react';
import { AccountData, ContractData, ContractForm } from 'drizzle-react-components'

class table extends Component {
    state = {
       
    }
    componentDidMount = ()=>{
        console.log('transactions in table:', this.props.transactions)
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
                        {this.props.transactions.map(el=>{
                            return (
                                <tr>
                                    <td>{el[0].c[0]}</td>
                                    <td>{el[1]}</td>
                                    <td>{el[2]}</td>
                                    <td>{el[3]}</td>
                                    <td>{el[4].c[0]}</td>
                                    <td>test</td>
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