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

echo 'Test get order'
curl -H "Content-Type: application/json" -X PUT -d '{"email":"test@gmail.com"}' https://nwen304onlineshoping.herokuapp.com/getOrder
echo

echo 'Test get orderDetails'
curl -H "Content-Type: application/json" -X PUT -d '{"orderID":"5"}' https://nwen304onlineshoping.herokuapp.com/getOrderDetails
echo

echo 'Test modify orderDetails'
curl -H "Content-Type: application/json" -X PUT -d '{"orderID":"5","productID":"40","amount":"3"}' https://nwen304onlineshoping.herokuapp.com/getOrderDetails
echo

echo 'Test Delete orderDetails'
curl -H "Content-Type: application/json" -X DELETE -d '{"orderID":"5","productID":"40"}' https://nwen304onlineshoping.herokuapp.com/deleteOrderDetails
echo

echo 'Test add product'
curl -H "Content-Type: application/json" -X POST -d '{"name":"MINION FAMILY", "price":"15", "descroption":"123"}' https://nwen304onlineshoping.herokuapp.com/cartadd1
echo

echo 'Test cartminus1'
curl -H "Content-Type: application/json" -X DELETE -d '{"orderID":"5","productID":"40"}' https://nwen304onlineshoping.herokuapp.com/deleteOrderDetails
echo

echo 'Test cartadd1'
curl -H "Content-Type: application/json" -X POST -d '{"name":"MINION FAMILY", "price":"15", "descroption":"123"}' https://nwen304onlineshoping.herokuapp.com/addtoproduct
echo

echo 'Test add product'
curl -H "Content-Type: application/json" -X POST -d '{"name":"MINION FAMILY", "price":"15", "descroption":"123"}' https://nwen304onlineshoping.herokuapp.com/addtoproduct
echo