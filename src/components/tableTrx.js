import React, { Component } from 'react';

class table extends Component {
    render() {
        return (
            <div className="ui container">
                <table className="ui celled table">
                    <thead>
                        <tr>
                            <th>Transaction Name</th>
                            <th>Jenis</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>nama</td>
                            <td>jenis</td>
                            <td>total</td>
                        </tr>
                        <tr>
                            <td>nama</td>
                            <td>jenis</td>
                            <td>total</td>
                        </tr>
                        <tr>
                            <td>nama</td>
                            <td>jenis</td>
                            <td>total</td>
                        </tr>
                   
                    </tbody>
                </table>
            </div>
        );
    }
}

export default table;