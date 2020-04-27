import React from "react";
import {Button, CircularProgress, MenuItem, Select, TextField} from '@material-ui/core';
import UsersTable from "./UserTable";
import  '../App.css';
import Paper from "@material-ui/core/Paper";
import Snackbar from "@material-ui/core/Snackbar";

export default class EnquiryForm extends React.Component {
    state = {
        baseUrl:  'https://cors-anywhere.herokuapp.com/',
        customerId: '',
        customerName: '',
        gender: 'Male',
        number: '',
        isSubmitting: false,
        isRestoring: false,
        userData: [],
        lastUserDeleted: undefined,
        showUserDeleted: false,
    };

    constructor(props) {
        super(props);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        console.log('Target field',event.target.name);
        this.setState(
            {
                [event.target.name]: event.target.value
            }
        )
    }

    componentDidMount() {
        let tempData = JSON.parse(localStorage.getItem('userDataBase'));
        if(tempData !== null){
            this.setState({
                userData: tempData,
            });
        }
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
        let request = await fetch(`${this.state.baseUrl}https://us-central1-form-manager-7234f.cloudfunctions.net/saveCustomer`, requestOptions);
        let data = await request.json();
        console.log('Response from handleSubmission: ', data);
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
        localStorage.setItem('userDataBase', JSON.stringify(this.state.userData));
    }

    removeUser(customerId){
        let temp = this.state.userData.slice();
            let index = temp.findIndex((e) => e.customerID === customerId);
            // if(!temp[index].deleting){
            //     console.log('Beginning to delete customer: ', customerId);
                temp[index].deleting = true;
                this.setState({
                    userData:temp,
                });
                this.callDelete(customerId).then(() => {});
            // }
    }

    async undoLastDelete(){
        this.setState({
            isRestoring: true,
            showUserDeleted: false,
        });
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.state.lastUserDeleted[0]),
        };
        let request = await fetch(`${this.state.baseUrl}https://us-central1-form-manager-7234f.cloudfunctions.net/undoDeleteCustomer`, requestOptions);
        let data = await request.json();
        console.log('Response from undoLastDelete: ', data);
        let temp = this.state.userData.slice();
            let [userDeleted, index] = this.state.lastUserDeleted;
            userDeleted.deleting = false;
            temp.splice(index, 0, userDeleted);
            this.setState({
                userData: temp,
                lastUserDeleted: undefined,
                isRestoring: false,
            })

    }

    async callDelete(customerId){
        let temp = this.state.userData.slice();
        let userDeleted =  [
            this.state.userData[this.state.userData.findIndex((e) => e.customerID === customerId)],
            this.state.userData.findIndex((e) => e.customerID === customerId)
        ];
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userDeleted[0]),
        };
        let request = await fetch(`${this.state.baseUrl}https://us-central1-form-manager-7234f.cloudfunctions.net/deleteCustomer`, requestOptions);
        let data = await request.json();
        console.log('Response from callDelete: ', data);
        setTimeout(() =>{
            // console.log('Finished delete request, index of element to delete: ', customerId);

            // console.log('UserDeleted was: ', userDeleted);
            temp.splice(temp.findIndex((e) => e.customerID === customerId), 1);
            userDeleted.deleting = false;
            this.setState({
                userData:temp,
                lastUserDeleted: userDeleted,
                showUserDeleted: true,
            });
            localStorage.setItem('userDataBase', JSON.stringify(this.state.userData));
        }, 2500);
    }

    closeSnackBar(){
        this.setState({
            showUserDeleted: false,
            lastUserDeleted: undefined,
        })
    }

    render() {
        // className={'enquiry-Field'}
            return (
                <div>
                    <Paper className={'paper'}>
                        <form action="" id={'sampleForm'} className={'enquiry-field'}>
                            <TextField helperText={'Invalid input'} name={'customerName'} label={'Your Name'} onChange={this.handleInputChange} className={'input-field'} value={this.state.customerName}/>
                            <TextField name={'number'} label={'Contact Number'} onChange={this.handleInputChange} className={'input-field'} value={this.state.number}/>
                            <Select name={'gender'} label={'Gender'} onChange={this.handleInputChange} className={'input-field'} value={this.state.gender}>
                                <MenuItem value={'Male'}>Male</MenuItem>
                                <MenuItem value={'Female'}>Female</MenuItem>
                            </Select>
                        </form>
                        <div className={'footer'}>
                            <Button variant="outlined" className={"submit-button"} onClick={this.handleSubmission.bind(this)}>Submit</Button>
                            {this.state.isSubmitting ? <CircularProgress className={'loading-indicator'} color={"secondary"}/> : null}
                        </div>
                    </Paper>
                    {this.state.userData.length !== 0 ? <UsersTable usersMaps = {this.state.userData} removeUser = {this.removeUser.bind(this)}/> : null}
                    {this.state.isRestoring ? <CircularProgress className={'loading-indicator'} color={"secondary"}/> : null}
                    <Snackbar open={this.state.showUserDeleted}
                              autoHideDuration={6000}
                              onClose={this.closeSnackBar.bind(this)}
                              action={<Button className={'undo-button'} variant="outlined" onClick={this.undoLastDelete.bind(this)}>Undo Delete</Button>}
                              message={this.state.lastUserDeleted !== undefined ? `User #${this.state.lastUserDeleted[0].customerID} deleted.` : null}
                    />
                </div>
            );
    }
}
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