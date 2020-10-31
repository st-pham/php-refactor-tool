import { ExtensionContext, languages } from 'vscode';
import { PhpRenameProvider } from './rename';

const activate = (context: ExtensionContext) => {
  // TODO check installation of PhpIntelephense
  context.subscriptions.push(languages.registerRenameProvider('php', new PhpRenameProvider()));  
  // TODO rename file => rename class, interface, ...
	// TODO rename folder => update namespace, ...
  console.log('php-refactor is active');
};

const deactivate = () => undefined;

export { activate, deactivate };