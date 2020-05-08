import React from "react";
import {Tabs, Tab, TextField, Button} from '@material-ui/core';
import  '../App.css';
import Paper from "@material-ui/core/Paper";

export default class LoginPage extends React.Component {

    state = {
        value: 1,
        email: undefined,
        password: undefined,
        confPassword: undefined,
        showStatus: false,
        status: undefined,
    }

    handleInputChange(event) {
        this.setState(
            {
                [event.target.name]: event.target.value
            }
        )
    }

    changeTab(value){
        this.setState({
            value: value,
        });
        // this.clearInputField();
    }

    clearInputField(){
        this.setState({
            email: undefined,
            password: undefined,
            confPassword: undefined,
        })
    }

    async handleSubmission (){
        let success = this.getFeedBack();
        if(success){
            console.log('Entered signIn/login');
            const requestOptions = {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({email: this.state.email, password: this.state.password})
            };
            let request = await fetch(`http://localhost:5004/${this.state.value === 0 ? 'signUp': 'login'}`, requestOptions);
            let data = await request.json();
            this.setState({
                showStatus: true,
                status: this.state.value === 0
                    ? data._id !== undefined
                        ?`Signup Successful with id: ${data._id}`
                        : `Signup Failed, user already exist.`
                    : data._id !== undefined
                        ? `Login success`
                        : `Login failed, check email and password`,
            });
            if(data._id !== undefined) {
                this.props.history.push('/forms');
            }
        }
        // else this.clearInputField();
            setTimeout(() => {this.setState({
                showStatus: false,
                status: undefined,
            })}, 3000);
    }

    getFeedBack (){
        if(this.state.email === '' || !this.state.email.includes('@')) {
            this.setState({
                showStatus: true,
                status: 'Invalid email',
            })
            return false;
        }

        if(this.state.value === 0  && this.state.password !== this.state.confPassword){
            this.setState({
                showStatus: true,
                status: 'Passwords dont match',
            })
            return false;
        }
       // return (this.state.email !== '' && this.state.email.includes('@'));
        return true;
    }

    render() {
        return (
            <div>
                <Paper className={'paper'}>
                        <Tabs value={this.state.value} aria-label="simple tabs example" onChange = {(event, value) => this.changeTab(value)}>
                            <Tab value = {0}  label="SignUp" enable = {this.state.value === 0}/>
                            <Tab value = {1} label="Login" enable = {!(this.state.value === 0)}/>
                        </Tabs>
                    <div hidden={this.state.value === 1} className={'login-field'}>
                        <TextField name={'email'} label={'Email'} onChange={this.handleInputChange.bind(this)} className={'input-field'} value={this.state.email}/>
                        <TextField type="password" name={'password'} label={'password'} onChange={this.handleInputChange.bind(this)} className={'input-field'} value={this.state.password}/>
                        <TextField type="password" name={'confPassword'} label={'Confirm password'} onChange={this.handleInputChange.bind(this)} className={'input-field'} value={this.state.confPassword}/>
                    </div>
                    <div hidden={this.state.value === 0} className={'login-field'}>
                        <TextField name={'email'} label={'Email'} onChange={this.handleInputChange.bind(this)} className={'input-field'} value={this.state.email}/>
                        <TextField type="password" name={'password'} label={'password'} onChange={this.handleInputChange.bind(this)} className={'input-field'} value={this.state.password}/>
                    </div>
                    <Button variant="outlined" onClick={this.handleSubmission.bind(this)}>{this.state.value === 0 ? 'Sign Up' : 'Login'}</Button>
                    {this.state.showStatus ? this.state.status : null}
                </Paper>

            </div>
        );
    }
}