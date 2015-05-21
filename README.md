# Lego -- A node web modules framework

In web development, a web page is usually separated to lots of modules ,  head , article , footer , side ads...

And each module has individual data from db or service.

We fetch all these data and then render the template .

With Lego we made this easier.
 
  
## Usage

`npm install node-lego --save`

- define a `Brick` , in Lego we call module a `Brick`

    in module `head.js` 
    
    ```js
    var Brick = require("node-lego").Brick;
    module.exports = Brick.create("head" , function(params , finish){
        //do module biz logic here
        finish(Brick.SUCCESS , headData);
            
    });
    ```
    
- make Bricks together
    
    in your http handler
    
    ```js
    var head = require("./head");
    var body = require("./body");
        
    new Lego().start(params).pipe(head,body).done(function(data){
        //you will get headData , bodyData here
            
        console.log(data.head);
        console.log(data.body);
        
        render("template" , data);
            
    });
    ```
    
## API

### Lego.Brick

- Brick.create(name , handler);

    - `name`      {String} name of the module
    - `handler`   {Function} handle function , `params` and `finishCallback` will be parsed in.
    
define a module

```js
var myBrick = Brick.create("myBrick", function(params , finish){
    //call finish with `Brick.SUCCESS` or `Brick.FAIL`
    finish(Brick.SUCCESS , data);
});
```

- Brick.SUCCESS

in handler , call `finish` callback with Brick.SUCCESS  when data fetching is success;

- Brick.FAIL

in handler , call `finish` callback with Brick.FAIL  when an error occurs , and the data will be set to `null`

### Lego

- lego.start(params)

    - `params` {Object} initial data
    
start the module system with some initial data. Each Brick will get this data in handler.

```js
new Lego().start({
    id:1
});
```

- lego.pipe(brick1,brick2....)

    - `brick` `Brick` created by Brick.create function
    
    execute each brick in the same time , and merge the data together.

    `pipe` could be called many times. pipes are serial and in each pipe bricks are in parallel.

    data will be  merged and passed to the next.

```js
new Lego().start({
    id:1
})

//preBrick1 and preBrick2 will be executed at the same time
.pipe(preBrick1,preBrick2)

//nextBrick1 and nextBrick2 will be executed at the same time when preBricks are all finished
.pipe(nextBrick1,nextBrick2)

.done(function(data){
})
```

- lego.done(callback)

    - `callback` , callback function with data
    
    when all pipes are finish , this callback will be called with the merged data
```js
new Lego().start({
    id:1
}).pipe(brick1,brick2).done(function(data){
    //data is :{
        id:1,
        brick1Name:brick1Data,
        brick2Name:brick2Data
    }
});
```    
        
