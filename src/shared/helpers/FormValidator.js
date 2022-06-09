export const handleValidation = (value) => {
    if (value.trim() === '') {
        return 'This field cannot be empty'
    }

    if (value.length >= 51) {
        return 'Must be 50 characters or less'
    }
    return null
}

export const validateEmail = (value) => {
    if (value.trim() === '') {
        return 'This field cannot be empty'
    }

    if (value.length >= 51) {
        return 'Must be 50 characters or less'
    }


    const isValid = String(value)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );

    if (!isValid) {
        return "Please enter a valid email";
    }

    return null
}

export const isPasswordValid = (password) => {
    if (password.trim() === '') {
        return 'This field cannot be empty'
    }

    if (password.length < 6) {
        return 'Password must be at least 6 characters'
    }

    if (password.length >= 51) {
        return 'Must be 50 characters or less'
    }
}

export const isPasswordMatched = (password, passwordRepeat) => {
    if (password !== passwordRepeat) {
        return "Passwords do not match"
    }
}

export const isStringExistsSpace = (value) => {
    if (value.indexOf(' ') >= 0) {
        return "Filename cannot contains space character"
    }
}

export const visualFilename = (value) => {
    if (value.trim() === '') {
        return 'This field cannot be empty'
    }

    if (value.length >= 51) {
        return 'Must be 50 characters or less'
    }

    if (value.indexOf(' ') >= 0) {
        return "This field cannot contains space character"
    }

    return null
}

export const isObjectEmpty = (value) => {
    if (Object.keys(value).length <= 0) {
        return 'This field cannot be empty'
    }

    return null
}