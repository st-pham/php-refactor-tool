import { ExtensionContext, languages } from 'vscode';
import { PhpRenameProvider } from './rename';

const activate = (context: ExtensionContext) => {
  // TODO check installation of PhpIntelephense
  context.subscriptions.push(languages.registerRenameProvider('php', new PhpRenameProvider()));  
  // TODO
  // - Rename files => rename class, interface, ...
  // - Rename folder => update namespace and its references
  // - Move files/folders => update namespace and its references
};

const deactivate = () => undefined;

export { activate, deactivate };