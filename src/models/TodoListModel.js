import { observable, computed, action } from 'mobx'

import TodoModel from './TodoModel'

export default class TodoListModel {
  @observable todos = []

  @computed
  get unfinishedTodoCount () {
    return this.todos.filter(todo => !todo.finished).length
  }

  @action
  addTodo (title) {
    this.todos.push(new TodoModel(title, false))
  }

  toJS () {
    return this.todos.map(todo => todo.toJS())
  }

  static fromJS (array) {
    const todoStore = new TodoListModel()
    todoStore.todos = array.map(item => TodoModel.fromJS(item))
    return todoStore
  }
}

// https://qiutc.me/post/efficient-mobx.html
