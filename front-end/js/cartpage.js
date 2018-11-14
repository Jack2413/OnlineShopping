$(document).ready(function(e) {
  var ERROR_LOG = console.error.bind(console);
  console.log("cartpage.js working");
  var addtocartinfo = $("addtocart").text();

  getcartpage();

  add1 = elem => {
    var array = elem.id.split(",");
    var name = array[0];
    var email = array[1];
    var todo = { name: name, email: email };
    cartadd1(todo);
  };

  minus1 = elem => {
    var array = elem.id.split(",");
    var name = array[0];
    var email = array[1];
    var amount = array[2];
    var todo = { name: name, email: email };

    if (amount >= 2) {
      cartminus1(todo);
    } else {
      cartdelete(todo);
    }
  };

  deleteproduct = elem => {
    var array = elem.id.split(",");
    var name = array[0];
    var email = array[1];
    var todo = { name: name, email: email };
    cartdelete(todo);
  };

  checkoutclicked = elem => {
    //var currentemail = window.localStorage.getItem("email");
    var currentemail = "test@gmail.com";
    var todo = { email: currentemail };
    addtoorder(todo, elem);
    getcurrentorderid();
    emptycart(todo);
  };

  function addtoorder(todo, elem) {
    //alert("email: " + todo.email);
    $.ajax({
      method: "POST",
      url: "/addtoorders",
      data: todo,
      success: orderid => {
        //alert("addtoorder success, orderid: " + orderid);
        // elem.id = orderid;
        // alert(elem.id);
        //addtoorderdetails(elem.id);
      }
    });
  }

  function emptycart(todo) {
    $.ajax({
      method: "PUT",
      url: "/emptycart",
      data: todo,
      success: data => {}
    });
  }

  function getcurrentorderid() {
    $.ajax({
      method: "GET",
      //hardcoding a bit, cuz I can not login now
      url: "/currentorderid",
      success: data => {
        addtoorderdetails(data[0].orderid);
      }
    });
  }

  function addtoorderdetails(currentorderID) {
    var data = JSON.parse(localStorage.getItem("currentcart"));
    for (var i = 0; i < data.length; i++) {
      var orderid = currentorderID;
      var email = data[i].email;
      var productid = data[i].id;
      var amount = data[i].amount;
      var totalprice = window.localStorage.getItem("totalprice");
      //alert("totalprice: " + totalprice);
      var todo = {
        orderid: orderid,
        email: email,
        productid: productid,
        amount: amount,
        totalprice: totalprice
      };
      addtoorderdetailslinebyline(todo);
    }
    alert("add to orderdetails success");
  }

  function addtoorderdetailslinebyline(todo) {
    $.ajax({
      method: "POST",
      url: "/addtoorderdetails",
      data: todo,
      success: data => {
        alert(" 1 line to orderdetails");
      }
    });
  }

  function cartadd1(todo) {
    $.ajax({
      method: "PUT",
      url: "/cartadd1",
      data: todo,
      success: data => {
        getcartpage();
      }
    });
  }

  function cartminus1(todo) {
    $.ajax({
      method: "PUT",
      url: "/cartminus1",
      data: todo,
      success: data => {
        getcartpage();
      }
    });
  }

  function cartdelete(todo) {
    $.ajax({
      method: "PUT",
      url: "/cartdelete",
      data: todo,
      success: data => {
        getcartpage();
      }
    });
  }

  function getcartpage() {
    //var currentemail = window.localStorage.getItem("email");
    var currentemail = "test@gmail.com";
    $("#cart-items").empty();
    $.ajax({
      method: "GET",
      url: "/cartdb/" + currentemail,
      success: data => {
        redrawcart(data);
        localStorage.setItem("currentcart", JSON.stringify(data));
      }
    });
  }

  //hardcoding current user's email

  function redrawcart(data) {
    var totalprice = 0;
    $("#cart-items").empty();
    for (var i = 0; i < data.length; i++) {
      var id = data[i].id;
      var name = data[i].name;
      var price = data[i].price;
      var amount = data[i].amount;
      // var currentemail = window.localStorage.getItem("email");
      var currentemail = "test@gmail.com";
      totalprice += price.replace(/[^\d.]/g, "") * amount;
      window.localStorage.setItem("totalprice", totalprice);
      stackcartitems(name, price, amount, currentemail);
    }
    $("#ttprice").text(totalprice);
  }

  function stackcartitems(name, price, amount, currentemail) {
    var info = name + "," + currentemail;
    var minusinfo = name + "," + currentemail + "," + amount;
    var taskHTML =
      '<div id="cart-item" class="row">' +
      '<div class="col-12 text-sm-center col-sm-12 text-md-left col-md-6">' +
      '<h6 class="productincart-name"><strong>Product' +
      "Name</strong></h6>" +
      "</div>" +
      '<div class="col-12 col-sm-12 text-sm-center col-md-4 ' +
      'text-md-right row">' +
      '<div class="col-3 col-sm-3 col-md-6 text-md-right" ' +
      'style="padding-top: 5px">' +
      '<h6 class="productincart-price"><strong>25.00 </strong></h6>' +
      "</div>" +
      '<div class="col-4 col-sm-4 col-md-4 text-md-right" ' +
      'style="padding-top: 5px">' +
      '<h6 class="productincart-amount"><strong>1 </strong></h6></div>' +
      '<div class=" btn-group col-2 col-sm-2 col-md-2 text-right">	' +
      '<button id="' +
      info +
      '"onclick=add1(this) type="button" class="btn btn-outline-secondary btn-xs">	' +
      "<strong>+</strong></button>" +
      '<button id="' +
      minusinfo +
      '"onclick=minus1(this) type="button" class="btn btn-outline-secondary btn-xs">	' +
      "<strong>-</strong></button>" +
      '<button id="' +
      info +
      '"onclick=deleteproduct(this) type="button" class="btn btn-outline-danger btn-xs">	' +
      '<i class="fa fa-trash" aria-hidden="true"></i>	</button>' +
      "</div>" +
      "</div></div><hr>";

    var $newCart = $(taskHTML);
    $newCart.find(".productincart-name").text(name);
    $newCart.find(".productincart-price").text(price);
    $newCart.find(".productincart-amount").text(amount);

    $newCart.hide();
    $("#cart-items").prepend($newCart);
    //$("#product-list") = [...$("#product-list"), $newTask];
    $newCart.show();
  }
}); // end ready
