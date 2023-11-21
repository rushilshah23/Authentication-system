

class UsersDB{
    private static authDBInstance:UsersDB;
    private constructor(){}

    public static getInstanceAuthDB = () =>{
        if(!this.authDBInstance){
            this.authDBInstance = new UsersDB();
        }
        return this.authDBInstance;
    }

    public createLocalUser = async() =>{
        
    }

}

const inst = UsersDB.getInstanceAuthDB();

