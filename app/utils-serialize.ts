
function isValid(str:string) {
    console.log({str})
    return ["\n"," | "].includes(str)
}
export const addWithSeparator = function (separator:string) {
    if(!isValid(separator)) {
        throw new Error("Invalid separator")
    }
    return function (original: string, toAdd: string) {
        console.log({ original, toAdd });
        if (original.includes(toAdd)) {
            throw new Error("Why you doing this!");
        }
    

        return original
            .concat(separator)
            .concat(toAdd);
    }
};
