"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addTwoHours = void 0;
const addTwoHours = (date) => {
    if (!(date instanceof Date)) {
        throw new Error('Invalid input: argument must be a Date object');
    }
    return new Date(date.getTime() + 2 * 60 * 60 * 1000);
};
exports.addTwoHours = addTwoHours;
//# sourceMappingURL=date.js.map