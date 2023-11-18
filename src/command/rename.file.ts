import { Uri, workspace } from "vscode";

export class UpdateReferences {
    // search for where the class is used
    public async updateReferences(oldUri: Uri, newUri: Uri): Promise<void>
    {
        // Perform actions based on the file rename
        console.log(`File renamed from ${oldUri} to ${newUri}`);
        // get all references
        // rename uses
    }

    private getProjectPath(): string
    {
        const workspaceFolders = workspace.workspaceFolders;
        if (workspaceFolders && workspaceFolders.length > 0) {
            return workspaceFolders[0].uri.fsPath;
        }

        throw new Error('Should not happen');
    }

    private getNameSpace(filePath: string)
    {
        // look for composer.json
        // look for psr4
        // "App\\": "src/"
        if (filePath.startsWith(this.getProjectPath()) === false) {
            throw new Error('File is not belong to the project');
        }

        let relativeFilePath = filePath.replace(this.getProjectPath() + '/','');
        // src/Entity/ActivityTest.php
        console.log(relativeFilePath.replace('src/', 'App/'));
    }

    private async findReferences()
    {

    }
}
