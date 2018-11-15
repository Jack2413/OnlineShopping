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

echo 'Test Delete orderDetails'
curl -H "Content-Type: application/json" -X DELETE -d '{"orderID":"5","productID":"40"}' https://nwen304onlineshoping.herokuapp.com/deleteOrderDetails
echo

echo 'Test /addtoorders'
curl -H "Content-Type: application/json" -X POST -d '{"email":"test@gmail.com"}' https://nwen304onlineshoping.herokuapp.com/addtoorders
echo

echo 'Test /addtoorderdetails'
curl -H "Content-Type: application/json" -X POST -d '{"orderid":"1","email":"test@gmail.com","productid":"38","amount":"2","totalprice":"50"}' https://nwen304onlineshoping.herokuapp.com/addtoorderdetails
echo

echo 'Test /cartadd1'
curl -H "Content-Type: application/json" -X PUT -d '{"name":"FAMILY MINION","email":"test@gmail.com"}' https://nwen304onlineshoping.herokuapp.com/cartadd1
echo

echo 'Test /cartminus1'
curl -H "Content-Type: application/json" -X PUT -d '{"name":"FAMILY MINION","email":"test@gmail.com"}' https://nwen304onlineshoping.herokuapp.com/cartminus1
echo

echo 'Test /emptycart'
curl -H "Content-Type: application/json" -X PUT -d '{"email":"test@gmail.com"}' https://nwen304onlineshoping.herokuapp.com/emptycart
echo

echo 'Test /currentorderid'
curl -H "Content-Type: application/json" -X GET -d '{"80"}' https://nwen304onlineshoping.herokuapp.com/currentorderid
echo

echo 'Test /cartdelete'
curl -H "Content-Type: application/json" -X PUT -d '{"name":"FAMILY MINION","email":"test@gmail.com"}' https://nwen304onlineshoping.herokuapp.com/cartdelete
echo

echo 'Test /db'
curl -H "Content-Type: application/json" -X GET -d '{}' https://nwen304onlineshoping.herokuapp.com/db
echo

echo 'Test /search/DAVE THE MINION'
curl -H "Content-Type: application/json" -X GET -d '{}' https://nwen304onlineshoping.herokuapp.com/search/DAVE THE MINION
echo

echo 'Test /addtoproduct'
curl -H "Content-Type: application/json" -X POST -d '{"name":"DAVE THE MINION","price":"15","imagecode":"1","description":"this is a minion toy"}' https://nwen304onlineshoping.herokuapp.com/addtoproduct
echo

echo 'Test /addtocart'
curl -H "Content-Type: application/json" -X POST -d '{"name":"DAVE THE MINION","price":"15","email":"test@gmail.com", "productid":"38"}' https://nwen304onlineshoping.herokuapp.com/addtocart
echo

echo 'Test /recommandation'
curl -H "Content-Type: application/json" -X POST -d '{}' https://nwen304onlineshoping.herokuapp.com/recommandation
echo
