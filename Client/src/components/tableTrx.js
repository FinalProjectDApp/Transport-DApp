import React, { Component } from 'react';
// import { AccounTableCellata, ContracTableCellata, ContractForm } from 'drizzle-react-components'
import { Table, Paper, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core'
import GoogleMap from "../components/googleMap";

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
       showMap: false,
       index: 0,
       budget: 1000000
    }
    
    componenTableCellidMount = ()=>{
        console.log('transactions in table:', this.props.transactions)
    }

    formatMoney(amount, decimalCount = 0, decimal = "", thousands = ",") {
        try {
          decimalCount = Math.abs(decimalCount);
          decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
      
          const negativeSign = amount < 0 ? "-" : "";
      
          let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
          let j = (i.length > 3) ? i.length % 3 : 0;
      
          return 'Rp ' + negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
        } catch (e) {
          console.log(e)
        }
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

    handleClickMap=(i)=>{
        if(this.state.showMap) {
            this.setState({
                showMap: false,
                index: 0
            })
        } else {
            this.setState({
                showMap: true,
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
                            <TableCell style={styles.customTableCell}>Transaction ID</TableCell>
                            <TableCell style={styles.customTableCell}>Created At</TableCell>
                            <TableCell style={styles.customTableCell}>Category</TableCell>
                            <TableCell style={styles.customTableCell}>Description</TableCell>
                            <TableCell style={styles.customTableCell}>Bill Image</TableCell>
                            <TableCell style={styles.customTableCell} numeric>Total</TableCell>
                            <TableCell style={styles.customTableCell}>Status</TableCell>
                            {this.props.transactions.length>0 && this.props.transactions[0][8] && <TableCell style={styles.customTableCell}>Location</TableCell>}
                        </TableRow>
                    </TableHead>
                    {
                        this.props.transactions.length > 0 ?
                        <TableBody>
                            {this.props.transactions.map((el, i)=>{
                                return (
                                    <TableRow key={i}>
                                        <TableCell>{el[0].c[0]}</TableCell>
                                        <TableCell>{new Date(el[7]).toLocaleString()}</TableCell>
                                        <TableCell>{el[1]}</TableCell>
                                        <TableCell>{el[2]}</TableCell>
                                        <TableCell><span onClick={()=>this.handleClickImage(i) } style={{color: 'blue', cursor:'pointer'}}>Show/Hide</span><br/>
                                            {this.state.showImage && i == this.state.index && <img src={el[3]} style={{height:'300px', width:'200px'}} />}
                                        </TableCell>
                                        {(el[4].s == -1) && <TableCell numeric>{this.formatMoney(Number(el[4].c[0]) * -1)}</TableCell>}
                                        {(el[4].s == 1) && <TableCell numeric>{this.formatMoney(Number(el[4].c[0]))}</TableCell>}
                                        {/* status */}
                                        {el[5] ==='OK' && <TableCell style={{color:'green'}}>{el[5]}</TableCell>}
                                        {el[5] ==='Different' && <TableCell style={{color:'red'}}>{el[5]}</TableCell>}
                                        {el[5] ==='Adjusted' && <TableCell style={{color:'green'}}>{el[5]}</TableCell>}
                                        {el[5] ==='Bill/Invoice does not contain total amount!' && <TableCell style={{color:'red'}}>{el[5]}</TableCell>}
                                        {el[5] ==='' && <TableCell style={{color:'red'}}>No Transaction Data!</TableCell>}
                                        {/* Location... */}
                                        {/* {el[8] && <TableCell>{JSON.stringify(el[8])}</TableCell>} */}
                                        {el[8] && <TableCell><span onClick={()=>this.handleClickMap(i) } style={{color: 'blue', cursor:'pointer'}}>Show/Hide Location</span><br/>
                                            {this.state.showMap && i == this.state.index && 
                                            <GoogleMap
                                                lat={el[8].lat}
                                                long={el[8].long}
                                                googleMapURL={`https://maps.googleapis.com/maps/api/js?key=AIzaSyD70YjbFMEBuhjcTR8_kOLHLktQk3X6AeM&v=3.exp&libraries=geometry,drawing,places`}
                                                loadingElement={<div style={{ height: `100%` }} />}
                                                containerElement={<div style={{ height: `300px`, width: `300px` }} />}
                                                mapElement={<div style={{ height: `100%` }} />}
                                            />}
                                        </TableCell>}
                                    </TableRow>
                                )
                            })}
                            <TableRow>
                                <TableCell rowSpan={3}></TableCell>
                                <TableCell colSpan={4} style={{textAlign: 'right', borderLeft: 0}}><strong>Grand Total</strong></TableCell>
                                <TableCell><strong>{this.formatMoney(this.props.grandTotal)}</strong></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={4} style={{textAlign: 'right', color: "green"}}><strong>Budgeted</strong></TableCell>
                                <TableCell><strong>{this.formatMoney(this.state.budget)}</strong></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={4} style={{textAlign: 'right'}}><strong>Remaining Amount</strong></TableCell>
                                <TableCell><strong>{this.formatMoney(this.state.budget - this.props.grandTotal)}</strong></TableCell>
                            </TableRow>
                        </TableBody> : null
                    } 
                </Table>
                { this.props.transactions.length === 0 && <h1 style={{textAlign: 'center'}}>There are no transactions for now</h1> }
            </Paper>
        );
    }
}


export default table;