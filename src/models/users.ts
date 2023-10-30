import { authService } from "@/lib/auth";
import { UserInterface } from "@/types/User.Interface";
import EventEmitter from "events";
import {v4} from "uuid";


class UsersDB extends EventEmitter{
    static users:UserInterface[] = [];
    constructor(){
        super();
    }


    static createUser = async(emailId:string, password:string) => {
        UsersDB.users.push({
            authentication:{
                tokenVersion:1,
                password:password
            },
            emailId:emailId,
            userId:v4()
        })
    }

    static getUser = async(emailId:string, password:string) => {
        let foundUsers:UserInterface[] = [];
        // Assuming UsersDB.users is an array of user objects
        UsersDB.users.filter((user) => {
          // Check if the user's email matches the provided emailId
           if(user.emailId === emailId){
            foundUsers.push(user);
           };
        });
      
        // If there are no matching users, return null
        if (foundUsers.length === 0) {
          return null;
        }
      
        // If there are matching users, check if the password matches for any of them
        const userWithMatchingPassword = foundUsers.find((user) => {
          // Replace 'passwordProperty' with the actual property name in your user object
          // where the password is stored (e.g., user.password)
          return user.authentication.password === password;
        });
      
        // If a user with a matching password is found, return that user
        if (userWithMatchingPassword) {
          return userWithMatchingPassword;
        }
      
        // If no user with a matching password is found, return null
        return null;
      };

      static findOne = async(emailId:string) =>{
        let returnUser :UserInterface | null = null;
        await UsersDB.users.forEach((user)=>{
            // console.log(user)
            if(user.emailId === emailId){
                returnUser = user;
                return returnUser;
            }
        })
        return returnUser;
      }

      static getAllUsers = async()=>{
        return UsersDB.users;
      }
      static getUserByUserId = async(userId:string)=>{
        let returnUser :UserInterface | null = null;
        await UsersDB.users.forEach((user)=>{
            // console.log(user)
            if(user.userId === userId){
                returnUser = user;
                return returnUser;
            }
        })
        return returnUser;    
      }


      
}


export{
    UsersDB
}