import _ from 'lodash'
import pluralize from 'pluralize'
import axios from 'axios'

function defineListAction (mod) {
  const singularName = _.lowerFirst(mod.name)
  const pluralName = pluralize(singularName)
  return async function (params) {
    const { [pluralName]: list } = await axios.get(`/${pluralName}`, { params })
    return list.map(attrs => new this(attrs))
  }
}

function defineFindAction (mod) {
  const singularName = _.lowerFirst(mod.name)
  const pluralName = pluralize(singularName)
  return async function (id) {
    const { [singularName]: attrs } = await axios.get(`/${pluralName}/${id}`)
    return new this(attrs)
  }
}

function defineSaveAction (mod) {
  const singularName = _.lowerFirst(mod.name)
  const pluralName = pluralize(singularName)
  return async function () {
    let attrs
    if (this.id) {
      attrs = (await axios.put(`/${pluralName}/${this.id}`, { [singularName]: this.attrs }))[singularName]
    } else {
      attrs = (await axios.post(`/${pluralName}`, { [singularName]: this.attrs }))[singularName]
    }
    this.attrs = attrs
  }
}

function defineReloadAction (mod) {
  const singularName = _.lowerFirst(mod.name)
  const pluralName = pluralize(singularName)
  return async function () {
    const { [singularName]: attrs } = await axios.get(`/${pluralName}/${this.id}`)
    this.attrs = attrs
  }
}

function defineDestroyAction (mod) {
  const singularName = _.lowerFirst(mod.name)
  const pluralName = pluralize(singularName)
  return async function () {
    await axios.delete(`/${pluralName}/${this.id}`)
    this.$destroyed = true
  }
}

const definedActions = {
  list: defineListAction,
  find: defineFindAction,
  save: defineSaveAction,
  reload: defineReloadAction,
  destroy: defineDestroyAction
}

export { definedActions }
