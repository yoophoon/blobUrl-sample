    chrome.runtime.onMessage.addListener((message,sender,sendResponse)=>{
        if(message.operation=='generateObjectURL'){
            console.log('request accept')
            // const newUrl= URL.createObjectURL(await (await fetch(message.fileURL)).blob())
            // console.log(newUrl)
            // sendResponse({newUrl:newUrl})
            fetch(message.fileURL)
                .then(async res => res.blob())
                .then(blob=>{
                    const newUrl=URL.createObjectURL(blob)
                    console.log(blob)
                    console.log(newUrl)
                    sendResponse({newUrl})
                })
        }
        return true
    });


    function getIMGData(url: string,response:(response:any)=>void) {
        fetch(url).then(async res => {
            const chunks = []
            const reader = res.body?.getReader()
            if (!reader) return
            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    break
                } else {
                    chunks.push(value)
                }
            }
            const result = new Uint8Array(chunks.reduce((a, c) => a + c.length, 0));
            let offset = 0;
            for (const chunk of chunks) {
                result.set(chunk, offset);
                offset += chunk.length;
            }
            const url = URL.createObjectURL(new Blob([result.buffer], { type: "image/*" }))
            console.log(url)
            console.log(result)
            response({response:url})
            return url
        })
    }


console.log('offscreenHTML')