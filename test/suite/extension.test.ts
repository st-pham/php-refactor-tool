import * as assert from 'assert';
import { before } from 'mocha';
import { setTimeout } from 'timers';
import * as vscode from 'vscode';
import * as utils from '../../utils/utils';

suite('PHP Rename Provider', function() {
	vscode.window.showInformationMessage('Start all tests.');

	this.timeout(5500);

	before(function(done) {
		setTimeout(done, 5000);
	});

	test('Should rename VARIABLE inside method only', async () => {
		const document = await getFileByName('Toto.php');
		const position = new vscode.Position(9, 41); // position of variable $name
		const oldName = '$name';
		const newName = '$newVariableName';

		await rename(document, position, newName);

		assertWordOccurenceInDocument(document, '\\' + oldName, 3);
		assertWordOccurenceInDocument(document, '\\' + newName, 2);
	});

	test('Should rename FUNCTION and its references', async () => {
		const document = await getFileByName('Toto.php');
		const document2 = await getFileByName('Tata.php');
		const position = new vscode.Position(9, 28); // position of method testToto
		const oldName = 'testToto';
		const newName = 'newFunctionName';

		await rename(document, position, newName);

		assertWordOccurenceInDocument(document, newName, 1);
		assertWordOccurenceInDocument(document, oldName, 0);
		assertWordOccurenceInDocument(document2, newName, 1);
		assertWordOccurenceInDocument(document2, oldName, 1);
	});

	test('Should rename CLASS, update name space, rename file and its references', async () => {
		const document = await getFileByName('Toto.php');
		const document2 = await getFileByName('Tata.php');
		const position = new vscode.Position(7, 10); // position of class Toto
		const oldName = 'Toto';
		const newName = 'NewClassName';

		await rename(document, position, newName);

		assertWordOccurenceInDocument(document, newName, 1);
		assertWordOccurenceInDocument(document, 'class ' + oldName, 0);
		assertWordOccurenceInDocument(document2, newName, 2);
		assertWordOccurenceInDocument(document2, oldName, 1);
		
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

		assertWordOccurenceInDocument(document, newName, 2);

		assert.doesNotThrow(async () =>
			await getFileByName(newName + '.php')
		);

		assert.rejects(async () =>
			await getFileByName('SomeInterface.php')
		);

		const document2 = await getFileByName(newName + '.php');
		assertWordOccurenceInDocument(document2, newName, 1);
	});

	test('Should rename PROPERTY, update getter and setter', async () => {
		const document = await getFileByName('Tata.php');
		const position = new vscode.Position(8, 32); // position of property
		const newName = 'newPropertyName';

		await rename(document, position, newName);

		assertWordOccurenceInDocument(document, '\\$' + newName, 1);
		assertWordOccurenceInDocument(document, '\\$this->' + newName, 3);
		assertWordOccurenceInDocument(document, 'get' + utils.upperCaseFirst(newName), 1);
		assertWordOccurenceInDocument(document, 'set' + utils.upperCaseFirst(newName), 1);

		const document2 = await getFileByName('NewClassName.php');
		assertWordOccurenceInDocument(document2, 'get' + utils.upperCaseFirst(newName), 1);
		assertWordOccurenceInDocument(document2, 'set' + utils.upperCaseFirst(newName), 1);
	});
});

function assertWordOccurenceInDocument(document: vscode.TextDocument, word: string, expectedCount: number) {
	assert.strictEqual(
		(document.getText().match(new RegExp(word, 'g')) || []).length,
		expectedCount
	);
}

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