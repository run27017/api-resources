import Vue from 'vue'
import { definedActions } from './defines'

class Base {
  static fields = false

  constructor (attrs = {}) {
    this.attrs = attrs
  }

  clone () {
    return new this.constructor(this.attrs)
  }

  // 1. 始终保留 fields 的字段；2. 用 attrs 完全替代剩余字段
  setAttrs (attrs) {
    const fields = this.constructor.fields || []

    // 将不在 fields 和 attrs 中的字段删除
    for (const key of Object.keys(this)) {
      if (!(key in attrs) || fields.indexOf(key) === -1) {
        Vue.delete(this, key)
      }
    }

    // 设置 fields 的字段
    for (const field of this.constructor.fields) {
      this[field] = attrs[field]
    }

    // 添加剩余的字段
    for (const [key, value] of Object.entries(attrs)) {
      if (fields.indexOf(key) === -1) {
        Vue.set(this, key, value)
      }
    }
  }

  // 用 attrs 完全替代内在字段
  replaceAttrs (attrs) {
    // 将不在 attrs 中的字段删除
    for (const key of Object.keys(this)) {
      if (!(key in attrs)) {
        Vue.delete(this, key)
      }
    }

    // 更新或添加字段
    for (const [key, value] of Object.entries(attrs)) {
      if (key in this) {
        this[key] = value
      } else {
        Vue.set(this, key, value)
      }
    }
  }

  // 返回一个纯 Object 的字段-值列表
  get attrs () {
    return Object.keys(this).reduce((accumulate, attrKey) => {
      accumulate[attrKey] = this[attrKey]
      return accumulate
    }, {})
  }

  // 通过一个纯 Object 的字段-值列表修改内部属性
  // 原对象内，对于 attrs 中的字段，用旧值覆盖新值，删除不在 attrs 中字段
  set attrs (attrs) {
    if (this.constructor.fields) {
      this.setAttrs(attrs)
    } else {
      this.replaceAttrs(attrs)
    }
  }

  static use (actionName, { scope } = { scope: 'instance' }) {
    const definedAction = definedActions[actionName]
    if (definedAction) {
      const proto = scope === 'static' ? this : this.prototype
      proto[actionName] = definedAction(this)
    } else {
      throw new Error(`未找到预定义 action：${actionName}`)
    }
  }
}

export default Base
