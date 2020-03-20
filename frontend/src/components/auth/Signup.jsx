import React from 'react'
import axios from 'axios'

class Signup extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
            name: '',
            message: ''
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault()
        axios({
            method: 'post',
            url: 'http://127.0.0.1:5000/auth/signup',
            data: this.state
        }).then(res => this.setState({
            email: '',
            name: '',
            password: '',
            message: res.data.message
        })).catch(err => this.setState({
            email: '',
            name: '',
            password: '',
            message: err.message
        }))
    }

    render () {
        return (
            <div className='container mx-auto mt-5 justify-content-center d-flex'>
                <form className='col-6' onSubmit={this.handleSubmit}>
                    <label htmlFor='name'>Name</label>
                    <input type='text' className='form-control' id='name' onChange={this.handleChange} value={this.state.name} required></input>
                    <label htmlFor='email'>Email</label>
                    <input type='email' className='form-control' id='email' onChange={this.handleChange} value={this.state.email} required></input>
                    <label htmlFor='password'>Password</label>
                    <input type='password' className='form-control' id='password' onChange={this.handleChange} value={this.state.password} required></input>
                    <div className='justify-content-center mt-2 d-flex'>
                        <button className='btn btn-dark' type='submit'>Signup</button>
                    </div>
                    {this.state.message && <h3 className='text-center text-dark'>{this.state.message}</h3>}
                </form>
            </div>
        )
    }
}

export default Signup
