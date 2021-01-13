# API Resources

> 用资源的方式编写前端 API 层

## 导言

传统的调用 API 的代码使用诸如 fetch、axios 等 ajax 调用框架，如：

```javascript
await axios.get('/users')
```

这里说的用资源编排的方式，类似于后端开发者熟知的 Active Record 模式：

```javascript
// 列出用户
await User.list()

// 创建用户
await User.create({ name: 'Jim', age: 18 })

// 查看用户
user = await User.find(1)

// 重载用户数据
await user.reload()

// 更新用户
await user.update({ age: user.age + 1 })

// 另一种更新用户的方法
user.age += 1
await user.save()

// 你也可以通过这样创建用户
user = User.new()
user.name = 'Jim'
user.age = 18
await user.save()

// 删除用户
await user.destroy()
```

## 引入指南

将 [src](src) 目录的代码拷贝到项目中即可。模块（如上面的 `User`）可参考示例 `demo/user.js`.

## 注意要点

### 项目依赖

1. vue 2.x
2. axios
3. lodash
4. 也许会有其他

### 接口规范

可以通过模块的 `use` 方法快捷定义接口，参考 `demo/user.js` 的部分代码：

```javascript
User.use('list', { scope: 'static' })
User.use('find', { scope: 'static' })
User.use('save')
User.use('reload')
User.use('destroy')
```

其中默认定义实例方法，标注 `{ scope: 'static' }` 的定义静态方法：

```javascript
await User.list()
await new User().reload()
```

通过此类方式生成的接口其路径、参数要满足一定的范式，举例如下：

- 返回用户列表：

    ```http
    GET /users
    
    --- Response ---
    {
      "users": [
        // ...
      ]
    }
    ```
    
- 创建用户：

    ```http
    POST /users
    
    {
      "user": {
        // ...
      }
    }
    
    --- Response ---
    {
      "user": {
        // ...
      }
    }
    ```

- 查看用户：

    ```http
    GET /users/:id
    
    --- Response ---
    {
      "user": {
        // ...
      }
    }
    ```

- 更新用户：

    ```http
    PUT /users/:id
    
    {
      "user": {
        // ...
      }
    }
    
    --- Response ---
    {
      "user": {
        // ...
      }
    }
    ```
    
- 删除用户：

    ```http
    DELETE /users/:id
    ```

基本如此。当然可以自定义和调整，相关代码见 `src/defines.js` 的全部代码和 `src/base.js` 的部分代码。

## License

MIT
