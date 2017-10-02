import React from 'react'
import { Switch, Route } from 'react-router-dom'
import TodoList from '@/TodoList'

const App = () => (
  <div className='app-core'>
    <Switch>
      <Route path='/todolist' component={TodoList} />
    </Switch>
  </div>
)

export default App
