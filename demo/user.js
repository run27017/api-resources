import axios from 'axios'
import Base from '../base'

class User extends Base {
  constructor (attrs = {}) {
    super(attrs)
  }

  static async findBy ({ name }) {
    const { user: attrs } = await axios.get(`/users/find_by`, { 
      params: { name }
    })
    return new User(attrs)
  }
}

User.use('list', { scope: 'static' })
User.use('find', { scope: 'static' })
User.use('save')
User.use('reload')
User.use('destroy')

export default User
