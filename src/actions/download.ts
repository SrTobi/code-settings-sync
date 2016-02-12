/*vscode.window.setStatusBarMessage("Downloading Your Settings...", 2000);

        var tokenChecked: boolean = false;
        var gistChecked: boolean = false;


        function ReadTokenFileResult(err: any, data: any) {
            if (err) {
                vscode.window.showErrorMessage(ERROR_MESSAGE);
                console.log(err);
                return false;
            }
            if (!data) {
                openurl("https://github.com/settings/tokens");
                var opt = pluginService.Common.GetInputBox(false);
                vscode.window.showInputBox(opt).then((value) => {
                    if (value) {
                        value = value.trim();
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
        }

        function ReadGist() {
            fs.readFile(FILE_GIST, { encoding: 'utf8' }, ReadGistFileResult);
        };

        function ReadGistFileResult(err: any, data: any) {

            if (!data) {
                var opt = pluginService.Common.GetInputBox(false);
                vscode.window.showInputBox(opt).then((value) => {
                    if (value) {
                        value = value.trim();
                        tempValue = value;
                        fs.writeFile(FILE_GIST, value, WriteGistFileResult);
                    }
                });
            }
            else {
                GIST = data;
                StartDownload();
            }
        };

        function WriteGistFileResult(err: any, data: any) {
            if (err) {
                vscode.window.showErrorMessage(ERROR_MESSAGE);
                console.log(err);
                return false;
            }
            GIST = tempValue;
            StartDownload();
        };

        function StartDownload() {
            github.getGistsApi().get({ id: GIST }, function(er, res) {

                if (er) {
                    vscode.window.showErrorMessage(ERROR_MESSAGE);
                    console.log(er);
                    return false;
                }

                var keys = Object.keys(res.files);
                for (var i: number = 0; i < keys.length; i++) {
                    switch (keys[i]) {
                        case "launch": {
                            fs.writeFile(FILE_LAUNCH, res.files.launch.content, function(err, data) {
                                if (err) {
                                    vscode.window.showErrorMessage(ERROR_MESSAGE);
                                    console.log(err);
                                    return false;
                                }
                                vscode.window.showInformationMessage("Launch Settings downloaded Successfully");
                                // console.log("launch");
                                // console.log(data);
                            });
                            break;
                        }
                        case "settings": {
                            fs.writeFile(FILE_SETTING, res.files.settings.content, function(err, data) {
                                if (err) {
                                    vscode.window.showErrorMessage(ERROR_MESSAGE);
                                    console.log(err);
                                    return false;
                                }
                                vscode.window.showInformationMessage("Editor Settings downloaded Successfully");
                                // console.log("setting");
                                // console.log(data);
                            });
                            break;
                        }
                        case "keybindings": {
                            fs.writeFile(FILE_KEYBINDING, res.files.keybindings.content, function(err, data) {
                                if (err) {
                                    vscode.window.showErrorMessage(ERROR_MESSAGE);
                                    console.log(err);
                                    return false;
                                }
                                vscode.window.showInformationMessage("Keybinding Settings downloaded Successfully");
                            });
                            break;
                        }
                        case "extensions": {
                            var remoteList = pluginService.ExtensionInformation.fromJSONList(res.files.extensions.content);
                            var missingList = pluginService.PluginService.GetMissingExtensions(remoteList);
                            if (missingList.length == 0) {

                                vscode.window.showInformationMessage("No extension need to be installed");

                            }
                            else {

                                var actionList = new Array<Promise<void>>();
                                vscode.window.setStatusBarMessage("Installing Extensions in background.",4000);
                                missingList.forEach(element => {
                                    actionList.push(pluginService.PluginService.InstallExtension(element, ExtensionFolder)
                                        .then(function() {
                                            var name = element.publisher + '.' + element.name + '-' + element.version;
                                            vscode.window.showInformationMessage("Extension " + name + " installed Successfully");
                                        }));
                                });

                                Promise.all(actionList)
                                    .then(function() {
                                        vscode.window.showInformationMessage("Extension installed Successfully, please restart");
                                    })
                                    .catch(function(e) {
                                        console.log(e);
                                        vscode.window.showErrorMessage("Extension download failed." + ERROR_MESSAGE)
                                    });
                            }

                            break;
                        }
                        default: {
                            if (i < keys.length) {
                                if (!fs.existsSync(FOLDER_SNIPPETS)) {
                                    fs.mkdirSync(FOLDER_SNIPPETS);
                                }
                                var file = FOLDER_SNIPPETS.concat(keys[i]).concat(".json");
                                var fileName = keys[i].concat(".json");
                                fs.writeFile(file, res.files[keys[i]].content, function(err, data) {
                                    if (err) {
                                        vscode.window.showErrorMessage(ERROR_MESSAGE);
                                        console.log(err);
                                        return false;
                                    }
                                    vscode.window.showInformationMessage(fileName + " snippet added successfully.");
                                });
                            }

                            break;
                        }

                    }
                }






            });
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

        Initialize();
*/