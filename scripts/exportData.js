function exportEntries () {
	const text = JSON.stringify(items);
    download(text, 'entries.txt', 'text/plain');
    window.dirtyState = true;
}

function download(content, fileName, contentType) {
    const a = document.createElement("a");
    const file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}
