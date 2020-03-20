import React from 'react'
import { Link } from 'react-router-dom'
import Routes from './Routes'
import { connect } from 'react-redux'
import { logoutUser, loginUser } from './redux/actions'

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  static getDerivedStateFromProps (prevProps) {
    if (localStorage.getItem('token')) {
      prevProps.loginUser()
    }
    return null
  }

  handleLogOut = () => {
    localStorage.clear()
    this.props.logoutUser()
  }

  render () {
    return (
      <>
        <nav className='navbar navbar-expand-lg navbar-light bg-dark'>
          <Link className='navbar-brand text-white' to='/'>Home</Link>
          <button className='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbarNav' aria-controls='navbarNav' aria-expanded='false' aria-label='Toggle navigation'>
            <span className='navbar-toggler-icon' />
          </button>
          <div className='collapse navbar-collapse justify-content-end' id='navbarNav'>
            <ul className='navbar-nav'>
              {this.props.isLogged && (
                <li className='nav-item'>
                  <Link to='/createblog'><button className='btn btn-dark mr-2'>Create Blog</button></Link>
                </li>
              )}
              {this.props.isLogged && (
                <li className='nav-item'>
                  <Link to='/profile'><button className='btn btn-dark mr-2'>My Profile</button></Link>
                </li>
              )}
              <li className='nav-item'>
                {!this.props.isLogged ? <Link to='/'><button className='btn btn-dark mr-2'>Login</button></Link>
                  : <Link to='/myblogs'><button className='btn btn-dark mr-2'>My Blogs</button></Link> }
                
              </li>
              <li className='nav-item'>
                {!this.props.isLogged ? <Link to='/signup'><button className='btn btn-dark'>Signup</button></Link>
                  : <button className='btn btn-dark' onClick={this.handleLogOut}>Logout</button>}
              </li>
            </ul>
          </div>
        </nav>
        <Routes />
      </>
    )
  }
}

const mapStateToProps = state => ({
  isLogged: state.isLogged
})

const mapDispatchToProps = dispatch => ({
  logoutUser: () => dispatch(logoutUser()),
  loginUser: () => dispatch(loginUser())
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
