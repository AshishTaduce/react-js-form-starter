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
        lastUserIndex: undefined,
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
        console.log('Inside handleSubmission ');
        let userField = new Map();
        userField['name'] = this.state.customerName;
        userField['gender'] = this.state.gender;
        userField['number'] = this.state.number;
        let temp = this.state.userData;
        console.log('Before adding users are:', temp);
        this.setState({
            isSubmitting: true,
        });
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',},
            body: JSON.stringify(userField),
            credentials: 'include',
        };
        let request = await fetch('http://localhost:5004/customer/add', requestOptions);
        let data = await request.json();
        console.log('Response from add: ', data);
        this.setState({
            customerId: data._id,
        });
        userField['_id'] = data._id;
        userField['deleting'] = false;
        userField['active'] = true;
        temp.push(userField);
        console.log('New user are : ', temp);
        this.setState({
            userData: temp,
            customerId: '',
            customerName: '',
            gender: 'Male',
            number: '',
            isSubmitting: false,
        });
    }

    async removeUser(customerId){
        let temp = this.state.userData.slice();
            let index = temp.findIndex((e) => e._id === customerId);
            temp[index].deleting = true;
            this.setState({
                lastUserIndex: index,
                userData:temp,
            });
            await this.callDelete(customerId);
    }

    async undoLastDelete(){
        console.log('Here');
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({id: this.state.lastUserDeleted}),
            };
            let request = await fetch('http://localhost:5004/customer/undoDelete', requestOptions);
            let data = await request.json();
            console.log('Response from undoDelete: ', data.userRestored, this.state.lastUserIndex);
            let temp = this.state.userData.slice();
            let userDeleted = temp[this.state.lastUserIndex];
            userDeleted.deleting = false;
            userDeleted.active = true;
            // temp.splice(this.state.lastUserIndex, 0, [userDeleted]);
            this.setState({
                userData: temp,
                // lastUserDeleted: undefined,
            })

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
        console.log('Delete completed , with response:', data)
        let temp = this.state.userData.slice();
        let userDeleted = data.id;
        let target = temp.find((e) => e._id === customerId);
        target.active = false;
        target.deleting = false;
        // temp.splice(temp.findIndex((e) => e.id === customerId), 1, target);

        this.setState({
            userData:temp,
            // lastUserDeleted: userDeleted,
        });
        console.log('User deleted id: ', this.state.lastUserDeleted);
        setTimeout(() =>{
            this.setState({
                showUndo: false,
            })
        }, 2500);
    }

    async getCustomers(){
        let customers = await fetch('http://localhost:5004/customers', {credentials: 'include',});
            let data = await customers.json();
            this.setState({
                userData: data,
                isLoading: false,
            });
            console.log(data, 'DATA FROM SERVER: ');
        if (customers.status !== 200) {
            console.log(customers.status, customers.statusText);
            alert('Session Expired! Login again.');
            this.props.history.push('/');
        }
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
                    {this.state.isLoading ? <CircularProgress color={"primary"}/> : <UsersTable key = {this.state.userData.length} usersMaps = {this.state.userData.filter(e => e.active)} removeUser = {this.removeUser.bind(this)}/>}
                    <Snackbar open={this.state.showUndo}
                              message={'User deleted'}
                              autoHideDuration={2500}
                              onClose={() => {
                                this.setState({
                                  showUndo: false,
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