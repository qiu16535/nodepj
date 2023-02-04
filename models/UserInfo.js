module.exports = class UserInfo
{
    constructor(userName, password, postCode,address)
    {
        this.名前 = userName;
        this.パスワード = password;
        this.郵便番号 = postCode;
        this.住所 = address;
    }
}