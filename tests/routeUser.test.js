const{app}=require('../serveur')
const request = require('supertest')
const expect = require('expect')

const {User}=require('./../Models/user')
const {routeUser}=require('../Routers/routeUser')
const {users,injectUsers}=require('./testcase/testcase')
var server = request.agent("http://localhost:3000/users")


beforeEach(injectUsers)

describe('POST /users',(done)=>{
  it('should create a user',()=>{
    var email = 'example@gmail.com'
    var password = '1234567'
    server
    .post('/')
    .send({email,password})
    .expect(200)
    .expect((res)=>{
      expect(res.header['x-auth']).toExist()
      expect(res.body._id).toExist()
      expect(res.body.email).not.toBe(email)
    })
    .end((err)=>{
      if(err){
        return done(err)
      }
      User.findOne({email}).then((user)=>{
        expect(user).toExist()
        expect(user.password).toBe(password)
        done()
      }).catch((e)=> {return e})
    })


  })
})
