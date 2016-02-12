import * as vscode from 'vscode';
import {Environment} from "./environment";
import * as fs from "./api/fs";
import openurl = require("open");

export type Token = string;

export interface ITokenService {
    getToken(): Promise<Token>;
    setToken(newToken: Token): Promise<void>;
    resetToken(): Promise<void>;
}

export class TokenService implements ITokenService {


    public constructor(
        private _env: Environment
    ) {
    }


    public async getToken(): Promise<Token> {
        if (await fs.exists(this._env.tokenFilePath())) {
            return await this.readToken();
        } else {
            return await this.askForNewToken();
        }
    }

    public async setToken(newToken: Token): Promise<void> {
        await fs.writeFile(this._env.tokenFilePath(), newToken);
    }

    public async resetToken(): Promise<void> {
        await fs.deleteFileIfExist(this._env.tokenFilePath());
    }
    
    private async askForNewToken(): Promise<Token> {
        let options: vscode.InputBoxOptions = {
            placeHolder: "Enter Github Personal Access Token",
            password: false,
            prompt: "Link is opened to get the github token."
        };
        
        openurl("https://github.com/settings/tokens");
        
        let newToken = await vscode.window.showInputBox(options);
        if (newToken) {
            newToken = newToken.trim();
            await this.setToken(newToken);
        }
        
        return newToken;
    }

    private async readToken(): Promise<Token> {
        return await fs.readStringFromFile(this._env.tokenFilePath());
    }
}