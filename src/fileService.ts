import * as fs from "./api/fs";
import { Environment } from './environment';
import { ISyncFiles } from "./gistService";

export interface IFileService {
    read(): Promise<ISyncFiles>;
    write(files: ISyncFiles): Promise<void>;
}

export class FileService implements IFileService {
    public constructor(
        private _env: Environment
    ) {
    }
    
    public async read(): Promise<ISyncFiles> {
        let result: ISyncFiles = {};
        
        if(await fs.exists(this._env.settingsPath())
        
        
        return null;
    }
    
    public async write(files: ISyncFiles) {
        return null;
    }
}