import React from 'react'
import axios from 'axios'

class CreateBlog extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      title: '',
      category_id: '',
      content: '',
      categories: []
    }
  }

  componentDidMount () {
    axios({
      method: 'get',
      url: 'http://127.0.0.1:5000/category/'
    }).then(res => {
      this.setState({
        categories: res.data.data
      })
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
      method: 'post',
      url: 'http://127.0.0.1:5000/blogs/user',
      data: {title: this.state.title, content: this.state.content, category_id: Number(this.state.category_id)},
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => {
      if (!res.data.error) {
        this.setState({
          message: 'Blog Posted Successfully. Redirecting to your blogs.'
        })
        setTimeout(() => this.props.history.push('/myblogs'), 3000)
      }
      else {
        this.setState({
          message: 'Error Occured'
        })
      }
    }).catch(err => this.setState({message: err.message}))
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
            <div className='col-6'>
              <label htmlFor='category_id'>Category</label>
              <select className='custom-select' id='category_id' onChange={this.handleChange} required>
                <option value=''>Select Category</option>
                {this.state.categories && this.state.categories.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
              </select>
            </div>
          </div>
          <div className='mt-3'>
            <label htmlFor='content'>Content</label>
            <textarea id='content' className='form-control' onChange={this.handleChange} rows='10' value={this.state.content} required />
          </div>
          <button type='submit' className='btn btn-dark mt-3 mb-2'>Post</button>
        </form>
        {this.state.message && <h3 className='text-dark text-center mb-2'>{this.state.message}</h3>}
      </div>
    )
  }
}

export default CreateBlog
