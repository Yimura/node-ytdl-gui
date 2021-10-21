import { resolve as resolvePath } from 'path'

export const resolve = (specifier, context, defaultResolver) => {
    if (specifier.startsWith('@/'))
        specifier = specifier.replace(/^@\//, 'file://' + resolvePath('.') + '/');

    return defaultResolver(specifier, context);
}