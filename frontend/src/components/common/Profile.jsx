import React from 'react'
import axios from 'axios'

class Profile extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      name: '',
      email: ''
    }
  }

  componentDidMount () {
    const token = localStorage.getItem('token')
    axios({
      method: 'get',
      url: 'http://127.0.0.1:5000/auth/details',
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => {
      if (!res.data.error) {
        this.setState({
          name: res.data.data.name,
          email: res.data.data.email
        })
      }
    })
  }

  render () {
    return (
      <div className='container mx-auto mt-5'>
        <div className='col-6'>
          <p>Name: {this.state.name}</p>
          <p>Email: {this.state.email}</p>
        </div>
      </div>
    )
  }
}

export default Profile
