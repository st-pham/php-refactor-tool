import { ExtensionContext, languages, window } from 'vscode';
import { PhpRenameProvider } from './rename';

const MESSAGE_NAME = 'phpRefactorToolWelcomeMessage';

const activate = (context: ExtensionContext) => {
  const notificationSent = context.globalState.get(MESSAGE_NAME, false);

  if (notificationSent) {
    window.showInformationMessage('See https://github.com/st-pham/php-refactor-tool for more info. Thanks for using this extension!');
    context.globalState.update(MESSAGE_NAME, true);
  }

  // TODO check installation of PhpIntelephense
  context.subscriptions.push(languages.registerRenameProvider('php', new PhpRenameProvider()));  
  // TODO
  // - Rename files => rename class, interface, ...
  // - Rename folder => update namespace and its references
  // - Move files/folders => update namespace and its references
};

const deactivate = () => undefined;

export { activate, deactivate };
