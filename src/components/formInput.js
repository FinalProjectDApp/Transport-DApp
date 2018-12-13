import React, { Component } from 'react';

class home extends Component {
    render() {
        return (
            <div className="ui container">
                <div className="ui form segment">
                    <div className="ui header">
                        <h3>Input New Transaction</h3>
                    </div>
                    <div className="ui field">
                        <label>Name of Transaction</label>
                        <input type="text" />
                    </div>
                    <div className="ui field">
                        <label>Category</label>
                        <select className="ui search dropdown">
                            <option value="AF">Jajan</option>
                            <option value="AX">Material</option>
                            <option value="AL">Kuli</option>
                        </select>
                    </div>
                    <div className="ui field">
                        <label>Bukti</label>
                        <input type="text" />
                    </div>
                    <div className="ui field">
                        <label>Total Money</label>
                        <input type="text" />
                    </div>
                    <div className="actions">
                        <div className="ui grey button" >Save</div>
                        <div className="ui grey button" >Cancel</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default home;