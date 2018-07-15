import { JsonRpc2 } from '../../shared/jsonrpc/json-rpc2';

export class RpcServer {
    private methodHandlers: {
        [key: string]: (params: any) => any;
    } = {};
    message(payload: string): string {
        let request: JsonRpc2.Request;
        try {
            request = JSON.parse(payload);
        }
        catch (e) {
            return this.error(JsonRpc2.ErrorCode.ParseError, undefined, e);
        }
        if (request && request.method && typeof request.method === 'string') {
            const handler = this.methodHandlers[request.method];
            if (handler) {
                const result = handler.call(null, request.params);
                const res = JSON.stringify({ id: request.id, result: result || {} });
                return res;
            }
            else {
                return this.error(JsonRpc2.ErrorCode.MethodNotFound, request);
            }
        }
        else {
            return this.error(JsonRpc2.ErrorCode.InvalidRequest, request);
        }
    }
    bind(api: any): void {
        Object.keys(api).forEach((domain) => {
            $.writeln(domain);
            Object.keys(api[domain]).forEach((method) => {
                const key = `${domain}.${method}`;
                $.writeln(key);
                this.methodHandlers[key] = api[domain][method];
            });
        });
    }
    expose(method: string, handler: (params: any) => any): void {
        this.methodHandlers[method] = handler;
    }
    private error(errorCode: JsonRpc2.ErrorCode, request?: JsonRpc2.Request, error?: Error): string {
        const payload = {
            id: request && request.id || -1,
            error: this._errorFromCode(errorCode, error && error.message || error, request && request.method)
        };
        return JSON.stringify(payload);
    }
    private _errorFromCode(code: JsonRpc2.ErrorCode, data?: any, method?: string): JsonRpc2.Error {
        let message = '';
        switch (code) {
            case JsonRpc2.ErrorCode.InternalError:
                message = `InternalError: Internal Error when calling '${method}'`;
                break;
            case JsonRpc2.ErrorCode.MethodNotFound:
                message = `MethodNotFound: '${method}' wasn't found`;
                break;
            case JsonRpc2.ErrorCode.InvalidRequest:
                message = 'InvalidRequest: JSON sent is not a valid request object';
                break;
            case JsonRpc2.ErrorCode.ParseError:
                message = 'ParseError: invalid JSON received';
                break;
        }
        return { code, message, data };
    }
}