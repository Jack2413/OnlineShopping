var url = 'https://nwen304onlineshoping.herokuapp.com';
var ERROR_LOG = console.error.bind(console);
$(document).ready(function(e) {
	loadOrder();
	$('#orderbody').on('click', '#view', function() {

		var $orderInfo = $(this).parent().parent();
		var $orderID = $orderInfo.find('.orderid').text();

		$.ajax({
				method: 'POST',
				url: url+'/getOrderDetails',
				data: JSON.stringify({
					orderID: $orderID
				}),
				contentType: "application/json",
				datatype: "json"

		}).then (loadOrderDetails, ERROR_LOG);
		//alert($username+' '+$email+' '+$password);

	});
});



function loadOrder () {
	
	$.ajax ({
		method: 'POST',
		url: url+'/getOrder', 
		data: JSON.stringify({
			email: window.localStorage.getItem("email"),
		}),
		contentType: "application/json",
		datatype: "json"
				
	}).then (loadOrderData, ERROR_LOG);
}

function loadOrderData(orders){
	var count = 1;
	orders.forEach(order=>{
		//alert('ID: $1 Task: $2 Name: $3',task.id,task.task,task.name);
		
		var orderHTML = '<tr><th scope="row">'+count+'</th>'
        orderHTML += '<td class="email">'+order.email+'</td>'
        orderHTML += '<td class="orderid">'+order.orderid+'</td>'
        orderHTML += '<td class="thedate">'+order.thedate+'</td>'
        orderHTML += '<td><a class="btn btn-success" id="view">View</a></td></tr>'
			
		$('#orderbody').prepend(orderHTML);
		count ++;
	});
}

function loadOrderDetails(data_Details){
	
	
	var total_price = 0;
	var HTML;
	data_Details.forEach(data_Detail=>{
		//alert('ID: $1 Task: $2 Name: $3',task.id,task.task,task.name);
		
	HTML +=  '<div id="product-list" class="row">'
             +	'<div class="col-12 col-sm-12 col-md-2 text-center">'
             +  '<img class="img-responsive" src=../images/products/'+data_Detail.imagecode+'.png alt="prewiew" width="100" height="100">'
             +	'</div>'
             +	'<div class="col-12 text-sm-center col-sm-12 text-md-left col-md-6">'
             + 	'<h4 class="product-name"><strong>'+data_Detail.name+'</strong></h4>'
             +	'<h4><small>'+data_Detail.description+'</small></h4>'
             +  '</div>'
             +  '<div class="col-12 col-sm-12 text-sm-center col-md-4 text-md-right row">'
             +  '<div class="col-3 col-sm-3 col-md-6 text-md-right" style="padding-top: 5px">'
             +  '<h6><strong>'+data_Detail.price+'<span class="text-muted">x</span></strong></h6>'
             +  '</div>'
             +  '<div class="col-4 col-sm-4 col-md-4" style="padding-top: 5px">'
             +  '<div class="quantity">'
             +  '<h6><strong>'+data_Detail.amount+'</h6>'
             +  '</div>'
             +  '</div>'
             + 	'</div>'
        	 +	'</div>'
        	 +	'<hr>';

    
    total_price += parseFloat(data_Detail.price.replace(/[^0-9.-]+/g, ''))*parseInt(data_Detail.amount);

    });
    HTML += '<div class="card-footer">'
        +  '<div class="coupon col-md-5 col-sm-5 no-padding-left pull-left"></div>'
        +  '<div class="pull-right" style="margin: 10px">'
        +  '<div class="pull-right" style="margin: 5px">Total price: <b>'+total_price+'</b>'
        +  '</div>'
        +  '</div>'
        +  '</div>';

    $('#cardbody').empty();
    if(!HTML){
 	   $('#cardbody').prepend(HTML);
	}
}



