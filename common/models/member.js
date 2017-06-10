'use strict';
var fail = {resultCode: 50000, resultDecription: 'System Error'};
var success = {resultCode: 20000, resultDecription: 'System Success', Data: [] };

module.exports = function(Member) {


	 Member.register = function (reg,cb) {
    console.log("ข้อมูลที่รับมากจาก หน้าบ้าน"+reg.fname);
    console.log("ข้อมูลที่รับมากจาก หน้าบ้าน"+reg.lname);
    console.log("ข้อมูลที่รับมากจาก หน้าบ้าน"+reg.email);
    console.log("ข้อมูลที่รับมากจาก หน้าบ้าน"+reg.country);
    console.log("ข้อมูลที่รับมากจาก หน้าบ้าน"+reg.password);
    Member.find({},function (err,result) {
      if(err){
        console.log(err);
        cb(null,fail);
      } else {
        var dataid = [result.length];
        for(var i =0;i<result.length;i++) {
          dataid[i]  =  result[i].memberID;
        }
        dataid.reverse();
        var newid = dataid[0]+1;
        var dataRegister ={
          "fname":reg.fname,
          "lname":reg.lname,
          "email":reg.email,
          "country":reg.country,
          "memberID":newid,
          "password":reg.password
        }
        Member.create(dataRegister,function (err,result) {
          if (err){
            console.log(err);
            cb(null,fail);
          } else{
            success.Data = result;
            console.log(success);
            cb(null,success);
          }
        })
      }
    })
  }
  /** End Register */

  /** Login Function*/
  /** Login Function*/
  Member.login =function (login,cb ) {

    console.log(login.email);
    console.log(login.password);

    Member.find({where: {"email": login.email,"password":login.password}},function (err,result) {
      // console.log("result>>>>email  "+result[0].email);
      // console.log("result>>>>password  "+result[0].password);
     
      
		if(err){
        console.log(" node err");
        
        cb(null,fail);
      } else{
      	console.log(result);
   
       }}) 


	
	
  }

  /** End Login Function*/

   /** Path of remote method */
  Member.remoteMethod(
    'register',
    {
      accepts: [{arg: 'reg', type: 'object', http: {source: 'body'}}],
      returns: {arg: 'regis', type: 'object', root: true},
      http: {path: '/register', verb: 'post'}
    }
  );
  Member.remoteMethod(
    'login',
    {
      accepts: [{arg: 'login', type: 'object', http: {source: 'body'}}],
      returns: {arg: 'returnlogin', type: 'object', root: true},
      http: {path: '/login', verb: 'post'}
    }
  );


};
