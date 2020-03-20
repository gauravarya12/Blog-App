import React from 'react'
import axios from 'axios'

class CommentBox extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      editPressed: false,
      commentbox: ''
     }
  }

  componentDidMount () {
    this.setState({ ...this.props.obj, commentbox: this.props.obj.comment })
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  handleEdit = () => {
    this.setState({
      editPressed: true
    })
  }

  handleUpdate = () => {
    const token = localStorage.getItem('token')
    axios({
      method: 'put',
      url: 'http://127.0.0.1:5000/comments/manipulate/' + this.state.id,
      data: {comment: this.state.commentbox},
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => {
      if (!res.data.error) {
        this.setState({
          editPressed: false
        }, () => this.props.updateParent())
      }
    })
  }

  handleDelete = () => {
    const token = localStorage.getItem('token')
    axios({
      method: 'delete',
      url: 'http://127.0.0.1:5000/comments/manipulate/' + this.state.id,
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => {
      if (!res.data.error) {
        this.props.updateParent()
      }
    })
  }

  render () {
    return (
      <div className='mt-2 row border border-dark align-items-center rounded'>
        <div className='col-6'>
          <p className='font-weight-bolder'>{this.state.author}</p>
          {!this.state.editPressed ? <p>{this.state.commentbox}</p> : (
            <input type='text' className='form-control' value={this.state.commentbox} onChange={this.handleChange} id='commentbox' />
          )}
        </div>
        <div className='col-6'>
          <div className='row d-flex justify-content-end'>
            {this.state.current && (
              <>
                <button className='btn btn-dark mr-2' onClick={ !this.state.editPressed ? this.handleEdit : this.handleUpdate }>{!this.state.editPressed ? 'Edit' : 'Update'}</button>
                <button className='btn btn-dark mr-2' onClick={this.handleDelete}>Delete</button>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default CommentBox
