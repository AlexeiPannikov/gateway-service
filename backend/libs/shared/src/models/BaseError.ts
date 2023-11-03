export class BaseError {
    code = 500;
    messages: string[] = [];
    details?: string[] = [];
    stack?: string[] = [];

    constructor(obj: BaseError) {
        Object.assign(this, obj)
    }
}