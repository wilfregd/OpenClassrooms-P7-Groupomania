//Sanitizer basique pour la validation des inputs avec logging des erreurs.
//Cette classe permet une instance qui donne accès à l'existence éventuelle d'erreurs
//Et un objet contenant les erreurs données pour chaque input.
class Sanitizer{
    constructor(logging = true){
        this.hasError = false;
        this.errors = {};
        this.logging = logging
    }

    #processRegexValidation(string, errorType, error, regex){
        string = this.sanitizeString(string);

        if(!regex.test(string)){
            this.writeError(errorType, error)
            return false;
        }
        return true;
    }

    sanitizeString(string){
        return string
        .replace("<", "")
        .replace(">", "")
        .replace(" ", "")
        .replace("*", "")
        .replace("\"", "")
        .replace("'", "")
        .replace("=", "")
        .replace("`", "");
    }

    writeError(errorType, error){
        this.hasError = true;
        this.errors[errorType] = error;

        if(this.logging){
            console.error(error);
        }
    }

    isEmpty(string, errorType, error){
        if(string === ""){
            this.writeError(errorType, error);
            return true;
        }
        return false;
    }

    isSimpleString(string, errorType, error){
        const regex = new RegExp(/^[a-zA-Z-]*$/);
        return this.#processRegexValidation(string, errorType, error, regex);
    }

    isPassword(string, error){
        const regex = new RegExp(/^(?=.*\d)(?=.*[a-zA-Z-@_]).{8,}$/);
        return this.#processRegexValidation(string, 'password', error, regex);
    }

    isEmail(string, error){
        const regex = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]+$/);
        return this.#processRegexValidation(string, 'email', error, regex);
    }

    isLength(string, min, max, errorType, error){
        string = this.sanitizeString(string);
        
        if(string.length < min || string.length > max){
            this.writeError(errorType, error);
            return false;
        }
        return true;
    }
}

module.exports = Sanitizer;