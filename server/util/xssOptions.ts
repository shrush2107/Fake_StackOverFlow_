
/**
 * Configuration options for the XSS (Cross-Site Scripting) sanitizer.
 * 
 * This object defines the allowed HTML tags and attributes to prevent XSS vulnerabilities.
 * 
 * - `whiteList`: Specifies the allowed HTML tags and their permitted attributes.
 *   - `b`, `i`, `p`, `code`, `pre`: These tags are allowed without any attributes as they're used in formatting.
 *   - `a`:  This tag is allowed with only the `href` attribute.
 * - `stripIgnoreTag`: If set to `true`, it removes any tags with the `data-xss` attribute, 
 *   which can be used to bypass the sanitizer for legitimate HTML content.
 */
export const xssOptions = {
  whiteList: {
    b: [],
    i: [],
    p: [],
    a: ['href'],
    code: [],
    pre: []
  },
  stripIgnoreTag: true,
};