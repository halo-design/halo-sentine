import React from 'react'
import { observable, action } from 'mobx'
import { observer, inject } from 'mobx-react'

import Todo from './Todo'

@inject(stores => {
  const {todos: { todos, unfinishedTodoCount }} = stores
  return {
    myTodos: todos,
    unTodos: unfinishedTodoCount,
    addTodo: title => stores.todos.addTodo(title)
  }
})

@observer
class TodoList extends React.Component {
  @observable newTodoTitle = ''

  render () {
    return (
      <div>
        <form onSubmit={this.handleFormSubmit}>
          New Todo:
          <input
            type='text'
            value={this.newTodoTitle}
            onChange={this.handleInputChange}
          />
          <button type='submit'>Add</button>
        </form>
        <hr />
        <ul>
          {this.props.myTodos.map(todo => (
            <Todo todo={todo} key={todo.id} />
          ))}
        </ul>
        Tasks left: {this.props.unTodos}
      </div>
    )
  }

  @action
  handleInputChange = e => {
    this.newTodoTitle = e.target.value
  }

  @action
  handleFormSubmit = e => {
    this.props.addTodo(this.newTodoTitle)
    this.newTodoTitle = ''
    e.preventDefault()
  }
}

export default TodoList
