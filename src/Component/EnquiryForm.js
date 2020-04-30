import React from "react";
import {Button, CircularProgress, MenuItem, Select, TextField} from '@material-ui/core';
import UsersTable from "./UserTable";
import  '../App.css';
import Paper from "@material-ui/core/Paper";
import Snackbar from "@material-ui/core/Snackbar";

class EnquiryForm extends React.Component {
    state = {
        customerId: '',
        customerName: '',
        gender: 'Male',
        number: '',
        isSubmitting: false,
        userData: [],
        lastUserDeleted: undefined,
        isLoading: true,
        showUndo: false,
    };

    constructor(props) {
        super(props);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        this.setState(
            {
                [event.target.name]: event.target.value
            }
        )
    }

    componentDidMount() {
        this.getCustomers();
    }

    async handleSubmission (){
        let userField = new Map();
        userField['name'] = this.state.customerName;
        userField['gender'] = this.state.gender;
        userField['number'] = this.state.number;
        let temp = this.state.userData;
        this.setState({
            isSubmitting: true,
        });
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userField)
        };
        let request = await fetch('http://localhost:5004/customer/add', requestOptions);
        let data = await request.json();
        console.log('Response: ', data);
        this.setState({
            customerId: data.customerID,
        });
        userField['customerID'] = data.customerID;
        userField['deleting'] = false;
        temp.push(userField);
        this.setState({
            userData: temp,
            customerId: '',
            customerName: '',
            gender: 'Male',
            number: '',
            isSubmitting: false,
        });
    }

    removeUser(customerId){
        let temp = this.state.userData.slice();
            let index = temp.findIndex((e) => e.customerID === customerId);
                temp[index].deleting = true;
                this.setState({
                    userData:temp,
                });
                this.callDelete(customerId);
            // }
    }

    async undoLastDelete(){
        if(this.state.lastUserDeleted !== undefined){
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            };
            let request = await fetch('http://localhost:5004/customer/undoDelete', requestOptions);
            let data = await request.json();
            console.log('Response from undoDelete: ', data);
            let temp = this.state.userData.slice();
            let [userDeleted, index] = this.state.lastUserDeleted;
            userDeleted.deleting = false;
            temp.splice(index, 0, userDeleted);
            this.setState({
                userData: temp,
                lastUserDeleted: undefined,
            })
        }
    }

    async callDelete(customerId){
        this.setState({
            showUndo: true,
        })
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({id: customerId})
        };
        let request = await fetch(`http://localhost:5004/customer/delete/${customerId}`, requestOptions);
        let data = await request.json();
        let temp = this.state.userData.slice();
        let userDeleted =  [
            this.state.userData[this.state.userData.findIndex((e) => e.customerID === customerId)],
            this.state.userData.findIndex((e) => e.customerID === customerId)
        ];
        temp.splice(temp.findIndex((e) => e.customerID === customerId), 1);
        userDeleted.deleting = false;
        this.setState({
            userData:temp,
            lastUserDeleted: userDeleted,
        });
        setTimeout(() =>{
            this.setState({
                showUndo: false,
            })
        }, 2500);
    }

    async getCustomers(){
        let customers = await fetch('http://localhost:5004/customers');
        let data = await customers.json();
        this.setState({
            userData: data,
            isLoading:false,
        });
        console.log(data, 'DATA FROM SERVER: ');
    }

    render() {
        // className={'enquiry-Field'}
            return (
                <div>
                    <Paper className={'paper'}>
                        <form action="" id={'sampleForm'} className={'enquiry-field'}>
                            <TextField name={'customerName'} label={'Your Name'} onChange={this.handleInputChange} className={'input-field'} value={this.state.customerName}/>
                            <TextField name={'number'} label={'Contact Number'} onChange={this.handleInputChange} className={'input-field'} value={this.state.number}/>
                            <Select name={'gender'} label={'Gender'} onChange={this.handleInputChange} className={'input-field'} value={this.state.gender}>
                                <MenuItem value={'Male'}>Male</MenuItem>
                                <MenuItem value={'Female'}>Female</MenuItem>
                            </Select>
                        </form>
                        <div className={'footer'}>
                            <Button variant="outlined" onClick={this.handleSubmission.bind(this)}>Submit</Button>
                            {this.state.isSubmitting ? <CircularProgress color={"secondary"}/> : null}
                        </div>
                    </Paper>
                    {this.state.isLoading ? <CircularProgress color={"primary"}/> : <UsersTable usersMaps = {this.state.userData} removeUser = {this.removeUser.bind(this)}/>}
                    {/*{this.state.lastUserDeleted !== undefined*/}
                    {/*    ? <Button variant="outlined" onClick={this.undoLastDelete.bind(this)}>Undo Delete</Button>*/}
                    {/*    : null*/}
                    {/*}*/}
                    <Snackbar open={this.state.lastUserDeleted !== undefined && this.state.showUndo}
                              message={'User deleted'}
                              autoHideDuration={2500}
                              onClose={() => {
                                this.setState({
                                  lastUserDeleted: null,
                                  })
                                }
                              }
                              action={<Button variant="outlined" onClick={this.undoLastDelete.bind(this)}>Undo Delete</Button>}
                    />
                </div>
            );
    }
}

export default EnquiryForm;

// <button
//     // form={'sampleForm'}
//     // type={'submit'}
//     // formAction={'https://cors-anywhere.herokuapp.com/https://us-central1-form-manager-7234f.cloudfunctions.net/saveCustomer'}//
//     // formMethod={'post'}
//     // formTarget={'_self'}
//     onClick={this.handleSubmission.bind(this)}
// >
//     Submit Info
// </button>