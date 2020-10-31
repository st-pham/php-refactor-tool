import * as path from 'path';
import {
	Position,
	RenameProvider,
	TextDocument,
	WorkspaceEdit,
	SymbolKind, 
	LocationLink, 
	Location, 
	Uri
} from 'vscode';
import { getReferences, getSymbol } from './api';
import { isNone } from 'fp-ts/lib/Option';

const DEFAULT_VENDOR_DIR = 'vendor';
const CANNOT_RENAME_ERROR_MESSAGE = 'You can not rename this symbol';
const CANNOT_RENAME_FROM_VENDOR_ERROR_MESSAGE = 'You can not rename the symbols from vendor';

export class PhpRenameProvider implements RenameProvider {

	public async provideRenameEdits(
		document: TextDocument,
		position: Position,
		newName: string
	): Promise<WorkspaceEdit|null> {

		const oldName = document.getText(document.getWordRangeAtPosition(position));

		const targets = await getReferences(document.uri, position);

		if (targets.length === 0) {
			throw new Error(CANNOT_RENAME_ERROR_MESSAGE);
		}

		const result = await getSymbol(document.uri, position);
		if (!isNone(result)) {
			const [sym, def] = result.value;
			if (this.isFromVendor(def.targetUri)) {
				throw new Error(CANNOT_RENAME_FROM_VENDOR_ERROR_MESSAGE);
			}
		}

		const edit = new WorkspaceEdit();

		let doRename = false;

		// TODO refactor this mess ^^
		for (const location of targets) {
			if (!isNone(result)) {
				const [sym, def] = result.value;

				if (sym.kind === SymbolKind.Property) {
					this.renameProperty(document, location, newName, edit);
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

	private renameProperty(document: TextDocument, location: Location, newName: string, edit: WorkspaceEdit): void {
		const oldName = document.getText(location.range);
		const normalized = newName.replace(/^\$/, '');

		edit.replace(
			location.uri,
			location.range,
			oldName.includes('$') ? `$${normalized}` : normalized
		);
	}

	private renameFile(edit: WorkspaceEdit, definition: LocationLink, newName: string): void {
		const newPath = path.format({
			dir: path.dirname(definition.targetUri.path),
			name: newName,
			ext: '.php'
		});
		edit.renameFile(definition.targetUri, definition.targetUri.with({ path: newPath }));				
	}

	private isFromVendor(uri: Uri): boolean {
		if (uri.path.includes(DEFAULT_VENDOR_DIR)) {
			return true;
		}
		return false;
	}
}
