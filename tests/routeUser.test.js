const{app}=require('../serveur')
const request = require('supertest')
const {ObjectID} = require('mongodb')
// const expect = require('expect')
const {expect}=require('chai')

const serveruser = request.agent("http://localhost:3000/users")
const servertodo=request.agent('http://localhost:3000/todos')


var  {Todo}=require('../Models/todo')
var  {User}=require('../Models/user')
var  {users,injectUsers,todos,injectTodos}=require('./testcase/testCase')



beforeEach(injectUsers)
beforeEach(injectTodos)

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    servertodo
      .post('/')
      .set('x-auth', users[0].tokens[0].token)
      .send({text})
      .expect((res) => {

        expect(res.body.text).to.equal(text);
      })
      .end((err, res) => {
        if (err) {
          throw err
        }

        Todo.find({text}).then((todos) => {

          expect(todos.length).to.equal(1);
          expect(todos[0].text).to.equal(text);
          done();
        }).catch((e) => {throw err});
      });
  });

  it('should not create todo with invalid body data', (done) => {
    servertodo
      .post('/')
      .set('x-auth', users[0].tokens[0].token)
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          throw err;
        }

        Todo.find().then((todos) => {

          expect(todos.length).to.equal(2);
          done();
        }).catch((e) => {throw err});
      });
  });
});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    servertodo
      .get('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).to.equal(1);
      })
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    servertodo
      .get(`/todo/${todos[0]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).to.equal(todos[0].text);
      })
      .end(done);
  });

  it('should not return todo doc created by other user', (done) => {
    servertodo
      .get(`/todos/${todos[1]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 if todo not found', (done) => {
    var hexId = new ObjectID().toHexString();

    request(app)
      .get(`/todos/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', (done) => {
    request(app)
      .get('/todos/123abc')
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});



//USERS
describe('POST /users',(done)=>{
  it('should create a user',()=>{
    var email = 'example@gmail.com'
    var password = '1234567'
    serveruser
    .post('/')
    .send({email,password})
    .expect(200)
    .expect((res)=>{

      expect(res.header['x-auth']).to.exist
      expect(res.body._id).to.exist
      expect(res.body.email).to.equal(email)
    })
    .end((err)=>{
      if(err){
        throw err
      }
      User.findOne({email}).then((user)=>{
        console.log(password)
        expect(user).to.exist
        expect(user.password).to.not.equal(password)
        done()
      }).catch((err)=>{
        throw err})
    })
  })

 it('should return validation errors if request invalid',(done)=>{
   serveruser
   .post('/')
   .send({
     email:'and',
     password:'123'
   })
   .expect(400)
   .end(done)
 })

 it('should not create user if email in use',(done)=>{
   serveruser
   .post('/')
   .send({
     email:users[0].email,
     password:'Password123!'
   })
   .expect(400)
   .end(done)
 })
})


describe('POST /users/login',()=>{
   it('should login user and return token',(done)=>{

     serveruser
     .post('/login')
     .send({
       email: users[1].email,
       password: users[1].password
       })
       .expect(200)
       .expect((res)=>{
         expect(res.header['x-auth']).to.exist
       })
       .end(done)
})

   it('should reject invalid login',(done)=>{

      serveruser
       .post('/login')
       .send({
         email: users[1].email,
         password: users[1].password + '1'
     })
       .expect(400)
       .expect((res)=>{
         expect(res.headers['x-auth']).to.not.exist
     })
     .end(done)

   })
})

describe('DELETE /user/Token',()=>{
  it('should remove auth token on logout',(done)=>{
    serveruser
    .delete('/logout')
    .set('x-auth',users[0].tokens[0].token)
    .expect(200)
    .end((err,res)=>{
      if(err){
        throw err
      }
      User.findById(users[0]._id).then((user)=>{
        expect(user.tokens.length).to.equal(0);
        done();
      }).catch((e)=>{
        throw err})
    })
  })
})
