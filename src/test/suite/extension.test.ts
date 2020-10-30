import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as path from 'path'
import { commands, Disposable, Position, Uri } from 'vscode';
import * as renameSymbolProvider from '../../extension';

suite('Php Rename Symbol Provider', () => {
	const _disposables: Disposable[] = [];

	test('Sample test', () => {
		assert.strictEqual(-1, [1, 2, 3].indexOf(5));
		assert.strictEqual(-1, [1, 2, 3].indexOf(0));
	});

	test('Should start PHP refactor tool extension', () => {
		// TODO figure out how to enable extention in test
	});

	test('Should rename the CLASS, update the namespace and rename the file', async () => {
		const uri = Uri.file(
			path.join(__dirname + '/Hello.js')
		);
		const document = await vscode.workspace.openTextDocument(uri);
		console.log(uri);
		// const startPosition = new Position(3, 6);
		// const endPosition = new Position(3, 9);
		// const range = new vscode.Range(startPosition, endPosition);
		// const newName = 'FooFoo';
		// const edit = await commands.executeCommand('vscode.executeDocumentRenameProvider', uri, endPosition, newName);
		// vscode.commands.executeCommand('workbench.action.closeActiveEditor')
	});

	// Should rename a class
	// Should rename an interface
	// Should rename an abstract
	// Should rename a method
	// Should rename a normal variable
	// Should rename a property
	// Should not rename on a bad value and show an message error
});
