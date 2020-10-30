import { ExtensionContext, languages } from 'vscode';
import { PhpRenameProvider } from './rename';

const activate = (context: ExtensionContext) => {
  context.subscriptions.push(languages.registerRenameProvider('php', new PhpRenameProvider()));
  // TODO update namespace when move files and folders
  console.log('php-refactor is active');
};

const deactivate = () => undefined;

export { activate, deactivate };