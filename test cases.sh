#!/bin/sh
# test cases
#test the GET method of the database
echo 'Getting task(s) from database'
curl -H "Content-Type: application/json" -X GET -d '{"username":"testusername","email":"testemail@gmail.com","password":"123456"}' https://nwen304onlineshoping.herokuapp.com/login
echo
#test the POST method of the database
echo 'Add task in the database'
curl -H "Content-Type: application/json" -X POST -d '{"username":"testusername","email":"test0email@gmail.com","password":"123456"}' https://nwen304onlineshoping.herokuapp.com/register
echo

echo 'Add task in the database'
curl -H "Content-Type: application/json" -X POST -d '{"email":"test@gmail.com","oldpassword":"12312","newpassword":"123123"}' https://nwen304onlineshoping.herokuapp.com/reset
echo

# test the Put method update the task in the database
echo 'Updating the task in the databse'
curl -H "Content-Type: application/json" -X PUT -d '{"id":"40","task":"123", "name":"456"}' https://nwen304project2.herokuapp.com/update
echo

# test the Put method update the task state in the database 
echo 'Updating the task in the databse'
curl -H "Content-Type: application/json" -X PUT -d '{"id":"40","state":"todo"}' https://nwen304project2.herokuapp.com/put
echo

#test the DELETE method delete the task in the database
echo 'Delete the task'
curl -H "Content-Type: application/json" -X DELETE -d '{"orderID":"5" "productID":"40"}' https://nwen304onlineshoping.herokuapp.com/deleteOrderDetails
echo

echo 'Getting task(s) from database'
curl -H "Content-Type: application/json" -X GET  https://nwen304onlineshoping.herokuapp.com/getOrder
echo