import { ExtensionContext, languages, workspace } from 'vscode';
import { PhpRenameProvider } from './rename';
import { UpdateReferences } from "./command/rename.file";

const activate = (context: ExtensionContext) => {
  // TODO check installation of PhpIntelephense
  context.subscriptions.push(languages.registerRenameProvider('php', new PhpRenameProvider()));  
  // TODO
  // - Rename files => rename class, interface, ...
  // - Rename folder => update namespace and its references
  // - Move files/folders => update namespace and its references
};

workspace.onDidRenameFiles((event) => {
  event.files.forEach(async (file) => {
      if (file.oldUri.path.endsWith('.php') && file.newUri.path.endsWith('.php')) {
          const oldFilePath = file.oldUri;
          const newFilePath = file.newUri;

          await (new UpdateReferences).updateReferences(oldFilePath, newFilePath);
      }
  });
});

const deactivate = () => undefined;

export { activate, deactivate };
