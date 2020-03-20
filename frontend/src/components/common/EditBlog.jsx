import React from 'react'
import axios from 'axios'

class EditBlog extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      title: '',
      content: '',
      message: ''
    }
  }

  componentDidMount () {
    axios({
      method: 'get',
      url: 'http://127.0.0.1:5000/blogs/' + this.props.match.params.blogId
    }).then(res => {
      if (!res.data.error) {
        this.setState({
          title: res.data.data.title,
          content: res.data.data.content
        })
      }
    })
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  handleSubmit = (e) => {
      e.preventDefault()
      const token = localStorage.getItem('token')
      axios({
          method: 'put',
          url: 'http://127.0.0.1:5000/blogs/' + this.props.match.params.blogId,
          data: { ...this.state },
          headers: {
              Authorization: `Bearer ${token}`
          }
      }).then(res => {
          if (!res.data.error) {
            this.setState({
                message: 'Blog Updated Successfully. Redirecting to your blogs.'
              })
              setTimeout(() => this.props.history.push('/myblogs'), 3000)
          }
      })
  }

  render () {
    return (
      <div className='container mx-auto mt-5'>
        <form onSubmit={this.handleSubmit}>
          <div className='row d-flex justify-content-between'>
            <div className='col-6'>
              <label htmlFor='title'>Title</label>
              <input id='title' type='text' value={this.state.title} onChange={this.handleChange} placeholder='Enter Title' className='form-control' required />
            </div>
          </div>
          <div className='mt-3'>
            <label htmlFor='content'>Content</label>
            <textarea id='content' className='form-control' onChange={this.handleChange} rows='10' value={this.state.content} required />
          </div>
          <button type='submit' className='btn btn-dark mt-3 mb-2'>Update</button>
        </form>
        {this.state.message && <h3 className='text-dark text-center mb-2'>{this.state.message}</h3>}
      </div>
    )
  }
}

export default EditBlog
