// Required modules and configurations.
const db = require("./db");
const {
    GetItemCommand,
    PutItemCommand,
    DeleteItemCommand,
    ScanCommand,
    UpdateItemCommand
} = require("@aws-sdk/client-dynamodb");
const {marshall, unmarshall} = require("@aws-sdk/util-dynamodb");
const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    accessKeyId: "AKIAUTIATMCNZZSH4XZV",
    secretAccessKey: "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"
});
const dynamodb = new AWS.DynamoDB.DocumentClient();

// Handler function that handles all of the RESTful API requests
// Input: event from API Gateway
exports.handler = async (event) => {
    console.log('Request Event: ', event);
    let response;
    const request = {};
    switch(true){
        // Entry for POST /pet resource.
        case event.httpMethod === 'POST' && event.path === '/pet':
            //NOTE: it is await addPet(JSON.parse(event.body)) in the AWS Lambda
            response = await createPet(event.body);
            break;
        // Entry for PUT /pet resource.
        case event.httpMethod === 'PUT' && event.path === '/pet':
            //NOTE: it is await updatePet(JSON.parse(event.body)) in the AWS Lambda
            response = await updatePet(event.body);
            break;
        // Entry for GET /pet/findByStatus resource.
        case event.httpMethod === 'GET' && event.path === '/pet/findByStatus':
            response = await getStatus(event.body.status);
            break;
        // Entry for GET /pet/{petId} resource.
        case event.httpMethod === 'GET' && event.path === `/pet/${event.queryStringParameters.pet_id}`:
            response = await findPet(parseInt(event.queryStringParameters.pet_id));
            break;
        // Entry for POST /pet/{petId} resource.
        case event.httpMethod === 'POST' && event.path === `/pet/${event.queryStringParameters.pet_id}`:
            let parsedEvent = JSON.parse(event.body);
            let petId = event.queryStringParameters.pet_id;
            let name = parsedEvent["name"];
            let status = parsedEvent["status"];
            response = await updatePetFormData(petId, name, status);
            break;
        // Entry for DELETE /pet/{petId} resource.
        case event.httpMethod === 'DELETE' && event.path === `/pet/${event.queryStringParameters.pet_id}`:
            response = await deletePet(parseInt(event.pathParameters.petId));
            break;
        // Entry for POST /pet/{petId}/uploadImage resource
        case event.httpMethod === 'POST' && event.path === `/pet/${event.body.pet_id}/uploadImage`:
            let parsed = JSON.parse(event.body);
            response = await uploadImage(parsed.pet_id, parsed.tags, parsed.photoUrl);
            break;
        // Entry for GET /store/inventory resource
        case event.httpMethod === 'GET' && event.path === '/store/inventory':
            response = getInventory();
            break;
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

// This is the function that handles POST /pet.
// Parameters:
// body: The body of the event input in the handler function.
async function createPet(body) {
    try {
        if(!validateQuery(body)) {
            return buildResponse(405, 'Invalid input');
        }
        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Item: marshall(body)
        }
        const res = await db.send(new PutItemCommand(params));
        
        return buildResponse(200, res);
    } catch (e) {
        console.log(e);
        return buildResponse(e.statusCode, "Failed to create pet");
    }
    /*
    // Called to make sure query is not ill-formed.
    if(!validateQuery(body)) {
        return buildResponse(405, 'Invalid input');
    }
    // params is the input for the put operation in DynamoDB.
    const params = {
        TableName: 'Pet',
        Item: body
    };
    // operation to insert query in the Pet table on DynamoDB.
    return await dynamodb.put(params).promise().then(() => {
        const body2 = {
            Operation: 'POST',
            Message: 'Success',
            Item: body
        };
        return buildResponse(200, body2);
    }, (error) => {
        return buildResponse(405, 'Invalid input');
    });
    */
}


// This is the function that handles PUT /pet.
// Parameters:
// body: The body of the event input in the handler function.
async function updatePet(body) {

    try {
        if(!validateQuery(body)) {
            return buildResponse(405, 'Invalid input');
        }
        const objKeys = Object.keys(body)
        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Key: marshall({pet_id: body["pet_id"]}),
            UpdateExpression: "SET #category = :c, #name = :n, #photoUrls = :p, #tags = :t, #status = :s",
            ExpressionAttributeNames: {
                "#category": "category",
                "#name": "name",
                "#photoUrls": "photoUrls",
                "#tags": "tags",
                "#status": "status"
            },
            ExpressionAttributeValues: {
                ":c": body["category"],
                ":n": body["name"],
                ":p": body["photoUrls"],
                ":t": body["tags"],
                ":s": body["status"]
            },
            ReturnValues: "UPDATED_NEW"
        }
        const res = await db.send(new UpdateItemCommand(params));
        
        return buildResponse(200, unmarshall(res));
    } catch (e) {
        console.log(e);
        return buildResponse(e.statusCode, "Failed to create pet");
    }

    // Added this if statement due to the different error code required, this if
    // statement checks for a code 400 error.
    /*
    if(Number.isInteger(body["pet_id"]) == false || body["pet_id"] < 0){
        return buildResponse(400, 'Invalid ID supplied');
    }
    // This if statement checks for a 405 error.
    if(validateQuery(body) == false) {
        return buildResponse(405, 'Validation Exception');
    }

    // These are the inputs for DynamoDB's update function.
    const params = {
        TableName: 'Pet',
        Key: {
            'pet_id': body["pet_id"]
        },
        UpdateExpression: "SET #category = :c, #name = :n, #photoUrls = :p, #tags = :t, #status = :s",
        ExpressionAttributeNames: {
            "#category": "category",
            "#name": "name",
            "#photoUrls": "photoUrls",
            "#tags": "tags",
            "#status": "status"
        },
        ExpressionAttributeValues: {
            ":c": body["category"],
            ":n": body["name"],
            ":p": body["photoUrls"],
            ":t": body["tags"],
            ":s": body["status"]
        },
        ReturnValues: "UPDATED_NEW"
    };
    
    // Updating Pet table on DynamoDB.
    return await dynamodb.update(params).promise().then((response) => {
        const body = {
            Operation: 'UPDATE',
            Message: 'Success',
            UpdatedAttributes: response
        };
        return buildResponse(200, body);
    }, (error) => {
        return buildResponse(404, "Pet not found");
    });
    */
}

