import * as vscode from 'vscode';
import { Action } from "../action";
import { Environment } from "../environment";
import * as fs from "../api/fs";
import { ITokenService } from '../tokenService';
import { IGistIdService } from '../gistIdService';
import { IGistService, IGistServiceFactory, ISyncFiles } from "../gistService";

export class UploadAction implements Action {
    public constructor(
            private _tokenService: ITokenService,
            private _gistIdService: IGistIdService,
            private _gistServiceFactory: IGistServiceFactory)
    {
    }
    
    public name(): string {
        return "Upload";
    }
    
    public async run() {
        let token = await this._tokenService.getToken();
        let gist = await this._gistIdService.getGistIdOrNull();
        
        let gistService = new this._gistServiceFactory(token, gist);
        
        let newGist = await gistService.upload(null);
        
        if (newGist != gist) {
            await this._gistIdService.setGistId(newGist);
        }
    } 
}
        

/*
tempValue = "";
vscode.window.setStatusBarMessage("Checking for Github Token and GIST.", 2000);
tokenChecked = false;
gistChecked = false;




function ReadTokenFileResult(err: any, data: any) {

    if (!data) {
        var opt =pluginService.Common.GetInputBox(true);
        openurl("https://github.com/settings/tokens");
        vscode.window.showInputBox(opt).then((value) => {
            value = value.trim();
            if (value) {
                tempValue = value;
                fs.writeFile(FILE_TOKEN, value, WriteTokenFileResult);
            }

        });
    }
    else {
        TOKEN = data;
        ReadGist();
    }
};


function WriteTokenFileResult(err: any, data: any) {
    if (err) {
        vscode.window.showErrorMessage(ERROR_MESSAGE);
        console.log(err);
        return false;
    }
    TOKEN = tempValue;
    ReadGist();
};

function ReadGist() {

    fs.readFile(FILE_GIST, { encoding: 'utf8' }, ReadGistFileResult);
};
function ReadGistFileResult(err: any, data: any) {
    if (err) {
        if (err.code != "ENOENT") {
            vscode.window.showErrorMessage(ERROR_MESSAGE);
            console.log(err);
            return false;
        }
    }
    if (data) {
        GIST = data;
    }
    else {
        GIST = null;
    }
    vscode.window.setStatusBarMessage("Uploading / Updating Your Settings In Github.", 2000);
    startGitProcess();
};







function CreateNewGist(settingtext: string, launchtext: string, keybindingtext: string, extensiontext: string) {
    github.authenticate({
        type: "oauth",
        token: TOKEN
    });

    if (fs.existsSync(FOLDER_SNIPPETS)) {
        //create new gist and upload all files there
        var list = fs.readdirSync(FOLDER_SNIPPETS);
        for (var i: number = 0; i < list.length; i++) {
            var fileName = list[i];
            var filePath = FOLDER_SNIPPETS.concat(fileName);
            var fileText: string = fs.readFileSync(filePath, { encoding: 'utf8' });
            var jsonObjName = fileName.split('.')[0];
            var obj = {};
            obj[jsonObjName] = {};
            obj[jsonObjName].content = fileText;
            GIST_JSON.files[jsonObjName] = {};
            GIST_JSON.files[jsonObjName].content = fileText;
            //debugger;
        }
    }

    GIST_JSON.files.settings.content = settingtext;
    GIST_JSON.files.launch.content = launchtext;
    GIST_JSON.files.keybindings.content = keybindingtext;
    GIST_JSON.files.extensions.content = extensiontext;

    github.getGistsApi().create(GIST_JSON
        , function(err, res) {
            if (err) {
                vscode.window.showErrorMessage(ERROR_MESSAGE);
                console.log(err);
                return false;
            }
            vscode.window.showInformationMessage("Uploaded Successfully." + " GIST ID :  " + res.id + " . Please copy and use this ID in other machines to sync all settings.");
            fs.writeFile(FILE_GIST, res.id, function(err, data) {
                if (err) {
                    vscode.window.showErrorMessage("ERROR ! Unable to Save GIST ID In this machine. You need to enter it manually from Download Settings.");
                    console.log(err);
                    return false;
                }
                vscode.window.showInformationMessage("GIST ID Saved in your machine.");

            });

        });
};

function ExistingGist(settingtext: string, launchtext: string, keybindingtext: string, extensiontext: string) {
    github.authenticate({
        type: "oauth",
        token: TOKEN
    });

    github.getGistsApi().get({ id: GIST }, function(er, res) {

        if (er) {
            vscode.window.showErrorMessage(ERROR_MESSAGE);
            console.log(er);
            return false;
        }
        else {
            if (fs.existsSync(FOLDER_SNIPPETS)) {
                var list = fs.readdirSync(FOLDER_SNIPPETS);
                for (var i: number = 0; i < list.length; i++) {
                    var fileName = list[i];
                    var filePath = FOLDER_SNIPPETS.concat(fileName);
                    var fileText: string = fs.readFileSync(filePath, { encoding: 'utf8' });
                    var jsonObjName = fileName.split('.')[0];
                    res.files[jsonObjName] = {};
                    res.files[jsonObjName].content = fileText;
                }
            }
            res.files.settings.content = settingtext;
            res.files.launch.content = launchtext;
            res.files.keybindings.content = keybindingtext;
            if (res.files.extensions) {
                res.files.extensions.content = extensiontext;
            }
            else {
                vscode.window.showInformationMessage("Announcement : Extension Sync feature has been Added. You need to Reset Settings Or Manually Remove GIST ID File in order to sync your extensions.");
            }


            github.getGistsApi().edit(res, function(ere, ress) {
                if (ere) {
                    vscode.window.showErrorMessage(ERROR_MESSAGE);
                    console.log(ere);
                    return false;
                }
                vscode.window.showInformationMessage("Settings Updated Successfully");
            });
        }

    });
};

function startGitProcess() {

    if (TOKEN != null) {

        var settingtext: string = "//setting";
        var launchtext: string = "//lanuch";
        var keybindingtext: string = "//keybinding";
        var extensiontext = "";

        if (fs.existsSync(FILE_SETTING)) {
            settingtext = fs.readFileSync(FILE_SETTING, { encoding: 'utf8' });
        }
        if (fs.existsSync(FILE_LAUNCH)) {
            launchtext = fs.readFileSync(FILE_LAUNCH, { encoding: 'utf8' });
        }
        if (fs.existsSync(FILE_KEYBINDING)) {
            keybindingtext = fs.readFileSync(FILE_KEYBINDING, { encoding: 'utf8' });
        }

        extensiontext = JSON.stringify(pluginService.PluginService.CreateExtensionList());


        if (GIST == null) {
            CreateNewGist(settingtext, launchtext, keybindingtext, extensiontext);
        }
        else if (GIST != null) {
            ExistingGist(settingtext, launchtext, keybindingtext, extensiontext);

        }
    }
    else {
        vscode.window.showErrorMessage("ERROR ! Github Account Token Not Set");
    }


}

function Initialize() {
    if (fs.existsSync(FILE_TOKEN)) {
        fs.readFile(FILE_TOKEN, { encoding: 'utf8' }, ReadTokenFileResult);
    }
    else {
        openurl("https://github.com/settings/tokens");
        var opt = pluginService.Common.GetInputBox(true);
        vscode.window.showInputBox(opt).then((value) => {
            if (value) {
                value = value.trim();
                tempValue = value;
                fs.writeFile(FILE_TOKEN, value, WriteTokenFileResult);
            }
        });
    }

} 



//// start here
Initialize();*/