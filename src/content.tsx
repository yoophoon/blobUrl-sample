import ReactDOM from "react-dom/client";


//create the img selector root
const testUploadFile = document.createElement('div')
document.documentElement.append(testUploadFile)
ReactDOM.createRoot(testUploadFile).render(<>
  <UpLoadImg></UpLoadImg>
</>)

//selector component
function UpLoadImg() {
  // const inputRef=useRef()
  const handlerFileSelectClick = (e: React.MouseEvent) => {
    const fileElem = document.querySelector('#fileElem') as HTMLElement
    if (fileElem) {
      fileElem.click();
    }
    e.preventDefault(); // 避免导航至“#”
  }

  const handleInputChange = () => {

    const fileElem = document.getElementById("fileElem") as HTMLInputElement,
      fileList = document.getElementById("fileList")

    if (fileList && fileElem && !fileElem.files?.length) {
      fileList.innerHTML = "<p>no file selected!</p>";
    } else if (fileList && fileElem && fileElem.files) {
      fileList.innerHTML = "";
      const list = document.createElement("ul");
      fileList.appendChild(list);
      for (let i = 0; i < fileElem.files.length; i++) {
        const li = document.createElement("li");
        list.appendChild(li);
        const img = document.createElement("img");
        img.src = URL.createObjectURL(fileElem.files[i]);
        chrome.runtime.sendMessage({
          operation: 'imgfile',
          fileURL: img.src
        }
          ,
          async response=>{
            console.log(response)
            const anotherIMG = document.createElement('img')
            //works
            // anotherIMG.src = URL.createObjectURL(await (await fetch(response.newUrl)).blob()) 
            //error like index.htm:1  Not allowed to load local resource: blob:chrome-extension://dddnomfkpikfjlecgdkoidjmeeajmmcl/a377e768-8e84-451e-aa43-3d356386beb0
            anotherIMG.src = response.newUrl
            // response.response
            anotherIMG.height=60
            anotherIMG.alt = 'the same img with different url'
            anotherIMG.crossOrigin = 'anonymous'
            document.documentElement.append(anotherIMG)
          }
        )
        console.log(img.src)
        console.log(fileElem.files[i])
        img.height = 60;
        // img.onload = () => {
        //   URL.revokeObjectURL(img.src);
        // };
        li.appendChild(img);
        const info = document.createElement("span");
        info.innerHTML = `${fileElem.files[i].name}: ${fileElem.files[i].size} bytes`;
        li.appendChild(info);
      }
    }
  }

  return (<>
    <input type="file" id="fileElem" multiple accept="image/*" style={{ display: "none" }}
      onChange={handleInputChange}></input>
    <a href="#" id="fileSelect" onClick={e => handlerFileSelectClick(e)}>select img</a>
    <div id="fileList">
      <p>no img selected</p>
    </div>
  </>)
}