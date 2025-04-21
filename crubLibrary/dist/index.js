// src/index.ts
import axios from 'axios';
class Crublibrary {
    apiKey;
    apiUrl;
    constructor(options) {
        this.apiKey = options.apiKey;
        this.apiUrl = options.apiUrl;
        console.log(`api key : ${this.apiKey} and api url : ${this.apiUrl}`);
    }
    //recharge
    async recharge() {
        console.log("inside recharge ....");
        try {
            const response = await axios.post(`${this.apiUrl}/crud/recharge`, {}, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        }
        catch (error) {
            console.log("Error in recharge method:");
            this.handleError('POST', 'recharge', error.response?.data?.error);
        }
    }
    // CREATE
    async create(data) {
        console.log("inside create ....");
        try {
            console.log("inside create ....try ... ");
            const response = await axios.post(`${this.apiUrl}/crud/create`, JSON.stringify(data), {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        }
        catch (error) {
            console.log("Error in create method:");
            this.handleError('POST', 'crud/create', error.response?.data?.erro);
        }
    }
    // READ (Get all todos for the user)
    async get() {
        console.log("inside get ....");
        try {
            const response = await axios.get(`${this.apiUrl}/crud/get`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                }
            });
            return response.data;
        }
        catch (error) {
            console.log("this is the error ", error.response?.data?.error, "now complete");
            this.handleError('GET', 'crud/get', error.response?.data?.error);
        }
    }
    // UPDATE (Update a todo by txHash)
    async update(txHash, value) {
        try {
            const response = await axios.put(`${this.apiUrl}/crud/update`, JSON.stringify({ txHash, value }), {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        }
        catch (error) {
            this.handleError('PUT', 'crud/update', error.response?.data?.error);
        }
    }
    // DELETE (Delete a todo by txHash)
    async delete(txHash) {
        try {
            console.log("gffgfga");
            const response = await axios.request({
                method: 'delete',
                url: `${this.apiUrl}/crud/delete`,
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                data: { txHash } // Send txHash in the body
            });
            return response.data;
        }
        catch (error) {
            this.handleError('DELETE', 'crud/delete', error.response?.data?.erro);
        }
    }
    // Error handling
    handleError(method, endpoint, error) {
        throw new Error(`${error}`);
    }
}
export function sayHelloFromLibrary() {
    console.log("Hello from library");
}
export default Crublibrary;
