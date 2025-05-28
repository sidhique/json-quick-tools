import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	console.log(`json-quick-tools extension is active!`);

	const parseJsonCommand = vscode.commands.registerCommand('json-quick-tools.parseJson', () => {
		vscode.window.showInformationMessage('Parsing selected text to JSON!');

		try {
			const text = getSelectedText();
			if (!text) {
				return;
			}

			const finalText = preprocess(text);
			const parsed = JSON.parse(JSON.parse(finalText));
			const formatted = JSON.stringify(parsed, null, 3);

			replaceSelection(formatted);

		} catch (error: any) {
			vscode.window.showErrorMessage('Invalid JSON: ' + error.message);
		}
	});

	const stringifyCommand = vscode.commands.registerCommand('json-quick-tools.stringify', () => {
		vscode.window.showInformationMessage('Stringifying selected JSON!');

		const text = getSelectedText();
		if (!text) {
			return;
		}

		try {
			const parsed = JSON.parse(text);
			const formatted = JSON.stringify(JSON.stringify(parsed));
			replaceSelection(formatted);

		} catch (error: any) {
			vscode.window.showErrorMessage('Invalid JSON: ' + error.message);
		}
	});

	context.subscriptions.push(parseJsonCommand);
	context.subscriptions.push(stringifyCommand);
}


function preprocess(text: string) {
	text = text.trim();
	if (!text.startsWith("\"")) {
		text = `"${text}"`;
	}

	return text;
}

function replaceSelection(valueToReplace: string) {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showErrorMessage('No active editor found!');
		return;
	}

	const selection = editor.selection;
	editor.edit(editBuilder => {
		editBuilder.replace(selection, valueToReplace);
	})
}

function getSelectedText(): string | null {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showErrorMessage('No active editor found!');
		return null;
	}

	const selection = editor.selection;
	const text = editor.document.getText(selection);

	if (!selection || !text) {
		vscode.window.showErrorMessage('No text selected!');
		return null;
	}

	return text;
}

// This method is called when your extension is deactivated
export function deactivate() { }
