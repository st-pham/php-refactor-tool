import * as path from 'path';

import { runTests } from 'vscode-test';

async function main() {
	try {
		const extensionDevelopmentPath = path.resolve(__dirname, '../../../');
		const extensionTestsPath = path.resolve(__dirname, './suite');
		const testWorkspace = path.resolve(__dirname, '../../test-fixtures/test-workspace');

		const vsCodeVersions = ['1.49.1', '1.62'];

		vsCodeVersions.forEach(async (version) => {
			await runTests({
				version: version,
				extensionDevelopmentPath,
				extensionTestsPath,
				launchArgs: [testWorkspace]
			});
		});
	} catch (err) {
		console.error('Failed to run tests');
		process.exit(1);
	}
}

main();
