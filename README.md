## Setup Instructions

### CLONING THE REPOSITORY

```bash
git clone https://github.com/TanmayBansal29/workindia-assignment
cd workindia-assignment
```

### INSTALLING DEPENDENCIES
```bash
npm install
```

## Setup MySQL Database
### LOG INTO MYSQL SERVER
#### USE SQL WORKBENCH 
Using Sql Workbench log into MySql Server - root

After login into the mysql server, you can use the irctc.sql file in /sql folder and run all those commands on MySQL Workbench to have everything ready

### CONFIGURING ENVIRONMENT VARIABLES
#### In the .env file in the root folder add the necessary environment values
#### Some of the default values written below can be used
DB_HOST=MySQL Server Host (127.0.0.1)

DB_NAME="irctc"

DB_USER=MySQL Server User (root)

DB_PASSWORD=MySQL Server Password

PORT = 3000

JWT_SECRET= "f66801ac4d01b503fb9f8ffe46805a3be24ece72df76d22115003f9b7f7c50e6"

API_ADMIN = "secretkey@Admin"

### RUNNING THE APPLICATION
Once complete setup is done 

```bash
npm run dev
```

#### ADMIN CREDENTIALS:
email: admin@gmail.com

password: admin@123

## API ENDPOINTS
### APIS can be tested in Postman

1. POST http://localhost:3000/api/v1/user/register

   Example req.body
   {
    "firstName": "Tanmay",
    "lastName": "Bansal",
    "email": "tanmay@gmail.com",
    "password": "@Tanmay098"
    }

2. POST http://localhost:3000/api/v1/user/login

   Example req.body
   {
    "email": "tanmay@gmail.com",
    "password": "@Tanmay098"
    }

3. POST http://localhost:3000/api/v1/train/addTrain

    For Adding train, you need to login as admin and in the Headers we have to add (key, value) = (x-api-key, secretkey@Admin)

    Example req.body
    {
    "trainNumber": "18779",
    "name": "Rajdhani Express",
    "source": "Delhi",
    "destination": "Mumbai",
    "totalSeats": 200,
    "availableSeats": 55,
    "fare": 2450
    }

4. GET http://localhost:3000/api/v1/train/getTrains

    Example req.body
    {
    "source": "Delhi",
    "destination": "Mumbai"
    }

5. POST http://localhost:3000/api/v1/book/:trainID

    For booking seats, you need to login as a user

    :trainID can be the id that is created and stored in database

    Example req.body
    {
    "journeyDate": "2025-05-24",
    "numberOfSeats": 4
    }

6. GET http://localhost:3000/api/v1/booking/details/:bookingID

    For getting particular booking details, you need to be logged in as user
    
    Nothing needs to sent in req.body
    