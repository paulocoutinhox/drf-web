export class Response {
    constructor(success, httpCode, message = null, errors = null, data = null) {
        this.success = success;
        this.httpCode = httpCode;
        this.message = message;
        this.errors = errors;
        this.data = data;
    }
}

export class ResponseAuthToken {
    constructor(access, refresh) {
        this.access = access;
        this.refresh = refresh;
    }
}

export class ResponseError {
    constructor(detail = null, code = null) {
        this.detail = detail;
        this.code = code;
    }
}

export class ResponseList {
    constructor(count, next = null, previous = null, results) {
        this.count = count;
        this.next = next ? new URL(next) : null;
        this.previous = previous ? new URL(previous) : null;
        this.results = results;
    }
}

export const ResponseType = {
    SINGLE: 'single',
    LIST: 'list'
};

export class Client {
    constructor() {
        this.baseURL = 'http://localhost:8000/api/';
        this.authToken = null;
    }

    setBaseURL(url) {
        this.baseURL = url;
    }

    setAuthToken(token) {
        this.authToken = token;
    }

    request(endpoint, method, parameters = null, type, completion) {
        const url = new URL(endpoint, this.baseURL);

        let request = {
            method: method.toUpperCase(),
            headers: {
                'Content-Type': 'application/json'
            },
            body: parameters ? JSON.stringify(parameters) : null
        };

        if (this.authToken) {
            request.headers['Authorization'] = `Bearer ${this.authToken}`;
        }

        fetch(url, request).then(response => {
            if (response.ok) {
                response.json().then(data => {
                    let apiResponse;
                    switch (type) {
                        case ResponseType.LIST:
                            apiResponse = new Response(true, response.status, 'success', null, data.results);
                            break;
                        case ResponseType.SINGLE:
                            apiResponse = new Response(true, response.status, 'success', null, data);
                            break;
                    }
                    completion({ success: true, data: apiResponse });
                }).catch(error => completion({ success: false, error }));
            } else {
                // Handle HTTP error responses
                response.json().then(errorData => {
                    let apiResponse = new Response(false, response.status, 'error', null, null);
                    if (response.status >= 400 && response.status < 500) {
                        apiResponse.errors = errorData;
                    }
                    completion({ success: false, data: apiResponse });
                }).catch(error => completion({ success: false, error }));
            }
        }).catch(error => completion({ success: false, error }));
    }

    static get shared() {
        if (!this.instance) {
            this.instance = new Client();
        }
        return this.instance;
    }
}
