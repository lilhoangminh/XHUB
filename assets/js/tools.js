import { API_DOMAIN } from '../../config/api.js'

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

export function verifyUserAccount() {
    const globalLogData = getLocalStorage("GLOBAL_LOG_DATA");
    if (globalLogData != null && globalLogData != "") {
        fetch(`${API_DOMAIN}/api/v1/auth/me`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${globalLogData.token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);  
            if (data.error_code == 0) {
                return true;
            } else {
                return false;
            }
            
        })
        .catch(err => {
            console.log(err);
        })
    } else return false;

}

export async function fetchAPI(data, type, method, header){
    await fetch(`${API_DOMAIN}/api/v1/auth/${type}`)
}