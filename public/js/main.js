//邱：このfunctionの役割はわからない
function EncodeHTMLForm( data )
{
    var params = [];

    for( var name in data )
    {
        var value = data[ name ];
        var param = encodeURIComponent( name ) + '=' + encodeURIComponent( value );

        params.push( param );
    }

    return params.join( '&' ).replace( /%20/g, '+' );
}

let appCrud = new Vue({
    el: '#crudUser',
    data: {
    //邱：""の中を変数に変更　※どこの変数を使用すればいい？
      user_name: "",
      password: "",
      postcode:"",
      address1:"",
      address2:"",
      address3:"",
      message: "CRUD User!",
      errors: {},
    },
    watch:{
    
      },
      methods: {
        //=============入力チェック================
        checkName:function(input){
            var pattern = new RegExp(/^[0-9a-zA-Z]+$/);
            var nameLength = input.length < 4 || input.length > 10;
            var nameZero = input.length < 1;

            if(nameZero){
                this.$set(this.errors, "name", "文字を入力してください");
                return false;
            }else if(nameLength){
                this.$set(this.errors, "name", "4以上10以内の文字を入力してください");
                return false;
            }else if(!pattern.test(input)){
                this.$set(this.errors, "name", "英数のみ");
                return false;
            }else{
                this.$delete(this.errors, "name");
                return true;
            }
        },
        checkPassword:function(input){
            // var pattern = new RegExp(/^[0-9a-zA-Z]+$/);
            var pattern = new RegExp(/^(?=.*[A-Z])(?=.*[a-z])[0-9a-zA-Z]+$/);
            var passwordLength = input.length < 8 || input.length > 12;

            if(passwordLength){
                this.$set(this.errors, "password", "passwordは8-12の英数を入力してください");
                return false;
            }else if(!pattern.test(input)){
                this.$set(this.errors, "password", "小文字と大文字は１以上が必須");
            }else{
                this.$delete(this.errors, "password");
                return true;
            }
        },
        checkPostcode:function(input){
            var postcodeLength = input.length === 0;
            if(postcodeLength){
                this.$set(this.errors, "postcode", "郵便番号を入力してください");
                return false;
            }else{
                this.$delete(this.errors, "postcode");
                return true;
            }
        },
        checkAll:function(input1, input2, input3){
            this.checkName(input1);
            this.checkPassword(input2);
            this.checkPostcode(input3);
            if(!this.checkName(input1) || !this.checkPassword(input2) || !this.checkPostcode(input3)){
                return false;
            }
        },
        msgClear:function(){
            this.$delete(this.errors, "password");
            this.$delete(this.errors, "postcode");
            this.$delete(this.errors, "name");
        },
        //============= CRUD ================
        createUser: function() {
            //入力チェック
            this.checkAll(this.user_name, this.password, this.postcode);
            if(this.checkAll(this.user_name, this.password, this.postcode) === false){
                return false;
            }
            // this.checkName(this.user_name);
            // this.checkPassword(this.password);
            // this.checkPostcode(this.postcode);
            // if(!this.checkName(this.user_name) || !this.checkPassword(this.password) || !this.checkPostcode){
            //    return false;
            // };


            // POSTメソッドで送信するデータ
            let userInfo = { UserName: this.user_name, Password: this.password, 
                PostCode: this.postcode, Address: [this.address1, this.address2, this.address3] };
            
            //邱：ここはapp.jsと連携する？    
            let url = new URL("http://127.0.0.1:3000/create");
            // (4) POSTメソッドでデータを送信    
            fetch( url, {      
                //邱：*GET, POST, PUT(置き換え), DELETE, etc.
                method: 'POST',
                headers: {
                    //邱：転送するデータのタイプ
                    'Content-Type': 'application/x-www-form-urlencoded',
                },  
                // 邱：データをリクエスト ボディに含めて送信する
                body: EncodeHTMLForm( userInfo )    
            }).then(response => {
                // (1) 通信が成功したか確認する	
                if (!response.ok) {
                    // (2) 通信に失敗したときはエラーを発生させる
                    throw new Error('Not ok');
                }
                return response.json();
            }).then(data => {
                    console.log(JSON.stringify(data));
                    alert(JSON.stringify(data));
            }).catch(error => {		
                // (5) エラーを受け取ったらコンソール出力		
                console.error(error);
            });
        },
        updateUser: function () {
             //入力チェック
             this.checkAll(this.user_name, this.password, this.postcode);
             if(this.checkAll(this.user_name, this.password, this.postcode) === false){
                 return false;
             }

            let userInfo = { UserName: this.user_name, Password: this.password, 
                    PostCode: this.postcode, Address: [this.address1, this.address2, this.address3] };

            let url = new URL("http://127.0.0.1:3000/update/" + this.user_name);
            // (4) POSTメソッドでデータを送信    
            fetch( url, {      
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },  
                body: EncodeHTMLForm( userInfo )    
            }).then(response => {
                // (1) 通信が成功したか確認する	
                if (!response.ok) {
                    // (2) 通信に失敗したときはエラーを発生させる
                    throw new Error('Not ok');
                }
                return response.json();
            }).then(data => {
                
                console.log(JSON.stringify(data));
                alert(JSON.stringify(data));

            }).catch(error => {		
                // (5) エラーを受け取ったらコンソール出力		
                console.error(error);
            });
        },
        readUser: function () {
             //入力チェック
            this.msgClear();
            this.checkName(this.user_name);
            if(!this.checkName(this.user_name)){
                return false;
            }

            let url = new URL("http://127.0.0.1:3000/read/" + this.user_name);
            fetch(url).then(response => {
                // (1) 通信が成功したか確認する	
                if (!response.ok) {
                    // (2) 通信に失敗したときはエラーを発生させる
                    throw new Error('Not ok');
                }		
                // (3) レスポンスデータからJSONデータを取得		
                return response.json();	
            }).then(data => {		
                // (4) 受け取ったデータをコンソール出力		
                console.log(JSON.stringify(data));
                alert(JSON.stringify(data));
            }).catch(error => {		
                // (5) エラーを受け取ったらコンソール出力		
                console.error(error);
            });
        },
        readUserAll: function () {
            console.log("Read the user.");

            let url = new URL("http://127.0.0.1:3000/readAll");
            fetch(url).then(response => {
                // (1) 通信が成功したか確認する	
                if (!response.ok) {
                    // (2) 通信に失敗したときはエラーを発生させる
                    throw new Error('Not ok');
                }		
                // (3) レスポンスデータからJSONデータを取得		
                return response.json();	
            }).then(data => {		
                // (4) 受け取ったデータをコンソール出力		
                console.log(JSON.stringify(data));
                alert(JSON.stringify(data));
            }).catch(error => {		
                // (5) エラーを受け取ったらコンソール出力		
                console.error(error);
            });
        },
        deleteUser: function () {
            //入力チェック
            this.msgClear();
            this.checkName(this.user_name);
            if(!this.checkName(this.user_name)){
                return false;
            }
     
            let url = new URL("http://127.0.0.1:3000/delete/" + this.user_name);
            // (4) POSTメソッドでデータを送信    
            fetch( url, {      
                method: 'DELETE',    
            }).then(response => {
                // (1) 通信が成功したか確認する	
                if (!response.ok) {
                    // (2) 通信に失敗したときはエラーを発生させる
                    throw new Error('Not ok');
                }
                return response.json();
            }).then(data => {
                console.log(JSON.stringify(data));
                alert(JSON.stringify(data));
                // delete this.user_name;
                                             
            }).catch(error => {		
                // (5) エラーを受け取ったらコンソール出力		
                console.error(error);
            });
        },
        search: function () {
            console.log("Search Address");
            if(this.postcode.slice( 0, 2 ) >= 10 && this.postcode.slice( 0, 2 ) <= 20 ){
                this.address1 = "東京都";
            }else if(this.postcode.slice( 0, 2 ) >= 21 && this.postcode.slice( 0, 2 ) <= 25 ){
                this.address1 = "神奈川県";
            }else if(this.postcode.slice( 0, 2 ) >= 26 && this.postcode.slice( 0, 2 ) <= 29 ){
                this.address1 = "千葉県";
            }else if(this.postcode.slice( 0, 2 ) >= 30 && this.postcode.slice( 0, 2 ) <= 31 ){
                this.address1 = "群馬県";
            }else if(this.postcode.slice( 0, 2 ) == 32){
                this.address1 = "栃木県";
            }else if(this.postcode.slice( 0, 2 ) >= 33 && this.postcode.slice( 0, 2 ) <= 36 ){
                this.address1 = "埼玉県";
            //邱：絶対イコールする(===)と検索できなくなる
            }else if(this.postcode.slice( 0, 2 ) == 37){
                this.address1 = "群馬県";
            }else{
                // this.address1 = "今回の検索範囲に超えました！";
                alert("今回の検索範囲に超えました！");
            }
        },
        search2: function () {
            let _this = this;
            new YubinBango.Core(this.postcode, function(addr) {
                if(addr.region === ""){
                    alert("not fund");
                }else{
                    _this.address1  = addr.region // 都道府県ID
                    _this.address2  = addr.locality  // 市区町村
                    _this.address3  = addr.street   // 町域
                }
                
                // console.log(addr);            
            })
          
            // if(test === ""){
            //     _this.$set(this.errors, "postcode", "該当する郵便番号が見つからない");
               
            // }else{
            //     _this.$delete(this.errors, "postcode");
            // }
           
         
            
        },
    }
});