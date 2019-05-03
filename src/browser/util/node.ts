import * as _path from 'path'
import * as _stream from 'stream'

import * as _child_process from 'child_process'
export var child_process: typeof _child_process = cep_node.require('child_process')

import * as _crypto from 'crypto'
export var crypto: typeof _crypto = cep_node.require('crypto')

import { promisify } from './promisify'

// can access node modules via cep_node in CEP environment.
declare var cep_node: any

import * as _fs from 'fs'
export var fs: typeof _fs = cep_node.require('fs')
export var fs_promises = {
    access: promisify(fs.access),
    stat: promisify(fs.stat),
    open: promisify(fs.open) as (a: string | Buffer, b: string | number) => Promise<number>,
    close: promisify(fs.close) as (fd: number) => Promise<void>,
    read: promisify(fs.read),
    readFile: promisify(fs.readFile) as (filename: string, encoding: string) => Promise<string | Buffer>,
    write: promisify(fs.write) as (fd: number, data: any) => Promise<void>,
    writeFile: promisify(fs.writeFile) as (filename: string, data: any) => Promise<void>,
    rename: promisify(fs.rename as (a: string, b: string, c: (err: NodeJS.ErrnoException, a: undefined) => void) => void),
    exists: (path: string | Buffer) => new Promise((resolve) => {
      fs.exists(path, (exists) => resolve(exists))
    }),
    mkdir: promisify(fs.mkdir as (path: string | Buffer) => Promise<void>),
}

export var stream: typeof _stream = cep_node.require('stream')


export var path: typeof _path = cep_node.require('path')
