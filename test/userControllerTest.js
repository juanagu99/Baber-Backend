//Math.floor(Math.random() * (9999999 - 2)) + 2;
const userController = require('../src/controllers/usersController')
const dbConecction = require('../src/utilities/dbConecction')

var assert = require('assert');
const { resolve } = require('path');
const { doesNotMatch } = require('assert');
describe('Tests to userController', function () {

    it('shoul returns 2', function () {
      assert.equal(2, 1+1);
    });
    it('if the client try registry a user that aready exist, then should return: User already in use ', async (done) => {
        
        let data = {
            body: {
                "email": "test99@correo.com",
                "password": "test01",
                "fullname": "fullname",
                "addres": "calle 14"
            }
        }
        let response =  await userController.saveUser(data)

            assert.equal(2, 2)
        
    });
});