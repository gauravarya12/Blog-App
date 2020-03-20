import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Dashboard from './components/common/Dashboard'
import { connect } from 'react-redux'
import Myblogs from './components/common/Myblogs'
import CreateBlog from './components/common/CreateBlog'
import Blog from './components/common/Blog'
import EditBlog from './components/common/EditBlog'
import Profile from './components/common/Profile'

class Routes extends React.Component {
  render () {
    return (
      <Switch>
        <Route exact path='/' render={(props) => !this.props.isLogged ? <Login {...props} /> : <Redirect to='/dashboard' />} />
        <Route path='/signup' render={(props) => !this.props.isLogged ? <Signup {...props} /> : <Redirect to='/dashboard' />} />
        <Route path='/dashboard' render={(props) => this.props.isLogged ? <Dashboard {...props} /> : <Redirect to='/' />} />
        <Route path='/myblogs/:blogId' render={(props) => this.props.isLogged ? <Blog {...props} /> : <Redirect to='/' />} />
        <Route path='/myblogs' render={(props) => this.props.isLogged ? <Myblogs {...props} /> : <Redirect to='/' />} />
        <Route path='/createblog' render={(props) => this.props.isLogged ? <CreateBlog {...props} /> : <Redirect to='/' />} />
        <Route path='/editblog/:blogId' render={(props) => this.props.isLogged ? <EditBlog {...props} /> : <Redirect to='/' />} />
        <Route path='/view/:blogId' render={(props) => this.props.isLogged ? <Blog {...props} /> : <Redirect to='/' />} />
        <Route path='/profile' render={(props) => this.props.isLogged ? <Profile {...props} /> : <Redirect to='/' />} />
      </Switch>
    )
  }
}

const mapStateToProps = state => ({
  isLogged: state.isLogged
})

export default connect(mapStateToProps, null)(Routes)
