import { observable } from 'mobx'

export default class TodoModel {
  id = Math.random()
  @observable title
  @observable finished

  constructor (title, finished) {
    this.title = title || '暂无'
    this.finished = finished
  }

  toggle () {
    this.finished = !this.finished
  }

  toJS () {
    return {
      id: this.id,
      title: this.title,
      finished: this.finished
    }
  }

  static fromJS (object) {
    return new TodoModel(object.title, object.finished)
  }
}
