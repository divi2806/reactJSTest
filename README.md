Changes i have made in the files.
For the rest api - 

Server-side:

Added proper error handling and consistent response structure
Implemented soft delete using the deleted flag
Added population for related fields (createBy, attendes, attendesLead)
Added sorting by timestamp
Improved query filtering for non-superAdmin users
Added proper MongoDB ObjectId type conversion

Client-side:

Enhanced Redux slice with additional actions and error handling
Added loading states and error management
Implemented optimistic updates for better UX
Added proper type handling for IDs
Improved state management with additional reducers
Added proper error clearing mechanism


For the login fix- 
I have updated .env files for both client and server, 

We need to create adminuser in mongodb if not created already, 

# Approach to create admin user in mongodb if not created already. 
use your_database
db.users.insertOne({
    email: "admin@gmail.com",
    password: "$2a$10$YOUR_HASHED_PASSWORD", // admin123 hashed
    firstName: "Admin",
    lastName: "User",
    role: "superAdmin",
    active: true
})

# in the .env files, the variable values are hardcoded which can be updated individually or taking the keys from the server.


# Added {index,view, deletedata,deletemany} server side controllers.
  