// Comlink for ExtendScript
// - can only expose

// local polyfills
function _Object_assign(target: any, ...args: any[]): any {
  const to = Object(target)
  for (let i = 1; i < args.length; ++i) {
    let next = args[i]
    if (next != null) {
      for (let key in next) {
        if (Object.prototype.hasOwnProperty.call(next, key)) {
          to[key] = next[key]
        }
      }
    }
  }
}
function _Object_keys(obj: any): string[] {
  const r: string[] = []
  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      r.push(key)
    }
  }
  return r
}

// in lib:dom
type EventListenerOrEventListenerObject = any



interface MessageEvent {
  readonly data: any
}


export interface Endpoint {
  postMessage(message: any, transfer?: any[]): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: {}
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: {}
  ): void;
}
export type Proxy = Function;
export type Exposable = Function | Object; // eslint-disable-line no-unused-vars

interface InvocationResult {
  id?: string;
  value: WrappedValue;
}

type WrappedValue = RawWrappedValue | HandledWrappedValue;

interface WrappedChildValue {
  path: string[];
  wrappedValue: HandledWrappedValue;
}

interface RawWrappedValue {
  type: "RAW";
  value: {};
  wrappedChildren?: WrappedChildValue[];
}

interface HandledWrappedValue {
  type: string;
  value: {};
}

type InvocationRequest =
  | GetInvocationRequest
  | ApplyInvocationRequest
  | ConstructInvocationRequest
  | SetInvocationRequest;

interface GetInvocationRequest {
  id?: string;
  type: "GET";
  callPath: PropertyKey[];
}

interface ApplyInvocationRequest {
  id?: string;
  type: "APPLY";
  callPath: PropertyKey[];
  argumentsList: WrappedValue[];
}

interface ConstructInvocationRequest {
  id?: string;
  type: "CONSTRUCT";
  callPath: PropertyKey[];
  argumentsList: WrappedValue[];
}

interface SetInvocationRequest {
  id?: string;
  type: "SET";
  callPath: PropertyKey[];
  property: PropertyKey;
  value: WrappedValue;
}

export interface TransferHandler {
  canHandle: (obj: {}) => Boolean;
  serialize: (obj: {}) => {};
  deserialize: (obj: {}) => {};
}

const TRANSFERABLE_TYPES = ['ArrayBuffer', 'MessagePort'];

const proxyValueSymbol = "proxyValue";
const throwSymbol = "throw";

const proxyTransferHandler = {
  canHandle: (obj: {}): Boolean => obj && (obj as any)[proxyValueSymbol],
  serialize: (obj: {}): {} => {
    throw new TypeError(`No implementation for serialize PROXY: ${obj}`);
  },
  deserialize: (obj: {}): {} => {
    throw new TypeError(`No implementation for deserialize PROXY: ${obj}`);
  }
};

const throwTransferHandler = {
  canHandle: (obj: {}): Boolean => obj && (obj as any)[throwSymbol],
  serialize: (obj: any): {} => {
    const message = obj && obj.message;
    const stack = obj && obj.stack;
    return _Object_assign({}, obj, { message, stack });
  },
  deserialize: (obj: {}): {} => {
    throw _Object_assign(Error(), obj);
  }
};

export const transferHandlers: { [key: string]: TransferHandler } = {
  "PROXY": proxyTransferHandler,
  "THROW": throwTransferHandler
};

function _forOfObject<V>(obj: { [key: string]: V }, cb: (key: string, value: V) => void) {
  const keys = _Object_keys(obj)
  for (let i = 0; i < keys.length; ++i) {
    const key = keys[i]
    cb(key, obj[key] as V)
  }
}

