export const range = (from, to) => {
    if (to >= from) {
        return Array.from({ length: to - from + 1 }).map((_, index) => index + from);
    }
    return Array.from({ length: from - to + 1 }).map((_, index) => from - index);
};
