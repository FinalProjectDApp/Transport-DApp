import React, { Component } from 'react';
import { AccountData, ContractData, ContractForm } from 'drizzle-react-components'
import { storageRef } from '../firebase'
import axios from 'axios'
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button'
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';

const styles = theme => ({
    root: {
      ...theme.mixins.gutters(),
      paddingTop: theme.spacing.unit * 2,
      paddingBottom: theme.spacing.unit * 2,
    },
    formControl: {
      margin: theme.spacing.unit,
      minWidth: 600,
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
    },
    numField : {
        width: 600,
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
    },
    selectEmpty: {
      marginTop: theme.spacing.unit * 2,
    },
    button: {
        margin: theme.spacing.unit,
    },
  });

class home extends Component {
    constructor(props, context) {
        super(props)
        this.state = {
            category: '',
            description: '',
            bill: null,
            file: null,
            total: '0',
            status: '',
            loading: false,
            message: '',
            transactionId: '',
            adjustmentIdAmount: null
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
        } else if (form === 'transactionId') {
            this.setState({
                [form]:val
            }, ()=>{
                this.findTransactionById(this.state.transactionId)
            })
        } else {
            this.setState({
                [form]:val
            })
        }
        console.log(this.state)
    }

    uploadBill=(file)=>{
        let uniqueId = this.makeId()
        var uploadTask = storageRef.child('images/' + uniqueId + file.name).put(file)
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

    makeId=()=> {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        
        for (var i = 0; i < 5; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        
        return text;
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
            if(this.state.category === 'Transaction Adjustment') input = Number(this.state.adjustmentIdAmount) + Number(this.state.total)
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
            // console.log(arr, 'new Arr:', newArr, input)
            // console.log('Result:', newArr.indexOf(input) !== -1)
            if(this.state.category !== 'Transaction Adjustment') {
                if(newArr.indexOf(input) !== -1) {
                    this.setState({status: 'OK', message: 'Upload Bill Success..'})
                } else {
                    this.setState({status: 'Different', message: 'We found there is difference between the total you input and the total in the bill. Please make adjustment by creating new transaction with category adjustment!'})
                }
            } else {
                if(newArr.indexOf(input) !== -1) {
                    this.setState({status: 'Adjusted', message: 'Upload Bill Success..'})
                } else {
                    this.setState({status: 'Different', message: 'We found there is difference between the total you input and the total in the bill. Please make adjustment by creating new transaction with category adjustment!'})
                }
            }
            this.setState({loading: false})
        }).catch((err) => {
            this.setState({status: 'Bill/Invoice does not contain total amount!', message: 'No Bill/Invoice'})
            console.log(err)
            this.setState({loading: false})
        });
    }

    findTransactionById=(id)=>{
        this.props.transactions.forEach((el, i)=>{
            if(el[0].c[0] === Number(id)) {
                this.setState({
                    adjustmentIdAmount: el[4].c[0]
                })
            }
        })
    }

    submitForm=()=>{
        this.props.addTransaction(this.state.category, this.state.description, this.state.bill, this.state.total, this.state.status)
        this.clearForm()
    }
    clearForm=()=>{
        this.fileInput.value = ''
        this.setState({
            category: '',
            description: '',
            bill: '',
            total: '0',
            status: '',
            file: null,
            loading: false,
            transactionId: '',
            adjustmentIdAmount: null,
            message: ''
        })
    }
    render() {
        const { classes } = this.props;
        return (
            <div className="ui container">
            <Paper className={classes.root} elevation={1}>
                <Typography variant="h5" component="h3">
                    Input New Transaction
                </Typography>
                <br />
                <br />
                <hr></hr>
                <Grid
                    container
                    direction="column"
                    justify="center"
                    alignItems="center"
                >
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="age-simple">Category</InputLabel>
                        <Select
                            value={this.state.category}
                            onChange={(e)=>this.handleForm('category', e.target.value)}
                            inputProps={{
                                name: 'age',
                                id: 'age-simple',
                            }}
                            >
                            <MenuItem value="">
                            <em>Select a Category</em>
                            </MenuItem>
                            <MenuItem value="Food & Beverage">Food & Beverage</MenuItem>
                            <MenuItem value="Transportation">Transportation</MenuItem>
                            <MenuItem value="Accomodation">Accomodation</MenuItem>
                            <MenuItem value="Entertainment">Entertainment</MenuItem>
                            <MenuItem value="Misc.">Misc.</MenuItem>
                            <MenuItem value="Transaction Adjustment"><span style={{color:'maroon'}}>Transaction Adjustment</span></MenuItem>
                        </Select>
                    </FormControl>
                    {/* form id trx to be adjusted */}
                    { this.state.category === 'Transaction Adjustment' && <TextField
                        id="standard-text"
                        label="Transaction ID"
                        style={{ margin: 8 }}
                        onChange={(e)=>this.handleForm('transactionId', e.target.value)}
                        value={this.state.transactionId}
                        className={classes.numField}
                        margin="normal"
                        />}
                    <TextField
                        id="standard-multiline-static"
                        label="Description"
                        multiline
                        rows="4"
                        style={{ margin: 8 }}
                        onChange={(e)=>this.handleForm('description', e.target.value)}
                        value={this.state.description}
                        className={classes.numField}
                        margin="normal"
                        />
                    <TextField
                        id="standard-number"
                        label="Total Expense"
                        value={this.state.total}
                        onChange={(e)=>this.handleForm('total', e.target.value)}
                        type="number"
                        className={classes.numField}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        margin="normal"
                    />
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="upload-bill">Bill / Invoice</InputLabel>
                        <Input
                            inputProps={{
                                id:"upload-bill",
                                name:"upload-bill"
                            }}
                            ref={ref=> this.fileInput = ref}
                            type="file"
                            onChange={(e)=>this.handleForm('bill', e.target.files[0])}
                        />
                        <FormHelperText>Upload Bill / Invoice</FormHelperText>
                    </FormControl>
                </Grid>
                
                {this.state.loading && <div className="ui segment">
                    <div className="ui active inverted dimmer">
                    <div className="ui text loader">Uploading and Analyzing File..</div>
                    </div>
                    <p>Uploading and Analyzing File..</p>
                </div>}
                <hr></hr>
                {this.state.loading ? <Button
                    disabled
                    className={classes.button}
                >
                    Save
                </Button> : <Button
                    color="primary"
                    onClick={this.submitForm}
                    className={classes.button}
                >
                    Save
                </Button>}
                <Button
                    color="secondary"
                    onClick={this.clearForm}
                    className={classes.button}
                >
                    Cancel
                </Button>
            </Paper>
        </div>
        );
    }
}



export default withStyles(styles)(home);