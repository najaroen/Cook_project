'use strict';
var fail = {resultCode: 50000, resultDecription: 'System Error'};
var success = {resultCode: 20000, resultDecription: 'System Success', Data: [],Data2:[],Data3:[] };
var topics = require('./topic');
var app = require('../../server/server');
var request =require('request');
var cheerio = require('cheerio');
module.exports = function(Topicfoodmodel) {




//** Function make Topic Food*/
Topicfoodmodel.makeTopic  =  function(make, cb)  {
var modelTopic = app.models.topic;
console.log(make);
modelTopic.find({order: 'topicID DESC', limit: 1}, function(err, resultID){

if(err) {
	console.log(err);
	cb(null, fail);
} else {
	var data = {
  "title": make.title,
  "quantity": make.quantity,
  "price": make.price,
  "cook": make.cook,
  "video": make.video,
  "picture": make.picture,
  "score": make.score,
  "rawfood": make.rawfood
}
var topicdata = {
	"memberID":make.memberID,
	"topicID":resultID[0].topicID+1,
	"title":make.title,
	"score":make.score
}
Topicfoodmodel.create(data,function(err,result1){
	if (err) {
		console.log(err);
		console.log("err case create mongodB");

		fail.Data = "ไม่สร้างมารถตั้งกระทู้ได้กรุณาตรวจสอบข้อมูลให้ถูกต้อง";
		cb(null,fail);

	} else	{
		modelTopic.create(topicdata,function(err,result2){
			if (err) {
			console.log(err);
			console.log("err case create Mysql");
			fail.Data = "ไม่สร้างมารถตั้งกระทู้ได้กรุณาตรวจสอบข้อมูลให้ถูกต้อง";
			cb(null,fail);
			} else {
				 success.Data =result1;
				 success.Data2 =result2
				 cb(null,success);
			}
		})}
})

} // end else


}) // endfind modeltopic
}

//**  Function add score Topic*/
Topicfoodmodel.addScore = function(score,cb){

	//คำเตือน อย่าลืสร้างฟิล memberID กับ topicID ในmongodb
	//คำเตืออย่าลืมสร้าง ฟิล DB เช็ค สถานะการกดไลค์
	//คำเตือน ต้องให้ สกอฝั่ง client update ทันที ถ้าไม่ update ทันที ถ้าไม่เปลี่ยนค่าทันที มันก็จะไม่ +
console.log(score);
var addscore = score.score+1;
var id = score.id;
var idmySQL = score.topicID;
var data = {
 	"title":score.title,
    "quantity":score.quantity,
    "price": score.price,
    "cook": score.cook,
    "video":score.video,
    "picture":score.picture,
    "score": addscore,
    "rawfood":score.rawfood,
    "id": score.id
  }

 var dataSQL = {
 		"topicID":score.topicID,
 		"score":addscore,
 		"title":score.title,
 		"memberID":score.memberID

 }

var scoreSQL = app.models.topic;
	Topicfoodmodel.upsert(data,function(err,result){
		if (err) {
			console.log(err);
			cb(null,fail);
		} else{
				scoreSQL.upsert(dataSQL,function(err,resultSQL){
					if (err) {
								console.log(err);
								cb(null,fail);
							} else {
								console.log(result);
								console.log(resultSQL);
								success.Data =result;
								success.Data2 =resultSQL;
								cb(null,success);
							}


				})

		}


	})
}

Topicfoodmodel.pupular =function(pop,cb){
	Topicfoodmodel.find({order:'score DESC',
						limit:5},function(err,result){
			if (err) {
				console.log(err);
				cb(null,fail);
			} else {
				console.log(result);
				success.Data =result;
				cb(null,success);

			}
						})

}

Topicfoodmodel.searchFood =function(search,cb){
	console.log(search);
	var rex = search.title;

	console.log(rex);
	if (rex !== undefined) {
		Topicfoodmodel.find({'where': {'title': {'regexp':'/'+rex+'/g'}}},function(err,result){
		if (err) {console.log(err)
				 cb(null,fail);
		} else{
			console.log(result);
			success.Data = result;
			cb(null,success);
		}
	})
} else	{
	console.log('arg is empty');
	cb(null,fail);
}


}
Topicfoodmodel.test = function(ts , cb) {
var  url = 'http://www.bigc.co.th/search/?q=%E0%B9%81%E0%B8%8A%E0%B8%A1%E0%B8%9E%E0%B8%B9';

request(url, function (err, response, body){

   

    let $ = cheerio.load(body);
    let column1RelArray = [];
    $('#catalog-category-products > ul li').each(function(){
        column1RelArray.push($(this).attr('id'));
    });
    var sizedata = column1RelArray.length;
    console.log(column1RelArray.length);
    var sharp = "#";
    var title = new Array;
    var price = new Array;
    var pic   = new Array;

for(var i =0;i<column1RelArray.length;i++) {
    title[i] = $(sharp + column1RelArray[i] + '> div.product-info > h2 > a').text().trim();



    if($(sharp + column1RelArray[i] + '>div.product-info> div.box-price-list > div.price-box > div.regular-price').text().trim()==""){
        price[i] = $(sharp + column1RelArray[i] + '>div.product-info > div.box-price-list > div.price-box > p.special-price>span.price').text().trim();
    }else{
        price[i] = $(sharp + column1RelArray[i] + '>div.product-info> div.box-price-list > div.price-box > div.regular-price').text().trim();
    }

    pic[i]=$(sharp + column1RelArray[i] + '>div.product-image>a>img').attr('src');

    // let category = $('.document-subtitle.category').text().trim();
    // let score = $('.score-container > .score').text().trim();
    // let install = $('.meta-info > .content').eq(2).text().trim();
    // let version = $('.meta-info > .content').eq(3).text().trim();



}
 // console.log(title);
 // console.log(price);
 // console.log(pic);
 for (var i = 0; i<column1RelArray.length; i++) {
 	console.log(title[i]+" "+price[i]+" "+pic[i]);
 };
 success.Data = title;
 success.Data2 = price;
 success.Data3 = pic;
 cb(null,success);
})


}

Topicfoodmodel.lotus = function(ls , cb) {
var  url = 'http://www.tops.co.th/d/Fresh_Meat_and_Seafood';

request(url, function (err, response, body){

   

    let $ = cheerio.load(body);
    let column1RelArray = [];
    $('#page > div.wrapper_container.main-contents.container > div.span12.no-mrg.container.fl-none > div > div.span9.product-list-wrap.clearfix > div.product_grid > ul li').each(function(){
        column1RelArray.push($(this).attr('id'));
    });
    var sizedata = column1RelArray.length;
    console.log(column1RelArray.length);
    var sharp = "#";
    var title = new Array;
    var price = new Array;
    var pic   = new Array;
    var pic2 = new Array;

for(var i =0;i<column1RelArray.length;i++) {
     title[i] = $(sharp + column1RelArray[i] + '> div.bottom_zone_grid > div.product_name > h3 > a').text().trim();
        //console.log(title[i]);

        if($(sharp + column1RelArray[i] + '>div.bottom_zone_grid > div.text_promo.font18 > span.normal_price').text().trim()!=""){
            price[i] = $(sharp + column1RelArray[i] + '>div.bottom_zone_grid > div.text_promo.font18 > span.promo_price').text().trim();
        }else{
            price[i] = $(sharp + column1RelArray[i] + '>div.bottom_zone_grid > div.text_promo.font18 >span').text().trim();
        }
        pic[i]=$(sharp + column1RelArray[i] + '>div.top_zone > div.a > a > img').attr('src');
      pic2[i]=pic[i].replace(/\\"/g,'"');
   
    // let category = $('.document-subtitle.category').text().trim();
    // let score = $('.score-container > .score').text().trim();
    // let install = $('.meta-info > .content').eq(2).text().trim();
    // let version = $('.meta-info > .content').eq(3).text().trim();



}
 // console.log(title);
 // console.log(price);
 // console.log(pic);
 console.log(column1RelArray.length);
 for (var i = 0; i<column1RelArray.length; i++) {
 	console.log(title[i]+" "+price[i]+" "+pic[i]);
 };
 success.Data =  title;
 success.Data2 = price;
 success.Data3 = pic;
 cb(null,success);
})


}


  Topicfoodmodel.remoteMethod(
    'makeTopic',
    {
      accepts: [{arg: 'make', type: 'object', http: {source: 'body'}}],
      returns: {arg: 'returntmake', type: 'object', root: true},
      http: {path: '/makeTopic', verb: 'post'}
    }
  );
   Topicfoodmodel.remoteMethod(
    'addScore',
    {
      accepts: [{arg: 'score', type: 'object', http: {source: 'body'}}],
      returns: {arg: 'returntscore', type: 'object', root: true},
      http: {path: '/score', verb: 'post'}
    }
  );
      Topicfoodmodel.remoteMethod(
    'pupular',
    {
      accepts: [{arg: 'pop', type: 'object', http: {source: 'body'}}],
      returns: {arg: 'returntpop', type: 'object', root: true},
      http: {path: '/pupular', verb: 'get'}
    }
  );
     Topicfoodmodel.remoteMethod(
    'searchFood',
    {
      accepts: [{arg: 'search', type: 'object', http: {source: 'body'}}],
      returns: {arg: 'returntsearch', type: 'object', root: true},
      http: {path: '/search', verb: 'post'}
    }
  );
  Topicfoodmodel.remoteMethod(
    'test',
    {
      accepts: [{arg: 'ts', type: 'object', http: {source: 'body'}}],
      returns: {arg: 'returntsts', type: 'object', root: true},
      http: {path: '/test', verb: 'post'}
    }
  );
  Topicfoodmodel.remoteMethod(
    'lotus',
    {
      accepts: [{arg: 'ls', type: 'object', http: {source: 'body'}}],
      returns: {arg: 'returnls', type: 'object', root: true},
      http: {path: '/lotus', verb: 'post'}
    }
  );

};


