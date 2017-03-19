import * as glob from 'glob';
import { join, dirname } from 'path';
import { readFile as fsReadFile, writeFile as fsWriteFile, readFileSync } from 'fs';

/**
 * Simple Promiseify function that takes a Node API and return a version that supports promises.
 * We use promises instead of synchronized functions to make the process less I/O bound and
 * faster. It also simplify the code.
 */
function wrap<T>(fn: (...args: any[]) => void) {
    return (...args: any[]) => {
        return new Promise<T>((resolve, reject) => {
            fn(...args, (err, value) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(value);
                }
            });
        });
    };
}

const readFile = wrap<string>(fsReadFile);
const writeFile = wrap<void>(fsWriteFile);

function inlineResources(folder: string, base: string) {
    // Matches only JavaScript files.
    const files = glob.sync(`${ folder }/**/*.js`, {});

    // Generate all files content with inlined templates.
    return Promise.all(files.map(filePath => {
        const urlResolver = (url: string) => {
            return join(dirname(filePath), url).replace(folder, base || folder);
        };

        return readFile(filePath, 'utf-8')
            .then(content => inlineResourcesFromString(content, urlResolver))
            .then(content => writeFile(filePath, content))
            .catch(err => {
                console.error('An error occurred: ', err.message);
            });
    }));
}

/**
 * Inline resources from a string content.
 * @param content {string} The source file's content.
 * @param urlResolver {Function} A resolver that takes a URL and return a path.
 * @returns {string} The content with resources inlined.
 */
function inlineResourcesFromString(content, urlResolver) {
    // Curry through the inlining functions.
    return [
        inlineTemplate,
        inlineStyle,
        removeModuleId
    ].reduce((content, fn) => fn(content, urlResolver), content);
}

if (require.main === module) {
    let [pattern, base] = process.argv.slice(2);
    inlineResources(pattern, base);
}


/**
 * Inline the templates for a source file. Simply search for instances of `templateUrl: ...` and
 * replace with `template: ...` (with the content of the file included).
 * @param content {string} The source file's content.
 * @param urlResolver {Function} A resolver that takes a URL and return a path.
 * @return {string} The content with all templates inlined.
 */
function inlineTemplate(content, urlResolver) {
    return content.replace(/templateUrl:\s*'([^']+?\.html)'/g, function (m, templateUrl) {
        const templateFile = urlResolver(templateUrl);
        const templateContent = readContent(templateFile);
        return `template: "${ templateContent }"`;
    });
}

/**
 * Inline the styles for a source file. Simply search for instances of `styleUrls: [...]` and
 * replace with `styles: [...]` (with the content of the file included).
 * @param urlResolver {Function} A resolver that takes a URL and return a path.
 * @param content {string} The source file's content.
 * @return {string} The content with all styles inlined.
 */
function inlineStyle(content, urlResolver) {
    return content.replace(/styleUrls:\s*(\[[\s\S]*?\])/gm, function (m, styleUrls) {
        const urls = eval(styleUrls);

        console.log('style urls', urls, JSON.parse(styleUrls));

        return 'styles: ['
            + urls.map(styleUrl => {
                const styleFile = urlResolver(styleUrl);
                const styleContent = readContent(styleFile);
                return `"${ styleContent }"`;
            })
                .join(',\n')
            + ']';
    });
}

function readContent(file: string) {
    const content = readFileSync(file, 'utf-8');
    return content.replace(/([\n\r]\s*)+/gm, ' ').replace(/"/g, '\\"');
}

/**
 * Remove every mention of `moduleId: module.id`.
 * @param content {string} The source file's content.
 * @returns {string} The content with all moduleId: mentions removed.
 */
function removeModuleId(content) {
    return content.replace(/\s*moduleId:\s*module\.id\s*,?\s*/gm, '');
}
