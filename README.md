# Lego -- A node web modules framework
[![Build Status](https://travis-ci.org/mangix/express-sledge.svg?branch=master)](https://travis-ci.org/mangix/express-sledge)

In web development, a web page is usually separated to lots of modules ,  head , article , footer , side ads...

And each module has individual data from db or service.

We fetch all these data and then render the template .

With Lego we made this easier.

## Install

 `npm install node-lego --save`
  
## Usage

In your request handler :

```js
var User = require("./user");
var OrderList = require("./orderlist");
var Profile = require("./profile");
var Lego = require("node-lego");
	
app.get("/index" , function(req , res){
	new Lego().start({
		userId: req.query.id
	})
	.pipe(User)
	.pipe(OrderList,Profile)
	.done(function(data){
		//data is something like 
		{
			userId:123,
			User:{
				name:'mangix',
				id:123,
				email:''
			},
			UserView:'<div>Hello mangix</div>',//rendered html 
			OrderList:[],
			OrderListView:'',
			Proflie:{},
			ProfileView:''
		}
			
		//use this data as you want
		
		//render the index.jade template
		res.render("index", data);
			
		//or return as json
		res.send(data);
	});
});
```

In module  `user.js`:

```js
var Brick = require("node-lego").Brick;
module.exports = Brick.create("User",function(params,finish){
	var userId = params.userId;
	getUser(userId,function(err , user){
		if(err){
			finish(Brick.FAIL);
		}else{
			finish(Brick.SUCCESS , user);
		}
	});
		
},"/index/user.jade");
	

```

In module `orderlist.js`

```js

var Brick = require("node-lego").Brick;
module.exports=Brick.create("OrderList",function(params,finish){
	var user = params.User;
	if(!user){
		finish(Brick.FAIL);
	}else{
		getOrderList(user,function(err, list){
			if(err){
				finish(Brick.FAIL);
			}else{
				finish(Brick.SUCCESS, list);
			}
		});
	}
		
},"/index/orderlist.jade");
	

```

In `profile.js` , do something same as orderlist;

In `index.jade`

```js
div #{User.name}
	
.orderlist !{OrderListView}
	
.profile !{PrifileView}		

```


    
## API

### Lego.setting

global config with a `get` and `set` function. Config list:

- `view engine` , default 'jade' , same as `express` , any template engin supported by [consolidate](https://github.com/tj/consolidate.js) is supported.
- `views` , default 'views' , root path of the template files , same as `express`
- `debug` , default 'process.NODE_EVN == "development" ' ,  debug mode , if true , view render error stack will set to the view property of the final data.

use `Lego.setting.get` and `Lego.setting.set` to get and set this config.

example:
```js
var Lego = require("node-lego");
var path = require("path");
Lego.setting.set("views" , path.join(__dirname,"views"));
Lego.setting.set("view engine","jade");
```


### Lego.Brick

#### Brick.create(name , handler);

- `name`      {String} name of the module . An attribute with this name will set to the final data .
- `handler`   {Function} handle function , `params` and `finishCallback` will be parsed in. Call this callback function with `status` and `data`.
- `viewPath`  {String} optional, template file path, joined to `setting.get("views")`. if this argument provided , the template will be auto rendered when `finish(Brick.SUCCESS ,data)` called and a property Brick.Name+'View' will set to the final data with value as rendered html String.
    
example: define a module

```js
var myBrick = Brick.create("User", function(params , finish){
    //call finish with `Brick.SUCCESS` or `Brick.FAIL`
    finish(Brick.SUCCESS , {
    	userId:123,
    	name:"mangix",
    	email:"maqh1988@gmail.com"
    });
    
} , 'path/to/the/view.jade');

```

in `view.jade`

```
.userinfo
    a.name(href='/user/#{id}') #{name}
    .email #{email}
	
```
if this brick finish with Brick.SUCCESS , this view will be rendered with the data. and the final data in `.done` will get this properties.

```js

User:{
	userId:123,
    	name:"mangix",
    	email:"maqh1988@gmail.com"
},
UserView:'<div class="userinfo"><a href="/user/123">mangix</a><div class="email">maqh1988@gmail.com</div></div>'


```

#### Brick.SUCCESS

in handler , call `finish` callback with Brick.SUCCESS  when data fetching is success;

#### Brick.FAIL

in handler , call `finish` callback with Brick.FAIL  when an error occurs , and the data will be set to `null`,template will not be rendered.

#### Brick.TIMEOUT
when an `timeout` option passed to Lego , if Brick handle timeout , `finish` will be called with TIMEOUT automatic. data will be `null`.

### Lego

#### constructor Lego(options)

- `options` {Object} 
 
```js

{
	timeout:0 , //brick timeout time  ,default 0 , not control
}

```

#### lego.start(params)

- `params` {Object} initial data
    
start the module system with some initial data. Each Brick will get this data in handler.

```js
new Lego().start({
    userId:1
});
```

#### lego.pipe(brick1,brick2....)

- `brick` `Brick` created by Brick.create()
    
execute each brick in the same time , and merge the data together.
`pipe` could be called many times. 
pipes are serial and in each pipe bricks are in parallel.
data will be merged and passed to the next.

example:
```js
new Lego().start({
    id:1
})

//preBrick1 and preBrick2 will be executed at the same time
.pipe(preBrick1,preBrick2)

//nextBrick1 and nextBrick2 will be executed at the same time when preBricks are all finished
//and data finished by preBrick1 and preBrick2 will passed to nextBrick1 and nextBrick2
.pipe(nextBrick1,nextBrick2)

.done(function(data){
    //data will contains
    {
        id:1,   //data from start
        preBrick1: {},
        preBrick2: {},
        nextBrick1:{},
        nextBrick2:{}
    }
})
```

#### lego.top(brick,property,toProperty)

when Brick finish with Brick.SUCCESS and data , data will merge as follow:

```js
{
    Brick1Name:data,
    Brick2Name:data
}
```
sometimes it's not convenient for the next Brick or template. 
You can use this method to convert the inside property to the top level.

- `brick` Brick create by Brick.create()
- `property` src property 
- `toProperty` target property

example:

```js
//in your user brick handle , you finish
finish(Brick.SUCCESS , {
    userInfo:{
        id:123,
        name:'xxx'
    }
});

//you have to use this data by data.User.userInfo.id , in the OrderBrick you have to :
Brick.create("orderBrick" , function(params , finish){

    //It's not a good idea to use params like this. 
    //It makes the OrderBrick to depend on the UserBrick,
    //but actually it's only depend on `userId`
    var userId = params.User.userInfo.id;
});

//with this api , after pipe UserBrick , call the `top` api to transfer userId to the top level.
new Lego().pipe(UserBrick).top(UserBrick,'userInfo.id','userId').pipe(OrderBrick);

//now in OrderBrick 
var userId = params.userId;

//you can also use OrderBrick in the first pipe,
//because it's not depend on params.User.userInfo.id
new Lego().start({
    userId:123
}).pipe(OrderBrick).done();

```

#### lego.done(callback)

- `callback` , callback function with data
    
when all pipes are finish , this callback will be called with the merged data

```js
new Lego().start({
    id:1
}).pipe(brick1,brick2).done(function(data){
    //data is :{
        id:1,
        brick1Name:brick1Data,
        brick1NameView:'',
        brick2Name:brick2Data
        brick2NameView:''
    }
    // render template 
    res.render("template" , data);
    //or send json
    res.send(data);
    //or do anything you want
});
```    
        
