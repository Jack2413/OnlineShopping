$(document).ready(function(e) {
  var ERROR_LOG = console.error.bind(console);
  console.log("homepage.js working");
  var addtocartinfo = $("addtocart").text();
  getthewholepage();

  //current todoitem
  var g;
  var count = 1;
  //$("#new-todo").dialog({ modal: true, autoOpen: false });

  //delete all data from database button
  $("#resetcart").click(() => {
    alert("delete all data from cart??");
  });

  $("#additem").click(() => {
    console.log("Add newitem to products!");
    var name = $("#product-name").val();
    var price = $("#product-price").val();
    var des = $("#product-des").val();
    var newproduct = { name: name, price: price, description: des };
    console.log(newproduct);
    addproduct(newproduct);
  });

  $("#addtocart").click(() => {
    alert("Add item to cart!");
  });

  $("#search").click(() => {
    var name = $("#searchitem").val();
    var name = { name: name };
    console.log(name);
    searchproduct2();
  });

  function getthewholepage() {
    $.ajax({
      method: "GET",
      url: "/db",
      success: data => {
        // alert(JSON.stringify(data.length));
        redraw(data);
      }
    });
  }

  function getcartdata() {
    $.ajax({
      method: "GET",
      url: "/cartdb",
      success: data => {
        // alert(JSON.stringify(data.length));
        redrawcart(data);
      }
    });
  }

  function getsearchpage() {
    $.ajax({
      method: "GET",
      url: "/search/" + $("#searchitem").val(),
      success: data => {
        // alert(JSON.stringify(data.length));
        redraw(data);
      }
    });
  }

  function addproduct(todo) {
    $.ajax({
      type: "POST",
      url: "/add",
      data: todo,
      success: returnedata => {
        //alert("before getpost success!!!");
        getthewholepage();
      }
    });
  }

  function addtocart(todo) {
    $.ajax({
      type: "POST",
      url: "/addtocart",
      data: todo,
      success: returnedata => {
        alert("add to cart");
      }
    });
  }

  function searchproduct2() {
    if ($("#searchitem").val() == "") {
      getthewholepage();
    } else {
      $.ajax({
        type: "GET",
        url: "/search/" + $("#searchitem").val(),

        contentType: "application/json",

        success: returnedata => {
          //alert("before getpost success!!!");
          getsearchpage();
        }
      });
    }
  }

  function redraw(data) {
    //empty 2 lists
    $("#product-list").empty();
    //alert(JSON.stringify(name))
    for (var i = 0; i < data.length; i++) {
      var name = data[i].name;
      var price = data[i].price;
      var des = data[i].description;
      stackproductlist(name, price, des);
    }
  }

  function redrawcart(data) {
    $("#cart-list").empty();
    //alert(JSON.stringify(name))
    for (var i = 0; i < data.length; i++) {
      var productId = data[i].productId;
      var amount = data[i].amount;
      stackcartitems(productId, amount);
    }
  }

  function stackproductlist(name, price, des) {
    var taskHTML =
      '<div class="col-lg-4 col-md-6 mb-4">' +
      '<div class="card h-100">' +
      ' <a href="#"><img class="card-img-top" src="http://placehold.it/700x400" alt=""></a>' +
      '<div class="card-body">' +
      ' <h4 class="card-title"><a href="#">Item One</a></h4>' +
      '<h5 class="card-price">$24.99</h5>' +
      '<p class="card-text">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet numquam aspernatur!</p>' +
      '<button id="addtocart" type="button" class="btn btn-primary btn">Add</button> </div> </div> </div>';
    var $newTask = $(taskHTML);
    $newTask.find(".card-title").text(name);
    $newTask.find(".card-price").text(price);
    $newTask.find(".card-text").text(des);

    $newTask.hide();
    $("#product-list").append($newTask);
    //$("#product-list") = [...$("#product-list"), $newTask];

    $newTask.show();
    $("#product-name").val("");
    $("#product-price").val("");
    $("#product-des").val("");
  }

  function stackcartitems(productId, amount) {
    var taskHTML =
      '<div id="cart-item" class="row">' +
      '<div class="col-12 text-sm-center col-sm-12 text-md-left' +
      'col-md-6">' +
      '<h6 class="productincart-name"><strong>Product' +
      "Name</strong></h4>" +
      "</div>" +
      '<div class="col-12 col-sm-12 text-sm-center col-md-4 ' +
      'text-md-right row">' +
      '<div class="col-3 col-sm-3 col-md-6 text-md-right" ' +
      'style="padding-top: 5px">' +
      '<h6 class="productincart-price"><strong>25.00 </strong></h6>' +
      "</div>" +
      '<div class="col-4 col-sm-4 col-md-4 text-md-right" ' +
      'style="padding-top: 5px">' +
      '<h6 class="productincart-amount"><strong>1 </strong></h6>' +
      "</div></div></div><hr>";

    var $newCart = $(taskHTML);
    $newCart.find(".productincart-name").text(productId);
    $newCart.find(".productincart-amount").text(amount);

    $newCart.hide();
    $("#cart-items").append($newCart);
    //$("#product-list") = [...$("#product-list"), $newTask];

    $newCart.show();
  }
}); // end ready
