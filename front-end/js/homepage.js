$(document).ready(function(e) {
    var ERROR_LOG = console.error.bind(console);
    console.log("homepage.js working");
    
    //current todoitem
    var g;
    var count = 1;
    //$("#new-todo").dialog({ modal: true, autoOpen: false });

   
  
    //delete all data from database button
    $("#resetcart")
      .click(() => {
        alert("delete all data from cart??");
      });

      $("#additem")
      .click(() => {
        console.log("Add item!");
        Add();
        

      });
  
    
  
    
    
   
  
    function Add(data) {
      //empty 2 lists
      $("#product-list").empty();
      var name = $("#product-name").val();
      var price = $("#product-price").val();
      var des = $("#product-des").val();
      //alert(JSON.stringify(name))
      stackproductlist(name,price,des);
    }
  
    function stackproductlist(name, price, des) {
      var taskHTML = '<div class="col-lg-4 col-md-6 mb-4">' +
       '<div class="card h-100">' + ' <a href="#"><img class="card-img-top" src="http://placehold.it/700x400" alt=""></a>'+
       '<div class="card-body">' + ' <h4 class="card-title"><a href="#">Item One</a></h4>'+
       '<h5 class="card-price">$24.99</h5>'+'<p class="card-text">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet numquam aspernatur!</p>'+
       '<button type="button" class="btn btn-primary btn-sm">Add</button> </div> </div> </div>';
      var $newTask = $(taskHTML);
      $newTask.find(".card-title").text(name);
      $newTask.find(".card-price").text("$"+price);
      $newTask.find(".card-text").text(des);
  
      $newTask.hide();
      $("#product-list").prepend($newTask);
      //$("#product-list") = [...$("#product-list"), $newTask];
     
      //$newTask.show("clip", 250).effect("highlight", 1000);
      $("#product-name").val("");
    }
  }); // end ready