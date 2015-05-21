# lego
node web modules framework

## Usage

- define a `Brick` (module)

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
            
        });
    ```
    
    
        
