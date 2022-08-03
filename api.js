const db = require("./db");
const {
    GetItemCommand,
    PutItemCommand,
    DeleteItemCommand,
    ScanCommand,
    UpdateItemCommand,
} = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

const getPaciente = async (event) => {
    const response = { 
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
        }
        };

    try {
        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Key: marshall({ pacienteId: event.pathParameters.pacienteId }),
        };
        const { Item } = await db.send(new GetItemCommand(params));

        console.log({ Item });
        response.body = JSON.stringify({
            message: "Successfully retrieved paciente.",
            data: (Item) ? unmarshall(Item) : {},
            rawData: Item,
        });
    } catch (e) {
        console.error(e);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: "Failed to get paciente",
            errorMsg: e.message,
            errorStack: e.stack,
        });
    }

    return response;
};

const createPaciente = async (event) => {
    const response = { 
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
        }
        };

    try {
        const body = JSON.parse(event.body);
        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Item: marshall(body || {}),
        };
        const createResult = await db.send(new PutItemCommand(params));

        response.body = JSON.stringify({
            message: "Successfully created paciente.",
            createResult,
        });
    } catch (e) {
        console.error(e);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: "Failed to create paciente",
            errorMsg: e.message,
            errorStack: e.stack,
        });
    }

    return response;
}; 

const updatePaciente = async (event) => {
    const response = { 
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
        }
        };

    try {
        const body = JSON.parse(event.body);
        const objKeys = Object.keys(body);
        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Key: marshall({ pacienteId: event.pathParameters.pacienteId }),
            UpdateExpression: `SET ${objKeys.map((_, index) => `#key${index} = :value${index}`).join(", ")}`,
            ExpressionAttributeNames: objKeys.reduce((acc, key, index) => ({
                ...acc,
                [`#key${index}`]: key,
            }), {}),
            ExpressionAttributeValues: marshall(objKeys.reduce((acc, key, index) => ({
                ...acc,
                [`:value${index}`]: body[key],
            }), {})),
        };
        const updateResult = await db.send(new UpdateItemCommand(params));

        response.body = JSON.stringify({
            message: "Successfully updated paciente.",
            updateResult,
        });
    } catch (e) {
        console.error(e);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: "Failed to update paciente",
            errorMsg: e.message,
            errorStack: e.stack,
        });
    }

    return response;
};

const deletePaciente = async (event) => {
    const response = { 
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
        }
        };

    try {
        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Key: marshall({ pacienteId: event.pathParameters.pacienteId }),
            
        };
        const deleteResult = await db.send(new DeleteItemCommand(params));

        response.body = JSON.stringify({
            message: "Successfully deleted paciente.",
            deleteResult,
        });
    } catch (e) {
        console.error(e);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: "Failed to delete paciente",
            errorMsg: e.message,
            errorStack: e.stack,
        });
    }

    return response;
};

const getAllPacientes = async () => {
    const response = { 
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
        }
    };

    try {
        const { Items } = await db.send(new ScanCommand({ TableName: process.env.DYNAMODB_TABLE_NAME }));

        response.body = JSON.stringify({
            message: "Successfully retrieved all paciente.",
            data: Items.map(( item ) => unmarshall(item)),
            Items,
        });
    } catch (e) {
        console.error(e);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: "Failed to retrieve paciente",
            errorMsg: e.message,
            errorStack: e.stack,
        });
    }

    return response;
};

module.exports = {
    getPaciente,
    createPaciente,
    updatePaciente,
    deletePaciente,
    getAllPacientes,
};