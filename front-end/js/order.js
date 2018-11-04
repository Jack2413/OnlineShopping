var url = 'https://nwen304onlineshoping.herokuapp.com';
var ERROR_LOG = console.error.bind(console);
$(document).ready(function(e) {
	loadOrder();
	$('#viewButton').click(function() {
		var $orderInfo = $(this).parent('tr');
		var $orderid = $orderInfo.find('.orderid').text();
		alert(orderid);

		$.ajax({
				method: 'POST',
				url: url+'/order',
				data: JSON.stringify({
					orderid: $orderid
				}),
				contentType: "application/json",
				datatype: "json"

		}).then (
		function(result){
			if(result.status==200){
				
			}	
		}, 
		function(error){
			alert(error);

		});
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
        orderHTML += '<td class="btn btn-success" id="viewButton">View</td></tr>'
			
		$('#orderbody').prepend(orderHTML);
		count ++;
	});
}



