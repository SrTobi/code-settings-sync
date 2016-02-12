import * as vscode from 'vscode';
import { Action } from "../action";
import { Environment } from "../environment";
import { ITokenService } from '../tokenService';
import { IGistIdService} from '../gistIdService';

export class ResetAction implements Action {
    public constructor(
        private _tokenService: ITokenService,
        private _gistIdService: IGistIdService
        ) {
    }
    
    public name(): string {
        return "Reset";
    }
    
    public async run() {
        vscode.window.setStatusBarMessage("Resetting Your Settings.", 2000);
        
        try {
            await this._gistIdService.resetGistId();
            await this._tokenService.resetToken();
            vscode.window.showInformationMessage("GIST ID and Github Token Cleared.");
        }
        catch (err) {
            console.log(err);
            vscode.window.showErrorMessage("Unable to clear settings. Error Logged on console. Please open an issue.");
        }
    }
}
        
