// Required modules and configurations.
const AWS = require('aws-sdk');
const { handler } = require('.');
AWS.config.update({
    region: 'us-east-1',
    accessKeyId: "",
    secretAccessKey: ""
});
const dynamodb = new AWS.DynamoDB.DocumentClient();

// Handler function that handles all of the RESTful API requests
// Input: event from API Gateway
exports.handler2 = async (event) => {
    console.log('Request Event: ', event);
    let response;
    let request = {};
    switch(true) {
        // Entry for POST /store/order
        case event.httpMethod === 'POST' && event.path === '/store/order':
            response = await createOrder(JSON.parse(event.body));
            break;
        // Entry for GET /store/order/{orderId}
        case event.httpMethod === 'GET' && event.path === `/store/order/${event.queryStringParameters.order_id}`:
            request = JSON.parse(event.queryStringParameters);
            response = await findOrder(parseInt(request.order_id));
            break;
        // Entry for DELETE /store/order/{orderId}
        case event.httpMethod === 'DELETE' && event.path === `/store/order/${event.pathParameters.orderId}`:
            response = await deleteOrder(parseInt(event.pathParameters.orderId));
        // If no request fits, return a 404 Not Found error
        default: 
            response = buildResponse(404, 'Not found');
    }
    return response;
}

// This function builds and returns the appropriate response for each request.
// Parameters: 
// code: the status code of the response.
// body: description of response/return value if successful.
function buildResponse(code, body) {
    return {
        statusCode: code,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    };
}

// This is the function that handles POST /store/order
// Parameters:
// orderBody: body part of the event, which contains the request.
async function createOrder(orderBody) {

    // Checking if order query is ill-formed
    if(!validateOrderQuery(orderBody)) {
        return buildResponse(400, "Invalid Order");
    }
    // Input parameters for DynamoDB's put function.
    const params = {
        TableName: 'Store',
        Item: orderBody
    };
    return await dynamodb.put(params).promise().then(() => {
        const body = {
            Operation: 'POST',
            Message: 'Success',
            Item: orderBody
        };
        return buildResponse(200, body);
    }, (error) => {
        return buildResponse(400, "Invalid Order");
    });
}

// this function handles GET /store/order/{orderId}
// Parameters: 
// orderId: id number of the order
async function findOrder(orderId) {

    // Checking if order id is valid
    if(!checkOrderId(orderId)) {
        return buildResponse(400, "Invalid ID supplied");
    }
    // Input parameter to find order.
    const params = {
        TableName: 'Store',
        Key: {
            'order_id': orderId
        }
    };
    return await dynamodb.get(params).promise().then((response) => {
        return buildResponse(200, response.Item);
    }, (error) => {
        return buildResponse(404, "Order not found");
    });
}

// this function handles DELETE /store/order/{orderId}
// Parameters: 
// orderId: id number of the order.
async function deleteOrder(orderId) {

    // Checking if order id is valid
    if(!checkOrderId(orderId)) {
        return buildResponse(400, "Invalid ID supplied");
    }
    // Parameters to delete order from Dynamo DB.
    const params = {
        TableName: 'Store',
        Key: {
            'order_id': orderId
        },
        ReturnValues: 'ALL_OLD'
    };
    return await dynamodb.delete(params).promise().then((response) => {
        const body = {
            Operation: 'DELETE',
            Message: 'Success',
            Item: response
        };
        return buildResponse(200, body);
    }, (error) => {
        return buildResponse(404, "Order not found");
    });  
}

// Function that validates the order query.
// Parameters: 
// body: body attribute of the event object.
function validateOrderQuery(body) {
    if(Object.keys(body).length != 6) {
        return false;
    } else if(!body.hasOwnProperty("order_id")|| !Number.isInteger(body["order_id"]) || body["order_id"] < 0) {
        return false;
    } else if(!body.hasOwnProperty("petId") || !Number.isInteger(body["petId"]) || body["petId"] < 0) {
        return false;
    } else if(!body.hasOwnProperty("quantity") || !Number.isInteger(body["quantity"]) || body["quantity"] < 0) {
        return false;
    } else if(!body.hasOwnProperty("shipDate") || typeof body["shipDate"] != "string" || !checkDateFormat(body["shipDate"])) {
        return false;
    } else if(!body.hasOwnProperty("status") || typeof body["status"] != "string") {
        return false;
    } else if(!body.hasOwnProperty("complete") || typeof body["complete"] != "boolean") {
        return false;
    } else {
        return true;
    }
}

// Checks if shipDate is in a date format.
// Parameters:
// shipDate: shipDate attribute of the order query.
function checkDateFormat(shipDate) {
    var date = Date.parse(shipDate);
    if(isNaN(date)) {
        return false;
    } else {
        return true;
    }
}

// Checks if orderId is between 1 and 10, which is a requirement for 2 of the resources.
// Parameters:
// orderId: id of the order being queried.
function checkOrderId(orderId) {
    if(orderId < 1 || orderId > 10) {
        return false;
    } else {
        return true;
    }
}
