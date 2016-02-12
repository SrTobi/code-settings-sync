import * as native from 'fs';
import * as bb from 'bluebird';

export var exists = bb.promisify(native.exists);
export var unlink = bb.promisify(native.unlink);
export var readFile = bb.promisify(native.readFile);
export var writeFile = bb.promisify<void, string, any>(native.writeFile);

export async function readStringFromFile(filePath:string, encoding = "utf8"): Promise<string> {
    let buf = await readFile(filePath);
    return buf.toString(encoding);
}

export async function deleteFileIfExist(filepath: string) {
    if (await exists(filepath)) {
        await unlink(filepath);
    }
}    