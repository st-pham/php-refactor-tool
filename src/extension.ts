import { ExtensionContext, languages, window } from 'vscode';
import { PhpRenameProvider } from './rename';

const activate = (context: ExtensionContext) => {
  window.showInformationMessage('Php Refactor Tool is active.');
  // TODO check installation of PhpIntelephense
  context.subscriptions.push(languages.registerRenameProvider('php', new PhpRenameProvider()));  
  // TODO
  // - Rename files => rename class, interface, ...
  // - Rename folder => update namespace and its references
  // - Move files/folders => update namespace and its references
  console.log('php-refactor-tool is active');
};

const deactivate = () => undefined;

export { activate, deactivate };