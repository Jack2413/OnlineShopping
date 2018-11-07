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
    addtoproduct(newproduct);
  });

  // $("#addtocart").click(() => {
  //   alert("Add item to cart!");
  // });

  $("#search").click(() => {
    var name = $("#searchitem").val();
    var name = { name: name };
    console.log(name);
    searchproduct();
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

  function addtoproduct(todo) {
    $.ajax({
      type: "POST",
      url: "/addtoproduct",
      data: todo,
      success: returnedata => {
        //alert("before getpost success!!!");
        getthewholepage();
      }
    });
  }

  //click Add button in card to add this product to cart
  Addincardclicked = elem => {
    // alert(e.id);
    var name = elem.id;
    var price = parseInt(elem.id);
    alert(name);
    alert(price);
  };

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

  function searchproduct() {
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

  function stackproductlist(name, price, des) {
    var info = 3 + name;
    var taskHTML =
      '<div class="col-lg-4 col-md-6 mb-4">' +
      '<div class="card h-100">' +
      ' <a href="#"><img class="card-img-top" src="http://placehold.it/700x400" alt=""></a>' +
      '<div class="card-body">' +
      ' <h4 class="card-title"><a href="#">Item One</a></h4>' +
      '<h5 class="card-price">$24.99</h5>' +
      '<p class="card-text">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet numquam aspernatur!</p></div>' +
      '<div class="card-footer">' +
      '<button id="' +
      info +
      '" onclick=Addincardclicked(this)  type="button" class="btn btn-primary btn">Add</button> </div> </div> </div>';
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
}); // end ready
