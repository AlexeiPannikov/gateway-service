export class BaseResponse<T> {
    success: boolean = true;
    data: T | undefined
}