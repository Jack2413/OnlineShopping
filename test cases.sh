#!/bin/sh
# test cases
#test the GET method of the database
echo 'Getting task(s) from database'
curl -H "Content-Type: application/json" -X POST -d '{"username":"testusername","email":"testemail@gmail.com","password":"123456"}' https://nwen304onlineshoping.herokuapp.com/login
echo
#test the POST method of the database
echo 'Test '
curl -H "Content-Type: application/json" -X POST -d '{"username":"testusername","email":"test0email@gmail.com","password":"123456"}' https://nwen304onlineshoping.herokuapp.com/register
echo

echo 'Test reset password'
curl -H "Content-Type: application/json" -X PUT -d '{"email":"test@gmail.com","oldpassword":"123123","newpassword":"123123"}' https://nwen304onlineshoping.herokuapp.com/reset
echo

echo 'Delete the task'
curl -H "Content-Type: application/json" -X DELETE -d '{"orderID":"5","productID":"40"}' https://nwen304onlineshoping.herokuapp.com/deleteOrderDetails
echo

echo 'get all the prducts'
curl -H "Content-Type: application/json" -X GET -d https://nwen304onlineshoping.herokuapp.com/cartdb
echo

echo 'Test add product'
curl -H "Content-Type: application/json" -X POST -d '{"name":"", "price":"15", "descroption","123"}' https://nwen304onlineshoping.herokuapp.com/addtoproduct
echo