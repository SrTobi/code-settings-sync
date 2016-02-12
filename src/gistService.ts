import * as github from './api/github';
import { Token } from './tokenService';
import { GistId } from './gistIdService';

export interface ISyncFiles {
    settings?: string;
    keybindings?: string;
    launch?: string;
    snippets?: { [file: string]: string }
}


export interface IGistServiceFactory {
    new (token: Token, gistId?: GistId): IGistService;
}

export interface IGistService {
    upload(files: ISyncFiles): Promise<GistId>;
    download(): Promise<ISyncFiles>;
}

export class GistService implements IGistService {
    
    public upload(files: ISyncFiles): Promise<GistId> {
        return null;
    }
    
    public download(): Promise<ISyncFiles> {
        return null;
    }
}