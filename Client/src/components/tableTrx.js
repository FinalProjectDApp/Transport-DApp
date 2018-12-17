import React, { Component } from 'react';
// import { AccounTableCellata, ContracTableCellata, ContractForm } from 'drizzle-react-components'
import { Table, Paper, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core'

const styles = {
    customTableCell: {
        backgroundColor: 'black',
        color: 'white',
        fontSize: 14
    }
}

class table extends Component {
    state = {
       showImage: false,
       index: 0
    }
    componenTableCellidMount = ()=>{
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
            <Paper className="ui container" style={{marginTop: 20, marginBottom: 50}}>
                <Table className="ui celled table">
                    <TableHead>
                        <TableRow>
                            <TableCell style={styles.customTableCell}>#</TableCell>
                            <TableCell style={styles.customTableCell}>Category</TableCell>
                            <TableCell style={styles.customTableCell}>Description</TableCell>
                            <TableCell style={styles.customTableCell}>Bill Image</TableCell>
                            <TableCell style={styles.customTableCell} numeric>Total</TableCell>
                            <TableCell style={styles.customTableCell}>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    {
                        this.props.transactions.length > 0 ?
                        <TableBody>
                            {this.props.transactions.map((el, i)=>{
                                return (
                                    <TableRow key={i}>
                                        <TableCell>{i+1}</TableCell>
                                        <TableCell>{el[1]}</TableCell>
                                        <TableCell>{el[2]}</TableCell>
                                        <TableCell><span onClick={()=>this.handleClickImage(i) } style={{color: 'blue', cursor:'pointer'}}>Show/Hide</span><br/>
                                            {this.state.showImage && i == this.state.index && <img src={el[3]} style={{height:'300px', width:'200px'}} />}
                                        </TableCell>
                                        <TableCell numeric>{el[4].c[0]}</TableCell>
                                        <TableCell>{el[5]}</TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody> : null
                    } 
                </Table>
                { this.props.transactions.length === 0 && <h1 style={{textAlign: 'center'}}>There are no transactions for now</h1> }
            </Paper>
        );
    }
}


export default table;