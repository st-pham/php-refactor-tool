import { ExtensionContext, languages, window } from 'vscode';
import { PhpRenameProvider } from './rename';

const activate = (context: ExtensionContext) => {
  window.showInformationMessage('Php Refactor Tool is active.');
  // TODO check installation of PhpIntelephense
  context.subscriptions.push(languages.registerRenameProvider('php', new PhpRenameProvider()));  
  // TODO rename file => rename class, interface, ...
	// TODO rename folder => update namespace, ...
  console.log('php-refactor-tool is active');
};

const deactivate = () => undefined;

export { activate, deactivate };