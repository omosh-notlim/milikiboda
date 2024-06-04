###### --------------
NOTE: Once setup, access the api route: [POST] /users to create users
      Log in with the user where isAdmin === true to be able to access
            [POST] /auth/register to register users

###### How to run
    git clone https://github.com/omosh-notlim/milikiboda.git

    ########
    1. Server setup(api):
        - open terminal
        - cd server
        - npm install
        - setup the .env file as instructed in the .envExample
        - npm start

    2. Server unit test:
        - open new terminal window
        - cd server
        - npm test

    3. Client setup:
        - open new terminal window
        - cd client
        - npm install
        - open file package.json in the client directory 
            then set the port your server is running on, example: "proxy": "http://localhost:3008/"
        - npm start
    
    4. Client unit test:
        - open new terminal window
        - cd client
        - npm test

Enjoy!!


###### ---------------------------------------------------
######


###### --------------------------------------------------
###### Sample api routes

###### to view all users   
    [GET] /users

###### to create user     
    [POST] /users

###### to view user by id
    [GET] /users/:id

###### to login
    [POST] /auth/login
    body:
    {
        "email": "USER1@GMAIL.com",
        "password": "1234"
    }


###### sample body
    {
        "name": "user 4",
        "email": "USER1@GMAIL.com",
        "password": "1234",
        "phoneNumber": 1111,
        "isAdmin": true
    }

    or

    {
        "name": "user 4",
        "email": "USER1@GMAIL.com",
        "password": "1234",
        "phoneNumber": 1111
    }


Enjoy!!

    