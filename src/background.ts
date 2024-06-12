//extension://dddnomfkpikfjlecgdkoidjmeeajmmcl/offScreenHTML.html

chrome.runtime.onMessage.addListener((message,sender,sendResponse)=>{
    if(message.operation=='imgfile'){
        setupOffscreenDocument('offScreenHTML.html').then(()=>{
            const response=chrome.runtime.sendMessage({
                operation: 'generateObjectURL',
                fileURL: message.fileURL,
            })
            response.then(res=>{
                console.log(res)
                sendResponse(res)
            })
        })
    }
    return true
})

let creating:Promise<void>|null; // A global promise to avoid concurrency issues
async function setupOffscreenDocument(path: string) {
    // Check all windows controlled by the service worker to see if one
    // of them is the offscreen document with the given path
    const offscreenUrl = chrome.runtime.getURL(path);
    const existingContexts = await chrome.runtime.getContexts({
        contextTypes: [chrome.runtime.ContextType.OFFSCREEN_DOCUMENT],
        documentUrls: [offscreenUrl]
    });

    if (existingContexts.length > 0) {
        return;
    }

    // create offscreen document
    if (creating) {
        await creating;
    } else {
        creating = chrome.offscreen.createDocument({
            url: path,
            reasons: [chrome.offscreen.Reason.BLOBS],
            justification: 'generate object URL',
        });
        await creating;
        creating = null;
    }
}

