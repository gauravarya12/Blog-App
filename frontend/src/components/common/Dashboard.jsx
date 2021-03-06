import React from 'react'
import axios from 'axios'
import BlogCard from './BlogCard'

class Dashboard extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      blogs: [],
      message: ''
    }
  }

  componentDidMount () {
    const token = localStorage.getItem('token')
    axios({
      url: 'http://127.0.0.1:5000/blogs',
      method: 'get',
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => {
      if (!res.data.error) {
        this.setState({
          blogs: res.data.data
        }, () => {
          if (!this.state.blogs) {
            this.setState({
              message: 'No Blogs Found'
            })
          }
        })
      } else {
        this.setState({
          message: res.data.message
        })
      }
    }).catch(err => {
      this.setState({
        message: err.message
      })
    })
  }

  render () {
    return (
      <div className='container mx-auto mt-5'>
        <div className='row justify-content-around d-flex'>
          {this.state.blogs && this.state.blogs.map(e => <BlogCard key={e.id} obj={e} myblogs={false} />)}
        </div>
        {this.state.message && <h3 className='text-center text-dark'>{this.state.message}</h3>}
      </div>
    )
  }
}

export default Dashboard
