import * as vscode from 'vscode';
import {Environment} from "./environment";
import * as fs from "./api/fs";
import openurl = require("open");

export type GistId = string;

export interface IGistIdService {
    getGistIdOrNull(): Promise<GistId>;
    getGistIdOrAskForNew(): Promise<GistId>;
    setGistId(newGistId: GistId): Promise<void>;
    resetGistId(): Promise<void>;
}

export class GistIdService implements IGistIdService{
    
    public constructor(
        private _env: Environment)
    {
    }
    
    
    public async getGistIdOrNull(): Promise<GistId> {
        if (await fs.exists(this._env.gistFilePath())) {
            return await this.readGistId();
        } else {
            return null;
        }
    }
    
    public async getGistIdOrAskForNew(): Promise<GistId> {
        let gistId = await this.getGistIdOrNull();
        if(!gistId) {
            gistId = await this.askForNewGistId();
        }
        return gistId;
    }
    
    public async setGistId(newGistId: GistId): Promise<void> {
        await fs.writeFile(this._env.gistFilePath(), newGistId);        
    }
    
    public async resetGistId(): Promise<void> {
        await fs.deleteFileIfExist(this._env.gistFilePath());
    }
    
    private async askForNewGistId(): Promise<GistId> {
        let options: vscode.InputBoxOptions = {
            placeHolder: "Enter GIST ID",
            password: false,
            prompt: "If you never upload the files in any machine before then upload it first."
        };
        
        openurl("https://github.com/settings/tokens");
        
        let newGistId = await vscode.window.showInputBox(options);
        if (newGistId) {
            newGistId = newGistId.trim();
            await this.setGistId(newGistId);
        }
        
        return newGistId;
    }

    private async readGistId(): Promise<GistId> {
        return await fs.readStringFromFile(this._env.gistFilePath());
    }
}
    