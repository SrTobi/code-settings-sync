import * as vscode from 'vscode';
import * as pluginService from './pluginService'
import * as path from 'path';
import { Action, ActionFactory } from './action';
import { Environment, getEnvironment } from './environment';
import { ResetAction } from './actions/reset';
import { TokenService } from './tokenService';
import { GistIdService } from './gistIdService';
import { GistService } from './gistService';
import { FileService } from './fileService';

export function activate(context: vscode.ExtensionContext) {
    
    let env = getEnvironment(context);
    let tokenService = new TokenService(env);
    let gistIdService = new GistIdService(env);
    let fileService = new FileService(env);
    
    function registerCommand(cmd: string, action: ActionFactory) {
        let disposable = vscode.commands.registerCommand(cmd, async () => {
            
            let a = new action(tokenService, gistIdService, GistService, fileService);           
            await a.run();
        });
        
        context.subscriptions.push(disposable);
    }

    registerCommand("extension.resetSettings", ResetAction);

    var disposable = vscode.commands.registerCommand('extension.updateSettings', () => {


    });


    var disposable = vscode.commands.registerCommand('extension.downloadSettings', () => {
        
    });

    var disposable = vscode.commands.registerCommand('', () => {
       

    });

}