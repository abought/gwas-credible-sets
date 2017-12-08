/** @module scoring */

import { ninv } from './stats';


/**
 * Convert a -logp value to Z^2
 *
 * Very large -logp (very small p values) cannot be converted to z by a direct method. These values
 *  are handled using an approximation: for small p-values, Z_i^2 has a linear relationship with -log10 p-value.
 *
 *  The cutoff on pvalues is ~ 10^-325
 *
 * @param nlogp
 * @return {number}
 * @private
 */
function _nlogp_to_z2(nlogp) {
    const p = Math.pow(10, -nlogp);
    if (nlogp < 300) {
        // Use exact method when within the range of 64-bit floats (approx 10^-325)
        return Math.pow(ninv(p / 2), 2);
    }
    else {
        // For very small p-values, -log10(pval) and z^2 have a linear relationship
        // This avoids issues with needing higher precision floats when doing the calculation
        // with ninv
        return (4.59884133027944 * nlogp) - 5.88085867031722
    }
}

/**
 * Calculate a probability statistic exp(Z^2) based on pvalues
 * @param {Number[]} nlogpvals An array of -log(pvalue) entries
 * @return {Number[]} An array of exp(Z^2) statistics
 */
function minKodos(nlogpvals) {
    if (!Array.isArray(nlogpvals) || ! nlogpvals.length) { // TODO: Custom exception types?
        throw 'Must provide a non-empty array of pvalues';
    }

    // 1. Convert the pvalues to Z^2 values
    let z2 = nlogpvals.map(item => _nlogp_to_z2(item));

    // 2. Calculate exp(Z^2), using a truncation approach that prevents exp(Z^2) from overrunning the max float64 value
    //   (when Z^2 > 709 or so). As safeguard, we could (but currently don't) check that exp(Z^2) is not larger
    //   than infinity.
    const cap = Math.max(...z2) - 708; // The real cap is ~709; this should prevent any value from exceeding it
    if (cap > 0) {
        z2 = z2.map(item => (item - cap));
    }
    return z2.map(item => Math.exp(item));
}

const rollup = { minKodos };
export default rollup;
export { minKodos };

// Export additional symbols for unit testing only (not part of public interface for the module)
export { _nlogp_to_z2 };
