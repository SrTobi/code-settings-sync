import * as vscode from 'vscode';
import * as path from 'path';

function isInsidersEdition(context: vscode.ExtensionContext) {
    return /insiders/.test(context.asAbsolutePath(""));
}

export interface Environment
{
    profileDir(): string;
    extensionDir(): string;
    gistFilePath(): string;
    tokenFilePath(): string;
    launchFilePath(): string;
    keybindingsFilePath(): string;
    snippetsDir(): string;
}

const CODE_HOME_RELDIR = "/Code/";
const CODE_INSIDERS_HOME_RELDIR = "/Code - Insiders/";
const CODE_EXTENSIONS_RELDIR = "/.vscode/extensions/";
const CODE_INSIDERS_EXTENSIONS_RELDIR = "/.vscode-insiders/extensions/";
const GIST_FILE_RELPATH = "/User/gist_sync.txt";
const TOKEN_FILE_RELPATH = "/User/token.txt";
const SETTINGS_FILE_RELPATH = "/User/settings.json";
const LAUNCH_FILE_RELPATH = "/User/launch.json";
const KEYBINDINGS_FILE_RELPATH = "/User/keybindings.json";
const SNIPPETS_RELDIR = "/User/snippets/";
    
export class GenericEnvironment implements Environment
{    
    
    private _tokenFilePath: string;
    private _gistFilePath: string;
    private _settingsFilePath: string;
    private _launchFilePath: string;
    private _keybindingsFilePath: string;
    private _snippetsDir: string;
    
    public constructor(
        private _profileDir: string,
        private _extensionDir: string)
    {
        this._tokenFilePath = path.join(_profileDir, TOKEN_FILE_RELPATH);
        this._gistFilePath = path.join(_profileDir, GIST_FILE_RELPATH);
        this._settingsFilePath = path.join(_profileDir, SETTINGS_FILE_RELPATH);
        this._launchFilePath = path.join(_profileDir, LAUNCH_FILE_RELPATH);
        this._keybindingsFilePath = path.join(_profileDir, KEYBINDINGS_FILE_RELPATH);
        this._snippetsDir = path.join(_profileDir, SNIPPETS_RELDIR);
    }

    public profileDir(): string
    {
        return this._profileDir;
    }
    
    public extensionDir(): string
    {
        return this._extensionDir;
    }
    
    public gistFilePath(): string
    {
        return this._gistFilePath;
    }
    
    public tokenFilePath(): string
    {
        return this._tokenFilePath;
    }
    
    public launchFilePath(): string
    {
        return this._launchFilePath;
    }
    
    public keybindingsFilePath(): string
    {
        return this._keybindingsFilePath;
    }
    
    public snippetsDir(): string
    {
        return this._snippetsDir;
    }
}

export function getEnvironment(context: vscode.ExtensionContext) {
    
    let isInsiders = isInsidersEdition(context);
    let homeDir = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME']
    let extensionDir = path.join(homeDir, isInsiders ? CODE_INSIDERS_EXTENSIONS_RELDIR : CODE_EXTENSIONS_RELDIR);
    
    let dataDir: string = process.env.APPDATA;
    if (!dataDir) {
        if (process.platform == 'darwin')
            dataDir = process.env.HOME + '/Library/Application Support';
        else if (process.platform == 'linux'){
            let os = require("os"); // strange, vscode's node verson is too old to support this
            dataDir = path.join(os.homedir(), '/.config/');
        }else
            dataDir = '/var/local'
    }
    
    let codeSubDir = isInsidersEdition(context)
                        ? CODE_INSIDERS_HOME_RELDIR : CODE_HOME_RELDIR;
    let codeHome = path.join(dataDir, codeSubDir);
    
    return new GenericEnvironment(codeHome, extensionDir);
}