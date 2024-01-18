const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');  
const sendConfirm = document.querySelector(".role-confirm");
const regisActive = document.getElementById('registration-form');
const loginActive = document.getElementById('login-form');

registerBtn.addEventListener('click', handleButtonEvent);
sendConfirm.addEventListener('click', roleConfirmEvent);
loginBtn.addEventListener('click', handleButtonEvent);
regisActive.addEventListener('submit', registrationEvent);
loginActive.addEventListener('submit', loginEvent);

let logData = {
    registration: {
        "email": "",
        "password": "",
        "role": "",
        "name": ""
    },
    login: {
        "email": "",
        "password": "",
        "role": ""
    }
}

let globalLogData = {
    name: "",
    role: "",
    passed: false,  
    token: ""
}

let checkLog = getLocalStorage("GLOBAL_LOG_DATA");
if (checkLog == null) {
    setLocalStorage(globalLogData, "GLOBAL_LOG_DATA");
}

function checkLogIn() {
    const checkVal = getLocalStorage("GLOBAL_LOG_DATA");
    // if (checkVal !=/)
    if (checkVal.token != "") {
        window.location.href = '/overview';
    } else {
        let globalLogData = {
            name: "",
            role: "",
            passed: false,  
            token: ""
        }
        setLocalStorage(globalLogData, "GLOBAL_LOG_DATA");
    }
}

checkLogIn();


function handleButtonEvent(event) {
    event.preventDefault();
    if (event.target.id === 'register') {
        container.classList.add("active");
    } else {
        container.classList.remove("active");
    }
    
}

function setLocalStorage(data, address){
    localStorage.setItem(address, JSON.stringify(data));
}

function getLocalStorage(address){
    let data = JSON.parse(localStorage.getItem(address)); 
    return data;
}

function roleConfirmEvent(event) {
    event.preventDefault();
    const select = document.querySelector("#s-role");
    var role = select.options[select.selectedIndex].value;
    if (role == 1) globalLogData.role = "student";
    if (role == 2) globalLogData.role = "teacher";
    globalLogData.passed = true;
    setLocalStorage(globalLogData, "GLOBAL_LOG_DATA");
    const form = document.querySelector(".container");
    form.classList.remove("hid");
    const annouce = document.querySelector(".role-check");
    annouce.classList.add("hid");
}

function registrationEvent(event) {
    event.preventDefault();
    let logData = JSON.parse(localStorage.getItem('GLOBAL_LOG_DATA'));
    if (!logData.registration) {
        logData.registration = {};
    }
    const regInput = {
        "email": document.getElementById('mail').value,
        "password": document.getElementById('pass').value,
        "role": logData.role,
        "name": document.getElementById('full-name').value
    }

    let valid = true;
    if (regInput.name === '') {
        document.getElementById('full-name-error').textContent = 'Tên đăng nhập không được để trống';
        valid = false;
    } else document.getElementById('full-name-error').textContent = '';
    if (regInput.email === '') {
        document.getElementById('mail-error').textContent = 'Hộp thư điện tử không được để trống';
        valid = false;
    } else document.getElementById('mail-error').textContent = '';
    if (regInput.password === '') {
        document.getElementById('pass-error').textContent = 'Mật khẩu không được để trống';
        valid = false;
    } else document.getElementById('pass-error').textContent = '';
    if (regInput.password.length < 8) {
        document.getElementById('pass-error').textContent = 'Mật khẩu phải có ít nhất 8 ký tự.';
        valid = false;
    } else if (!/[A-Z]/.test(regInput.password)) {
        document.getElementById('pass-error').textContent = 'Mật khẩu phải chứa ít nhất 1 ký tự viết hoa.';
        valid = false;
    } else if (!/\d/.test(regInput.password)) {
        document.getElementById('pass-error').textContent = 'Mật khẩu phải chứa ít nhất 1 chữ số.';
        valid = false;
    } else if (!/[!@#$%^&*]/.test(regInput.password)) {
        document.getElementById('pass-error').textContent = 'Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt.';
        valid = false;
    } else document.getElementById('pass-error').textContent = '';

    if (valid == true) {
        logData.registration.email = regInput.email;
        logData.registration.password = regInput.password;
        logData.registration.role = regInput.role;
        logData.registration.name = regInput.name;
        console.log(logData.registration);
        fetchRegisterApi(logData);
        document.getElementById('pass-allowed').textContent = 'Đã đăng ký thành công.';
        globalLogData.name = document.getElementById('full-name').value;
        setLocalStorage(globalLogData, "GLOBAL_LOG_DATA");
    }
    if (!valid) {
        event.preventDefault();
    }

    console.log(JSON.stringify(logData.registration));
}

async function fetchRegisterApi(logData) {
    await fetch(`http://192.168.1.143:7777/api/v1/auth/register`, {
        method: "POST",
        body: JSON.stringify(logData.registration),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(logData => {
            if (logData.error_code == 0) {
                globalLogData.token = logData.data.token;
                globalLogData.role = logData.role;  
                setLocalStorage(globalLogData, "GLOBAL_LOG_DATA");
                handleButtonEvent();
                document.getElementById('pass-allowed').textContent = 'Đã đăng ký thành công.';
            } else document.getElementById('pass-allowed').textContent = checkLogValidation(logData.error_code);
            
        })
        .catch(err => {
            console.log(err);
        })
}

function loginEvent(event) {
    event.preventDefault();
    let data = JSON.parse(localStorage.getItem('GLOBAL_LOG_DATA'));
    logData.login.email = document.getElementById('log-mail').value;
    logData.login.password = document.getElementById('log-pass').value;
    logData.login.role = data.role;
    console.log(JSON.stringify(logData.login));
    fetchLoginApi();
}

async function fetchLoginApi() {
    await fetch(`http://192.168.1.143:7777/api/v1/auth/login`, {
        method: "POST",
        body: JSON.stringify(logData.login),
        headers: {
            "Content-type": "application/json"
        }
    })
        .then(res => res.json())
        .then(logData => {
            if (logData.error_code == 0) {
                console.log(logData);
                globalLogData.token = logData.data.token;
                setLocalStorage(globalLogData, "GLOBAL_LOG_DATA");
                checkLogIn();
            } 
        })
        .catch(err => {
            console.log(err);
        })
}

function checkLogValidation(code) {
    if (code == 10004) return "Thông tin đăng nhập không hợp lệ."; else 
    if (code == 10005) return "Tài khoản người dùng đã tồn tại."; else
    if (code == 10006) return "Tài khoản người dùng không tồn tại"; else
    if (code == 10007) return "Role không hợp lệ"; else
    if (code == 10008) return "Email không hợp lệ."; else 
    if (code == 20004) return "Bạn không phải là giáo viên."; else 
    if (code == 20005) return "Không tìm thấy lớp."; else 
    if (code == 20006) return "Bạn không phải là học sinh";
}