export function expose(
  rootObj: Exposable,
  endpoint: Endpoint
): void {
  if (!isEndpoint(endpoint))
    throw Error(
      "endpoint does not have all of addEventListener, removeEventListener and postMessage defined"
    );

  activateEndpoint(endpoint);
  attachMessageHandler(endpoint, function(event: MessageEvent) {
    if (!event.data.id || !event.data.callPath) return;
    const irequest = event.data as InvocationRequest;

    let that = rootObj as any
    for (let i = 0; i < irequest.callPath.length - 1; ++i) {
      that = that[irequest.callPath[i]]
    }

    let obj = rootObj as any
    for (let i = 0; i < irequest.callPath.length; ++i) {
      obj = obj[irequest.callPath[i]]
    }

    let iresult = obj;
    let args: {}[] = [];

    if (irequest.type === "APPLY" || irequest.type === "CONSTRUCT")
      args = irequest.argumentsList.map(unwrapValue);
    if (irequest.type === "APPLY") {
      try {
        iresult = obj.apply(that, args);
      } catch (e) {
        iresult = e;
        iresult[throwSymbol] = true;
      }
    }
    if (irequest.type === "CONSTRUCT") {
      try {
        throw new TypeError(`Not implemented: ${irequest}`)
      } catch (e) {
        iresult = e;
        iresult[throwSymbol] = true;
      }
    }
    if (irequest.type === "SET") {
      obj[irequest.property] = irequest.value;
      // FIXME: ES6 Proxy Handler `set` methods are supposed to return a
      // boolean. To show good will, we return true asynchronously ¯\_(ツ)_/¯
      iresult = true;
    }

    iresult = makeInvocationResult(iresult);
    iresult.id = irequest.id;
    return (endpoint as Endpoint).postMessage(
      iresult,
      transferableProperties([iresult])
    );
  });
}

function unwrapValue(arg: WrappedValue): {} {
  if (arg.type in transferHandlers) {
    const transferHandler = transferHandlers[arg.type]!;
    return transferHandler.deserialize(arg.value);
  } else if (isRawWrappedValue(arg)) {
    for (const wrappedChildValue of arg.wrappedChildren || []) {
      if (!(wrappedChildValue.wrappedValue.type in transferHandlers))
        throw Error(
          `Unknown value type "${arg.type}" at ${wrappedChildValue.path.join(
            "."
          )}`
        );
      const transferHandler = transferHandlers[
        wrappedChildValue.wrappedValue.type
      ]!;
      const newValue = transferHandler.deserialize(
        wrappedChildValue.wrappedValue.value
      );
      replaceValueInObjectAtPath(arg.value, wrappedChildValue.path, newValue);
    }
    return arg.value;
  } else {
    throw Error(`Unknown value type "${arg.type}"`);
  }
}

function replaceValueInObjectAtPath(obj: {}, path: string[], newVal: {}) {
  const lastKey = path.slice(-1)[0];

  let lastObj = obj as any
  const p = path.slice(0, -1)
  for (let i = 0; i < p.length; ++i) {
    lastObj = lastObj[p[i]]
  }
  lastObj[lastKey] = newVal;
}

function isRawWrappedValue(arg: WrappedValue): arg is RawWrappedValue {
  return arg.type === "RAW";
}

function attachMessageHandler(
  endpoint: Endpoint,
  f: (e: MessageEvent) => void
): void {
  (endpoint as any).addEventListener("message", f);
}

function isEndpoint(endpoint: any): endpoint is Endpoint {
  return (
    "addEventListener" in endpoint &&
    "removeEventListener" in endpoint &&
    "postMessage" in endpoint
  );
}

function activateEndpoint(endpoint: Endpoint): void {
  if (typeof (endpoint as any).start == 'function') (endpoint as any).start()
}



function transferableProperties(obj: {}[] | undefined): any[] {
  return [];
}

function makeInvocationResult(obj: {}): InvocationResult {
  _forOfObject<TransferHandler>(transferHandlers, (type, transferHandler) => {
    if (transferHandler.canHandle(obj)) {
      const value = transferHandler.serialize(obj);
      return {
        value: { type, value }
      };
    }
  })

  return {
    value: {
      type: "RAW",
      value: obj
    }
  };
}
