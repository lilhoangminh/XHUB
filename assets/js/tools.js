export function setLocalStorage(data, address){
    localStorage.setItem(address, JSON.stringify(data));
}

export function getLocalStorage(address){
    let data = JSON.parse(localStorage.getItem(address)); 
    return data;
}

export function popupAlert(title, content){
    let popUp = document.createElement('div');
    let popT = document.createElement('h1');
    popT.innerHTML = title;
    let popC = document.createElement('p');
    popC.innerHTML= content;
    popUp.style = "color: red; z-index: 20000000; position:fixed; bottom: 25px; right: 10px; background-color: white; height: 150px; width: 300px";
    popUp.appendChild('')
    document.getElementById('container').appendChild(popUp);
}