import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Bumper from '^/Bumper'
import Login from './Login'
import TodoList from 'bundle-loader?lazy&name=todolist!./TodoList'

const App = () => (
  <div className='app-core'>
    <Switch>
      <Route
        path='/login'
        component={Login}
      />
      <Route
        path='/todolist'
        component={() => <Bumper compnent={TodoList} />}
      />
    </Switch>
  </div>
)

export default App
