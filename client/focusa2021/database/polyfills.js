// polyfilling the nodeJS atob and btoa.
import { decode, encode } from 'base-64';
if (!global.btoa) {
    global.btoa = encode;
}

if (!global.atob) {
    global.atob = decode;
}

// Avoid using node dependent modules
process.browser = true;