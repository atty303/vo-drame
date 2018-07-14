import * as _fs from 'fs'
import * as _path from 'path'
import * as _stream from 'stream'

import * as _child_process from 'child_process'
export var child_process: typeof _child_process = cep_node.require('child_process')

import { promisify } from './promisify'

// can access node modules via cep_node in CEP environment.
declare var cep_node: any

export var fs: typeof _fs = cep_node.require('fs')
export var fs_promise = {
    access: promisify(fs.access),
    stat: promisify(fs.stat),
    open: promisify(fs.open) as (a: string | Buffer, b: string | number) => Promise<number>,
    read: promisify(fs.read),
    rename: promisify(fs.rename as (a: string, b: string, c: (err: NodeJS.ErrnoException, a: undefined) => void) => void)
}

export var stream: typeof _stream = cep_node.require('stream')


export var path: typeof _path = cep_node.require('path')
