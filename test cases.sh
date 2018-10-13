#!/bin/sh
# test cases
#test the GET method of the database
echo 'Getting task(s) from database'
curl -H "Content-Type: application/json" -X GET -d '{"username":"testusername","email":"testemail@gmail.com","password":"123456"}' https://nwen304onlineshoping.herokuapp.com/login
echo
#test the POST method of the database
echo 'Add task in the database'
curl -H "Content-Type: application/json" -X POST -d '{"task":"456","name":"789","state":"todo"}' https://nwen304project2.herokuapp.com/post
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
curl -H "Content-Type: application/json" -X DELETE -d '{"id":"40"}' https://nwen304project2.herokuapp.com/delete
echo
