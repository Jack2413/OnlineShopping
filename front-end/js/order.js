var url = 'https://nwen304onlineshoping.herokuapp.com';
var ERROR_LOG = console.error.bind(console);
$(document).ready(function(e) {
	loadOrder();
});

function loadOrder () {
	alert(window.localStorage.getItem("email"));
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
        orderHTML += '<td>'+order.email+'</td>'
        orderHTML += '<td>'+order.orderid+'</td>'
        orderHTML += '<td>'+order.totalprice+'</td>'
        orderHTML += '<td>'+order.thedate+'</td>'
        orderHTML += '<td><a href="viewOrder.html" class="btn btn-success">View</a></td></tr>'
			
		$('#orderbody').prepend(orderHTML);
		count ++;
	});
}