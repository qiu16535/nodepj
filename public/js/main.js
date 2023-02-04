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
      methods: {
        createUser: function () {
            //=======入力チェック(邱)==========
            //===username===
            //username:1-10制御
            const name = this.user_name.length;
            const password = this.password.length;
            const postcode = this.postcode.length;

            const name_value = this.user_name;
            const password_value = this.password;
            const postcode_value = this.postcode;

            var pattern = new RegExp(/^[0-9a-zA-Z]+$/);

            if(name < 1 || name > 10){
                this.$set(this.errors, "name", "1以上10以内の文字を入力してください");
                return false;
            }else{
                this.$delete(this.errors, "name");
                // console.log("Create the user.");
            }

            //username:英数制御
            // console.log(pattern.test(name_value));
            if(pattern.test(name_value)){
                this.$delete(this.errors, "name");
                // console.log("Create the user.");
            }else{
                this.$set(this.errors, "name", "英数のみ");
                return false;
            }

            //===password===
            //password:文字数制御
            if(password < 8 || password > 12){
                this.$set(this.errors, "password", "passwordは8-12の英数を入力してください");
                return false;
            }else{
                this.$delete(this.errors, "password");
                // console.log("Create the user.");
            }
             //password:英数制御
             if(pattern.test(password_value)){
                this.$delete(this.errors, "password");
                // console.log("Create the user.");
            }else{
                this.$set(this.errors, "password", "英数のみ");
                return false;
            }

            //===postcode===
            //7文字
            //半角数字のみ（半角ハイフン入り）
            //空白はだめ
            
            if(postcode === 0){
                this.$set(this.errors, "postcode", "郵便番号を入力してください");
                return false;
            }else{
                this.$delete(this.errors, "postcode");
                // console.log("Create the user.");
            }
            //その他：該当する郵便番号が見つからないときはエラーを表示
            

            //===address===
             //address:空白制御
             



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
                if(this.user_name === null){
                    alert("該当ユーザーは存在しません");
                }else{
                    console.log(JSON.stringify(data));
                    alert(JSON.stringify(data));
                }
                
            }).catch(error => {		
                // (5) エラーを受け取ったらコンソール出力		
                console.error(error);
            });
        },
        updateUser: function () {
            //邱　入力チェック：空白制御
            const name = this.user_name.length;
            if(name === 0){
                this.$set(this.errors, "name", "usernameは入力されていません");
                return false;
            }else{
                this.$delete(this.errors, "name");
                console.log("Update the user.");
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
            console.log("Read the user.");
            
            
            let url = new URL("http://127.0.0.1:3000/read");
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
                let flag = false; //データがない状態
                
                Object.keys(data).forEach((key) => {
                    if (key === this.user_name) {
                        alert(JSON.stringify(data[key], null, 2));
                        flag = true;//データがある
                    }//else if(key === null){
                    // //邱追加：空白データを表示させないように   
                    //     alert("該当ユーザーは存在しません");
                    // }
                  });
                // console.log(JSON.stringify(data));
                // alert(JSON.stringify(data, null, 2));
                    if(flag === false){
                        alert("該当ユーザーは存在しません");
                };
            }).catch(error => {		
                // (5) エラーを受け取ったらコンソール出力		
                console.error(error);
            });
        },
        deleteUser: function () {
            //邱　入力チェック：空白制御
            const name = this.user_name.length;
            if(name === 0){
                this.$set(this.errors, "name", "usernameは入力されていません");
                return false;
            }else{
                this.$delete(this.errors, "name");
                console.log("Delete the user.");
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
            let _this = this
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