// This function handles GET /pet/findByStatus and GET /store/inventory
// Parameters:
// status: The status in which we will filter the Pets data table.
async function getStatus(status) {
    // Checking if status is valid.
    if(!checkStatus(status)) {
        return buildResponse(400, 'Invalid status value');
    }
    // Parameters for scanStatus function
    const params = {
        TableName: 'Pet',
        KeyConditionExpression: "status = :s",
        ExpressionAttributeValues: {
            ":s": status
        }
    }
    const petsArray = [];
    const petsWithStatus = await scanStatus(params, petsArray);
    const body = {
        pets: petsWithStatus
    };
    return buildResponse(200, body);
}

// Helper function. It is a recursive function since there is a limit in DynamoDB 
// as to how much data you can return on 1 call, so we would have to check if the query has all items.
// Parameters: 
// params is the input for the scan function for the DynamoDB table.
// petsArray is the array with all pets with a certain status.
async function scanStatus(params, petsArray) {
    try {
        const data = await dynamodb.scan(params).promise();
        petsArray = petsArray.concat(data.Items);
        if(data.LastEvaluatedKey) {
            params.ExclusiveStartKey = data.LastEvaluatedKey;
            return await scanStatus(params, petsArray);
        }
        return petsArray;
    } catch(error) {
        return buildResponse(400, 'Invalid status value');
    }
}

// This function handles GET /pet/{petId}
// Parameters:
// petId: id of the pet request is trying to find.
async function findPet(petId) {
    // Checking if petId is valid.
    try {
        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Key: marshall({pet_id: petId})
        }
        const {Item} = await db.send(new GetItemCommand(params));
        console.log({Item});
        /*
        if(Item == {}) {
            return buildResponse(404, "Not found");
        }
        */
        return buildResponse(200, unmarshall(Item));
    } catch (e) {
        console.log(e);
        return buildResponse(e.statusCode, "Failed to get pet");
    }

    /*
    if(!petIdChecker(petId)) {
        return buildResponse(400, "Invalid ID Supplied");
    }
    
    // Input parameters for DynamoDB's get function.
    const params = {
        TableName: 'Pet',
        Key: {
            'pet_id': petId
        }
    };
    return await dynamodb.get(params).promise().then((response) => {
        return buildResponse(200, response.Item);
    }, (error) => {
        return buildResponse(404, "Pet not found");
    });
    */
}

// This function handles POST /pet/{petId}
// Parameters:
// petId = id of the pet that the request is trying to find.
// name = new name of the pet.
// status = new status of the pet.
async function updatePetFormData(petId, name, status) {
    // Checking if name and status are valid.
    if(checkName(name) == false && checkStatus(status) == false) {
        return buildResponse(405, "Invalid input");
    }
    // Parameters for DynamoDB's update function.
    const params = {
        TableName: 'Pet',
        Key: {
            'pet_id': petId
        },
        UpdateExpression: "SET #name = :n, #status = :s",
        ExpressionAttributeNames: {
            "#name": "name",
            "#status": "status"
        },
        ExpressionAttributeValues: {
            ":n" : name,
            ":s" : status
        },
        ReturnValues: "UPDATED_NEW"
    };
    return await dynamodb.update(params).promise().then((response) => {
        const body = {
            Operation: 'UPDATE',
            Message: 'Success',
            UpdatedAttributes: response
        };
        return buildResponse(200, body);
    }, (error) => {
        return buildResponse(405, 'Invalid input');
    });
}

