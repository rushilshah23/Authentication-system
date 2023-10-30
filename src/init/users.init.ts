// MIMIC SOME DATA. LATER TO BE REPLACE WITH DATABASE.

import { authService } from "@/lib/auth";

let users = [
    {
        "emailId":"a1@gmail.com",
        "password":"123456"
    },
    {
        "emailId":"a2@gmail.com",
        "password":"1234567"
    },
    {
        "emailId":"a3@gmail.com",
        "password":"12345678"
    },
    {
        "emailId":"a4@gmail.com",
        "password":"123456789"
    },
    {
        "emailId":"a5@gmail.com",
        "password":"12345678910"
    }
]


users.forEach(async(user)=>{
    try {
        await authService.createLocalUser(user.emailId,user.password)
        // await UsersDB.createUser(user.emailId, user.password)
        console.log("User with emailId "+user.emailId+" created successfully !");
    } catch (error) {
        console.log("Failed to create user with emailId "+user.emailId);
        console.log(error)
    }
})