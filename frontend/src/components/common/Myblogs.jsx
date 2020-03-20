import React from 'react'
import axios from 'axios'
import BlogCard from './BlogCard'

class Myblogs extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      blogs: [],
      message: '',
      update: false
    }
  }

  componentDidMount () {
    const token = localStorage.getItem('token')
    axios({
      method: 'get',
      url: 'http://127.0.0.1:5000/blogs/user',
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => {
      if (!res.data.error) {
        this.setState({
          blogs: res.data.data
        }, () => {
          if (this.state.blogs.length === 0) {
            this.setState({
              message: 'You have not posted any blogs.'
            })
          }
        })
      }
    }).catch(err => this.setState({ message: err.message }))
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.state.update !== prevState.update) {
      const token = localStorage.getItem('token')
    axios({
      method: 'get',
      url: 'http://127.0.0.1:5000/blogs/user',
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => {
      if (!res.data.error) {
        this.setState({
          blogs: res.data.data
        }, () => {
          if (this.state.blogs.length === 0) {
            this.setState({
              message: 'You have not posted any blogs.'
            })
          }
        })
      }
    }).catch(err => this.setState({ message: err.message }))
    }
  }


  handleUpdate = () => {
    this.setState(state => {this.setState({update: !state.update})})
  }

  render () {
    return (
      <div className='container mx-auto mt-5'>
        <div className='row justify-content-around d-flex'>
          {this.state.blogs && this.state.blogs.map(e => <BlogCard key={e.id} obj={e} myblogs handleUpdate={this.handleUpdate} />)}
        </div>
        {this.state.message && <h3 className='text-center text-dark'>{this.state.message}</h3>}
      </div>
    )
  }
}

export default Myblogs
