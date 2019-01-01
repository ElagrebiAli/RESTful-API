const{app}=require('../serveur')
const request = require('supertest')
const expect = require('expect')
const {routeUser}=require('../Routers/routeUser')
const {User}=require('./../Models/user')
const {users,injectUsers}=require('./testcase/testcase')
var server = request.agent("http://localhost:3000/users")


beforeEach(async()=>{
  await injectUsers})

describe('POST /users',(done)=>{
  it('should create a user',()=>{
    var email = 'example@gmail.com'
    var password = '1234567'
    server
    .post('/')
    .send({email,password})
    .expect(200)
    .expect((res)=>{
      console.log(res.body)
      expect(res.header['x-auth']).toBeTruthy()
      expect(res.body._id).toBeTruthy()
      expect(res.body.email).toBe(email)
    })
    .end((err)=>{
      if(err){
        throw err
      }
      User.findOne({email}).then((user)=>{
        console.log(user)
        expect(user).toBeTruthy()
        expect(user.password).not.toBe(password)
        done()
      }).catch((e)=>done(e))
    })
  })

 it('should return validation errors if request invalid',(done)=>{
   server
   .post('/')
   .send({
     email:'and',
     password:'123'
   })
   .expect(400)
   .end(done)
 })

 it('should not create user if email in use',(done)=>{
   server
   .post('/')
   .send({
     email:users[0].email,
     password:'Password123!'
   })
   .expect(400)
   .end(done())
 })
})


describe('POST /users/login',()=>{
   it('should login user and return token',(done)=>{

     server
     .post('/login')
     .send({
       email: users[1].email,
       password: users[1].password
       })
       .expect(200)
       .expect((res)=>{
         expect(res.header['x-auth']).toBeTruthy()
       })
       .end(done)
})

   it('should reject invalid login',(done)=>{

      server
       .post('/login')
       .send({
         email: users[1].email,
         password: users[1].password + '1'
     })
       .expect(400)
       .expect((res)=>{
         expect(res.headers['x-auth']).toBeFalsy();
     })
     .end(done)

   })
})

describe('DELETE /user/Token',()=>{
  it('should remove auth token on logout',(done)=>{
    sever
    .delete('/logout')
    .set('x-auth',users[0].tokens[0].token)
    .expect(200)
    .end((err,res)=>{
      if(err){
        return done(err)
      }
      User.findById(users[0]._id).then((user)=>{
        expect(user.tokens.length).toBe(0);
        done();
      }).catch((e)=>done(e))
    })
  })
})
