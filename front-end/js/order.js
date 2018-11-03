var url = 'https://nwen304onlineshoping.herokuapp.com';
var ERROR_LOG = console.error.bind(console);
$(document).ready(function(e) {
	loadOrder();
});

function loadOrder () {
	$.ajax ({
		method: 'GET',
		url: url+'/getOrder', 
				
	}).then (loadOrderData, ERROR_LOG);
}

function loadOrderData(orders){
	var count = 0;
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