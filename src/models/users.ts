// import { authService } from "@/lib/auth";
// import { UserInterface } from "@/types/User.Interface";
// import EventEmitter from "events";
// import {v4} from "uuid";
// import mongoDBInstance from "@/models/mongo";


// class UsersDB{
//     static users:UserInterface[] = [];
//     static createUser = async(emailId:string, password:string) => {
      
//       const dbConnection = await mongoDBInstance.getDB();
//       const usersCollection = dbConnection.collection("users")
//       await usersCollection.insertOne({
//         authentication:{
//             tokenVersion:1,
//             password:password
//         },
//         emailId:emailId,
//         userId:v4()
//     });
//       console.log("User entered ")
//         // UsersDB.users.push({
//         //     authentication:{
//         //         tokenVersion:1,
//         //         password:password
//         //     },
//         //     emailId:emailId,
//         //     userId:v4()
//         // })
//     }

//     static getUser = async(emailId:string, password:string) => {
//         let foundUsers:UserInterface[] = [];
//         // Assuming UsersDB.users is an array of user objects
//         UsersDB.users.filter((user) => {
//           // Check if the user's email matches the provided emailId
//            if(user.emailId === emailId){
//             foundUsers.push(user);
//            };
//         });
      
//         // If there are no matching users, return null
//         if (foundUsers.length === 0) {
//           return null;
//         }
      
//         // If there are matching users, check if the password matches for any of them
//         const userWithMatchingPassword = foundUsers.find((user) => {
//           // Replace 'passwordProperty' with the actual property name in your user object
//           // where the password is stored (e.g., user.password)
//           return user.authentication.password === password;
//         });
      
//         // If a user with a matching password is found, return that user
//         if (userWithMatchingPassword) {
//           return userWithMatchingPassword;
//         }
      
//         // If no user with a matching password is found, return null
//         return null;
//       };

//       static findOne = async(emailId:string) =>{
//         let returnUser :UserInterface | null = null;
//         await UsersDB.users.forEach((user)=>{
//             // console.log(user)
//             if(user.emailId === emailId){
//                 returnUser = user;
//                 return returnUser;
//             }
//         })
//         return returnUser;
//       }

//       static getAllUsers = async()=>{
//         return UsersDB.users;
//       }
//       static getUserByUserId = async(userId:string)=>{
//         let returnUser :UserInterface | null = null;
//         await UsersDB.users.forEach((user)=>{
//             // console.log(user)
//             if(user.userId === userId){
//                 returnUser = user;
//                 return returnUser;
//             }
//         })
//         return returnUser;    
//       }


      
// }


// export{
//     UsersDB
// }


import { UserInterface } from "@/types/User.Interface";
import mongoDBInstance from "@/models/mongo";
import { v4 } from "uuid";

class UsersDB {
    private static async getCollection() {
        const dbConnection = await mongoDBInstance.onlyGetDB();
        if(dbConnection){
            return dbConnection.collection("users");
            
        }else{
            console.log("Error: DB not initialized")
            throw Error("Db not initialized !")

        }
    }

    static createUser = async (emailId: string, password: string) => {
        const usersCollection = await UsersDB.getCollection();
        await usersCollection.insertOne({
            authentication: {
                tokenVersion: 1,
                password: password
            },
            emailId: emailId,
            userId: v4()
        });
        console.log("User entered");
    };

    static getUser = async (emailId: string, password: string) => {
        const usersCollection = await UsersDB.getCollection();
        const foundUser = await usersCollection.findOne({
            emailId: emailId,
            "authentication.password": password
        });
        return foundUser;
    };

    static findOne = async (emailId: string) => {

        const usersCollection = await UsersDB.getCollection();
        const returnUser = await usersCollection.findOne({ emailId: emailId });
        return returnUser;
    };

    static getAllUsers = async () => {
        const usersCollection = await UsersDB.getCollection();
        const allUsers = await usersCollection.find().toArray();
        return allUsers;
    };

    static getUserByUserId = async (userId: string) => {
        const usersCollection = await UsersDB.getCollection();
        const returnUser = await usersCollection.findOne({ userId: userId });
        return returnUser;
    };
}

export { UsersDB };
