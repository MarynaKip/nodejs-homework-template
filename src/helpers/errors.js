class ServiceError extends Error {
    constructor(message) {
        super(message);
        this.status = 400;
    }
}

class ValidationError extends ServiceError {
    constructor(message) {
        super(message);
        this.status = 400;
    }
}

class ConflictError extends ServiceError {
    constructor(message) {
        super(message);
        this.status = 409;
    }
}

class UnauthorizedError extends ServiceError {
    constructor(message) {
        super(message);
        this.status = 401;
    }
}

module.exports = { ServiceError, ValidationError, ConflictError, UnauthorizedError }