// Cookie Helper Functions

export const getCookie = (name) => {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));

    return matches ? decodeURIComponent(matches[1]) : undefined;
}


export const setCookie = (name, value, options = {}) => {

    let date = new Date(Date.now() + 86400e3); // cookie to expire in 1 day

    options = {
        // add other defaults here if necessary
        // path: '/',
        expires: date.toUTCString(),
        ...options
    };
    
    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

    for (let optionKey in options) {

        updatedCookie += "; " + optionKey;

        let optionValue = options[optionKey];

        if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
        }
    }

    document.cookie = updatedCookie;

    // i.e: setCookie('user', 'John', {secure: true, 'max-age': 3600});

}


export const deleteCookie = (name) => {
    setCookie(name, "", {
        'max-age': -1
    })
}
