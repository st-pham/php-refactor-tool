import { DocumentSymbol, Location, LocationLink, Position, Uri, commands } from 'vscode';
import { Option, isNone, none, some } from 'fp-ts/lib/Option';

export const getDocumentSymbols = async (uri: Uri) => {
  return (await commands.executeCommand<DocumentSymbol[]>('vscode.executeDocumentSymbolProvider', uri))!;
};

export const getDefinition = async (uri: Uri, position: Position): Promise<Option<LocationLink>> => {
  const definitions = (await commands.executeCommand<LocationLink[]>('vscode.executeDefinitionProvider', uri, position))!;
  return definitions.length === 0 ? none : some(definitions[0]);
};

export const getReferences = async (uri: Uri, position: Position) => {
  return (await commands.executeCommand<Location[]>('vscode.executeReferenceProvider', uri, position))!;
};

export const getSymbol = async (uri: Uri, position: Position): Promise<Option<[DocumentSymbol, LocationLink]>> => {
  const definition = await getDefinition(uri, position);
  if (isNone(definition)) {
    return none;
  }

  const symbols = await getDocumentSymbols(definition.value.targetUri).then(flattenDocumentSymbols);
  for (const symbol of symbols) {
    if (definition.value.targetRange.contains(symbol.selectionRange)) {
      return some([symbol, definition.value]);
    }
  }

  // find symbol by references
  const references = await getReferences(uri, position);
  for (const reference of references) {
    for (const symbol of symbols) {
      if (symbol.selectionRange.contains(reference.range)) {
        return some([symbol, definition.value]);
      }
    }
  }

  return none;
};

const flattenDocumentSymbols = (symbols: DocumentSymbol[]) => {
  const dig = (symbol: DocumentSymbol) => {
    const acc = [symbol];
    for (const child of symbol.children) {
      acc.push(...dig(child));
    }
    return acc;
  };

  const acc = [];
  for (const symbol of symbols) {
    acc.push(...dig(symbol));
  }

  return acc;
};