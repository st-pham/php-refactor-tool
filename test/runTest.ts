import * as path from 'path';

import { runTests } from 'vscode-test';

async function main() {
	try {
		const extensionDevelopmentPath = path.resolve(__dirname, '../../../');
		const extensionTestsPath = path.resolve(__dirname, './suite');
		const testWorkspace = path.resolve(__dirname, '../../test-fixtures/fixture1');

		await runTests({
			version: '1.49.1',
			extensionDevelopmentPath,
			extensionTestsPath,
			launchArgs: [testWorkspace]
		});

	} catch (err) {
		console.error('Failed to run tests');
		process.exit(1);
	}
}

main();
