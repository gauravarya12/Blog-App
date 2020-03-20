import React from 'react'
import axios from 'axios'
import CommentBox from './CommentBox'

class Blog extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      comment: '',
      blog: {},
      comments: [],
      update: false
    }
  }

  componentDidMount () {
    const token = localStorage.getItem('token')
    axios({
      method: 'get',
      url: 'http://127.0.0.1:5000/blogs/' + this.props.match.params.blogId
    }).then(res => {
      if (!res.data.error) {
        const blog = res.data.data
        axios({
          method: 'get',
          url: 'http://127.0.0.1:5000/comments/' + this.props.match.params.blogId,
          headers: {
            Authorization: `Bearer ${token}`
          }
        }).then(res => {
          if (!res.data.error) {
            this.setState({
              comments: res.data.data,
              blog: blog,
              headers: {
                  Authorization: `Bearer ${token}`
              }
            })
          }
        })
      }
    })
  }

  componentDidUpdate (prevProps, prevState) {
      const token = localStorage.getItem('token')
      if (this.state.update !== prevState.update) {
        axios({
            method: 'get',
            url: 'http://127.0.0.1:5000/comments/' + this.props.match.params.blogId,
            headers: {
                Authorization: `Bearer ${token}`
            }
          }).then(res => {
            if (!res.data.error) {
              this.setState({
                comments: res.data.data,
              })
            }
          })
      }
  }

  handleChange = (e) => {
      this.setState({
          [e.target.id]: e.target.value
      })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    let token = localStorage.getItem('token')
    axios({
        method: 'post',
        url: 'http://127.0.0.1:5000/comments/' + this.props.match.params.blogId,
        data: {comment: this.state.comment},
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then(res => {
        if (!res.data.error) {
            this.setState(state => {
                return {
                    update: !state.update,
                    comment: ''
                }
            })
        }
    })
  }

  handleEditDelete = () => {
      this.setState(state => {
          return {
              update: !state.update
          }
      })
  }

  render () {
    return (
      <div className='container mx-auto mt-5 text-dark mb-3'>
        <h1 className='display-5'>{this.state.blog.title}</h1>
        <p className='text-justify font-weight-bold'>{this.state.blog.content}</p>
        <form onSubmit={this.handleSubmit}>
            <input type='text' value={this.state.comment} onChange={this.handleChange} className='form-control mt-2' id='comment' required placeholder='Enter Comment' />
            <button className='btn btn-dark mt-2' type='submit'>Comment</button>
        </form>
        {this.state.comments && this.state.comments.map(e => <CommentBox key={e.id} obj = {e} updateParent={this.handleEditDelete} />)}
      </div>
    )
  }
}

export default Blog
