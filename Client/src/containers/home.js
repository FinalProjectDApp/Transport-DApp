import React, { Component } from 'react';

import Navbar from '../components/navbar'
import FormInput from '../components/formInput'
import TableTrx from '../components/tableTrx'


class home extends Component {
    render() {
        return (
            <div>
                <Navbar></Navbar>
                <div className="ui container" >
                    <div >
                        <h2 style={{backgroundColor: 'gray', width: 100, padding: 10}} >Groups</h2>
                        <div className="ui gray button"> Create Group</div>
                    </div>
                </div>
                <FormInput></FormInput>
                <TableTrx></TableTrx>
            </div>
        );
    }
}

export default home;