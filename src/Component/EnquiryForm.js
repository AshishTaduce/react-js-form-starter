import React from "react";
import {Button, CircularProgress, MenuItem, Select, TextField} from '@material-ui/core';
import UsersTable from "./UserTable";
import  '../App.css';
import Paper from "@material-ui/core/Paper";



class EnquiryForm extends React.Component {
    state = {
        customerId: '',
        customerName: '',
        gender: 'Male',
        number: '',
        isSubmitting: false,
        userData: [],
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
        let request = await fetch('https://cors-anywhere.herokuapp.com/https://us-central1-form-manager-7234f.cloudfunctions.net/saveCustomer', requestOptions);
        let data = await request.json();
        console.log('Response: ', data);
        this.setState({
            customerId: data.customerID,
        });
        userField['customerID'] = data.customerID;
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
                    <UsersTable usersMaps = {this.state.userData}/>
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