import * as path from 'path';
import {
	Position,
	RenameProvider,
	TextDocument,
	WorkspaceEdit,
	SymbolKind, LocationLink
} from 'vscode';
import { getReferences, getSymbol } from './api';
import { isNone } from 'fp-ts/lib/Option';

export class PhpRenameProvider implements RenameProvider {

	public async provideRenameEdits(
		document: TextDocument,
		position: Position,
		newName: string
	): Promise<WorkspaceEdit|null> {

		const oldName = document.getText(document.getWordRangeAtPosition(position));

		const targets = await getReferences(document.uri, position);

		if (targets.length === 0) {
			throw new Error('You can not rename this symbol');
		}

		const result = await getSymbol(document.uri, position);

		const edit = new WorkspaceEdit();

		let doRename = false;

		// TODO refactor this mess ^^
		for (const location of targets) {
			if (!isNone(result)) {
				const [sym, def] = result.value;

				if (sym.kind === SymbolKind.Property) {
					// TODO update getters and setters
					// get the old name
					const oldName = document.getText(location.range);
					const normalized = newName.replace(/^\$/, '');

					edit.replace(
						location.uri,
						location.range,
						oldName.includes('$') ? `$${normalized}` : normalized,
					);
				} else if (sym.kind === SymbolKind.Class 
					|| sym.kind === SymbolKind.Interface
					|| sym.kind === SymbolKind.Module
				) {
					// TODO rename file => rename class, interface, ...
					// TODO rename folder => update namespace, ...
					doRename = true;

					edit.replace(
						location.uri, 
						location.range.with(location.range.end.translate(0, -oldName.length)), 
						newName
					);
				} else {
					edit.replace(location.uri, location.range, newName);
				}
			} else {
				edit.replace(location.uri, location.range, newName);
			}
		}

		if (!isNone(result)) {
			const [sym, def] = result.value;
			if (sym.kind === SymbolKind.Class) {
				this.renameFile(edit, def, newName);
			}
		}

		return edit;
	}

	private renameFile(edit: WorkspaceEdit, definition: LocationLink, newName: string): void {
		const newPath = path.format({
			dir: path.dirname(definition.targetUri.path),
			name: newName,
			ext: '.php'
		});
		edit.renameFile(definition.targetUri, definition.targetUri.with({ path: newPath }));				
	}
}
