import React from 'react'
import axios from 'axios'
import styles from './blogcard.module.css'
import { Link } from 'react-router-dom'

class BlogCard extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      category: ''
    }
  }

  componentDidMount () {
    axios({
      method: 'get',
      url: 'http://127.0.0.1:5000/category/' + this.props.obj.category_id
    }).then(res => {
      this.setState({
        category: res.data.data
      })
    })
  }

  render () {
    return (
      <div className='card col-lg-5 col-md-8 col-11 p-0 shadow' style={{ height: '300px' }}>
        <div className='card-header text-center bg-dark' style={{ height: '70px' }}>
          <Link to={`/view/${this.props.obj.id}`} className='text-decoration-none'><h5 className='text-white'>{this.props.obj.title}</h5></Link>
        </div>
        <div className='card-body text-justify'>
          <button className='btn btn-dark btn-sm' disabled>{this.state.category}</button>
          <p className={`text-dark mt-2 ${styles.truncateText}`}>{this.props.obj.content}</p>
        </div>
        {!this.props.myblogs ? (
          <div className='card-footer bg-dark' style={{ height: '70px' }}>
            <h5 className='text-center text-white'>Author: {this.props.obj.author}</h5>
          </div>
        ) : (
          <div className='card-footer bg-dark d-flex justify-content-center' style={{ height: '70px' }}>
            <Link to={`/myblogs/${this.props.obj.id}`}><button className='btn btn-dark'>View Blog</button></Link>
            <Link to={`/editblog/${this.props.obj.id}`}><button className='btn btn-dark'>Edit Blog</button></Link>
            <button className='btn btn-dark'>Delete Blog</button>
          </div>
        )}
      </div>
    )
  }
}

export default BlogCard
