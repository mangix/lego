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


    
    
        
