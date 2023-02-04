const UserInfo = require('../models/UserInfo');

module.exports = class UserInfoViewModel
{
    /* to save the users' info */
    #_userInfos = {
            wxingm : new UserInfo("wxingm", "123456", "2420015", ["kanagawa", "yamato", "1-2-1"]),
            mcs001 : new UserInfo("mcs001", "7890123", "3420015", ["tiba", "funabashi", "4-5-1"])
        };

    CreateUserInfo(userInfo)
    {
        // console.log(this.#_userInfos[userInfo.UserName]);
        if(!this.#_userInfos[userInfo.UserName]){
            this.#_userInfos[userInfo.UserName] = userInfo;
            return true; 
        }else{
            return false;
        }
        
    }

    ReadUserInfo(userName)
    {
        let userInfos = this.#_userInfos;

        return userInfos;
    }

    UpdateUserInfo(userInfo)
    {
        if( this.#_userInfos[userInfo.UserName]){
            this.#_userInfos[userInfo.UserName] = userInfo;
            // console.log(userInfo);
            return true;
        }else{
            return false;
        }
       
    }

    DeleteUserInfo(userName)
    {
        //邱：「this.#_userInfos[userName] === true」なら行けないのはなぜ
        if(this.#_userInfos[userName]){
            // console.log(userName);
            delete this.#_userInfos[userName];
            return true;        
        }else{
            return false;
        }

        // if(userName){
        //     console.log(userName);
        //     delete this.#_userInfos[userName];
        //     return true;        
        // }else{
        //     return false;
        // }
        
        
    }
}