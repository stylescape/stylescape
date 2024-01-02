
// ============================================================================
// Local Storage
// ============================================================================


export function setCookie(key: string, value: any, days: number) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = key + "=" + (value || "")  + expires + "; path=/";
}


export function getCookie(key: string) {
    var nameEQ = key + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}


export function eraseCookie(key: string) {   
    document.cookie = key +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}


export function setValue(key: string, value: any) {
    let days = 30;
    if (localStorage) {
        localStorage.setItem(key, value);
    } else {
        setCookie(key, value, days);
    }
}


export function getValue(key: string) {
    if (localStorage) {
        return localStorage.getItem(key);
    } else {
        return getCookie(key);
    }
}

