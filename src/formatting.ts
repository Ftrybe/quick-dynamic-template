export default class StringFormatter {
    private constructor() { }

    // Converts a hyphen-separated string to camel case.
    public static toCamelCase(input: string) {
        return input.replace(/-([a-z])/ig, (all, letter) => letter.toUpperCase());
    }

    // Converts a string to title case, capitalizing the first letter of each word.
    public static toTitleCase(input: string) {
        return input.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
    }

    // Converts a string to Pascal case, which is similar to Camel Case but the first letter is capitalized.
    public static toPascalCase(input: string) {
        return this.toCamelCase(input.charAt(0).toUpperCase() + input.slice(1));
    }

    // Converts a camel cased string to a hyphen-separated string.
    public static toHyphenCase(input: string) {
        return input.charAt(0).toLowerCase() + input.substring(1).replace(/[A-Z]+/g, txt => "-" + txt).toLowerCase();
    }

    // Replaces a dot with a hyphen in a string.
    public static replaceDotWithHyphen(input: string) {
        return input.replace(".", "-");
    }

    // Converts the first character of a string to lower case, keeping the rest of the string unchanged.
    public static toLocaleLowerCaseFirst(input: string) {
        return input.substring(0, 1).toLocaleLowerCase() + input.substring(1);
    }
}
