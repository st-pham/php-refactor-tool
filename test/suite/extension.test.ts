import * as assert from 'assert';
import { before, beforeEach, afterEach } from 'mocha';
import { setTimeout } from 'timers';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
// import * as myExtension from '../extension';

suite('PHP Rename Provider', function() {
	vscode.window.showInformationMessage('Start all tests.');

	this.timeout(5500);

	before(function(done) {
		setTimeout(done, 5000);
	});

	test('Should rename VARIABLE inside method', async () => {
		const document = await getFileByName('Toto.php');
		const position = new vscode.Position(9, 41); // position of variable $name
		const newName = '$newVariableName';

		await rename(document, position, newName);

		assert.strictEqual(
			(document.getText().match(/\$name/g) || []).length, 
			3
		);

		assert.strictEqual(
			(document.getText().match(/\$newVariableName/g) || []).length, 
			2
		);
	});

	test('Should rename FUNCTION and its references', async () => {
		const document = await getFileByName('Toto.php');
		const document2 = await getFileByName('Tata.php');
		const position = new vscode.Position(9, 28);
		const newName = 'newFunctionName';

		await rename(document, position, newName);

		assert.strictEqual(
			(document.getText().match(/newFunctionName/g) || []).length, 
			1
		);

		assert.strictEqual(
			(document2.getText().match(/newFunctionName/g) || []).length, 
			1
		);
	});

	test('Should rename CLASS, update name space, rename file and its references', async () => {
		const document = await getFileByName('Toto.php');
		const document2 = await getFileByName('Tata.php');
		const position = new vscode.Position(7, 10); // position of class Toto
		const newName = 'NewClassName';

		await rename(document, position, newName);

		assert.strictEqual(
			(document.getText().match(/NewClassName/g) || []).length, 
			1
		);

		assert.strictEqual(
			(document2.getText().match(/NewClassName/g) || []).length, 
			2
		);
		
		assert.doesNotThrow(async () =>
			await getFileByName(newName + '.php')
		);

		assert.rejects(async () =>
			await getFileByName('Toto.php')
		);
	});

	test('Should rename INTERFACE, update namespace, rename file and its references', async () => {
		const document = await getFileByName('NewClassName.php');
		const position = new vscode.Position(7, 35); // position of interface SomeInterface
		const newName = 'NewInterfaceName';

		await rename(document, position, newName);

		assert.strictEqual(
			(document.getText().match(/NewInterfaceName/g) || []).length, 
			2
		);

		assert.doesNotThrow(async () =>
			await getFileByName(newName + '.php')
		);

		assert.rejects(async () =>
			await getFileByName('SomeInterface.php')
		);

		const document2 = await getFileByName(newName + '.php');
		assert.strictEqual(
			(document2.getText().match(/NewInterfaceName/g) || []).length, 
			1
		);
	});

	test('Should rename PROPERTY, update getter and setter', async () => {
		const document = await getFileByName('Tata.php');
		const position = new vscode.Position(8, 32); // position of property
		const newName = 'newPropertyName';

		await rename(document, position, newName);

		assert.strictEqual(
			(document.getText().match(/\$newPropertyName/g) || []).length, 
			1
		);

		assert.strictEqual(
			(document.getText().match(/\$this\-\>newPropertyName/g) || []).length, 
			3
		);

		assert.strictEqual(
			(document.getText().match(/getNewPropertyName/g) || []).length, 
			1
		);

		assert.strictEqual(
			(document.getText().match(/setNewPropertyName/g) || []).length, 
			1
		);

		const document2 = await getFileByName('NewClassName.php');

		assert.strictEqual(
			(document2.getText().match(/getNewPropertyName/g) || []).length, 
			1
		);

		assert.strictEqual(
			(document2.getText().match(/setNewPropertyName/g) || []).length, 
			1
		);
	});
});

async function rename(document: vscode.TextDocument, position: vscode.Position, newName: string) {
	await vscode.window.showTextDocument(document);
	await wait(2000);
	await vscode.commands.executeCommand<vscode.WorkspaceEdit>('vscode.executeDocumentRenameProvider',
		document.uri,
		position,
		newName
	).then(async (edit) => {
		if (!edit) {
			throw new Error("Cannot rename");
		}

		await vscode.workspace.applyEdit(edit);
	});
}

async function getFileByName(name: string): Promise<vscode.TextDocument> {
	const files = await vscode.workspace.findFiles(name);

	if (files.length === 0) {
		throw new Error("File not found");
	}

	return vscode.workspace.openTextDocument(files[0]);
}

const wait = (ms: number) => new Promise<void>(resolve => setTimeout(() => resolve(), ms));