// This function handles DELETE /pet/{petId}
// Parameters:
// petId: id of the pet we will delete.
async function deletePet(petId) {

    try {
        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Key: marshall({pet_id: petId})
        }
        const {Item} = await db.send(new DeleteItemCommand(params));
        return buildResponse(200, res);
    } catch (e) {
        console.log(e);
        return buildResponse(e.statusCode, "Failed to delete pet");
    }

    /*
    if(petIdChecker(petId) == false) {
        return buildResponse(400, "Invalid ID Supplied");
    }
    // Input parameters for DynamoDB's delete function.
    const params = {
        TableName: 'Pet',
        Key: {
            'pet_id': petId
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
    });
    */
}

// ASSUMPTION: metadata is the name part of the tags of the photo and can be null.
// NOTE: This is very simplified due to time constrains
// This function handles POST /pet/{petId}/uploadImage
// Parameters:
// petId: id of the pet photo refers to.
// metadata: tags of the photo. 
// file: file to be uploaded
async function uploadImage(petId, metadata, file) {
    // Checking if inputs are in correct data type and value
    if(typeof file != "string" || !petIdChecker(petId) || typeof metadata != "string") {
        return buildResponse(400, "Invalid link");
    }
    // Getting the pet from database
    const params = {
        TableName: 'Pet',
        Key: {
            'pet_id': petId
        }
    };
    let pet = await dynamodb.get(params).promise();
    if(metadata != null) {
        let tagsSize = pet["tags"].length;
        const tagObj = {
            "id": tagsSize,
            "name": metadata
        };
        pet["tags"].push(tagObj);
    }
    let photoArray = pet["photoUrls"];
    photoArray.push(file);
    
    const response = {
        "code": 200, 
        "type": "Success",
        "message": "successful operation"
    };

    return buildResponse(200, response);
}

// This function handles the GET /store/inventory resource
// It simply uses the GET /pet/findByStatus function, but for every
// possible status input.
async function getInventory() {

    // Getting arrays of each status.
    let available = await getStatus("available");
    let pending = await getStatus("pending");
    let sold = await getStatus("sold");

    // Forming map of status code. 
    let petMap = {
        "available": available,
        "pending": pending,
        "sold": sold
    };
    // Forming return value.
    let response = {
        Operation: 'UPDATE',
        Message: 'Success',
        Item: petMap
    };
    return buildResponse(200, response);
}


// Checks if request body has the correct properties and that those properties contain the correct type.
// Parameters:
// body: body of the request.
function validateQuery(body) {
    if(Object.keys(body).length != 6){
        return false;
    } else if(body.hasOwnProperty("pet_id") == false || Number.isInteger(body["pet_id"]) == false || body["pet_id"] < 0) {
        return false;
    } else if(body.hasOwnProperty("category") == false || typeof body["category"] != "object") {
        return false;
    } else if(Object.keys(body["category"]).length != 2) {
        return false;
    } else if(body["category"].hasOwnProperty("id") == false || Number.isInteger(body["category"]["id"]) == false) {
        return false;
    } else if(body["category"].hasOwnProperty("name") == false || typeof body["category"]["name"] != "string") {
        return false;
    } else if(body.hasOwnProperty("name") == false || typeof body["name"] != "string") {
        return false;
    } else if(body.hasOwnProperty("photoUrls") == false && !checkPhotoUrls(body["photoUrls"])) {
        return false;
    } else if(body.hasOwnProperty("tags") == false && !checkTags(body["tags"])) {
        return false;
    } else if(body.hasOwnProperty("status") == false) {
        return false;
    } else if(checkStatus(body["status"]) == false) {
        return false;
    } else {
        return true;
    }
}

// Checks petId for the 400 code error in GET and DELETE /pet/{petId}
// Parameters: 
// petId: id of the pet.
function petIdChecker(petId) {
    if(Number.isInteger(petId) == false || petId < 0) {
        return false
    } else {
        return true;
    }
}

// Checks if name is valid.
// Parameters:
// name: name of pet.
function checkName(name) {
    if(typeof name != "string") {
        return false;
    }
}

// Checks if status is valid.
// Parameters:
// status: status of pet.
function checkStatus(status) {
    if(status != "available" && status != "pending" && status != "sold") {
        return false;
    }
}

// Checks if photoUrls part of event.body is ill-formed
// Parameters:
// photoUrls: photoUrl array
function checkPhotoUrls(photoUrls) {
    if(!photoUrls.isArray()) {
        return false;
    }
    let i;
    for(i = 0; i < photoUrls.length; i++) {
        if(typeof photoUrls[i] != "string") {
            return false;
        }
    }
    return true;
}

// Checks if tags are well-formed
// Parameters:
// tags: tags array
function checkTags(tags) {
    if(!tags.isArray()) {
        return false;
    }
    let i;
    for(i = 0; i < tags.length; i++) {
        if(tags[i]["id"] == undefined || Number.isInteger(tags[i]["id"])) {
            return false;
        }
        if(tags[i]["name"] == undefined || typeof tags[i]["name"] != "string") {
            return false;
        }
    }
    return true;
}

module.exports = {
    createPet,
    updatePet,
    deletePet,
    findPet,
};