/* franc-min bundled for Chromium Translator */
(function() {
  'use strict';

  // n-gram
const bigram = nGram(2)
const trigram = nGram(3)

/**
 * Factory returning a function that converts a value string to n-grams.
 *
 * @param {number} n
 */
function nGram(n) {
  if (
    typeof n !== 'number' ||
    Number.isNaN(n) ||
    n < 1 ||
    n === Number.POSITIVE_INFINITY
  ) {
    throw new Error('`' + n + '` is not a valid argument for `n-gram`')
  }

  return grams

  /**
   * Create n-grams from a given value.
   *
   * @template {string|Array<unknown>} T
   * @param {T} [value]
   * @returns {T extends any[] ? T : Array<string>}
   */
  function grams(value) {
        // @ts-expect-error: pretty sure this is fine.
    const nGrams = []

    if (value === null || value === undefined) {
      return nGrams
    }

    const source = typeof value.slice === 'function' ? value : String(value)
    let index = source.length - n + 1

    if (index < 1) {
      return nGrams
    }

    while (index--) {
      nGrams[index] = source.slice(index, index + n)
    }

    return nGrams
  }
}

  // collapse-white-space
/**
 * @typedef {'html'|'js'} Style
 *
 * @typedef Options
 *   Configuration.
 * @property {Style} [style='js']
 *   Style of white space to support.
 * @property {boolean} [preserveLineEndings=false]
 *   Whether to collapse white space containing a line ending to that line
 *   ending.
 *   The default is to collapse to a single space.
 * @property {boolean} [trim=false]
 *   Whether to drop white space at the start and end of `value`.
 *   The default is to keep it.
 */

const js = /\s+/g
const html = /[\t\n\v\f\r ]+/g

/**
 * Collapse white space.
 *
 * @param {string} value
 *   Value to collapse white space in.
 * @param {Style|Options} [options='js']
 *   Configuration.
 * @returns {string}
 *   Value with collapsed white space.
 */
function collapseWhiteSpace(value, options) {
  if (!options) {
    options = {}
  } else if (typeof options === 'string') {
    options = {style: options}
  }

  const replace = options.preserveLineEndings ? replaceLineEnding : replaceSpace

  return String(value).replace(
    options.style === 'html' ? html : js,
    options.trim ? trimFactory(replace) : replace
  )
}

/**
 * Replace white space with a line ending as that line ending and otherwise a
 * space.
 *
 * @param {string} value
 * @returns {string}
 */
function replaceLineEnding(value) {
  const match = /\r?\n|\r/.exec(value)
  return match ? match[0] : ' '
}

/**
 * Replace white space with a space.
 *
 * @returns {string}
 */
function replaceSpace() {
  return ' '
}

/**
 * @param {(value: string) => string} replace
 */
function trimFactory(replace) {
  return dropOrReplace

  /**
   * Replace white space with nothing if it starts or ends the string.
   * Calls `replace` otherwise.
   *
   * @param {string} value
   * @param {number} index
   * @param {string} all
   * @returns {string}
   */
  function dropOrReplace(value, index, all) {
    return index === 0 || index + value.length === all.length
      ? ''
      : replace(value)
  }
}

  // trigram-utils
/**
 * @typedef {[string, number]} TrigramTuple
 * @typedef {TrigramTuple[]} TrigramTuples
 * @typedef {Record<string, number>} TrigramDictionary
 */




var own = {}.hasOwnProperty

/**
 * Clean `value`.
 * Removed general non-important (as in, for language detection) punctuation
 * marks, symbols, and digits.
 *
 * @param {string|null} [value]
 * @returns {string}
 */
function clean(value) {
  if (value === null || value === undefined) {
    return ''
  }

  return collapseWhiteSpace(String(value).replace(/[\u0021-\u0040]+/g, ' '))
    .trim()
    .toLowerCase()
}

/**
 * Get clean, padded, trigrams.
 *
 * @param {string} [value]
 * @returns {string[]}
 */
function trigrams(value) {
  return trigram(' ' + clean(value) + ' ')
}

/**
 * Get an `Object` with trigrams as its attributes, and their occurence count as
 * their values.
 *
 * @param {string} value
 * @returns {TrigramDictionary}
 */
function asDictionary(value) {
  const values = trigrams(value)
    const dictionary = {}
  let index = -1

  while (++index < values.length) {
    if (own.call(dictionary, values[index])) {
      dictionary[values[index]]++
    } else {
      dictionary[values[index]] = 1
    }
  }

  return dictionary
}

/**
 * Get an `Array` containing trigram--count tuples from a given value.
 *
 * @param {string} value
 * @returns {TrigramTuples}
 */
function asTuples(value) {
  const dictionary = asDictionary(value)
    const tuples = []
    let trigram

  for (trigram in dictionary) {
    if (own.call(dictionary, trigram)) {
      tuples.push([trigram, dictionary[trigram]])
    }
  }

  tuples.sort(sort)

  return tuples
}

/**
 * Get an `Array` containing trigram--count tuples from a given value.
 *
 * @param {TrigramTuples} tuples
 * @returns {TrigramDictionary}
 */
function tuplesAsDictionary(tuples) {
    const dictionary = {}
  let index = -1

  while (++index < tuples.length) {
    dictionary[tuples[index][0]] = tuples[index][1]
  }

  return dictionary
}

/**
 * Deep regular sort on item at `1` in both `Object`s.
 *
 * @param {TrigramTuple} a
 * @param {TrigramTuple} b
 * @returns {number}
 */
function sort(a, b) {
  return a[1] - b[1]
}

  // franc-min expressions
// This file is generated by `build.js`.
/** @type {Record<string, RegExp>} */
var expressions = {
  cmn: /[\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u3005\u3007\u3021-\u3029\u3038-\u303B\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFA6D\uFA70-\uFAD9]|\uD81B[\uDFE2\uDFE3\uDFF0\uDFF1]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879\uD880-\uD883\uD885-\uD887][\uDC00-\uDFFF]|\uD869[\uDC00-\uDEDF\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF39\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uD884[\uDC00-\uDF4A\uDF50-\uDFFF]|\uD888[\uDC00-\uDFAF]/g,
  Latin:
    /[A-Za-z\u00AA\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02B8\u02E0-\u02E4\u1D00-\u1D25\u1D2C-\u1D5C\u1D62-\u1D65\u1D6B-\u1D77\u1D79-\u1DBE\u1E00-\u1EFF\u2071\u207F\u2090-\u209C\u212A\u212B\u2132\u214E\u2160-\u2188\u2C60-\u2C7F\uA722-\uA787\uA78B-\uA7CA\uA7D0\uA7D1\uA7D3\uA7D5-\uA7D9\uA7F2-\uA7FF\uAB30-\uAB5A\uAB5C-\uAB64\uAB66-\uAB69\uFB00-\uFB06\uFF21-\uFF3A\uFF41-\uFF5A]|\uD801[\uDF80-\uDF85\uDF87-\uDFB0\uDFB2-\uDFBA]|\uD837[\uDF00-\uDF1E\uDF25-\uDF2A]/g,
  Cyrillic:
    /[\u0400-\u0484\u0487-\u052F\u1C80-\u1C88\u1D2B\u1D78\u2DE0-\u2DFF\uA640-\uA69F\uFE2E\uFE2F]|\uD838[\uDC30-\uDC6D\uDC8F]/g,
  Arabic:
    /[\u0600-\u0604\u0606-\u060B\u060D-\u061A\u061C-\u061E\u0620-\u063F\u0641-\u064A\u0656-\u066F\u0671-\u06DC\u06DE-\u06FF\u0750-\u077F\u0870-\u088E\u0890\u0891\u0898-\u08E1\u08E3-\u08FF\uFB50-\uFBC2\uFBD3-\uFD3D\uFD40-\uFD8F\uFD92-\uFDC7\uFDCF\uFDF0-\uFDFF\uFE70-\uFE74\uFE76-\uFEFC]|\uD803[\uDE60-\uDE7E\uDEFD-\uDEFF]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB\uDEF0\uDEF1]/g,
  ben: /[\u0980-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09FE]/g,
  Devanagari:
    /[\u0900-\u0950\u0955-\u0963\u0966-\u097F\uA8E0-\uA8FF]|\uD806[\uDF00-\uDF09]/g,
  jpn: /[\u3041-\u3096\u309D-\u309F]|\uD82C[\uDC01-\uDD1F\uDD32\uDD50-\uDD52]|\uD83C\uDE00|[\u30A1-\u30FA\u30FD-\u30FF\u31F0-\u31FF\u32D0-\u32FE\u3300-\u3357\uFF66-\uFF6F\uFF71-\uFF9D]|\uD82B[\uDFF0-\uDFF3\uDFF5-\uDFFB\uDFFD\uDFFE]|\uD82C[\uDC00\uDD20-\uDD22\uDD55\uDD64-\uDD67]|[\u3400-\u4DB5\u4E00-\u9FAF]/g,
  jav: /[\uA980-\uA9CD\uA9D0-\uA9D9\uA9DE\uA9DF]/g,
  kor: /[\u1100-\u11FF\u302E\u302F\u3131-\u318E\u3200-\u321E\u3260-\u327E\uA960-\uA97C\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uFFA0-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/g,
  tel: /[\u0C00-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3C-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C5D\u0C60-\u0C63\u0C66-\u0C6F\u0C77-\u0C7F]/g,
  tam: /[\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BFA]|\uD807[\uDFC0-\uDFF1\uDFFF]/g,
  guj: /[\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AF1\u0AF9-\u0AFF]/g,
  kan: /[\u0C80-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDD\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1-\u0CF3]/g,
  mal: /[\u0D00-\u0D0C\u0D0E-\u0D10\u0D12-\u0D44\u0D46-\u0D48\u0D4A-\u0D4F\u0D54-\u0D63\u0D66-\u0D7F]/g,
  mya: /[\u1000-\u109F\uA9E0-\uA9FE\uAA60-\uAA7F]/g,
  pan: /[\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A76]/g,
  amh: /[\u1200-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u137C\u1380-\u1399\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E]|\uD839[\uDFE0-\uDFE6\uDFE8-\uDFEB\uDFED\uDFEE\uDFF0-\uDFFE]/g,
  tha: /[\u0E01-\u0E3A\u0E40-\u0E5B]/g,
  sin: /[\u0D81-\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2-\u0DF4]|\uD804[\uDDE1-\uDDF4]/g,
  ell: /[\u0370-\u0373\u0375-\u0377\u037A-\u037D\u037F\u0384\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03E1\u03F0-\u03FF\u1D26-\u1D2A\u1D5D-\u1D61\u1D66-\u1D6A\u1DBF\u1F00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FC4\u1FC6-\u1FD3\u1FD6-\u1FDB\u1FDD-\u1FEF\u1FF2-\u1FF4\u1FF6-\u1FFE\u2126\uAB65]|\uD800[\uDD40-\uDD8E\uDDA0]|\uD834[\uDE00-\uDE45]/g
}

  // franc-min data
/** @type {Record<string, Record<string, string>>} */
var data = {
  Latin: {
    spa: ' de|de |os | la| a |la | y |Ã³n |iÃ³n|es |ere|rec|ien|o a|der|ciÃ³|cho|ech|en |a p|ent|a l|aci|el |na |ona|e d| co|as |da | to|al |ene| en|tod| pe|e l| el|ho |nte| su|per|a t|ad | ti|ers|tie| se|rso|son|e s| pr|o d|oda|te |cia|n d| es|dad|ida| in|ne |est|ion|cio|s d|con|a e| po|men| li|n e|nci|res|su |to |tra| re| lo|tad| na|los|a s| o |ia |que| pa|rÃ¡ |pro| un|s y|ual|s e|lib|nac|do |ra |er |a d|ue | qu|e e|sta|nal|ar |nes|ica|a c|ser|or |ter|se |por|cci|io |del|l d|des|ado|les|one|a a|ndi| so| cu|s p|ale|s n|ame|par|ici|oci|una|ber|s t|rta|com| di|dos|e a|imi|o s|e c|ert|las|o p|ant|dic|nto| al|ara|ibe|enc|o e|s l|cas| as|e p|ten|ali|o t|soc|y l|n c|nta|so |tos|y a|ria|n t|die|a u| fu|no |l p|ial|qui|dis|s o|hos|gua|igu| ig| ca|sar|l t| ma|l e|pre| ac|tiv|s a|re |nad|vid|era| tr|ier|cua|n p|ta |cla|ade|bre|s s|esa|ntr|ecc|a i| le|lid|das|d d|ido|ari|ind|ada|nda|fun|mie|ca |tic|eli|y d|nid|e i|odo|ios|o y|esp|iva|y e|mat|bli|r a|drÃ¡|tri|cti|tal|rim|ont|erÃ¡|us |sus|end|pen|tor|ito|ond|ori|uie|lig|n a|ist|rac|lar|rse|tar|mo |omo|ibr|n l|edi|med| me|nio|a y|eda|isf|lo |aso|l m|ias|ico|lic|ple|ste|act|tec|ote|rot|ele|ura| ni|ie |adi|u p|seg|s i|un |und|a n|lqu|alq|o i|inc|sti| si|n s|ern',
    eng: 'the| th| an|he |nd |ion|and| to|to |tio| of|on |of | in|al |ati|or |ght|igh|rig| ri|ne |ent|one|ll |is |as |ver|ed | be|e r|in |t t|all|eve|ht | or|ery|s t|ty | ev|e h|yon| ha|ryo|e a|be |his| fr|ng |d t|has| sh|ing| hi|sha| pr| co| re|hal|nal|y a|s a|n t|ce |men|ree|fre|e s|l b|nat|for|ts |nt |n a|ity|ry |her|nce|ect|d i| pe|pro|n o|cti| fo|e e|ly |es | no|ona|ny |any|er |re |f t|e o| de|s o| wi|ter|nte|e i|ons| en| ar|res|ers|y t|per|d f| a | on|ith|l a|e t|oci|soc|lit| as| se|dom|edo|eed|nti|s e|t o|oth|wit| di|equ|t a|ted|st |y o|int|e p| ma| so| na|l o|e c|ch |d a|enc|th |are|ns |ic | un| fu|tat|ial|cia| ac|hts|nit|qua| eq| al|om |e w|d o|f h|ali|ote|n e| wh|r t|sta|ge |thi|o a|tit|ual|an |te |ess| ch|le |ary|e f|by | by|y i|tec|uni|o t|o o| li|no | la|s r| su|inc|led|rot|con| pu| he|ere|imi|r a|ntr| st| ot|eli|age|dis|s d|tle|itl|hou|son|duc|edu| wo|ate|ble|ces|at | at| fa|com|ive|o s|eme|o e|aw |law|tra|und|pen|nde|unt|oun|n s|s f|f a|tho|ms | is|act|cie|cat|uca| ed|anc|wor|ral|t i| me|o f|ily|pri|ren|ose|s c|en |d n|l c|ful|rar|nta|nst| ag|l p|min|din|sec|y e| tr|rso|ich|hic|whi|cou|ern|uri|r o|tic|iti|igi|lig|rat|rth|t f|oms|rit|d r|ee |e b|era|rou|se |ay |rs | ho|abl|e u',
    por: 'de | de| se|Ã£o |os |to |em | e |do |o d| di|er |ito|eit|ser|ent|Ã§Ã£o| a |dir|ire|rei|o s|ade|dad|uma|as |no |e d| to|nte| co|o t|tod| ou|men|que|s e|man| pr| in| qu|es | te|hum|odo|e a|da | hu|ano|te |al |tem|o e|s d|ida|m d| pe| re|o a|ou |r h|e s|cia|a e| li|o p| es|res| do| da| Ã  |ual| em| su|aÃ§Ã£|dos|a p|tra|est|ia |con|pro|ar |e p|is | na|rÃ¡ |qua|a d| pa|com|ais|o c|ame|erÃ¡| po|uer|sta|ber|ter| o |ess|ra |e e|das|o Ã |nto|nal|o o|a c|ido|rda|erd| as|nci|sua|ona|des|ibe|lib|e t|ado|s n|ua |s t|ue | so|ica|ma |lqu|alq|tos|m s|a l|per|ada|oci|soc|cio|a n|par|aci|s a|pre|ont|m o|ura|a s| um|ion|e o|or |e r|pel|nta|ntr|a i|io |nac|Ãªnc|str|ali|ria|nst| tr|a q|int|o n|a o|ca |ela|uÃ§Ã£|lid|e l| at|sen|ese|r d|s p|egu|seg|vid|pri|sso|Ã©m |ime|tic|dis|raÃ§|eci|ara| ca|nid|tru|Ãµes|ass|seu|por|a a|m p| ex|so |r i|eÃ§Ã£|teÃ§|ote|rot| le| ma|ing|a t|ran|era|rio|l d|eli|Ã§a |sti| ne|cid|ern|utr|out|r e|e c|tad|gua|igu| ig| os|s o|ruÃ§|ins|Ã§Ãµe|ios| fa|e n|sse| no|re |art|r p|rar|u p|inc|lei|cas|ico|uÃ©m|guÃ©|ngu|nin| ni|gur|la |pen|nÃ§a|na |iÃ§Ã£|iÃ£o|cie|ist|sem|ta |ele|e f|om |tro| ao|rel|m a|s s|tar|eda|ied|uni|e m|s i|a f|ias| cu| ac|r a|Ã¡ a|rem|ei |omo|rec|for|s f|esc|ant|Ã  s| vi|o q|ver|a u|nda|und|fun',
    ind: 'an |ang|ng | da|ak | pe|ata| se| ke| me|dan| di| be|ber|kan|ran|hak|per|yan| ya|nga|nya|gan| at|ara| ha|eng|asa|ora|men|n p|n k|erh|rha|n d|ya |ap |at |as |tan|n b|ala|a d| or|a s|san|tas|eti|uk |pen|g b|set|ntu|n y|tia|iap|k m|eba|aan| un|n s|tuk|k a|p o|am |lam| ma|unt| de|ter|bas|beb|dak|end|i d|pun|mem|tau|dal|ama|keb|aka|ika|n m| ba|di |ma | sa|den|au |nda|n h|eri| ti|ela|k d|un |n a|ebe|ana|ah |ra |ida|uka| te|al |ada|ri |ole|tid|ngg|lak|leh|dap|a p|dil|g d|ena|eh |gar|na |ert|apa|um |tu |atu|a m|sam|ila|har|n t|asi|ban|erl|t d|bat|uat|ta |lan|adi|h d|neg| ne|kum|mas|nan|pat|aha| in|l d|emp|sem|rus|sua|ser|uan|era|ari|erb|kat|man|a b|g s|rta|ai |nny|n u|ung|ndi|han|uku|huk| hu|sa |ers|in | la|ka | su|ann|car|kes|aku|dip|i s|a a|erk|n i|lai|rga|aru|k h|i m|rka|a u|us |nak|emb|gga|nta|iba| pu|ind|s p|ent|mel|ina|min|ian|dar|ni |rma|lua|rik|ndu|lin|sia|rbu|g p|k s|da |aya|ese|u d|ega|nas|ar |ipe|yar|sya|ik |aga| ta|ain|ua |arg|uar|iny|pem|ut |si |dun|eor|seo|rak|ngs|ami|kel|ini|g t|dik|mer|emu|aks|rat|uru|ewa|il |enu|any|kep|pel|asu|rli|ia |dir|jam|mba|mat|pan|g m|ses|sar|das|kuk|bol|ili|u k|gsa|u p|a k|ern|ant|raa|t p|ema|mua|idi|did|t s|i k|rin|erm|esu|ger|elu|nja|enj|ga |dit',
    fra: ' de|es |de |ion|nt |tio|et |ne |on | et|ent|le |oit|e d| la|e p|la |it | Ã  |t d|roi|dro| dr| le|tÃ© |e s|ati|te |re | to|s d|men|tou|e l|ns | pe| co|son|que| au| so|e a|onn|out| un| qu| sa| pr|ute|eme| lâ€™|t Ã | a |e e|con|des| pa|ue |ers|e c| li|a d|per|ont|s e|t l|les|ts |tre|s l|ant| ou|cti|rso|ou |ce |ux |Ã  l|nne|ons|itÃ©|en |un | en|er |une|n d|sa |lle| in|nte|e t| se|lib|res|a l|ire| dâ€™| re|Ã© d|nat|iqu|ur |r l|t a|s s|aux|par|nal|a p|ans|dan|qui|t p| dÃ©|pro|s p|air| ne| fo|ert|s a|nce|au |ui |ect|du |ond|ale|lit| po|san| ch|Ã©s | na|us |com|our|ali|tra| ce|al |e o|e n|rtÃ©|ber|ibe|tes|r d|e r|its| di|Ãªtr|pou|Ã©tÃ©|s c|Ã  u|ell|int|fon|oci|soc|ut |ter| da|aut|ien|rai| do|iss|s n| ma|bli|ge |est|s o| du|ona|n p|pri|rs |Ã©ga| Ãªt|ous|ens|ar |age|s t| su|cia|u d|cun|rat| es|ir |n c|e m| Ã©t|t Ãª|a c| ac|ote|n t|ein| tr|a s|ndi|e q|sur|Ã©e |ser|l n| pl|anc|lig|t s|n e|s i|t e| Ã©g|ain|omm|act|ntr|tec|gal|ul | nu| vi|me |nda|ind|soi|st | te|pay|tat|era|il |rel|n a|dis|n s|prÃ©|peu|rit|Ã© e|t Ã©|bre|sen|ill|lâ€™a|dâ€™a| mo|ass|lic|art| pu|abl|nta|t c|rot| on| lo|ure|lâ€™e|ava|ten|nul|ivi|t i|ess|ys |ays| fa|ine|eur|rÃ©s|cla|tÃ©s|oir|eut|e f|utr|doi|ibr|ais|ins|Ã©ra|â€™en|iÃ©t|l e|s Ã©|ntÃ©| rÃ©|ssi| as|nse|ces|Ã© a',
    deu: 'en |er |der|ein| un|nd |und|ung|cht|ich| de|sch|ng | ge|ine|ech|gen|rec|che|ie | re|eit| au|ht |die| di| ha|ch | da|ver| zu|lic|t d|in |auf| ei| in| be|hen|nde|n d|uf |ede| ve|it |ten|n s|sei|at |jed| je| se|and|rei|s r|den|ter|ne |hat|t a|r h|zu |das|ode| od|as |es | an|fre|nge| we|n u|run| fr|ere|e u|lle|ner|nte|hei|ese| so|rde|wer|ige| al|ers|n g|hte|d d| st|n j|lei|all|n a|nen|ege|ent|bei|g d|erd|t u|ren|nsc|chu| gr|kei|ens|le |ben|aft|haf|cha|tli|ges|e s| si|men| vo|lun|em |r s|ion|te |len|gru|gun|tig|unt|uch|spr|n e|ft |ei |e f| wi| sc|r d|n n|geh|r g|dar|sta|erk| er|r e|sen|eic|gle| gl|lie|e e|tz |fen|n i|nie|f g|t w|des|chl|ite|ihe|eih|ies|ruc|st |ist|n w|h a|n z|e a| ni|ang|rf |arf|gem|ale|ati|on |he |t s|ach| na|end|n o|pru|ans|sse|ern|aat|taa|ehe|e d|hli|hre|int|tio|her|nsp|de |mei| ar|r a|ffe|e b|wie|erf|abe|hab|ndl|n v|sic|t i|han|ema|nat|ber|ied|geg|d s|nun|d f|ind| me|gke|igk|ieÃŸ| fa|igu|hul|r v|dig|rch|urc|dur| du|utz|hut|tra|aus|alt|bes|str|ell|ste|ger|r o|esc|e g|rbe|arb|ohn|r b|mit|d g|r w|ntl|sow|n h|nne|etz|raf|dlu| ih|lte|man|iem|erh|eru| is|dem|lan|rt |son|isc|eli|rel|n r|e i|rli|r i| mi|e m|ild|bil| bi|eme| en|ins|fÃ¼r| fÃ¼|gel|Ã¶ff| Ã¶f|owi|ill|wil|e v|ric|f e',
    jav: 'ng |an | ka|ang|ing|kan| sa|ak |lan| la|hak| pa| ha|ara|ne |abe| in|n k|ngg|ong|ane|nga|ant|won|uwo| an| uw|nin|ata|n u|en |ra |tan| da|ran|ana| ma|nth|ake|ben|beb|hi |ke |sab|nda| ng|adi|thi|nan|a k| ba|san|asa|ni |e h|e k|g k| ut|pan|awa| be|eba|gan|g p|dan| wa|bas|aka|dha|yan|sa |arb|man| di|wa |g d| na|g n|ban| tu|n s|ung|wen|g s|rbe|dar|dak|di |g u|ora|aya|be |ah |a s|eni| or|han|as | pr|a n|na |iya|a a|kar|at |a l|mar|uwe|duw|uta|und|n p|asi|pa | si|ala|n n| un|kab|oni|ya |i h|gar|g b|yat|tum|ta |n m|i k|apa|taw| li|ani| ke|al |ka |kal|ngk|ega| ne|nal|n i|g a|ggo|ina|we |ena|dad|iba|awi|aga|a p| ta|sar|adh|awe|and|uju|ind|min|sin|ndu|uwa|gge|n l|ggu|ngs|n b|a b|pra|iji|n a|ha | bi|kat|go | ku|e p|ron|kak|ngu|a u|gsa|war|nya|g t|pad|bis|k b|i w|ae |wae| nd|ali|a m|er |sak|e s|ku |liy|ama|i l|eh |isa|arg|n t|a d|kap|i s|ayo|gay| pe|ndh|bad|pri|neg|tow|uto|eda|bed|il |ih | ik|ur |k k|rta|art|i p|rga|lak|ami|ro |aro|yom|r k|e d|a w|kon|rib|eng|ger|g l|ras|dil| ti|k l|rap|mra|uma| pi|k h|n d|gaw|wat|ga |k n|ar |per| we|oma|k p|jro|ajr|saj|ase|ini|ken|saw|ona|nas|kas|h k|i t| um|tin|wo | me|aba|rak|pag|yar|sya|t k| te| mu|ngl| ni|i b|men|ate|a i|aku|ebu|a t| du|g m|owo|mat| lu|amp',
    vie: 'ng |Ì£c |Ìc | qu|aÌ€ | th|nh | ng|Ì£i |Ì€n |vaÌ€| va| nh|uyÃª| ph|quy| ca|ÃªÌ€n|yÃªÌ€|Ì€nh|Ì€i |Ì£t | ch|oÌ | tr|ngÆ°|i n| gi|gÆ°Æ¡|Æ¡Ì€i|Æ°Æ¡Ì€|Ìt | co|Æ°Æ¡Ì£| cu|aÌc|Æ°Ì£ |Æ¡Ì£c| kh| Ä‘Æ°|Ä‘Æ°Æ¡| tÆ°|coÌ| ha|Ã´ng|c t| Ä‘Ãª|n t|i Ä‘|iÌ€n|Ì€u |caÌ|gia|Ìi |oÌ£i|moÌ£| mo|ÃªÌ€u|iÃªÌ£|Ä‘ÃªÌ€|u c|nhÆ°|pha| ba| bi|Ã¢Ìt|Ì‰a |uÌ‰a|cuÌ‰|hÃ´n| Ä‘Ã´|g t|Ì q|Ìƒng| ti|tÆ°Ì£|t c|Ì£n | la|n Ä‘|n c|n n|hiÃª|ch |ay |hay| vi|Ã¢n | Ä‘i| na|baÌ‰| ho|do | do| tÃ´| hi|Ã´Ì£i|haÌ|iÌ£ |naÌ€|Ì€ t|Æ¡Ìi|hÃ¢n| mÃ´|Ìp |aÌ€n|Ì£ d|Ìch|Ì£p |Ì€o |aÌ€o|khÃ´|Ìn |Ã´Ì£t|mÃ´Ì£| hÃ´|ia |Ã´Ìc|c h|hÆ°Ìƒ|i v|g n|Ìng|uÃ´Ì|quÃ´|h t|Ã´n |Ãªn |n v|nhÃ¢|Ì£ t| bÃ¢|i c|g v|Ì‰ng|iÃªÌ|c c|Ã¢Ì£t|thÆ°|hÆ° |Æ°Æ¡Ì|Ì‰n | vÆ¡| cÃ´|c Ä‘| Ä‘o| sÆ°|t t|Ã´Ì£c|Æ°Ìƒn|vÆ¡Ì| vÃª|aÌ‰ |Ì£ng|g Ä‘|Ì‰o |aÌ‰o|uÃ¢Ì£| Ä‘a|biÌ£|laÌ€|sÆ°Ì£|bÃ¢Ì|haÌ€|hÃ´Ì£|i t|aÌ‰n|hÆ°Æ¡|Ì€ng|tro|Ì‰m |o v| mi|ÃªÌ‰ |uÌ£c|i h|Æ°Ìc|aÌp|g c|Ìƒ h|iaÌ|n b|Ì‰i |a m|h c|cÃ´n|ÃªÌ£n|Æ¡Ìc|haÌ£|Ä‘Ã´Ì£| du| cÆ°|a c|n h|tha|aÌƒ | xa|Ìo |aÌo|iÌn|Ì€y |g b| hÆ°|g h|ong|ron|Ì€ c|cho|Ì€ n|miÌ€|Æ°Ì£c|h v|c b| lu|i b|ÃªÌ£ |ai |ÃªÌ |Ì£ c|xaÌƒ|kha|c q|iÃªÌ‰|tÃ´Ì£|Ã´Ìi|Ä‘Ã´Ì|aÌ |hoa|o h|h Ä‘|caÌ‰|n l|hoÌ£|tiÃª|y t|Ì‰ c|aÌ£i|aÌn|Ì€ Ä‘|oaÌ€|y Ä‘|chi|Ì‰ n|phÃ¢|ÃªÌ€ |thu|iÃªn|duÌ£|o c|i m|luÃ¢|c p|Ã´Ìn|c l|Ì c|uÌƒn|cuÌƒ|c g|c n|qua|n g|c m|o n|aÌ‰i|haÌ‰|Ì t|ho |vÃªÌ€| tÃ¢| hÆ¡|o t|Æ¡Ì‰ |hÆ°Ì|hiÌ€|viÃª|Ì€m |Ì‰ t|Ä‘oÌ|thÃ´|Æ°Ì |cÆ°Ì|hiÌ|Ình|aÌ€y|Æ¡Ì‰n|Æ°Æ¡Ì‰| bÄƒ|tri| ta|m v|c v|Æ¡Ì£p|hÆ¡Ì£|h m| nÆ°|ÃªÌt|thi|ÄƒÌ£c|ngh|uy ',
    ita: ' di|to | in|ion|la | de|di |re |e d|ne | e |zio|rit|a d|one|o d|ni |le |lla|itt|ess| al|iri|dir|tto|ent|ell|i i|del|ndi|ere|ind|o a| co|te |tÃ  |ti |a s|uo |e e|gni|azi| pr|idu|ivi|duo|vid|div|ogn| og| es|i e| ha|all|ale|nte|e a|men|ser| su| ne|e l|za |i d|per|a p|ha | pe| un|con|no |sse|li |e i| o | so| li| la|pro|ia |o i|e p|o s|i s|in |ato|o h|na |e s|a l|e o|nza|ali|tti|o p|ta |so |ber|ibe|lib|o e|un | a | ri|ua |il | il|nto|pri|el | po|una|are|ame| qu|a c|ro |oni|nel|e n| ad|ual|gli|sua|ond| re|a a|i c|ri |o o|sta|ita|i o| le|ad |i a|ers|enz|ssi|Ã  e|itÃ |gua|i p|e c|io | pa|ter|soc|nal|ona|naz|ist|cia|rso|ver|a e|i r|tat|lle|sia| si|rio|tra|che| se|rtÃ |ert|anz|eri|tut|Ã  d|he | da|al |ant|qua|on |ari|o c| st|oci|er |dis|tri|si |ed | ed|ono| tu|ei |dei|uzi|com|att|a n|opr|rop|par|nes|i l|zza|ese|res|ien|son| eg|n c|ont|nti|pos|int|ico|rÃ  |sun|ial|lit|sen|pre|tta|dev|nit|era|eve|ll |l i| l |nda|ina|non| no|o n|ria|str|d a|art|se |ssu|ica|raz|ett|sci|gio|ati|egu| na|i u|utt|ve | ma|do |e r|ssa|sa |a f|n p|fon| ch|d u|rim| fo|a t| sc|trÃ |otr|pot|n i| cu|l p|ra |ezz|a o|ini|sso|dic|ltr|uni|cie| ra|i n|ruz|tru|ste| is|der|l m|a r|pie|lia|est|dal|nta| at|tal|ntr| pu|nno|ann|ten|vit|a v',
    tur: ' ve| ha|ve |ir |ler|hak| he|her|in |lar|r h|bir|ya |er |ak |kkÄ±|akk|eti| ka| bi|eya|an |eri|iye|yet|ara|ek | ol|de |vey|Ä±n |Ä±r |nda|arÄ±|esi|Ä±nÄ±|dÄ±r| ta|tle|e h|asÄ±|etl|e k| va|Ä± v|sÄ±n|ile|ne |rke|erk|ard|ine| sa|Ä±nd|ini|k h|kÄ±n|ama|le |tin|rdÄ±|var|a v| me|e m|na |sin|ere|k v| ÅŸa| bu|lan|kes|dir|rin|dan| ma|kÄ± |mak|ÅŸah|da | te|mek| ge|nÄ± | hi|nin|en |n h| se|lik|rle|ana|lma|e a|Ä± h|r ÅŸ|ill|si | de|aya|zdi|izd|aiz|hai|ret|hiÃ§|Ä±na| iÅŸ|e b| ba|kla|et | hÃ¼|rÄ±n|n k|ola|nma|e t| ya|eme|riy|n v|e i|a h|li |mil|eli|ket|ik |kar|irl|hÃ¼r|im |evl|mes|e d|ahs|ma |rak|ala|let|lle|un | ed|rri|Ã¼rr|bu | mi|i v|dil| il| eÅŸ|n i|la |el |mal| mÃ¼| ko|e g|se | ki|mas|lek|mle|mem|n b|ili|e e|ser| iÃ§|n s|din| di|es |mel|eke|tir|ÅŸit|eÅŸi|r b|akl|yla|n m|len| ke|edi|oru|nde|re |ele|ni |tÃ¼r|a k|eye|Ä±k |ken|uÄŸu| uy|eml|erd|ede|ame| gÃ¶|e s|i m|tim|i b|rde|rÅŸÄ±|arÅŸ|a s|it |t v|siy|ar |rme|est|bes|rbe|erb|te |alÄ±| an|ndi|end|hsÄ±|unm|rÄ± |kor|nÄ±n| ce|maz|mse|ims|kim|iÃ§ | ay|a m|lam|ri |sÄ±z|a b|ade|n t|nam|lme|ilm|k g|il |tme|etm|r v|e v|n e|ÄŸre|Ã¶ÄŸr| Ã¶ÄŸ|al |Ä±yl|olm|vle|ÅŸma|i s|ger|me | da|ind|lem|i o|may|cak|Ã§in|iÃ§i|nun|kan|ye |e y|r t|az |Ã§ k|ece|sÄ± |eni| mu|ulu|und|den|lun| fa|ÅŸÄ± |ahi|l v|r a|san|kat| so|enm| ev|iÅŸ ',
    pol: ' pr|nie|pra| i |nia|ie |go |ani|raw|ia | po|ego| do|wie|iek|awo| ni|owi|ch |ek |do | ma|wo |a p|Å›ci|ci |ej | cz| za| w |ych|oÅ›c|rze|prz| ka|wa |eni| na| je|aÅ¼d|kaÅ¼|ma |zÅ‚o|czÅ‚|noÅ›|o d|Å‚ow|y c|dy |Å¼dy|i p|wol| lu|ny |oln| wy|stw| wo|ub |lub|lno|rod|k m|twa|dzi|na | sw|rzy|ajÄ…|ecz|czn|sta| sp|owa|o p|spo|i w|kie|a w|zys|obo|est|neg|aÄ‡ |mi |cze|e w|nyc|nic|jak| ja|wsz| z |jeg|wan|Å„st|o s|a i|awa|e p|yst|pos|pow| rÃ³|o o|jÄ…c|ony|nej|owo|dow|Ã³w | ko|kol|aki|bez|rac|sze|iej| in|zen|pod|i i|ni | ro|cy |o w|zan|eÅ„s|no |zne|a s|lwi|olw|ez |odn|rÃ³w|odz|o u|ne |i n|i k|czy| be|acj|wob|inn| ob|Ã³wn|zie| ws|aln|orz|nik|o n|icz|zyn|Å‚ec|oÅ‚e|poÅ‚|aro|nar|a j|i z|tÄ™p|stÄ™|ien|cza|o z|ym |zec|ron|i l|ami| os|kra| kr|owe| od|ji |cji|mie|a z|bod|swo|dni|zes|eÅ‚n|peÅ‚|iu |edn|iko|a n|raj| st|odo|zna|wyc|em |lni|szy|wia|nym|Ä… p|jÄ… |zeÅ„|iec|pie|st |jes| to|sob|ktÃ³|ale|y w|ieg|och|du |ini|war|zaw|nny|roz|i o|wej|iÄ™ |siÄ™| si|nau| or|o r|kor|e s|pop|zas|niu|z p|owy|w k|ywa| ta|ymi|hro|chr| oc|jed|ki |o t|ogo|oby|ran|any|oso|a o|tÃ³r| kt|w z|dne|to |tan|h i|nan|ejs|ada|a k|iem|aw |h p|wni|ucz|ora|a d| wÅ‚|ian| dz| mo|e m|awi|Ä‡ s|gan|zez|mu |taw|dst|wiÄ…|w c|y p|kow|o j|i m|y s|bow|kog|by |j o|ier|mow|sza|b o|ju |yna',
    swh: 'a k| ya|na |wa |ya | ku|a m| na| ha|i y| wa|a h|a n|ana|aki|ki |la |hak| ka|kwa|tu | kw| ma|li |a a|ila|i k| ki|ni |a w|ali|a u| an| mt|ke |mtu|a y|ake|ati|kil|ka |ika|kat|ili|te |ote|we |a s|e k|ia |zi |u a|za |azi|ifa|ma |yak|yo |i n|ama| yo|au | au|e a|kut|amb|o y|ha |asi|fa |u w|hal|ara|sha|ish|ata|ayo| as|tik|u k| za|i z|ina|u n|mba|uhu|hi |hur|cha|yot|ru |uru|wat| ch|eri|ngi|e y|u y|i a|aif|tai| sh|nay|chi|ra |ani| bi| uh|sa | hi|i h|awa|iwa|a j|ti |mu |o k|ja |kan|uli|iwe|any|i w| am|e n|end|atu|kaz|o h|ria|her|she|shi|nch| nc|uta|ye |wak|ii |ele|ami|adh|eza| wo|iki|oja|moj|jam| ja|aka|bu |kam|kul|mat|fan|a l|agu|ind|ne |iri|lim|wen|da |kup|uto|i m|a b|ini|wan|bil| ta|sta|dha| sa| ni|ao | hu|e w|wot| zi|rik|kuf|aji|ta |wez|nya|har| ye|e m|si |lin| ut|ine|gin|ing| la|a t|zim|imu|ima|tak|e b|uni|ibu|azo|kos|yan|nye|uba|ari|ahi|nde|asa|ri |ham|dhi|eli|hir|ush|pat| nd|kus|maa|di |nda|oa |bar|bo |mbo|oka|tok|ndw|ala|wal| si|uzi|hii|tah|i s|o n|liw| el|upa|zin|hag|a c|ndi|ais|mai|eny|mwe|aa |ewe| al|ndo|e h|lo |umi|kuh|jib|osa|mam|a z|ufu|dwa|u i| in|iyo|nyi| ny|u m|sil|ang|o w|guz|zwa|uwa|kuw|hil|saw|uch|ufa|laz|und|aha|ua | mw|bal| lo|o l|a i|del|nun|anu|nji| ba|lik|le |uku|i i',
    sun: 'an |na |eun|ng | ka|ana| sa| di|ang|ung|un |nga|ak | ha|keu| ba|a b| an|nu |hak| bo|anu|ata|nan|a h|ina| je|aha|ga |ah |awa|jeu| na|ara|ing|oga|bog|gan| ng|asa|kan|a s|ha |ae |bae|n k|a k| pa|a p|sah|g s|sar| si|sin|a n|din|n s|ma | at|aga|a a|tan| ku| ma|n a|san|man|wa |lah|pan|taw|u d|ra |ari|eu | pi|gar| pe|kat| te|n p|sa |per|a d|a m|e b|aan|ban|ran|ala|ike|n n|kum| ti|ama|a j|pik|ima|n d|al |at | ja|ila|ta |nda|bas|rim|teu|n b|eba|beb|udu|aya|ika|ngg|nag|kab|rta|art| me|ola|k n|uma|atu|aba|g k|adi|aca| po|ngt|nar|una|ate|oh |boh|awe|di |tin|asi|uku|n h|dan|aka|iba|car|sac|gaw|are|ent|um |jen|abe|u s|dil|pol|ar |ku |kud|u m|upa|han| hu|ake|bar|ur |hna|aru|h s|a t|sak|wat|kaw| so|n t|pa |mpa|du |ngk|g d|ena|huk| mi|mas|ngs|ti |n j|ka |aku|ren|n m| ta|law|isa| tu|und|a u|h a|tay|ula|aja|ali|nte|gsa|en |gam| wa|ieu|ere|k h|jal|h b|il |dit|ngu|lan|asu|yun|ayu|gta|k d|a r|g n|mah|uda|dip|kas|rup|geu| be|ter|sej|min|ri |ern|u p|k k|amp|ura|kal|e a|k a|ut |g b|nak|bis| bi|k p|tes|end|we |h k|tun|uan| un| de|u n|h t|ksa|u k|ian|wil|u b|ona|nas|uka|rak|eje| se|ami| ke|war| ra| ie|k j|eh |ya |lma|alm|pen|tur|wan|lak|h j|g a|ean|up |rga|arg|r k|u t| ne|deu|gal|gke|e t|h p| ge|g t| da|i n',
    ron: ' de|re | Ã®n|È™i |are|de | È™i|te |ul | sa|rep|e d|ea |ept|dre|tul|e a| dr|ie |Ã®n |ptu|le |ate|la |e p| la| pe|ori| pr|ce |e s| or|au |tat| ar|ice|ii |or |a s| fi| a |ric|ale|per| co|nÄƒ |Äƒ a|rea|ers|i s| li|sau| ca|rso|ent|lor|aÈ›i|al |a d|e o|men|l l|ei |e c|pri|anÄƒ| ac| re|uri|ber|ibe|lib|a p|oan|soa| in|i l|ter| al| sÄƒ|tea|lÄƒ |car|tÄƒÈ›|sÄƒ |tur|i a|i d|nal| ni|ri |ita|e Ã®|e È™|se |ilo|in |ia |È›ie|pre|fie|È›ii|ÄƒÈ›i|con|ere|e f|a o|eni|nte| nu| se|ace|ire|ici| cu|i Ã®|a c|i n|a l|pen|ui |nu |Äƒri|alÄƒ|ona|l d|rÄƒ |ert|ril| su|ntr|n c|rin| as|ni |i o|eri|tÄƒ |cÄƒ |ile|Äƒ d|i c|e n|ele|sa | mo|i p|fi |sal|tor|va |oci|soc|nic|pro| un| tr|est|inÈ›|a Ã®|uni|n m|a a| di|ecu|lui|sta|lit| po|tre|gal|ega|oat|ra |act|Äƒ Ã®|leg|u d|e l|nde|int|a f|n a| so|naÈ›|ara|i f|uie|iun| to|tar|ste|ces|rar|at | ce|eme|i È™|rec|dep| cÄƒ| o | Ã®m|bui|ebu|reb| eg| na|mÃ¢n|ntu|ili|vÄƒÈ›|Ã¢nd|iei|r È™|bil|pli|od |mod|res|din|e e|cÈ›i| au|ali|Äƒ p|Äƒ f|Ã®mp|ial|cia|ion|Äƒ c|dec|nta| om|itÄƒ| fa|È›Äƒ |cu |tra|ÄƒÈ›Äƒ|nvÄƒ|Ã®nv|Ã¢t |ite|i i|lic| pu| ex|riv|tri|rot|È›a |È›i |l c|rta|imi|ulu|È›io|icÄƒ|lig|rel|ta |cla|t Ã®|nt |nit|e m|Ã¢nt|ÄƒmÃ¢|È›Äƒm|ger|nÈ›a|ru |tru|gur|u c|bli|abi|atÄƒ|art|par|ar |rim|iva|l È™| sc|ime|nim|era|sup|ind|u a|dic|ic | st| va|ini|igi|e r',
    hau: 'da | da|in |a k|ya |a d| ya|an |a a| ko| wa|na | a |sa | ha|kin|wan|ta | ba|a s| ta|a y|a h|wa |ko | na|n d|a t|ba |ma |n a| ma|iya|hak|asa| sa|ar |ata|yan| za|akk|a w|ama| ka|i d|iki|a m|owa|a b| ci| mu| sh|anc|nci|kow|a z|ai |nsa|a c|shi| Æ™a|cik|ne |ana|i k|ci |kki|e d|a Æ™| ku|su |n y|uma|ka |uwa|kum|hi |a n|utu| yi|ani| ga| ra|aka|ali|mut|â€˜ya|tar| do|É—an|ars| â€˜y|sam|Æ™as|nda|ane|man|tum|i a|yi |ni | du|ada| su|and|a g|cin| ad|a i|ke | É—a|n k|yin|um |e m| ab|ins|nan|ki |mi |ami|yar|min|oka|re |i b|kam|mas|i y|mat|za |ann|en |aÉ—a| ja|m n|li |duk|dai|e s|n s|ra |n w|n h|aik| ai|ida|ga |san|rsa|aba|sar|ce |nin| la|o n|ban|nna|kan|abi|una|dam|me |ara|i m|hal|a r|add|are|n j|abu| ne|zai|a É—|wat|ari| Æ™u|on |ans|waÉ—|ame|ake|kar|din|zam| fa|a l|Æ™un|buw|r d| hu|oki|kok|a â€˜|u d|n t|abb|aur| id|rin|yak|dok|kiy|ray|jam|n b|ubu|bub|n m|i s| an|am |ili|bba|omi|dan|gam|ayu|ash|nce|tsa|ayi|har|yya|ika|bin|han|kko|rsu|aif|imi|fa | am|i i|dom| ki|yuw|dun|o a|fan|n Æ™|aya|fi |n r|she|uni|bay|riy|n â€˜|sab| iy|bat|tab|aga| ir|mar|o w|i w|sha|awa| ak|uns|unc|tun|u k| il|É—in|mfa|amf|aci|ewa|kas|lin|n n|don|n i|ure|ifi|lai|dda| ts|iri|aye|un |tan|wad|gwa|afi| ay|ace|mba|amb|aid|nta|ant|war|lim|kya| al|aÉ—i',
    fuv: 'de | e |e n| ha|nde|la | wa|ina| ka|akk| nd|É—o |na | in|e e|hak|al |di |i h|kke|ii |um |ko |ala|ndi| mu| ne|lla| jo|wal|eÉ—É—|neÉ—|all|mum| fo|kal|jog|ke |aaw|taa| ko|eed|É—É—o|aa | le|ji |ade|aad|laa|o k| ng|e h| ta|re |ogi|a j|e w|e m|nnd|gii|e l|ley|awa|aag|ede|waa|e k|gu |e d| go|gal|É“e |ti |fot|aan|eyd|ydi|É—e |ee | re|ol |oto|i e|oti|m e|taw|nga|a i|kee|to |ann|eji|am |ni | wo|een|goo|eej|e f| he|enn|gol|agu|pot| po|dee|ay | fa|ka |a k|ond|oot| de|a f|o f|a n|wa |maa|ota|le |hay|i k|o n|ngo|e j|o t| ja|Ã±aa|hee|nka|i w|awi|a w|ngu|der| to|e t|dim|i n|fof|i f|e g|tee|naa|aak| do|too|a e|ndo|ren|dii|oor|er |o e|i m|of | sa| so|gaa|ani|kam| ma| Ã±a|o w|i l|u m|kaa|ima|dir| ba|igg|lig| li|aar| É“e|o i|e s| o |e r|so |ooj| nj| la|won|awo|dow|woo|faw|and|e i|ore|nge|nan|are|a t|tin|aam| mo|É—ee|ita|ira|aaÉ—|e p|nng|ma |ank|yan|nda|oo |e É“|njo|ude|nee|e y|e a|je | ya|en |ine|iin| di|ral| na|É—i |und| hu|inn|Å‹de|aÅ‹d|jaÅ‹|a d|den| fe| te|go | su|a h|haa|tal|eÉ—e|e b|y g|baa|tde| yi|É—É—a|o h|iiÉ—|ow | da|do |l n|alt| ho|l e|aga|mii| aa|a a|ama|nna|m t| ke|edd|oga|m w|l m|o j|aÉ—e|ree|oje|yee| no|ele|ne |ago| pa| al|guu|wi |ge |aaÉ“|daa|ind|dew|i j|jey| je|ent|tan|o É—|geÉ—| ge|Ã±ee|a l| É—u|kko|mak|a s| ga',
    bos: ' pr| i |je |rav|na |ma |pra| na|ima| sv|a s|da |a p|vo |nje|ko |ako|anj|o i| po|avo|ja |e s|a i|ti | im| da| u |sva|no |ju | za|o n|va |i p|ili|vak|li | ko|ne | il|koj| ne|nja| dr|ost| sl|van|im |i s|u s|i i|a n|ava|ije|a u| bi|stv|se |a d|om |jed|bod|obo|lob|slo| se| ra|ih |sti| ob| je|pri|enj|dru|u i|o d|iti|voj|raz|ova|dje| os|e i|lo |e p| nj|uje|i d|bra|tre| tr| su|jeg|i n|u z|a k|og |u p|oje|cij|reb|a o|a b|lju|i u|ran|mij|ni |nos|jen|ba |edn|svo| iz|jel|pro|e d|Å¾av|bit| ni|i o|sta|a z|avn|vje| ka|bil|ovo|a j|aju|ist|nih|tu |red|gov| od|e o|oji| sm|lje|o k|ilo|ji |aci|e u|e n|pre|o p|eba|u o|su |vim|iÄn| sa|u n| dj|a t|ija|Äno|jem|rÅ¾a|drÅ¾|elj|stu|dna|odn|eni|za |iva|olj|Å¡ti|nom|em |du |vno|smi|jer|e b|de |pos|m i| do|u d|nak|a r|obr| mo|lja|nim|ego| kr|tit|kri|ve |nju|an |iko|nik|nu |i m|nog|eno|sno| st|e k|tup|rug|ka |oda|riv|vol|aln|m s|itu|aÅ¡t|zaÅ¡|ani|sam|akv|ovi|osn|rod|aro| mi|tva|dno|nst|jan|ak |ite|viÄ|rad|u m| ta|dst|tiv|nac|rim|kon|ku |odu|Å¾iv|amo|tvo|tel|pod|g p|nov|ina|nar| vj|o s|i b|oj | ov|ave|vu |ans|oja|zov|azo|ude|bud| bu|e t|i v|din|edi|nic|tan|nap|mje| is|jal|slu|pun|eds|o o|zak|jav|i k|m p|tno|ivo|ere|niÄ|m n|jim|kak|ada|vni|ugi| ro|mov|ven|pol|to |te | vr',
    hrv: ' pr| i |ma |rav|ima|pra|je |na | sv|ti | na|a p|vo |vat|ko |a s|nje| po|anj|avo|o i|tko| im|a i|sva|no |i p|e s|ja |o n| za|ju |ili| u |va |li | bi|ne |i s|atk| il|iti|da | ne| ko| dr| sl|van|nja|koj|ije| ra|ova| os|u s|i i|ost|bod|obo|lob|slo|pri|a n|om |jed|ati|ih |im |voj|ava| ob|stv|se | mo|i u|bit|dru| je| se|dje|i o|enj| ka|i n|sti|lo |u i|svo|mij|ni |e i|raz|a o|e n|bra|o p| su|a b|u p|ran|a k|og |i d|bil|ako|e p|a d|edn|aju|mor|eni| nj|iva|jel|Å¾av| ni|a z|avn|ovi|eno|ra |oje|a j| da|a u|ora|jeg| iz|nih|rÅ¾a|drÅ¾|oji|sno|nit|jen|vje|ilo|cij|oda|nim| dj|pro|tit|u z|e d|red|nom|jem| od|nos|sta|nov|osn| sm|lje|o s|ji |ovo|stu|pos|vim| do|odn|rad|ist| sa|e o|tu |nju|em |gov|o d|rod|i m|jer|aci|oj |pre|m i|nak|dna|a r|lju|uje|e m|obr|za |olj|ve |o o|m s|an |nu |du |aro|vno|smi|aln|e k|o k|i b|e u|tva|u u|tup|rug|dno|u o|su |u d|ka |vol| ta|ija|itu|Å¡ti|aÅ¡t|zaÅ¡|itk|Å¾iv|ani|sam|elj| st|sob|oso|nar|akv|ada| mi|te |ona|nst|jan|lja|i v|ite|ego|elo|rim|ku |odu|amo|tvo|tel|jim|pod|nog|vi |ina| vj|to |e b|ans|zov|azo|ak | sk|edi|tan|oju|pun|pot|oti|kon|zak|i k|m p|tno|ivo|ere|niÄ|kak|vni|ugi| ro|mov|ven|Å¡tv| be|ara|kla|ave|u b|avi|oja|jal|u m|dni|mje|rak|din|Ä‡i |juÄ|klj|nic|u k|nap|obi|atn',
    nld: 'en |an |de | de| he|ing|cht| en|der|van| va|ng |een|et |ech| ge| ee|n e|rec| re|n v|n d|nde|ver| be|er |ede|den| op|het|n i| te|lij|gen|zij| zi|ht |ijk|eli| in|t o| ve|op |and|ten|ke |ijn|e v|jn |ied| on|eft| ie|sch|n z|n o|aan|ft |eid|te |oor| we|ond|eef|ere|hee|id |in |rde|n w|t r|aar|rij|ord|wor|ens|of | of|hei|n g| vr| vo| aa|r h|hte| wo|n h|al |nd |vri|e o|ren|le |or |n a|jke|lle|eni|n b|ij |e e|g v| st|ige|die|e g|men|nge|t h|e b| za|e s|om |t e|ati|wel|erk|sta|ers| al| om|n t|zal|dig| me|ste|voo|ter|gin|re |ege|ge |g e|bes|nat| na|eke|che|ig |gel|nie|nst|e a|nig|est|e w|erw|r d|end|ona|d v|jhe|ijh|d e|ele| di|ie | do|del|n n|at |it | da|tie|e r|elk|ich|jk |vol|ijd|tel|min|len|str|lin|n s|per|t d|han| zo|hap|cha|wet| to|ven| ni|aat|ion|tio|taa|lke|eze|met|ard|waa|uit|sti|e n|doo|pen|eve|el |toe|ale|ien|ach|st |ns | wa|eme|nin|e d|bij| gr|n m|p v|esc|t w|ont|ite|man|ema| ma|nal|g o|rin|hed|t a|t v|beg|all|ijs|wij|rwi|e h| bi|gro|p d|rmi|erm|her|oon| pe|eit|kin|t z|iet|iem|e i|gem|igi| an|d o|r e|ete|e m|js | hu|oep|g z|edi|arb|zen|tin|ron|daa|teg|g t|raf|tra|eri|soo|nsc|t b| er|lan| la|ern|ar |lit|zon|d z|ze |dez|eho|d m|tig|loo|mee|ger|ali|gev|ije|ezi|gez|nli|l v|tij|eer| ar',
    srp: ' pr| i |rav|na |pra| na|ma | sv|ima|da |ja |a p|vo |je |ko |ti |avo| po|a i|ako|a s| za| u |ju |o i| im|nje|i p|va |sva|anj|vak| da|o n|nja|e s|ost| ko|a n|li |ili|ne |om | ne|i s| sl| il| dr|no |koj|u s|ava| ra|og |slo|im |enj|sti|bod|obo|lob|iti|a o|stv|i u|a d|ni |jed|u p|pri|edn| bi|i i|a k|o d|sta|ih |dru|a u| je| os| ni|nos|pro|aju|i o|ran| de| su|u i|se |van|ova|i d|cij| ob|uje|red|Å¾av|e i|i n|voj|e p|a j|dna| se| od|ve | ka|eni|rÅ¾a|drÅ¾|a z|avn|aci|ovo|u u|m i|oja| iz|lja| nj|ija|u z|e o|rod|jen|lje|e b|raz|jan|lju|svo|za |gov|iÄn| st|nov|sno|osn|du |ji |pre| tr|su |vu |odn|a b|jeg|nim|nih|tu |tit|Å¡ti|ku |nom|bit|e d|me |iko|Äno|oji|lo |vno|nik|e n|Ä‘en|ika|bez|ara|de |u o|vim|nak| sa|u n|riv|ave|an |olj|vol| kr|o p|sme|e k|nog| ov|e u|tva|bra|rug|reb|tre|u d|oda| mo| vr|vlj|avl|ego|jav|del|m s|kri|o k|aÅ¡t|zaÅ¡|nju| sm|ani| li|dno|eÄ‘u|aln|la |akv|oj |Å¡en|kom|stu|ugi|avi|a r|ka |rad|oju|tan|odi|viÄ|tav|itu|ude|bud| bu|pot|odu|Å¾iv|ere|m n|tvo|ilo|bil|aro|ovi|por|eno|Å¡tv|nac|ove|m p|tup|pos|rem|dni|ba |nst|a t|ast|iva|e m|vre|nu |beÄ‘|ist|pun|en |te |dst|rot|zak|ao |kao|i k|juÄ‡|o s|st |sam|ter|nar| me|i m|kol|e r|uÅ¡t|ruÅ¡|ver|kak| be|i b|kla|ada|eba|ena|ona| on|tvu|ans| do|rak|slu',
    ckb: ' he| Ã» |Ãªn | bi| ma|na |in |maf| di|an |xwe| xw|ku | ku|kes| de| ji|her|kir|iya|ya |rin|iri|ji |bi |es | ne|ye |yÃªn|e b|er |afÃª|tin|ke | an|iyÃª|eye|rke|erk|we | be|e h|de | we|hey|fÃª |i b|yÃª |ina| bÃª| li|diy|ber|li |re |Ã® Ã»|nÃª |Ãª d| se| ci|eke|di |wÃ® | na|Ã® y|af |ete|hem| wÃ®|sti| ki|rÃ® |kÃ® |Ã® a|yek|n d|kar| te|ne |yÃ® |i h|e k|tÃ® |tÃª |a w|e d|Ã® b|s m|ast|n b|be |yan|ser|tew|net| tu| ew|hev|aza|ara|Ã» b|n k|adi|ev |zad| az|ras|est|anÃª| ya|n h|n Ã»|wed| tÃª|wek|bat|bo | bo| yÃª|st |n n|Ãª k|dan|Ãª h|ema|Ãª b|iye|Ã® h|din|bÃ»n|r k|ekÃ®| me|par|Ã»na|ta |wle|ewl|Ã® m| ke|nav|ewe|man|Ãª t|dÃ® |Ã» m|mÃ» |emÃ»|a m|ika|e Ã»|n w|a x|Ãª m|e n| ta|ela|n j|eyÃª|n x|civ|wey|ana| re|khe|ekh|bik|kÃª |jÃ® |f h|erÃ®| pa|Ã®na|bin|erb|vak|iva|a s| ni|cih|vÃª |e j|ari| pÃª|Ã® d|nÃªn|ike|e t|a k|Ãª x| ye|n a|eyÃ®|n e|ama|bÃª |ar |ewa|atÃª|bes|rbe|av |ibe|ist|mÃ® |tem|awa|are|hÃ® |geh|nge|ing|nek|nÃ»n|anÃ»|qan| qa|vÃ® |rti|uke|tuk| ÅŸe|eza| da|u d|Ã» a|f Ã»|edi| ra|tu |tiy|tÃªn| mi|xeb| ge|hÃ®n| hÃ®|etÃª|Ã® j|stÃ®|mal|bib|ra |i d|e m|mam|i a|nik|i m|Ã® k| wi|Ã»n | ko|a ÅŸ|Ãª j|riy|lat|wel|e e|ine|ane|Ã» h|Ã®n |a d|siy|end|aye| za|ija|a n|Ã® n|ek |tek|yet|mbe|emb|Ã» d|rov|iro|mir|eba| xe|mÃªn| Ãªn| hu|nÃ®n|anÃ®|t Ã»|ten|n m|dem|Ãª Ã»|enÃª|te |art|i r| jÃ®|u j|ekÃª|dew',
    yor: ' nÃ­|ti |á»Ì |nÃ­ | lÃ¡| áº¹Ì€|Ã n |áº¹Ì |kan|tÃ­ | tÃ­|an |áº¹Ì€ |tá»Ì|á»Ì€ | áº¹n|á»n |wá»n|Ã­ áº¹|bÃ­ |Ã¡ti|lÃ¡t|Ì€tá»|áº¹Ì€t| gb| Ã t| Ã w|n l|Ã ti| a |láº¹Ì€|áº¹nÃ¬| Ã³ |ká»Ì€| lÃ³|Ã¬ k|sÃ­ |á»Ì€k| ká»|ra |ni |Ã bÃ­|tÃ b| tÃ |nÃ¬ | sÃ­|Ì€ka|á»Ì€á»|n áº¹|Ã wá»|n t|Ã³ n|Ì€á»Ì€|Ã­láº¹|orÃ­|lÃ³ | wá»|tÃ³ |dÃ¨ |Ã¬yÃ |Ãºn | tÃ³| or|Ã­ Ã¬|Ã¨dÃ¨|kÃ² |â€Ã¨d|Ì€â€Ã¨|áº¹Ì€â€|rÃ­l|Ã­ Ã³|ráº¹Ì€|Ã­ Ã | sÃ¬|yÃ n|gbo|á¹£e | kÃ²|Ã­ a| ráº¹| jáº¹|sÃ¬ | bÃ¡|rÃ n| á¹£e|wá»Ì|nÃ¬y|fÃºn| fÃº|n Ã |ba |n n|gbÃ |gbá»|jáº¹Ì|un |Ã¬Ã­ | kÃ­|gba|Ã¨nÃ¬| Ã¨n|bÃ¡ |Ì l|a k| ka|dá»Ì€|kÃ­ | Ã²m|in | fi|bÃ² |fi |báº¹Ì|á»dá»|bá»d|Ì s|hun|nÃº |nÃ­n|wÃ  |ira|nir|Ã²mÃ¬|Ã¬gb| Ã¬g|Ì t|áº¹ni|Ã­nÃº|i l|Ã¬ni|mÃ¬n|bÃ  |Ã¡Ã  |i Ã¬|ohu| oh|Ã­ i|ara| ti|bo |Ã² l| pÃ©|rÃº |Ã­rÃ | á»Ì€|Ã­ Ã²|ogb|ká»Ì|pá»Ì€|Ã³ b|Ã  t|i n|lá»Ì|áº¹Ìn| Ã¬b|yÃ¬Ã­|gbÃ©|gáº¹Ì|bog|Ã³Ã² |yÃ³Ã²| yÃ³|n k|pÃ© |dÃ¡ |Ìwá»|á»Ìw|Ã  l|Ã­ k| wÃ |n o|já» | ir|á»Ì€r|Ãº Ã¬|Ì Ã |Ã³ s|i t|á¹£áº¹Ì|Ì€ká»|Ã­ t|yÃ© |lÃ¨ | lÃ¨|fin|Ã bÃ²| lá»|Ã  n|Ã¹já»|wÃ¹j|irÃº|Ã³ j| ar|Ã­ w|a w| Ã¬m|Ãº Ã |Ì€ t|Ã²fi| Ã²f| Ã Ã |fáº¹Ì|Ã wÃ¹|Ìni|wÃ¹ |Ã¬Ã­r|mÃ¬Ã­| mÃ¬|lÃ¡Ã¬| yÃ¬|Ã­ g|á»Ìn|n s|i áº¹|áº¹Ì€k|Ã gb|Ã­gb|nÃ­g|a n| kÃº|lÃ¡Ã |Ã­ o|nÃ¡Ã | nÃ¡|káº¹Ì|Ã­pa|nÃ­p|Ã¬n | Ã¬k|bÃ© |i g|á»má»| á»m|i Ã |iá¹£áº¹|Ì€ Ã |Ã¬má»|n a|n f|jáº¹ |yÃ­ |Ì á»|Ã³ d|Ì Ã²| dÃ¡| mÃº|Ã Ã b|Ã¡báº¹|lÃ¡b|Ã¬bÃ¡|Ã² g|jÃº |i o|lÃº | Ã¨t|Ì€ áº¹|tá»Ì€|de |Ì€ n|i Ã²| Ã¬y|kÃ n|Ìn | bÃ­| iá¹£|má»Ì€|e áº¹|Ì€ l| fÃ |Ã¨yÃ­| Ã¨y| Ã¬d|má»Ì|dÃ© |Ì€ k|Ì p|Ã² t|mÃº | fáº¹| Ã¬j|rÃ­ |Ã¬káº¹|nÃ¬k|Ã¬nÃ­|n Ã¬|n Ã¨|sÃ¬n|Ã¨ áº¹| i |rá»Ì€| Ã n|Ì b|Ã¹n |Ìgb|á»Ìg|dá»Ì| dá»|Ã­ n|rin|Ì€ j',
    uzn: 'ish|an |lar|ga |ir | bi|ar | va|da |iga| hu|va |bir|sh |uqu|quq|huq| ha|shi| bo|r b|gan|a e|ida| ta|ini|lis|adi|ng |dir|lik|iy |ili|oÊ»l|har|ari| oÊ»|uqi|ins|lan|hi |ing|dan|nin|kin| yo|son|nso| in| mu|on |qig| ma|ega|r i|boÊ»| eg|oÊ»z|ni |gad|ash|i b|ki |oki|ila|yok|a b|n b|osh|ala|at |in |r h|erk| er|lga| qa|rki|h h| sh|i h|ara|n m| ba|nis|ik |igi|lig|bos|ri |qil|a t|bil|las|eti| et|n o|ani|nli|kla|i v|a q|a h|a o|yat| qo|im |a s|i m|iya|atl|oli|osi|siy|qla|cha|til| ol|ati|a y|mas|qar|inl|lat| qi|taÊ¼|ham|gi |ib |Ê»li|mla|h v|Ê»z |hun|n e|mum| da| bu| to|un |mki|umk|sha|tla|ris|iro|ha |rch|bar|iri|oya|ali| be|i o|asi|aro| ke|i t|rla| te|arc|hda|shu|tis|n h|tga| sa| xa|rak|lin|ada|ola|imo|hqa|shq|li | tu|aml|lla|sid| as|nid|a i| ki|ch |n t|nda|k b|era|siz|or |hla|a m|r v|eng|ten|mat|mda|amd|lim|miy|y t|ayo|i a|ino|ilg|tni| is|ana|as |ema| em|ech|a a|tar|kat|aka|ak |rat| de|aza|ill| si| so|gÊ»i|uql|n q|oda|Ê¼li|aÊ¼l|nik| ni|tda|uch|gin|a u|him|uni|sit|ay |qon| ja|atn|kim|h k|hec| he|Ê»zi|lak|ker|ikl| ch|liy|lli|chi|ur |zar|shl|rig|irl|dam|koh|iko|a d|am |n v|rti|tib|yot|tal|chu| uc|sla|rin|sos|aso| un|na | ka|muh|dig|asl|lma|ra |bu |ush|xal|Ê»lg|i k|ekl|r d|qat|aga|i q|oiy|mil| mi|qa |i s|jin',
    zlm: 'an |ang| ke|ng | se| da|ada|ara|dan| pe|ran| be|ak |ber|hak|ata|ala|a s|ah |nya| me|da |per|n s|ya | di|kan|lah|n k|aan|gan|dal|pad|kep|a p|n d|erh|eba|nga|yan|rha| ya|nda|ora|tia|asa| ha|ama|epa| or|iap|ap |a b| at| ma|eti|ra |tau|n a|set|au | ba|pa | ad|n p|tan|p o|eng|a d|men|apa|h b|h d|dak|man|a a|ter| te|k k| sa|n b|ana|g a|end|leh|ole|a k|am |n y|aka|eh |lam|bas|beb|n m| un|pen|sa |keb|sam|n t| ti|ela|san|car|uan|ma |di |han|ega|ban|eri|at |sia|a m|ika|kes|ian|gar|seb|ta |mas|und|neg|nan|ngs|i d|erl|na |epe|emb|bar| la|atu|kla|pem|mem|emu|eca|sec|ngg|nny|any|bol|al |aha|gsa|ebe|ind|akl|n h|erk|ung|ena| bo|a t| ap|ers| de|in |tu |pun|as |agi|ann|g b|bag| ne|ain|hen| he|era|rat|sem| su|adi|lan|g s|dia|mat|ses|iad| ta|iha|g t|tin|k m|k h|i k|gi |i s|ing|uka|enu|den|lai|k d|ert|ti |rka|aja|rga|lua|ker|mel|dun|ndu|lin|rli|nak|ntu|esi|aya|un |uat|jua| in|rma|erm|ai |emp|kem|ri |dil|ua |uk |h m|l d|g m|mba|kat|ese|tik|ni |ini| an|mpu|ka |dar|mar|rja|erj|arg|u k|sua| ol|esa|dap|ar |g u|si |ent|g d| pu|awa|iri|dir|sal|gam|mbe|n i|har|a h|raa|ema|tar|i a|saa|ira|ari|pel|jar|laj|uju|tuj|rak|ura|uar|elu|t d|unt|il |wen|asi|gga|ipa|ksa|tuk|ula|sek|sas|ibu|rta|sep|rsa|nta|ati|ila|mua|yar',
    ibo: 'a n|e n|ke | na| á» |na | bá»¥|á» b|nwe|nye|ere|re | n |ya |la | nk|ye | nw| ma|e á»| ya| ik|a o|a á»|ma |á»¥la|bá»¥l|ike| on|nke|e i|a m|ony|á»¥ n|kik|iki|bá»¥ | a |ka |wer|ta |i n|do |di | nd| ga|a a|e a|a i|he |kwa| ok| ob|e o|hi |any|gaâ€|ha |dá»¥ | mm|ndi|á» n|wa |rá»¥ |e m|che|a e|oke|wu |aka|ite|o n|a g|odo|bod|obo| dá»‹| ez|ara|we | ih|aâ€e|há»‹ |ri |n o|zi |mma|chi|dá»‹ |ghi|á»¥ta|iri|ihe| an| oh|a y|gba|á»¥ á»| á»z| ak| iw|nya|te |iwu| nt|ro |oro|e á»‹|zá» |ezi|me |e e|u n|her|ohe| si|aâ€a|i m|ala|á»¥ i| ka|akw| in|ghá»‹|kpe|n e|pá»¥t| e |i i|i o|ide|inw|á»¥ o|há»¥ |ahá»¥|weg|ra |o i|kpa|adá»¥|mad|si |sit|a s| me|sor|i á»|gid|edo|u o|e y|n a| en|tar|ozu|toz|bi |be |á»¥ m|á»¥rá»¥|á»rá»¥| á»r|mak|uso|ama|de |á»‹ o| á»n|á»zá»|chá»‹|egh|enw|apá»¥|ru | to|i a|a á»¥|osi|rá»‹ |wet|hed|nch| nc| eb| al|ná»d|á»ná»|uru|sir| kw|yer|ji |eny| mk|á»‹rá»‹|eta| us|tu |á» d|u á»| o |ba | mb|á»dá»¥|á»‹ch| ch|a d|pa | ag|kwe| ha|a u|e s|mkp|n u|nta|ebe|n á»|o m|kwu|nkw|nwa|obi| á»‹k|esi|i e|nha| nh|le |ile|nil| ni|eme| og|e k|n i|chá»|o y|asá»‹|otu| ot|ram|u m|á»‹gh|dá»‹g|zu |ná» |mba| gb|e g|á»‹ m|á»ch|ich|pe |agb|i á»‹|uch|zá»¥z|uny|wun|á»rá»| nn|naâ€| di|ge |oge|iji| ij|á»ha| á»h|ikp|egi|meg|o o|á»¥há»¥|há»¥h|mah|n á»¥|á» g|á»ta|eká»|á»‹ n|kwá»¥|agh|á»¥má»¥|ban|kpu|okp| ah|á»‹kp|a k|ime| im|zá»¥ |á»¥zá»¥|á»zá»¥| á»¥z|lit|ali|nat',
    ceb: 'sa | sa|ng |ang| ka| pa|an |ga |nga| ma|pag| ng|on |a p|od |kat|ay | an|g m|a k|ug |ana| ug|ung|ata|ngo|atu|n s|ala|san|d s|tun|ag |a m|god|g s|a a|a s|g k|g p|yon|n u|ong|tag|usa|pan|ing|una|mat|g u|mga| mg|y k| us|ali|syo| o |aga|tan|iya|kin|dun|nay|man|nan|a i| na|ina|nsa|isa|bis|a b|adu| ad|n n| bi|asy|asa|lay|awa|lan|non|a n|nas|o s|al |agp|lin|nal|wal| wa|ili|was|gaw|han| iy| ki|nah|ban|nag|yan|ahi|n k|gan| gi|him| di|a u| ba| un|ini|ama|ya |kas|asu|n a|g a|gka|agk|kan|ags|agt|l n|a g|kag| ta|imo|uns|sam| su|g n|n o|gal|kal|og |taw|aho|uka|gpa|ipo|ika|o p|a t| og| si|gsa|g t|aba|ano|gla|y s|o a|aki|hat|kau|sud|gpi|a w|g i|aha|ot |ran|i s|n m|bal|lip|gon|ud | ga|li |uba|ig |ara|g d|na |kab|aka|gba|ngl|ayo| la| hu|a h|ati|d a|d n| pu| in|uga|ok |ihi|d u|ma |may|awo|agb|ami|say|apa|pod|uha|t n|agh|buh|ins|ad | ub| bu|at |iin|a d|ip |uta|sal|hon|wo |ho |tra|lak|iko|as |aod|bah|mo |aug|ona|dil|gik|sos|lih|pin| pi|k s|nin|oon|abu|la |rab|hun| ti|mah|tar|t s|ngb|uma|hin|bat|lao|mak|it | at|s s|sno|asn|ni |aan|ahu| hi|agi|n p|inu|ulo|y p| ni|iha|mag|o n|duk|edu| ed|a e|til|ura|tin|kip|agl|gay|g h|g b|ato|ghi|nab|kon|in |ter|o u|o o|yal|sya|osy| so|tik| re| tr|hig|a o|ha |but|pak|aya',
    tgl: 'ng |ang| pa|an |sa | ka| sa|at | ma| ng|apa|ala|ata|g p|pan|pag|ay | an| na|ara| at|tan|a p|pat|n a| ba|ga |awa|rap|kar|g k|aya|lan|g m|n n|g b|nga|mga| mg|a k|na |ama|n s|a a|gan|yan|gka| ta|may|tao|agk|asa|man|aka|ao |y m|ana|g a|nan|aha|kan|y k|baw|kal|a m|g n|ing|wat| y |t t|pam|a n|o y|ban| la|ali|san|wal|mag| o |g i|aga|lay|any|g s|in |nya|yon|kas|a s|isa|una|ong|aan|kat|t p| wa|ina|tay|ya |on |o m|ila|ag |nta|t n|aba|ili| ay|o a| ga|no |a i|gal|ant|han|t s|kap|kak|lah|ari|agt|agp|ran|g l|lin|as |lal|gaw|ans|to |ito| it|hay|wa |t m| is|pap|mam|nsa|ahi|nag|bat|lip|gta| di|gay|gpa|pin| si|ngk|ung|aki|y n|iti|tat|ano|yaa|y s|mal|hat|kai|sal|hin|uma|mak|di |agi|pun|ihi|a l|i a|ira|gga|nah|s n|ap | ha|usa|nin|o p|gin|ipu|ika|ngi|i n|lag|la |y p|ini|g t|uka|nap| tu|a g|tas|aru|ipa| ip|li |al |n o|a o|t k|alo| pi|sin|syo|asy|ita|aho|nar|par|o s|pak|t a|uha|sas|gsa|ags|kin|a h|iba|lit|ula|o n|nak|a t| bu|duk|kab|sam|g e|ain|ami|mas|lab|ani|kil|it | al|agb|buh|a b|g g|ba | ib|iyo|ri |yag|ad | da|edu| ed|anl|ma |ais|iga|mba|tun|ipi| ki|od |ayu| li|lih|sar|gi |g w|pah|wir|oob|loo|agg|nli|bay|map|git|mil|ok |hon|ngg|sah|iya|pas|g h|agl|tar|ngu|amb|uku|ayo|s a|p n|n m|rus|i m|l a|abu| aa',
    hun: 'en | sz| va| a |Ã©s |min|ek | Ã©s| mi|jog| jo|an |ind|nek|sze|sÃ¡g|nde|a v|den|oga|sza|val|ga |mÃ©l|ala|emÃ©|gy |n a|van|zem|ele| me|egy|Ã©ly| eg|zab|tÃ¡s| az|n s|bad|aba|ni |az |gye| el|ak | se|meg|sen|Ã©ny|sÃ©g|k j|yne|lyn| ne|ben|lam|tt |t a|et |agy|oz |hoz|vag|zet| te|n m|ez |nak|int|re |etÃ©|tet|mel|tel|s a|em |ely|let|hez| al|s s| ki|ete|atÃ¡|z a| le|yen|es |ra |tÃ©s|ell|nt |sem|t s|len|nem|a s|ese|nki|enk|a m|Ã¡sÃ¡|i m|ban|kin|k m|szt| Ã¡l|ame|kÃ¶z|k a|dsÃ¡|ads|lÃ³ | kÃ¶|Ã¡s |ly |on |Ã©be|tat|a t|n v|Ã¡ll|mÃ©n| vÃ©|nye|kÃ¼l|lÅ‘ |a n| cs|i Ã©|ok |Ã©sz|Ã©rt|lla|lap|Ã¡go|gok|nyi|tek| ke|nd |Ã©te|ami|zÃ©s|yes|szo|t m|a a|het|fel|lat|lem|lle|el |z e|s e|k Ã©|mbe|emb|elÃ©|ot |lis|vet|kor|Ã¡g |olg| am|szÃ¡|ehe|leh|ogo|ott|Ã¼l |nte|Ã©le|i v|ogy|hog| ho|kel|n k|tes|nlÅ‘|enl|ssÃ¡|Ã¡za|hÃ¡z|Ã©g |vel|Ã¡ba|lek|Ã©ge| ha|a h|rÃ©s| fe|Ã¡ny|del|elÅ‘|Ã¡t |alÃ¡|art|tar|zto|zÃ¡s|tÅ‘ |yil|koz|tko|alÃ³|s k|i e|Ã¡rs|tÃ¡r|mze|emz| ny|mÃ¡s|ett|ny |fej|ass|zas| hÃ¡|d a|t Ã©|is |Ã©sÃ©|ezÃ©|tÃ©b| mu|Ã¡so|sÃ­t|lye|elm|Ã©de|vÃ©d|ine|t k|os |it |izt|biz| bi|y a|m l|tot|a j|atk|nÃ©l|t n|ti | mÃ¡|ai |lÃ¡s|eve|nev|zte| bÃ¡|sel|ll |al |ere|n e|unk|mun|t e| ak|ife|kif|ako|s Ã©| Ã©r|Ã¡na| es|s t|got|sÃ¼l| be|vÃ¡l|csa|se |Ã©se|ad |ges|tos|ja | gy|asz|ten|lmÃ©| tÃ¡|eze|Ã¡rm|bÃ¡r|ess|l s|Ã¼le',
    azj: ' vÉ™|vÉ™ |É™r |ir | hÉ™| bi| hÃ¼| ol|Ã¼qu|hÃ¼q|quq|na |in |lar|hÉ™r|dÉ™ | ÅŸÉ™|bir|lÉ™r|lik|mal|r b|lma|r h| tÉ™|É™xs|ÅŸÉ™x|É™n |dir|uqu|una|an |ali|a m| ma|ikd|ini|r ÅŸ|dÉ™n|ar |ilÉ™|qun|aq |asÄ±| ya|mÉ™k|yÉ™t| mÉ™| mÃ¼|kdi|É™si|É™k |ilm|nin|ndÉ™|olm|É™ti|É™ y|sin|xs |nda|lmÉ™|yyÉ™|i v| qa| az|olu|iyy|ya |ind|zad|qla|Ã¼n |ni |lÉ™ |tin|n m|aza|arÄ±|É™t |n t|maq|lun|lÄ±q|É™ b|un |nun|q v|n h|dan|Ä±n | et|tmÉ™|É™rÉ™| Ã¶z|da |É™ v| on|É™ a|Ä±na|Ä±nÄ±|bil|a b|sÄ± |il |É™mi|ara|si | di|É™ m|É™ri|rlÉ™| va|É™ h|etm|Ä±ÄŸÄ±|ama|dlÄ±|adl|rin|bÉ™r|rÄ±n|n i|mÃ¼d|nÄ±n| he|mas|ik |n a|dil|alÄ±|irl|É™lÉ™|Ã¼da|sÄ±n|Ä±nd|xsi|li |É™ d|nÉ™ | bÉ™|É™ya| in|É™ i|lÉ™t| sÉ™|nÄ± | iÅŸ|anÄ±|eÃ§ |heÃ§|q h|eyn|É™ e|dÄ±r| da|asi|rÄ± |iÅŸ |ifa|lÄ±ÄŸ|i s|fiÉ™|afi|daf| ed|mÉ™z|u v|kil| ha|ola|n v|É™ni|Ä±r |uq |unm| bu| as|sia|osi|sos|ili|Ä±dÄ±|lÄ±d|nma|Ä±q |inÉ™|É™ra|sil|xil|axi|dax|adÉ™|man|a h|É™ o|onu|a q|É™z | ki|seÃ§| se|Ä± h|min|lan|É™dÉ™|bu |raq|lÄ± |Ä±lÄ±|al |É™ q|r v|nla|hsi|É™hs|tÉ™h|Ã¶z |ist| is|mÉ™s| É™s|ina|É™ t|É™tl|a v|iÉ™ |n b|tÉ™r| ta| cÉ™|edi|ala|kim|qu |i t|ulm|mÉ™h|n o|aya|Ä± o|ial| so|ill|siy| dÉ™|var|ins|mi |ÄŸÄ± |nik|r i|aql|k h|tÉ™m|tam|Ã§Ã¼n|Ã¼Ã§Ã¼| Ã¼Ã§|ÄŸÄ±n|sas|É™sa|z h|É™mÉ™|zam| za|sti|rÉ™f|n e|r a|ild|hÉ™m|Ä±ql|yan|may|n É™|mÉ™n|mil| mi|É™qi|din|n d|tÃ¼n| dÃ¶|miy|kah|ika| ni|fad|tif|l o|sÉ™r|yni| ey|ana|lÉ™n|am |ril|ayÉ™|aÅŸÄ±',
    ces: ' pr|nÃ­ | a | ne|prÃ¡|rÃ¡v|na |ost| po|ho | sv|o n| na|vo |neb|Ã¡vo|bo |ebo|nos|mÃ¡ | mÃ¡|aÅ¾d|kaÅ¾| ka| ro|ch |dÃ½ |Å¾dÃ½|ti |ou |a s| pÅ™| za|Ã¡nÃ­|Ã¡ p| je| v |svo|Ã©ho| st|Ã½ m|sti|nÄ› | by|obo|vob|ter|pro|enÃ­|bod| zÃ¡| sp|Ã­ a|rod|kte|by |mu |u p|o p| nÃ¡|vÃ¡n|jak| ja|a p|o v|Ã­ n|ovÃ¡|oli|vÃ­ |spo|roz| kt|mi |Ã­ p|ny | ma|Ã­m |i a|do | so|odn|Ã¡ro|nÃ¡r|li |nÃ© |tvÃ­|at |Ã½ch|a z| vy|byl|vol|en |Ã½t |bÃ½t| bÃ½|t s|tnÃ­|stn|o s|Ã­ b|to | do|svÃ©|vÃ© |ran|ejn|zÃ¡k|eho|jeh|nes|pÅ™Ã­|mÃ­ |Äin|kol|ajÃ­|sou| vÅ¡|Ã­ch|it |nÃ½m|Ã½m |nu |hra|nou|u s|Ã©mu| k |du |Å¾en|pod| ze|kla|a v|stv|pol|dnÃ­|erÃ©|m p|stÃ¡|je |ci |eÄn| ni|nÃ©h|a n|akÃ©|Ã¡va|maj|em |rov|Ã­ m|kÃ© |ole|nÃ½c|ova| ve|ako| ta|i k|chr|och| oc|kon|i p|Ã­ v|smÃ­|esm|kdo|st |i n|o z|ave|odu|bez| to|sta|ech|jÃ­ |o d|sob|se | se|Ã­ s|Ã½mi|i s| i |i v| vz|nÃ­m|pra|lnÄ›|pÅ™i|tÃ¡t|ste|a j|aby| ab| s |oln|a o|m n|Äen|slu|Å™Ã­s| os|zem|mez| Äi|lnÃ­|Ã¡ln|oci|jin| ji|y b|Ã­ z|y s|va |vÅ¡e|t v|ovn|chn|dÄ›l|nÃ­c|leÄ| pl|vat| vo|vin|rav|vou|lad|inn|Ã© v|anu|tej|u k|stu|est| tr|ky |ikd|nik|ivo|nit|zen|u o|nÃ©m|nez|iÃ¡l|Ã­ho|len|ens|oÅ¾e|oko|kÃ©h|rac|ven|Ã­ k|e s|lÃ¡n|Ä›lÃ¡|zdÄ›|vzd|t k|din|odi|tÃ­ | od|rÃ© |tup|pov|pln|Å¡tÄ›|Ã¡kl|nno|tak|erÃ¡|Å™ed|o a|a t|res|jÃ­c| mu|u z|rok| ob|Äno|u a|y k|i j|Ã© n|luÅ¡|Ã­sl|oso|ciÃ¡|soc|nÃ­h|o j|ckÃ©',
    run: 'ra |we |wa |e a| mu|a k|se | n | um| ku|ira|ash|tu |ntu|a i|mu |umu|mun|unt|ere|zwa|ege|ye |ora|teg|a n|a a|ing|ko | bi|sho|iri| ar| we|shi|aba|e n|ese|go |a m|o a|gu |uba|ngo|nga|hir| ca|ugu|obo|hob|za |ndi|ish|gih| at|ara|wes| kw|ger|ate|a b| ba| gu|e k|can|ama|ung|bor|u w|mwe|di | ab|nke|ke |kwi|ka |ank|yo |ezw|n u|na |iwe|e m|rez|ri |a g|gir| am|igi|e i|ro |a u|ngi|e b|ban| ak| in|ari|n i|hug|ihu|e u|riz|ang|nta| vy|ata| ub|and|aka|rwa| nt|kur|ta |iki|kan|iza|u b|ran|sha|o n|i n| ig|ivy| iv|ahi|bah|u n|ana| bu| as|aku|ga |uko|o u|ho | ka|ose|ubu|ako|guk|ite|o y|ba |i b|any|kir|o k|aho|iye|kub|amw|nye|aha| ng|o m|nya| it|re | im|o b|izw|kun|hin|e c|vyo|o i|vyi|ngu|uri|imi|imw|gin|ene|u m|zi |ha |kug|bur|uru|jwe| zi|u g|era|aga|ron|abi| y |e y| uk|gek|ani| gi|eye|ind|wo |u a|i a| ib|i i|ras|bat|gan|amb|n a|onk|rik|ne |ihe|agi|kor| ic|ze |tun|ibi|wub|nge|o z|tse|nka|he |rek|twa|gen|eko|mat|ber| ah|ni |ush|umw| bw|mak|bik|ury|yiw|bwo| nk|ma |no |kiz|uro|gis|aro|ika| ya|gus|y i|wir|ugi|uki| ki|a c|ryo|bir| ma| yi|iro|bwa|mur|eng|ukw|hat|tan|utu|wit|w i| mw|y a|mbe| ha|uza|ham|rah| is|irw|o v|umv|ura|eny|him|eka|bak|bun| ny|bo |yig|kuv|wab|key|eke|yer|vye|i y|ita|ya |a r| ko|kwa|o c',
    plt: 'ny |na |ana| ny|a n|sy |y f|a a|aha|ra | ma|nan|n n|any|y n|a m|y m|y a| fi|an |tra|han|ara| fa| am|ka | ts| na|in |ami| mi|a t|olo|min|man|iza|lon| iz|fan| ol| ha| sy|aka|a i|reh|ay |ian|tsy|ina| ar|on |o a|etr|het|ona|y o|o h|zan|y t|a h|ala| hi|a f|y h|ehe|ira|a s|zo |y i|ndr|jo | jo|n j| an| az|ran|dia| dr|y s|fah|ena|ire|tan|dre| zo|mba| ka|m p|afa| di|n d|and|azo|zy |amp|ia |ren|iny|rah|y z|ry |ika|oan|ao |amb|lal|ho | ho|isy|ony|tsa|asa|a d|ha |fia|mis|ava|ray| pi|am |dra| to|rin| ta|ant|eo |zay|rai|tsi|itr|sa | fo| ra|van|ova|nen|azy| vo|mpi|ari|o f|tok|a k| ir|kan|oto|mah|ly |sia| la|n i|voa|haf|a r|ito|y k|oka|y r|y l|ano|ita|ene|its|ial|zon|aza|ain| re| as|fot|aro|fit|nat|nin|aly|har| ko|ham| no|fa |ary|atr|ila|ata|iha|nam|kon|oko| sa|elo|nja|anj|ive|isa|oa |dy |y d|o m|nto|ank|o n|otr|pan|fir|air|sir|ty |a v|sam|o s|tov|mit|rak|reo|o t|pia|tao| ao|no |y v|iar|a e|a z|hit|hoa| it|to |za |ton|eha|end|vy |idi|tin|ati|adi|lna|aln|rov|ban| za|nga|hah|oni|osi|sos|vah|ino|ity| at|hia|pir|ifa|omb|ame|era|vel|kar|va |tso|jak|fid|ifi|ais|o i|idy|la |ama|ba | pa|tot|ani|rar|mpa|haz|kam| eo| il|iva|aho|nao|n k|ato|lah|ovy| te|dro|lan|ela| mo| si|fin|miv|san|koa| he|aso| mb|sak|kav',
    qug: 'ta | ka|ka |na |una|cha|ash|ari|a k|ana|pak|ish|ach|hka|shk|mi |kta|hay|man| ch|apa|ak |rin|ata|kun|har|akt|ita| ha|ami|lla| pa|ama|pas|shp| ma|tak|ayÃ±|yÃ±i|in |sh |ina|uku|nka|chi|aka|a c|yta|kuy|all|tap|a h|kan| tu|Ã±it|tuk| ru|run|chu|an |pay|ayt|ris| ki|aku|hpa|ank|a p|kam| sh|nam|a s|uy |i k|ayp|nak|pi |nta|a m| li|ay |lia|hin|kaw|nap|ant|tam|a t|iri|nat| wa|y r|kay|aws| ya|n t|ypa|wsa|pa |lak|shi|a a|lli|iku|hu |n k|iak|yay|kis| al|shu|a w|ipa| sa| il|api|kas|yku|yac|kat|a r|huk|i c|wan|hik|a i|ill|ush| ti|ayk|hpi| ku|kac|say|hun|uya|ila|ika|yuy|pir|ich|mac|ima|a y|yll|ayl|i p|kin|a l| wi|kus| yu|lan|tan|llu|kpi| ta| pi|aya|la |yan|awa| ni|kak|lat|rik|war|ull|kll|li |ink|nch|un |akp|n s|may| ay|uch|i s|nac|sha|iki|kik|h m|ukt|pip|tin|n p|iya|nal|aki| ri|ura|tik|mak|ypi|i m|i w|n m|his|k i|riy|iwa|y h| hu|han|akl|k t|mas|pik|kap| Ã±a|u t|nmi|nis|k a|i y|k l|kar| im|i i|wil|yma|aym|ksi|iks|uma| su|h k|has| ak|unk|huc|kir|anc|k m|pal|k k|ik |iÃ±i| iÃ±|ma |n y|mun| mu|mam|tac|a n|i t|k r|sam|ian|asi|k h|was|ywa|iyt|llp|san|sum|ray|si |pan|nki|tar| ii|u k|Ã±ik|uk |iÃ±a|kuk|wpa|awp|akk|a u|wat|uri| mi|yar|uyk|ayw|h c|ha |tay|rmi|arm|uta|las|yka|llk|kul|wiÃ±|ati|ska| ll|kit|n h|uti|kic|mat',
    mad: 'an |eng|ng |ban| sa| ka|dha|ren| se| ba|ak | ha|adh|hak| dh|ang|se | pa|aba|a s|na |aga|ha | or|n s|ore|ara| ag|gad|are|ana|n o|ngg|ale|gan|a k|ala|dhu|tab|sar|ota|asa|eba| ot| ke|sab|ba |wi |uwi|abb|i h|huw|aan|n k|a b|bba| ta| ma|pan|hal|bas|ako|dhi|ra |kab|em |beb|ka |lak|gi |lem|g a|eka|n b|ama|nga|san|at |ong|ran|nge|a o|ggu|sa |a d|ane|n p|ken|par|aja|man|gar|ata|nek|apa| na|agi|abe| ga|e e|sal|a a|tan|g s|al |kal|gen|ta |i s|aka|e a|a p|a e| la| pe|nan| an|era|e d| e | be|n a| al|ena|uy |guy|n n|ate| bi|mas|e k|kat|uan|oan|kon|k k|a m|i d|g e|n t|g k|ada|koa|lan|ela| da|bad|ma |ne |as |lab|ega| mo|ar |car|one|i p|bi |kaa|bat|ri |on |pon| so|e b|le |ah |abi|ase|adi|epa| ep|k h|and|pam|te |ok |ste|aon|om |oko|aha|ari|ona|asi|ter| di|di |pad|e s|sad|yar|neg|ton|set|rga|ost|mos|gap|nda|a l|har|i k|ina| a | ng|kom|isa|si |a t|a h| kl|jan|daj|iga|hig|idh|hid|ndh|n m|ngs|tto|ett|arg|la |k b|ler|k d|nna| to|nao|n d|mat| ca|tad|bis|aya|epo|aen| po|bin|nya|kas|k s|n h|sya|nta|gsa|en |ant|n g|kar|i e|das|e t|e p|iba| pr|g p| ho| el|i a|hi |os |sao|uwa|tes| ja|nag|nas|lae|sia|t s|k o|nto|int|yat|arn|m p|duw|adu|eta| ko|i b|ni |g n|kla|rak|ame|mpo|jua|sok|aso|ggi|eja|pel|jam|ele| et|dil',
    nya: 'ali|ndi|a m|a k| nd|wa |na | al|yen| ku|nth|ra |di |se |nse| mu|a n|thu|hu |nga| wa|la |mun|u a|unt|iye| ka|ce |ace| lo|a l|ang|e a| la| pa|liy|a u|ens| ma|idw|ons|dwa|e m|i n|ala|kha|lo |li |ira|era|ene|ga |ana|za |o m| mo|yo |o w| ci|we |dzi|ko |o l|and|dan|hal|zik|chi|oyo|pa |ner|ulu|ena|moy| um|a p| da|ape|kap|ka |iko| an|pen|a c|to |ito|hit|nch| nc|iri|lir|wac|umo|e k|lu |a a|aye| dz|kuk|a z|dwe|tha|mal| za|ing|ufu|mu |ro |ful| uf|o c|i d|lin|e l|zo |edw| zo|o a|mwa|u w|iro|o n|lan|amu|ere| mw|nzi|dza|alo|ri | li|fun|lid|gan|so | ca|kul|ofu|nso|o z|ulo|unz|o k|mul|lam|i c|san|a b|kwa| na|a d| a |una|u k|i l|nkh|ant|aku|ca |cit|oli|ipo|dip|ama|lac|wir|han|yan|osa|uli|tsa|i m|pon|kup|u d|ti |gwi|ukh|ung|hun|lon|ank|nda|iki|ina| ko|ao |diz|phu|ati|oma|i a|tsi|pat|iya|siy|kut| ya|zid|eze|ma |i k|mer|ome|mol|u n|u o|aph|ogw|izo|mba|sid|ku |sam|awi|adz| ad|izi|ula|say|e n|khu| kh|rez|vom|bvo|okh|lok|win|akh|o o| am| on|zir|map| zi|eza|ja |go |ngo|ika|its|ats|osi|gwe| co|isa|ya |haw|ani|o p|zi |ndu|kho|ezo|kir|uni|i u| ay|lal|gal|sa |bom| bo|ola|amb|wak|ha |ba |nja|anj|ban| ba|iza| bu|udz|ngw|bun|oye|o d|nal|kus|i p|i o|i y|wi | nt|e p| si|aka|ne |men|jir|nji|sed|ets|end|eka|uma|du ',
    zyb: 'bou|iz |aeu|enz|eng|uz | bo|ih |oux|nz | di|ing|z g|ux |uq |dih|ngh| ca|ng |gen|ung|z c| mi|miz|ij |cae|z d| gi| de| ge|euq|you| ci|ngz|ouj|aen|uj | yi|ien|gya| gu|ngj|mbo| mb|zli|dae|gij|cin|ang|j d|nae| se| ba|z y|euz| cu|de |x m|oz |j g|ouz|x b|li |z b|h g| da| yo|nj |xna|oxn|rox| ro|h c|nzl|vei|yau|wz |z m|ix | si|i c|iq |gh |j b| cw|nda|yin| hi| nd|dan|vun|inh| ga|can|ei |cun|yie|q g|hoz|bau| li| gy|wyo|cwy|z h|gue|gz |gun|faz|unz|yen|uh |den|ciz| go|q c|gj | bi|ej |aej| fa|hin|zci| wn|j n|goz|gai|au |z s|q d| vu|h m|gva|hu |auj|ouq|az |h d|ya |uek|ci |nh |u d|ou |sou|jso|gjs|din|awz|enj| do|h s|eve|sev|z r|nq |sin|nhy|g g|g b|liz|kgy|ekg|sen|eix|wng|lij|ngq|bin|i d|ghc| ha|bae|hix|h y|j c|ghg|i b|ouh|en |n d|h f|j s|z v|j y|law|hci|anh|inz|q y|nei|anj|ozc|ez |enh|q s|aiq|uen|zsi|zda|hye|ujc|e c|siz|eiz|anz|g y|i g|q n|bie| ne| ae|giz|u c|hgy|g d|gda|ngd|cou| la|z l|auy|ai |in |iuz|zdi|jhu|ujh|yuz| du|j m| fu|cuz|eiq|g c|gzd| co|uyu|coz|zbi|biu| dw|i s|i n|aw |dun|yun|izy|daw| he|nho| ho|enq|x l|cie|q b|cij|uzl|x d|iuj|awj| ya|eij|dei|nde|sae|izc|wnq|wnh|sei|h b|aih|gzs|bwn|a d|u g|ngg|jca|e b|ran| ra|hcu| me|iet|van| bu|guh|hen|si |wnj| ve|u b|azl|inj|gak|gan|ozg|siu|yaw|i m',
    kin: 'ra | ku|se | mu|a k|ntu|tu |nga|umu|ye | um|unt|mun|e n| gu|we |ira|a n| n |wa |ere|mu |ko |gom|a b|e a| ab|li |e k|mba|a a|e b|aba|ga |e u|ba |omb|o k| ba|a u|ose|u b|o a| cy|ash|eng| ag|kwi| bu|za |gih|ren|ndi| ub|ang|yo |aka|gu |igi| ib|a g|a m| nt|uli|o b|ama|ihu|e i|nta| ak|ago|ro |ora| ka|ugu|hug|di |iye|ban| am|cya|ku |ta | bw|and|sha|re | ig|gan|ubu|na | kw|obo| by| bi|a i|yan|ka |sho|kub|era|ese| we|kan|aga|hob|bor|ana|byo|ura|uru|ibi|rwa|wes|u w|no |uko|i m|mo |u a|ure|ili|uba|o n|uha|uga|n a| im|ish|bwa|bwo|wiy|ali|ber|ze |ne |ush|are|o i|u m|ger|bur|ran| ki| no|ane|bye| y |ege|teg|guh| uk|n i|rag|i a|ya |u g|e m|anz|bo |abo|gar|wo |y i|ho |age|ind|o m|eke|a s|ara|zir|ite|kug|kim|aci| as|u n|ani|kir|mbe| gi|yos|kur|ugo|gir|e c|iza|aho|i b|tur|ata|o u| se|u u|zo |i i|aha|nge|mwe|iro|akw|any|eza|uki|imi|o y|ate|u k|iki|atu|bat| in|go |tan|n u|bos| bo| na|hak|iby| at|ihe|ung|ha |bul|kar|eye|eko|gek|nya|o g|shy|e y|awe|ngo|bit|mul|nzi|rer|bag|ge |imw|bah|cir|gac|bak|je |gez|imu|eze|tse|ets|mat| ru|irw|he | ni| ur| yi|ako|ngi| ng|i n|rez|ubi|gus|fit|afi|ugi|uka|amb|o c|utu|ufa|ruk|mug|bas|bis|uku|hin|e g|ige|amo|ing| af|yem|ni | ry|a r|gaz|te |erw|bwe|ubw|hwa|iko| al|ant|zi ',
    zul: 'nge|oku| ng|a n|lo |ung|nga|la |le | no|elo|lun| um|e n|wa |we |gel|e u|ele|nel|thi|ke |nom|ezi|ma |ntu|oma|hi |o n|ngo|tu |nke|onk|o l|uth|ni |a u|lek|unt| wo|o e| lo|mun|umu|pha| ku|ang|ho |kwe|ulu| ne|won|une|lul|elu| un|a i|gok|kul|ath|hla|lok|khe|eni|tho|ela|zwe|akh|kel|a k|enz|ana|ban|aka|u u|ing|ule|elw|kho|uku|ala|lwa|gen| uk|wen|ama|na |e k|ko |gan|a e|he |zin|enk|o y| ez|kat| kw|lan|eth|het|o o| ok|okw|i n|nzi|aba|e a|hak|lel|lwe|eko|ane|ka |so |yo |ayo|o a|uhl|nku|nye| na|thu|mph|do |ben|ise|kut|ike|kun| is| im|hol|obu|fan|i k|e w|nhl|nok|ini|and|kuh|ukh|kuk| ak|e i|isi|aph|zi |ile|eki|ekh| ba|eka|the|a a| le| ye|kwa|e e|fut| fu|za |mal| ab|ebe|isa| em|o w|kub|mth|i w|ndl|emp|any|olo|ga | ko|nen|nis|alu|ith|eli|ndo|seb|nda| ya|i i|eke|vik|ake|uba|abe|ezw|yok|ba |ale|zo |olu|ume|ye |esi|kil|khu|yen|emi|nez|hlo|a l|ase|ula|kek|a o|iph|o u|no |azw|kan|mel|uny|ne |ufa|ahl|lin|hul|ant|und|sa |enh|kus|kuv|lak| in|o i|din|kom|amb|zis|ind|ola|uph|wez|eng|yez|phe|phi|mba|nya|han|kuf|nem|isw|ani|iyo| iy|fun| yo|uvi|i a|ene|izi| el|cal|i e|eze|ano|nay|hwe|kup|lal|uyo|ubu|kol|oko|ulo| la|e l|tha|nan|mfu|hon|nza|hin| ey|omp|da |bo |ilu|wak|lon|iso|kug|nka|ink|i l|sek|eku| ek|thw|gez',
    swe: 'ar |er |tt |ch |och| oc|ing|Ã¤tt|ill|rÃ¤t|en | ti|til|fÃ¶r|ll | rÃ¤|nde| fÃ¶|var|et |and| en|ell| ha|om |het|lle|lig|de |nin| de|ng | in| fr|as |ler| el|gen|nva|und|att|env|r h| i |r r|ska|fri| so|har|der| at|Ã¶r |ter|all|t t| ut|den|ka |lla|som|av |sam|ghe|ga | sk| vi| av|ete|la |ens|t a| si|r s|iga|igh|tig| va|ig |a s| st|ion|ra |tti|a o| Ã¤r|ten|ns |t e|na | be|han| un| an| sa|a f| la| gr| mÃ¥|nge|n s|vis|lan|mÃ¥ |ati|nat| Ã¥t|an |nna| li| al|t f|ans|nsk|sni|gru|Ã¤ll|tio|ad | me|isk|kli|s f|t i|stÃ¤|t s|ri |med|sta|h r|lik|da |dig|ta |r o|run|on | re|lag|tta|Ã¤r |kap|a i|a r|Ã¤nd|erv|n e|kte|n f|rvi|nom|itt|id | mo|sky|r e|ver|Ã¤ns|vil|gt |igt| na|tan|uta|dra|t o|ro |isn| fa|kal|ihe|rih|erk|r u|e s|per|l v|vid|one|rel|ber|ran|ot |mot|ndl|d f|ed |ika|mÃ¤n|l s|bet|t b|dd |ydd|kyd|n o|s s|str|n m|tet|sin|r f| om|rna|int|r i|end|nad|l a|ap |ers|nda|t v|ent|rbe|arb| hÃ¤|ets|hÃ¤l|amh|ckl|gar|nga|r m|je |rje|arj|n i|s e|lin|r t|i s|rÃ¤n| pe|ilk|t l|ern|pÃ¥ | pÃ¥|tÃ¤l|d e|dom|ege|g e|tni|r a|lit|ras| sÃ¥|lln|kil|ski|enn|i o|a d|erÃ¤|n a|ara| ge|Ã¤ro|a m| ar|t d|ilj|els|yck| ve|g o|frÃ¥|nas|tra|ess|del|m s|liv|l l|in |v s|g a|ast|e e|val|son|rso|e t|age|nd | eg|ial|cia|oci|soc|upp|igi|eli|g s|rkl|gad|ndr|nte|Ã¶ra',
    lin: 'na | na| ya|ya |a m| mo|to | ko|li |a b| li|o n| bo|i n|a y|a n|ki |a l|kok|la | ma|zal|i y|oki| pe|ngo|ali|pe |so |nso|oto|ons| ba|ala|mot|a k|eng|nyo|eko|o e|nge|yon| ny|kol|lik|iko|a e|o y|ang|ye | ye|oko|ma |o a|go | ek|ko |e m|aza|te |olo|sal|ama|si | az|mak|e b|lo | te|ta |isa|ako|amb|sen|ong|e n|ela|oyo|i k|ani| es|o m|ni |osa| to|ban|bat|a t|mba|ing|yo | oy|eli|a p|mbo|o p|mi | mi| nd|ba |i m|bok|i p|isi|mok|lis|nga|ge |nde|koz|bo |gel|ato|o t|mos|aka|oba|ese|lam|kop| ez|lon|den|omb|o b|ota|sa |ga |e a|e y|eza|kos|lin|esa|e e|kob|e k|sam|kot|kan|bot|ika|ngi|kam|ka | po|gom|oli|ope|yan|elo| lo|ata| el|bon|oka|po |bik|ate| bi|a s|i t|i b|omi|pes|wa | se|oza|lok|bom|oke|som|zwa|mis|i e|bek|iki| at|ola|ti |ozw|lib|o l|osu|oso|e t|nda|ase|ele|kel|omo|bos|su |usu|sus|bal|i l|ami|o o|bak| nz|pon|tel|mob|mu | ep|nza|asi|mbi|ati|kat|le |gi |ana|oti|ndi|tan|a o|wan|obe|kum|nya|mab|bis|nis|opo|tal|mat| ka|bol|and|aye|baz|u y|eta| ta|ne |ene|emb|sem|e l|gis|ben| ak| en|mal|obo|gob|ike|se |ibo|â€™te| â€™t|umb| so|mik|oku|be |mbe|bi |i a|eni|i o| mb|tey|san| et|abo|ebe|geb|eba|yeb|bu | as|ote|sik|ema|eya|ibe|mib|ai |pai|mwa|kes|da |may|boz|amu|a a|kom|mel|ona|ebi|ia |ina|tin| ti|bwa|sol|son',
    som: ' ka|ka |ay |uu |an |yo |oo |aan|aha| wa|da | qo| in| u |sha| xa|a i|ada|iyo| iy|ma |ama| ah| la|qof|aa |hay|ga |a a|a w|ah | dh|a s| da|in |xaq| oo|a d|aad|yah|eey| le|isa|lee|u l|q u|aq | si|taa|eya|ast|la |of |iya|sa |y i|u x|sta|kas|xuu|uxu|wux| wu|iis|nuu|inu|ro | am| ma|a q|wax|dha|ala|kal|nay|f k|a k|le |ku | ku| sh|o i|a l|ta |maa|a u|dii|loo| lo|o a|ale|ara|ana|iga|o d| uu|ha |lo |o m|o x|doo|aro|kar|yaa|gu |si |ima|na | xo| fa|adk|do |a x|ad |aas| qa| so|a o| ba|lag| aa| he|dka|adi|soo|o k|aqa| is|ash|u d|had| ga|eed|san|u k|a m|iin|i k| ca|u s|n l|yad|rka|axa|elo|hel|aga|hii|o h|o q| ha|id |n k| mi|baa| xu|har|xor|aar|ax |mad|add|nta|mid|aal|waa|haa|ina|qaa|daa|agu|ark|o w|nka|u h|dad|ihi| bu| ho|naa|n a|ays|haq|a h|o l| gu|o s|aya|saa|lka| ee| sa|dda|ab |nim|quu|gga|ank|kii|rci|arc|n s|a g| ji|gel| ge|eli|ysa|a f|siy|int|laa|uuq|uqu|xuq| mu|i a|uur|mar|ra |iri|o u| ci|riy|ya |ado|alk|dal|ee |al |rri|ayn|asa| di|ooc|aam|ofk|oon|to |ayo|dar| xi|dhi|jee|a c| ay|yih|a j|ban|caa|lad|sho|d k|ida|uqd|agg|sag|ras|bar|ar | ko| ra|o f|gaa|gal|fal|u a| de| ya|o c|ii |xay|eel|aab|sig|aba|orr|hoo|u q|y d|ed |ho |sad|qda|h q|fka|n i|xag|n x|qay|lsh|uls|bul|u w|jin| do|raa| ug|ido|ood',
    hms: 'ang|gd |ngd|ib | na|nan|ex | ji|eb |id |d n|b n|ud | li|nl |ad | le|jid|leb|l l| ga|ot | me|x n|anl|aot|mex|d g|b l|d d|ob |gs |ngs|jan| ne|ul | ni|nja| nj|lib|ong|nd | zh|jex| je|b j| sh|ngb| gh|gb | gu|gao|l n|han| ad|gan| da|t n| wu|il |x g|nb |b m| nh|she|is |l j|d l|nha|l g|d j|b g|el |end|wud|nex|gho|d s|d z|oul|hob|ub |nis| ch| ya|it |b y|eib| gi|s g|lie| yo| zi|oud|s j|d b|nx | de|es |d y| hu|uel|gue|ies|aob|you| ba|d m|chu|gia|dao|b d|s n|zib| go|zha|eit|hei|al |hud| do|nt |ol | fa|t g|hen|ut |gx |ngx|ab |fal|x j|b z|ian|d h|don|b w|t j|iad|nen| xi|gou|d c|b h|hao|x z|nib|anx|ant|gua| mi|s z|dan|ox |inl|hib|lil|uan|and| xa|b x| se|x m|uib|hui|d x|anb|enl| we|od |enb| du|at |ix |s m|bao| ho|hub| ng|zhi|jil|l s|yad|t m|t l|yan| ze| ju|heb|had|os |aos|t h|l d|nga| he|b a|xan|b s|sen|xin|dud|jul|d a|lou| lo|dei|d w| bi|b c| di|zhe|gt |ngt|x l|bad|x b| ja|hon|zho|blo| bl|d k| ma|deb|l z|wei| yi| qi|b b|x d|d p|eud| ge|x a|can| ca|t w|lol| si|hol|s w|aod|pao| pa|ren| re|x s|eut|pud| pu|aox|mis|gl |ngl|x w|zei|gon|enx|gha|s a|b f|l y|oub|eab|hea| to|did| ko|unb|ghu|t p|x c|geu|t s|x x|jao|ed |t c|l m|l h|jib|ax |l c|d f|nia| pi|eul|d r| no|min|l t|heu|ux |tou|ns |s y|iel|s l|hun',
    hnj: 'it | zh| ni|ab |at |ang| sh|nit| do|uat|os |ax |ox |ol |nx |ob | nd|t d|zhi|nf |x n|if |uax| mu|d n|tab| ta| cu|mua|cua|as |ad |ef |uf |id |dos|gd |ngd|hit|ib |us |enx|f n|she|s d|t l|nb |ux |x z|ed |inf|b n|l n|t n|aob|b z| lo|ong|ix |dol| go|zhe|f g| ho| yi|t z|d z|b d| le|euf|d s|ut |yao| yo| zi|gb |ngb|ndo|enb|len| dr|zha|uab|dro|hox| ge|nen| ne|han| ja|das|x d|x c|x j|f z|shi|f h|il | da|oux|nda|s n|nd |s z|b g| ny|heu| de|gf |ngf| du|od |gox| na|uad| gu|inx|b c| ya|uef| xa| ji|ous| ua| hu|xan|hen|zhu|nil|jai|rou|t g|f d| la|enf|ged|ik | bu|nya|you|f y|lob|af |bua|uk |is |yin|out|of |l m|ud |hua| qi|ot |t s| ba|ait| kh|s s|nad| di|aib|x l|lol| id|dou|ex |aod|bao| re| ga|d d|b y|las|hed|b h|b s|f b|t y|jua| ju| dl|x s|hue|b l| xi|zif|dus|b b|x g|hif|x y|hai| nz|sha| li|x t| be|d j|und|hun|ren|d y|hef|xin| ib|b t|l d|aos|s l| ha|gai|nzh|gx |ngx| ao|s b|s x|el |gt |ngt|hik|aid|s t|x m|f l|f t| pi|aof|t r|eb | gh|s y|d l|gua| bi| za| fu|t h| zu|hou|deu|lb | lb|d g| mo|b k| bo|iao|ros|gon|eut|x h|al |uaf|hab|t t|k n|f x|hix|pin|yua| no|t b|ak | zo|s m| nb| we|d b|gha|f s|mol|euk|dax|l b|nof| ko|lou|guk|end|uas|t k|dis|dan|yol|uan|d t|x b|lan|t m| ch|jix|x x| hl|aox|zis|x i|et | ro',
    ilo: 'ti |iti|an |nga|ga | ng| it| pa|en | ma| ka| a | ke| ti|ana|pan|ken|ang|a n|agi|a k|n a|gan|a m|a a|lin|ali|aya|man|int|teg|n t|i p|nte| na|awa|a p|na |kal|ng |dag|git|ega|sa |da |add|way|n i|n n|no |ysa|al |dda|n k|ada|aba|nag|nna|ngg|eys| me|a i|i a|mey|ann|pag|wen|i k|gal|gga| tu|enn| da| sa|nno| we|ung| ad|tun|mai| ba|l m| ag|ya |i s|i n|yan|nan|ata|nak| si|aka|kad|aan|kas|asa|wan|ami|aki|ay |li |i m|apa|yaw|a t|mak| an|i t|g k|a s|ina|eng|ala|ika|ama|ong|ara|ili|dad| aw|gpa|nai|et |yon|ani|aik|on |at |oma|sin|bal|ipa|n d|uma|g i|ket|ag |in |aen|n p|ram|sab|aga|nom|ino|lya|ily|syo|i b| ki|nia|agp|gim|kab|asi|kin|iam|ags|bab|oy |toy|n m|agt| ta|bag|sia|g a|gil|mil| um|o p|ngi|n w|i i|pad|pap|daa|iwa|naa|eg |ias|ed |nat|bae|o k|saa|san|pam|gsa|ta |kit|ma |dum|yto|tan|i e|t n|uka|t k|apu|lan|sta|sal| li|a b|ari|g n|den|mid|ad |o i|y a|ida|ar |aar|y n|dey| de| wa|a d|ak |bia|ao |tao|min|asy|mon|imo| gi|maa|sap|abi|i u|aib|kni|i l|gin|ged|o a| ar|kap|pul|eyt|abs|ibi| am|akn|i g|kip|isu|g t|bas|nay|ing|i d|kar|ban|iba|nib|t i|as |d n|y i|ura|a w|nal|aad|i w|lak|adu|kai|bsa|duk|edu| ed|may|agb|agk|tra|gge|sol|aso|agr|ngs|ian|ila|dde|edd|tal|aip|kua|umi|pay|sas|ita|pak|g d|ulo|inn|aw '
  },
  Cyrillic: {
    rus: ' Ð¿Ñ€| Ð¸ |Ñ€Ð°Ð²| Ð½Ð°|Ð¿Ñ€Ð°|ÑÑ‚Ð²|Ð³Ð¾ |ÐµÐ½Ð¸|Ð²Ð¾ |Ð¾Ð²Ðµ| ÐºÐ°|Ð½Ð° |Ñ‚ÑŒ | Ð¿Ð¾|Ð¸Ñ |Ð¾ Ð½| Ð¾Ð±|ÐµÑ‚ | Ð² |ÑÐ²Ð¾| ÑÐ²|Ð°Ð²Ð¾|Ð°Ð½Ð¸|Ð¾ÑÑ‚|Ð¾Ð³Ð¾|Ñ‹Ð¹ |Ð°Ð¶Ð´|Ð»Ð¾Ð²|Ñ‚ Ð¿| Ð¸Ð¼|Ð½Ð¸Ñ| Ñ‡Ðµ| ÑÐ¾|ÐµÐ»Ð¾|Ð¸Ð¼Ðµ| Ð½Ðµ|Ð»ÑŒÐ½|Ð»Ð¸ |Ñ‡ÐµÐ»|ÐºÐ°Ð¶|ÐµÑÑ‚|Ð²ÐµÐº|Ð°Ñ‚ÑŒ|Ð¾Ð²Ð°|Ð¸Ð»Ð¸| Ñ€Ð°|ÐµÐº |Ð¹ Ñ‡|Ð´Ñ‹Ð¹|Ð¶Ð´Ñ‹| Ð´Ð¾|Ð¸Ðµ |ÐµÐµÑ‚|Ð¼ÐµÐµ|Ð½Ð¾ | Ð¸Ð»|Ð¸Ð¸ |ÑÑ |ÐµÐ³Ð¾|Ð¾Ð±Ð¾|Ð¸ Ð¿|Ð½Ð¸Ðµ|Ðº Ð¸| Ð±Ñ‹|Ð¸ Ñ|Ð¸ Ð¸|Ð¼Ð¸ |Ð±Ð¾Ð´|Ð²Ð¾Ð±|Ð²Ð°Ð½| Ð·Ð°|Ð¾Ð¹ |Ñ‹Ñ… |Ð¾Ð¼ |Ð»ÐµÐ½|Ð°Ñ†Ð¸|ÐµÐ½Ð½|Ð¾ Ñ|Ð¾ Ð¿|ÑŒÐ½Ð¾|Ñ‚Ð²Ð°|Ñ‚Ð²Ð¾|Ð¿Ñ€Ð¸|Ð½Ð¾Ð³|Ð°Ð»ÑŒ|Ð°ÐºÐ¾|Ð²Ð° |Ð¸ Ð½|ÑÑ‚Ð¸|Ð½Ñ‹Ñ…|Ñ‚Ð¾ |Ð±Ñ€Ð°|Ð¾Ð»Ð¶|Ð´Ð¾Ð»|ÑÑ‚Ð¾|Ð¸ Ð²|Ð½Ñ‹Ð¼|Ð¾Ðµ | ÐµÐ³|Ð½Ð¾Ð²|Ð¸Ñ… |ÐµÐ»ÑŒ|Ñ‚ÐµÐ»|Ñ‚Ð¸ |Ð½Ð¾Ñ|Ð½Ðµ |Ð¿Ð¾Ð»|Ñ€Ð°Ð·| Ð²Ñ|Ð¸ Ð¾| Ð»Ð¸|Ð¸ Ñ€|Ñ‹Ñ‚ÑŒ|Ð±Ñ‹Ñ‚|Ð²Ð»Ðµ|Ñ€ÐµÐ´|Ð¸ÑŽ |Ñ‚Ð¾Ñ€| Ð¾Ñ|ÑŒÑÑ|Ñ‚ÑŒÑ|Ð¾Ð´Ð¸|Ñ‰ÐµÑ|Ñ Ð¸|ÐºÐ°Ðº|Ð¿Ñ€Ð¾|Ð¶ÐµÐ½|Ñ‹Ð¼ |Ð¿Ñ€Ðµ|Ð° Ñ|ÑÐ½Ð¾|Ðµ Ð´|Ð½Ð½Ð¾|Ð¾ Ð¸|Ð¸Ð¹ | ÐºÐ¾|Ð¾ Ð²| Ð½Ð¸| Ð´Ðµ|ÑÑ‚Ñƒ|Ð»Ð¶Ð½|ÑÐ¾Ð²|Ðµ Ð²|Ð½Ð¾Ð¼|Ð¾Ð»ÑŒ|Ñ€Ð°Ð½|Ð¾Ð¶Ðµ|Ð¸Ñ‡Ðµ|ÐµÐ¹ |Ð°ÑÑ‚|Ð½Ð½Ñ‹| Ð¾Ñ‚|Ñ‚ÑƒÐ¿|Ð¼ Ð¸|Ð¾Ð´Ð½|Ð·Ð¾Ð²|Ñ€ÐµÑ| Ð¼Ð¾|Ð¾ÑÑƒ|Ð»Ñ |Ð¾ÑÐ½|Ð° Ð¾|Ð²ÐµÐ½| Ñ‚Ð¾|Ð¾ Ð±|ÑˆÐµÐ½|Ñ‚Ð²Ðµ|Ð¾Ð±Ñ‰|Ð° Ð¸|Ðµ Ð¼|ÑŒÐ½Ñ‹|Ð¾Ð±Ñ€|Ð²ÐµÑ€|Ñ‡ÐµÐ½|Ñ Ð½|Ð¶Ð½Ð¾|Ñ‡ÐµÑ|Ð°Ðº |Ð»Ð¸Ñ‡|Ð½Ð¸Ð¸|Ðµ Ð¸|Ð²ÑÐµ|Ð±Ñ‰Ðµ|Ð²Ð°Ñ‚|ÐµÑÐ¿|Ð¼Ð¾Ð¶|Ð¹ Ð¸|Ð½Ð¾Ðµ|Ð¾ Ð´|Ð±ÐµÑ| Ð²Ð¾|Ñ Ð²|Ð´Ñƒ | ÑÑ‚|Ð´Ð½Ð¾|Ð¾Ð½Ð°|Ð½Ð°Ñ†|Ð´ÐµÐ½|ÐµÐ¶Ð´|Ñ… Ð¸| Ð±Ðµ|Ð¸ Ð´|Ð½Ñ‹ |Ð´Ð¾Ñ|Ð´Ð»Ñ| Ð´Ð»| Ñ‚Ð°|Ð»ÑŒÑ|Ð°Ñ‚Ðµ|Ñ†Ð¸Ð¸|Ñ Ð¿|ÑƒÑŽ |Ð¸Ñ‚Ðµ|Ðµ Ð¾|Ð½Ð¾Ð¹|Ð¿Ð¾Ð´|Ð¾Ñ‚Ð¾|ÑÑ‚Ñ€|ÑÑ‚Ð°| Ð¼Ðµ|ÐµÐ»Ð¸| Ñ€Ðµ|Ñ Ðº|Ñ‚Ð¾Ñ|Ð°Ð¼Ð¸|ÐµÐ½ |ÑŒ Ð²|ÑŽ Ð¸|Ð°Ð·Ð¾|Ð³Ð¾Ñ|Ð¼ Ð¿|ÑŒ Ð¿|Ñ‚ Ð±|Ð¶ÐµÑ‚|ÑƒÑ‡Ð°|ÑÑƒÐ´|ÑŒÑÑ‚|Ð´ÑÑ‚|Ñ‰Ð¸Ñ‚|Ð°Ñ‰Ð¸|Ð·Ð°Ñ‰|ÐºÐ¾Ð½|Ð½Ð¸ÑŽ|Ð°Ð¼ |Ð¾Ð´Ñƒ|ÐµÑ€Ðµ|Ð³Ñ€Ð°|Ð¿ÐµÑ‡|Ð¾ Ð¾|Ð¾Ñ€Ð¾|ÐºÐ¾Ñ‚|Ð¸ Ðº|Ñ‚Ñ€Ð°|Ð½Ð¸Ðº|ÑƒÑ‰Ðµ|Ñ†Ð¸Ð°|Ð¾Ñ†Ð¸|ÑÐ¾Ñ†|Ð½Ð°Ð»|ÐµÑÐº|Ð¾ Ñ€|ÐºÐ¾Ð³|Ð´Ñ€Ñƒ| Ð´Ñ€|Ð½Ð¸ |Ð°Ð²Ð°|Ð½ÑÑ‚|ÐµÐ¼ |Ð°Ð²Ð½|Ñ‹Ð¼Ð¸|ÐµÐ´Ñ|Ð´Ð¸Ð½|Ð´Ð¾Ð²| Ð³Ð¾| Ð²Ñ‹|Ð² Ðº|Ñ‹Ðµ |Ð¾Ð±Ðµ|Ð¼Ñƒ |Ñ Ðµ|ÑÐ»Ñƒ|ÑƒÐ´Ð°|Ñ‚Ð°Ðº|ÐºÐ¾Ð¹|Ñ‚Ñƒ |Ð¸Ñ‚Ñƒ|Ð·Ð°Ðº|Ñ…Ð¾Ð´|Ð²Ð¾Ð»|Ñ€Ð°Ð±|ÐºÑ‚Ð¾|Ð¸ÐºÑ‚|Ð¸Ñ‡Ð½|Ð½Ð¸Ñ‡|Ð¾Ñ‚ |Ð¸Ð½Ð°| Ðº |Ñ‚ÐµÑ€|Ñ€Ð¾Ð´|Ð½Ð°Ñ€',
    ukr: 'Ð½Ð° | Ð¿Ñ€|Ð¿Ñ€Ð°| Ñ– |Ñ€Ð°Ð²| Ð½Ð°| Ð¿Ð¾|Ð½Ñ |Ð½Ð½Ñ| Ð·Ð°|Ð¾Ð³Ð¾|Ñ‚Ð¸ |Ð²Ð¾ |Ð³Ð¾ | ÐºÐ¾|Ð°Ð²Ð¾| Ð¼Ð°|Ð»ÑŽÐ´|Ð¾ Ð½| Ð½Ðµ| Ð»ÑŽ|ÑŽÐ´Ð¸|Ð¾Ð¶Ð½|ÐºÐ¾Ð¶|Ð»ÑŒÐ½|Ð¶Ð½Ð°|Ð´Ð¸Ð½|Ð°Ñ‚Ð¸|Ð°Ñ” |Ð¸Ñ… |Ð¸Ð½Ð°|Ð¿Ð¾Ð²|ÑÐ²Ð¾| ÑÐ²|Ð°Ð½Ð½|Ñ” Ð¿|Ð¼Ð°Ñ”|Ð°Ð±Ð¾|Ð° Ð»| Ð±Ñƒ|Ð½Ðµ |ÐµÐ½Ð½|Ð±Ð¾ | Ð°Ð±|Ð° Ð¼|Ð¾Ð²Ð¸|Ð½Ñ– | Ð²Ð¸| Ð¾Ñ|Ð°Ñ†Ñ–|Ð²Ð¸Ð½| Ñ‚Ð°|Ð±ÐµÐ·|Ð¾Ð±Ð¾| Ð²Ñ–| ÑÐº|ÐµÑ€Ðµ| Ð´Ð¾|Ñ– Ð¿|ÑƒÐ²Ð°|Ð¾ Ð¿|Ð°Ð»ÑŒ|Ð½Ð¸Ñ…|Ð¾Ð¼ |Ð¼Ð¸ |Ñ–Ð»ÑŒ|Ð½Ð¾Ð³|Ñ‚Ð° |Ð¸Ð¹ |Ð¿Ñ€Ð¸|Ð¾ÑŽ |Ñ‚ÑŒ |ÑÑ‚Ð°| Ð¾Ð±|Ð²Ð°Ð½|Ð¸Ð½Ð½|Ñ‚Ñ– |Ð¾ÑÑ‚| Ñƒ |ÑÑ |Ð²Ð°Ñ‚|Ð±ÑƒÑ‚|Ð¸ÑÑ‚| Ð¼Ð¾|ÐµÐ·Ð¿|ÑƒÑ‚Ð¸|Ð½Ð¾Ð²|Ð¿ÐµÑ€|Ñ–Ñ— |Ð¸ Ð¿|Ð±Ð¾Ð´|Ð²Ð¾Ð±|ÑÑ‚Ð²| Ð² |Ð¾ Ð²|Ð²Ñ–Ð´| Ð±Ðµ|Ð°ÐºÐ¾|Ð¿Ñ–Ð´|Ñ‚Ð¸Ñ|ÐºÐ¾Ð½|Ð½Ð¾ |Ð²Ð° |Ð½Ð½Ñ–|Ñ– Ñ|Ð° Ð¿|ÑÑ‚Ñ–| ÑÐ¿|Ð½Ð¸Ð¹|Ð´Ñƒ |ÑŒÐ½Ð¾|Ð¾Ð½Ð°| Ñ–Ð½|Ð´Ð½Ð¾|Ð½Ð¸Ð¼|Ñ–Ð¹ |Ð° Ð·|Ð½Ñƒ |Ð¼Ð¾Ð¶|Ñ—Ñ— | Ñ—Ñ—|Ð»Ñ |ÑÐ¾Ð±|Ð¼Ñƒ |Ð¾Ñ— |ÑÐºÐ¾| Ð¿Ðµ| Ñ€Ð°|Ñ–Ð´ | Ð´Ðµ|Ñ– Ð²|Ð¸ Ñ–|Ñ‡Ð¸Ð½|Ð²Ð½Ð¾|Ð¾Ð¼Ñƒ|Ð½Ð¾Ð¼|Ñƒ Ð¿|Ñ– Ð½|Ð° Ñ| ÑÑƒ|Ð° Ð¾|Ð½ÐµÐ½|Ð¸ÑÑ|Ð¾Ð²Ð¾|Ð½Ð°Ð½|Ð¾Ð´Ð½|Ñƒ Ð²|Ñ– Ð´|Ð°Ð²Ð°|Ñ–Ð´Ð½|Ñ€Ñ–Ð²| Ñ€Ñ–|Ñ– Ñ€|Ð¸Ð¼Ð¸|Ð²Ñ–Ð»|Ð¸Ð¼ |Ñ†Ñ–Ñ—|Ð¾ Ð´|Ð° Ð²|ÑÑ‚Ñƒ|Ð¾Ð´Ñƒ|Ð±ÑƒÐ´|Ð¾Ð²Ð°| Ð¿Ñ–| Ð½Ñ–|Ñ Ð½|Ðµ Ð¿|Ð½Ð°Ñ†|Ð¸ Ñ|Ð½Ð½Ð°| Ð¾Ð´| Ñ€Ð¾|Ð½Ð¾Ñ|ÑŒÐ½Ð¸|ÑŽÑ‚ÑŒ|Ð¸ Ð·|ÐºÐ¸ |Ñ– Ð·|Ð° Ð±|ÑÐ¿Ñ€|Ñ‡ÐµÐ½|Ð¶Ðµ |Ð¾Ð¶Ðµ|Ðµ Ð¼|Ð¾Ð²Ð½|Ñ€Ð¸Ð¼|Ðµ Ð±|Ñ‚Ð¾ |Ð½Ñ–Ñ…|Ð¾ÑÐ¾|ÑƒÐ´ÑŒ|Ð²Ñ– | Ñ€Ðµ| ÑÑ‚|Ñ€Ð°Ñ†|Ð´Ð¾ | ÑÐ¾|Ñ€Ð¾Ð·|Ð»ÐµÐ½|Ð²Ð½Ð¸|Ñ–Ð²Ð½|Ñ€Ð¾Ð´| Ð²Ñ|ÑÐ¿Ñ–|ÐºÐ¾Ð²|Ð·Ð¿Ðµ|Ñ–Ð² |Ð´Ð»Ñ| Ð´Ð»|Ñ— Ð¾|Ñ…Ð¸Ñ|Ð°Ñ…Ð¸|Ð·Ð°Ñ…|â€ÑÐº|ÑŒâ€Ñ|Ð´ÑŒâ€|Ñ Ñ–|Ñ‚Ð°Ðº|Ð·Ð½Ð°|Ð·Ð°Ð±|ÑÑ‚ÑŒ|Ñ‚Ñƒ |Ð½Ð¾ÑŽ|Ð° Ð½|Ñ‚Ð¾Ñ€|ÑÐ½Ð¾|Ð¾ Ñ|Ð¶ÐµÐ½|Ñ†Ñ–Ð°|Ð¾Ñ†Ñ–|ÑÐ¾Ñ†|Ñ–Ð½Ñˆ|Ñ– Ð¼|ÐºÐ»Ð°|Ð¸ Ð²|Ñ‚ÐµÑ€| Ð´Ñ–|Ñ–ÑÑ‚|Ð¾Ð²Ñ–|Ñƒ Ñ|Ñ Ð²|Ð°Ñ€Ð¾|ÑÑ– |Ð²Ñ–Ñ‚|ÑÐ²Ñ–|Ð¾ÑÐ²|Ñ€Ð¾Ð±|Ð¿Ñ–Ð»|Ñ€ÐµÑ|Ð·Ð° |Ð¿ÐµÑ‡|Ð°Ð±Ðµ|ÐºÑƒ |Ð»Ð¸Ð²|ÐµÑ€Ð¶|Ð´ÐµÑ€|Ð² Ñ–|Ð°Ð²Ð½|Ñ‚Ð°Ð²|Ð°Ð² |Ð°Ð¼Ð¸|ÐºÐ¾Ð¼|Ð²Ð»Ðµ|Ð¾ Ð±|ÑŒ Ð¿| Ñ‰Ð¾|Ñ—Ñ… |Ñ‚Ð²Ð¾|Ñ…Ñ‚Ð¾|Ñ–Ñ…Ñ‚|ÐºÐ¾Ð³| ÐºÑ€|Ð°Ð½Ð¾|Ñ‚Ð°Ð½|Ñ–Ð°Ð»|Ð½Ð°Ð»|Ð½ÑŒ |Ñ… Ð¿|Ð¶Ð½Ð¾|Ð»ÐµÐ¶|Ð°Ð»Ðµ|Ð¿Ñ€Ð¾|Ñ‚Ð²Ð°|Ñ€Ð°Ñ‚|Ð¾ Ð¾|Ñ… Ð²|Ð½Ð°Ñ€|Ð»ÑŒÑ|Ñ†Ñ–Ð¹|ÐºÐ¾Ñ€|Ñ‡Ð°Ñ|Ñ€Ð¶Ð°|Ñ— Ñ|Ð¸Ð½Ñƒ|Ð´ÑÑ‚|Ð¾ Ð·|Ñ€Ð°Ð·|Ð¼Ñ–Ð½|Ð° Ñ€|Ð·Ð°Ðº',
    bos: ' Ð¿Ñ€| Ð¸ |Ñ€Ð°Ð²|Ð½Ð° |Ð¼Ð° |Ð¿Ñ€Ð°| Ð½Ð°|Ð¸Ð¼Ð°| ÑÐ²|Ð° Ñ|Ð´Ð° |Ð° Ð¿|Ð²Ð¾ |Ñ˜Ðµ |ÐºÐ¾ |Ð°ÐºÐ¾|Ð¾ Ð¸| Ð¿Ð¾|Ð°Ð²Ð¾|Ðµ Ñ|Ð° Ð¸|Ñ‚Ð¸ | Ð¸Ð¼| Ð´Ð°| Ñƒ |ÑÐ²Ð°|Ð½Ð¾ | Ð·Ð°|Ð¾ Ð½|Ð²Ð° |Ð¸ Ð¿|Ð¸Ð»Ð¸|Ð²Ð°Ðº|Ð»Ð¸ | ÐºÐ¾|Ð½Ðµ | Ð¸Ð»|ÐºÐ¾Ñ˜| Ð½Ðµ| Ð´Ñ€|Ð¾ÑÑ‚| ÑÐ»|ÑšÐ° |Ð¸Ð¼ |Ð¸ Ñ|Ñƒ Ñ|Ð¸ Ð¸|Ð°Ð²Ð°|Ð¸Ñ˜Ðµ|Ð° Ñƒ| Ð±Ð¸|ÑÑ‚Ð²|ÑÐµ |Ð²Ð°Ñš|Ð° Ð´|Ð¾Ð¼ |Ñ˜ÐµÐ´|Ð±Ð¾Ð´|Ð¾Ð±Ð¾|Ð»Ð¾Ð±|ÑÐ»Ð¾| ÑÐµ| Ñ€Ð°|Ð¸Ñ… |ÑÑ‚Ð¸|Ð° Ð½|ÑšÐµ | Ð¾Ð±| Ñ˜Ðµ|Ð¿Ñ€Ð¸|Ð´Ñ€Ñƒ|Ñƒ Ð¸|Ñ˜Ñƒ |Ð¾ Ð´|Ð¸Ñ‚Ð¸|Ð²Ð¾Ñ˜|Ñ€Ð°Ð·|Ð°ÑšÐµ|Ð¾Ð²Ð°|Ð´Ñ˜Ðµ| Ð¾Ñ|Ðµ Ð¸|Ð»Ð¾ |Ðµ Ð¿|Ð°ÑšÐ°|ÑƒÑ˜Ðµ|Ð¸ Ð´|Ð±Ñ€Ð°|Ñ‚Ñ€Ðµ| Ñ‚Ñ€| ÑÑƒ|Ñƒ Ð·|Ð° Ðº|Ð¾Ð³ |Ñƒ Ð¿|Ð¾Ñ˜Ðµ|Ñ†Ð¸Ñ˜|Ñ€ÐµÐ±|Ð° Ð¾|Ð° Ð±| ÑšÐµ|Ð¸ Ñƒ|Ð¼Ð¸Ñ˜|Ð½Ð¸ |Ð½Ð¾Ñ|Ð±Ð° |ÐµÐ´Ð½|ÑÐ²Ð¾|ÑšÐµÐ³| Ð¸Ð·|Ð¿Ñ€Ð¾|Ðµ Ð´|Ð¶Ð°Ð²|Ð±Ð¸Ñ‚| Ð½Ð¸|Ð¸ Ð¾|ÑÑ‚Ð°|Ð° Ð·|Ð°Ð²Ð½|Ð²Ñ˜Ðµ| ÐºÐ°|Ð±Ð¸Ð»|Ð¾Ð²Ð¾|Ð° Ñ˜|Ð°Ñ˜Ñƒ|Ð¸ÑÑ‚|Ð¸ Ð½|Ð½Ð¸Ñ…|Ñ˜ÐµÐ»|Ñ‚Ñƒ |Ñ€ÐµÐ´|Ð³Ð¾Ð²| Ð¾Ð´|Ðµ Ð¾|Ð¾Ñ˜Ð¸| ÑÐ¼|Ñ˜Ð° |Ð¾ Ðº|Ð¸Ð»Ð¾|Ð°Ñ†Ð¸|Ðµ Ñƒ|Ð¿Ñ€Ðµ|Ð¾ Ð¿|ÐµÐ±Ð°|Ñƒ Ð¾|ÑÑƒ |Ð²Ð¸Ð¼|Ð¸Ñ‡Ð½| ÑÐ°| Ð´Ñ˜|Ð° Ñ‚|Ð¸Ñ˜Ð°|ÑˆÑ‚Ð¸|Ñ‡Ð½Ð¾|Ñ€Ð¶Ð°|Ð´Ñ€Ð¶|ÑÑ‚Ñƒ|Ð´Ð½Ð°|Ð¾Ð´Ð½|ÐµÐ½Ð¸|Ð·Ð° |Ð¸Ð²Ð°|Ð½Ð¾Ð¼|ÐµÐ¼ |Ð´Ñƒ |Ñ€Ð°Ð½|Ð²Ð½Ð¾|ÑÐ¼Ð¸|Ñ˜ÐµÑ€|Ðµ Ð±|Ðµ Ð½|Ð´Ðµ |Ð¿Ð¾Ñ|Ð¼ Ð¸| Ð´Ð¾|Ñƒ Ð´|Ð½Ð°Ðº|Ð° Ñ€|Ð¾Ð±Ñ€| Ð¼Ð¾|Ð½Ð¸Ð¼|ÐµÐ³Ð¾| ÐºÑ€|Ñ‚Ð¸Ñ‚|ÐºÑ€Ð¸|Ð²Ðµ |Ð°Ð½ |Ð¸ÐºÐ¾|Ð½Ð¸Ðº|Ð½Ñƒ |Ð¸ Ð¼|Ð½Ð¾Ð³|ÐµÐ½Ð¾|ÑÐ½Ð¾|Ðµ Ðº|Ñ‚ÑƒÐ¿|Ñ€ÑƒÐ³|ÐºÐ° |Ð¾Ð´Ð°|Ñ€Ð¸Ð²|Ð²Ð¾Ñ™|Ð°Ð»Ð½|Ð¼ Ñ|Ð¸Ñ‚Ñƒ|Ð°ÑˆÑ‚|Ð·Ð°Ñˆ|Ð°Ð½Ð¸|ÑÐ°Ð¼| ÑÑ‚|Ð°ÐºÐ²|Ð¾Ð²Ð¸|Ð¾ÑÐ½|Ñ€Ð¾Ð´|Ð°Ñ€Ð¾| Ð¼Ð¸|Ñ˜Ð¸ |Ñ‚Ð²Ð°|Ð´Ð½Ð¾|Ð½ÑÑ‚|Ð°Ðº |Ð¸Ñ‚Ðµ|Ñ™Ñƒ |Ð²Ð¸Ñ‡|Ñ€Ð°Ð´|Ñƒ Ð½|Ñƒ Ð¼| Ñ‚Ð°|Ð´ÑÑ‚|Ñ‚Ð¸Ð²|Ð½Ð°Ñ†|Ñ€Ð¸Ð¼|ÐºÐ¾Ð½|ÐºÑƒ |ÑšÑƒ |Ð¾Ð´Ñƒ|Ð¶Ð¸Ð²|Ð°Ð¼Ð¾|Ñ‚Ð²Ð¾|Ñ‚ÐµÑ™|Ð¿Ð¾Ð´|ÐµÑ›Ñƒ|Ð³ Ð¿|Ð½Ð¾Ð²|Ð¸Ð½Ð°|Ð½Ð°Ñ€| Ð²Ñ˜|Ð¸ Ð±|Ð¾Ñ˜ | Ð¾Ð²|Ð°Ð²Ðµ|Ð²Ñƒ |Ð°Ð½Ñ|Ð¾Ñ˜Ð°|Ð·Ð¾Ð²|Ð°Ð·Ð¾|ÑƒÐ´Ðµ|Ð±ÑƒÐ´| Ð±Ñƒ|Ðµ Ñ‚|Ð¸ Ð²|ÐµÑšÐ°|ÐµÐ´Ð¸|Ð½Ð¸Ñ†|Ð½Ð°Ð¿|Ð¼Ñ˜Ðµ| Ð¸Ñ|ÑÐ»Ñƒ|ÐµÐ´Ñ|Ð¾ Ð¾|Ð·Ð°Ðº|Ð¸ Ðº|Ð¼ Ð¿|Ñ‚Ð½Ð¾|Ð¸Ð²Ð¾|ÐµÑ€Ðµ|Ð½Ð¸Ñ‡|ÐºÐ°Ðº|Ð°Ð´Ð°|Ð²Ð½Ð¸|ÑƒÐ³Ð¸| Ñ€Ð¾|Ð¼Ð¾Ð²|Ð²ÐµÐ½|Ð¾ Ñ|Ñ‚Ð¾ |Ñ‚Ðµ | Ð²Ñ€| Ð±Ðµ|Ð°Ñ€Ð°|ÐºÐ»Ð°| Ð±Ñ€|Ñƒ Ð±|Ñƒ Ñƒ|Ð¸ Ñ‚|Ð¾Ð½Ð°| Ð¾Ð½|Ð°Ð²Ð¸|Ñ˜Ð°Ð»|Ð´Ð½Ð¸| ÑÐº',
    srp: ' Ð¿Ñ€| Ð¸ |Ñ€Ð°Ð²|Ð½Ð° |Ð¿Ñ€Ð°| Ð½Ð°|Ð¼Ð° | ÑÐ²|Ð¸Ð¼Ð°|Ð´Ð° |Ð° Ð¿|Ð²Ð¾ |ÐºÐ¾ |Ñ‚Ð¸ |Ð°Ð²Ð¾| Ð¿Ð¾|Ð° Ð¸|Ð°ÐºÐ¾|Ð° Ñ| Ð·Ð°| Ñƒ |Ð¾ Ð¸| Ð¸Ð¼|Ð¸ Ð¿|Ð²Ð° |ÑÐ²Ð°|Ð²Ð°Ðº| Ð´Ð°|Ð¾ Ð½|Ðµ Ñ|Ð¾ÑÑ‚| ÐºÐ¾|ÑšÐ° |Ð»Ð¸ |Ð¸Ð»Ð¸|Ð½Ðµ |Ð¾Ð¼ | Ð½Ðµ|Ð° Ð½| ÑÐ»| Ð¸Ð»|Ñ˜Ðµ | Ð´Ñ€|Ð¸ Ñ|Ð½Ð¾ |ÐºÐ¾Ñ˜|Ñƒ Ñ|Ð°Ð²Ð°| Ñ€Ð°|Ð¾Ð³ |ÑÐ»Ð¾|Ñ˜Ñƒ |Ð¸Ð¼ |ÑÑ‚Ð¸|Ð±Ð¾Ð´|Ð¾Ð±Ð¾|Ð»Ð¾Ð±|Ð¸Ñ‚Ð¸|Ð° Ð¾|ÑÑ‚Ð²|Ð¸ Ñƒ|Ð° Ð´|Ð½Ð¸ |Ñ˜ÐµÐ´|Ñƒ Ð¿|Ð¿Ñ€Ð¸|ÐµÐ´Ð½| Ð±Ð¸|Ð¸ Ð¸|Ð° Ðº|Ð¾ Ð´|ÑÑ‚Ð°|Ð¸Ñ… |Ð´Ñ€Ñƒ|Ð° Ñƒ| Ñ˜Ðµ|Ð°ÑšÐ°| Ð¾Ñ| Ð½Ð¸|Ð½Ð¾Ñ|Ð¿Ñ€Ð¾|Ð°Ñ˜Ñƒ|Ð¸ Ð¾| Ð´Ðµ| ÑÑƒ|Ñƒ Ð¸|ÑÐµ |ÑšÐµ |Ñ˜Ð° |Ð¾Ð²Ð°|Ð¸ Ð´|Ñ†Ð¸Ñ˜| Ð¾Ð±|ÑƒÑ˜Ðµ|Ñ€ÐµÐ´|Ð¶Ð°Ð²|Ðµ Ð¸|Ðµ Ð¿|Ð° Ñ˜|Ð´Ð½Ð°| ÑÐµ| Ð¾Ð´|Ð²Ðµ | ÐºÐ°|ÐµÐ½Ð¸|Ñ€Ð¶Ð°|Ð´Ñ€Ð¶|Ð° Ð·|Ð°Ð²Ð½|ÐµÑšÐ°|Ð°Ñ†Ð¸|Ð²Ð¾Ñ˜|Ð¾Ð²Ð¾|Ñƒ Ñƒ|Ð¼ Ð¸|Ð¾Ñ˜Ð°|Ð²Ð°Ñš| Ð¸Ð·|Ð¸Ñ˜Ð°|Ñƒ Ð·|Ð°ÑšÐµ|Ñ€Ð°Ð½|Ðµ Ð¾|Ñ€Ð¾Ð´|Ð¸ Ð½|Ðµ Ð±|Ñ€Ð°Ð·|Ð·Ð° | ÑšÐµ|Ð³Ð¾Ð²|Ð¸Ñ‡Ð½| ÑÑ‚|Ð½Ð¾Ð²|ÑÐ½Ð¾|Ð¾ÑÐ½|Ð´Ñƒ |Ð¿Ñ€Ðµ| Ñ‚Ñ€|ÑÑƒ |Ð²Ñƒ |Ð¾Ð´Ð½|Ð° Ð±|ÑÐ²Ð¾|ÑšÐµÐ³|Ð½Ð¸Ð¼|Ð½Ð¸Ñ…|Ñ‚Ñƒ |Ñ‚Ð¸Ñ‚|ÑˆÑ‚Ð¸|ÐºÑƒ |Ð½Ð¾Ð¼|Ð±Ð¸Ñ‚|Ðµ Ð´|Ð¼Ðµ |Ð¸ÐºÐ¾|Ñ‡Ð½Ð¾|Ð¾Ñ˜Ð¸|Ð»Ð¾ |Ð²Ð½Ð¾|Ð½Ð¸Ðº|Ð¸ÐºÐ°|Ð±ÐµÐ·|Ð°Ñ€Ð°|Ð´Ðµ |Ñƒ Ð¾|Ð²Ð¸Ð¼|Ð½Ð°Ðº| ÑÐ°|Ñ€Ð¸Ð²|Ð°Ð²Ðµ|Ð°Ð½ |Ð²Ð¾Ñ™| ÐºÑ€|Ð¾ Ð¿|ÑÐ¼Ðµ|Ðµ Ðº|Ð½Ð¾Ð³|Ñ˜Ð¸ | Ð¾Ð²|Ðµ Ñƒ|Ñ‚Ð²Ð°|Ð±Ñ€Ð°|Ñ€ÑƒÐ³|Ñ€ÐµÐ±|Ñ‚Ñ€Ðµ|Ñƒ Ð´|Ð¾Ð´Ð°| Ð¼Ð¾| Ð²Ñ€|Ð°Ð²Ñ™|Ñƒ Ð½|ÐµÐ³Ð¾|Ð´ÐµÐ»|Ð¼ Ñ|ÐºÑ€Ð¸|Ð¾ Ðº|Ð°ÑˆÑ‚|Ð·Ð°Ñˆ|ÑšÑƒ | ÑÐ¼|Ð°Ð½Ð¸| Ð»Ð¸|Ð´Ð½Ð¾|ÐµÑ’Ñƒ|Ð°Ð»Ð½|Ð»Ð° |Ð°ÐºÐ²|Ð¾Ñ˜ |ÐºÐ¾Ð¼|ÑÑ‚Ñƒ|ÑƒÐ³Ð¸|Ð°Ð²Ð¸|Ð° Ñ€|ÐºÐ° |Ñ€Ð°Ð´|Ð¾Ð´Ð¸|Ð²Ð¸Ñ‡|Ñ‚Ð°Ð²|Ð¸Ñ‚Ñƒ|ÑƒÐ´Ðµ|Ð±ÑƒÐ´| Ð±Ñƒ|Ð¿Ð¾Ñ‚|Ð¾Ð´Ñƒ|Ð¶Ð¸Ð²|ÐµÑ€Ðµ|Ñ‚Ð²Ð¾|Ð¸Ð»Ð¾|Ð±Ð¸Ð»|Ð°Ñ€Ð¾|Ðµ Ð½|Ð¾Ð²Ð¸|Ð¿Ð¾Ñ€|ÐµÐ½Ð¾|ÑˆÑ‚Ð²|Ð½Ð°Ñ†|Ð¾Ð²Ðµ|Ð¼ Ð¿|Ñ‚ÑƒÐ¿|Ð¿Ð¾Ñ|Ñ€ÐµÐ¼|Ð´Ð½Ð¸|Ð±Ð° |Ð½ÑÑ‚|Ð° Ñ‚|Ð¾Ñ˜Ñƒ|Ð°ÑÑ‚|Ð¸Ð²Ð°|Ðµ Ð¼|Ð²Ñ€Ðµ|Ð²Ñ™Ð°|Ð½Ñƒ |Ð±ÐµÑ’|Ð¸ÑÑ‚|ÐµÐ½ |Ñ‚Ðµ |Ð´ÑÑ‚|Ñ€Ð¾Ñ‚|Ð·Ð°Ðº|Ð°Ð¾ |ÐºÐ°Ð¾|Ð¸ Ðº|Ñ˜ÑƒÑ›|Ð¾ Ñ|ÑÑ‚ |ÑÐ°Ð¼|Ð¼ Ð½|Ñ‚ÐµÑ€|Ð½Ð°Ñ€| Ð¼Ðµ|Ð¸ Ð¼|ÐºÐ¾Ð»|Ðµ Ñ€|ÑƒÑˆÑ‚|Ñ€ÑƒÑˆ|Ð²ÐµÑ€|ÐºÐ°Ðº| Ð±Ðµ|Ð¸ Ð±|ÐºÐ»Ð°|Ð°Ð´Ð°|ÐµÐ±Ð°|ÐµÐ½Ð°|Ð¾Ð½Ð°| Ð¾Ð½|Ñ‚Ð²Ñƒ|Ð°Ð½Ñ| Ð´Ð¾|Ñ€Ð°Ðº|ÑÐ»Ñƒ|Ð¸ Ð²|Ð½Ð¸Ñ†|Ñƒ Ðº|Ð¼ÐµÐ½|Ð²Ñ€Ñˆ|ÐµÐ¼Ðµ|ÐµÐ´Ñ|Ð¸Ð²Ð¸|Ð¾ Ð¾|Ñ˜Ð°Ð²',
    uzn: 'Ð°Ð½ |Ð»Ð°Ñ€|Ð³Ð° |Ð¸Ñ€ | Ð±Ð¸|Ð°Ñ€ | Ð²Ð°|Ð´Ð° |Ð¸Ð³Ð°| Ò³Ñƒ|Ð²Ð° |Ð±Ð¸Ñ€|ÑƒÒ›Ñƒ|Ò›ÑƒÒ›|Ò³ÑƒÒ›| Ò³Ð°|Ñ€ Ð±|Ð³Ð°Ð½|Ð¸Ñˆ |Ð¸Ð´Ð°| Ñ‚Ð°|Ð° Ñ|Ð¸Ð½Ð¸|Ð°Ð´Ð¸|Ð½Ð³ |Ð´Ð¸Ñ€|Ð¸ÑˆÐ¸|Ð»Ð¸Ðº|Ð»Ð¸Ñˆ|Ð¸Ð¹ |Ð¸Ð»Ð¸|Ð°Ñ€Ð¸|ÑƒÒ›Ð¸|Ò³Ð°Ñ€|Ð»Ð°Ð½|Ð¸Ð½Ð³|ÑˆÐ¸ |Ð´Ð°Ð½|Ð½Ð¸Ð½|Ð¸Ð½Ñ|ÐºÐ¸Ð½|ÑÐ¾Ð½|Ð½ÑÐ¾| Ð¸Ð½| Ð¼Ñƒ|Ò›Ð¸Ð³| Ð¼Ð°|Ð¾Ð½ |Ñ€ Ð¸| Ð±Ñž|ÑÐ³Ð°| ÑÐ³| ÑžÐ·|Ð½Ð¸ |Ð±ÑžÐ»|Ð³Ð°Ð´|Ð¸ Ð±|ÐºÐ¸ |Ð¸Ð»Ð°|Ñ‘ÐºÐ¸| Ñ‘Ðº|Ð° Ð±|Ð½ Ð±|Ð¸Ð½ |Ñ€ Ò³|Ð°Ð»Ð°|ÑÑ€Ðº| ÑÑ€|Ð»Ð³Ð°| Ò›Ð°|Ñ€ÐºÐ¸|Ñˆ Ò³|Ð¸ Ò³|Ð½ Ð¼| Ð±Ð¾| Ð±Ð°|Ð¸Ðº |Ð°Ñ€Ð°|Ð¸Ð³Ð¸|Ð»Ð¸Ð³|Ñ€Ð¸ |Ò›Ð¸Ð»|Ð° Ñ‚|Ð±Ð¸Ð»| ÑÑ‚|Ð½Ð¸Ñˆ|Ð½Ð»Ð¸|ÐºÐ»Ð°|Ð¸ Ð²|Ð±Ð¾Ñˆ|ÑÑ‚Ð¸|Ð°Ð½Ð¸|Ð¸Ð¼ |Ð¸ Ð¼|Ð¾Ð»Ð¸|Ò›Ð»Ð°|Ð° Ò³|Ð»Ð°Ñˆ|Ð°Ñ‚Ð»|Ñ‚Ð¸Ð»|Ð° Ò›| Ð¾Ð»|Ð¾ÑÐ¸|Ð¼Ð°Ñ|Ò›Ð°Ñ€|Ð¸Ð½Ð»|Ð»Ð°Ñ‚| Ò›Ð¸|Ñ‚Ð°ÑŠ|Ò³Ð°Ð¼|Ð³Ð¸ |Ð¸Ð± |Ð¼Ð»Ð°|ÑžÐ· |Ð½ Ñ|Ð¼ÑƒÐ¼| Ð´Ð°| Ð±Ñƒ|Ð°Ñ‚ |Ñˆ Ð²|ÑƒÐ½ |Ð°Ñ‚Ð¸|Ð¼ÐºÐ¸|ÑƒÐ¼Ðº|Ñ‚Ð»Ð°|Ð¸Ñ€Ð¾|ÑžÐ»Ð¸|Ð±Ð°Ñ€|Ð¸Ñ€Ð¸|Ñ€Ð¸Ñˆ|Ð¸ÑÑ‚|Ð°Ð»Ð¸| Ð±Ðµ| Ò›Ð¾|Ð° Ñˆ|Ð°Ñ€Ð¾| ÐºÐµ|Ð¸ Ñ‚|Ñ€Ð»Ð°| Ñ‚Ðµ|Ñ‡Ð° |Ñ€Ñ‡Ð°|Ð°Ñ€Ñ‡|Ð° Ñž| ÑˆÑƒ|Ñ‚Ð¸Ñˆ|Ð½ Ò³|Ñ‚Ð³Ð°| ÑÐ°|Ð°ÑÐ¸| Ñ…Ð°|Ñ€Ð°Ðº|Ð»Ð¸Ð½|Ð¾Ð»Ð°|Ð¸Ð¼Ð¾|ÑˆÒ›Ð°|Ð»Ð¸ | Ñ‚Ñƒ|Ð°Ð¼Ð»|Ð»Ð»Ð°|ÑÐ¸Ð´|Ð½ Ñž| Ð°Ñ|Ð½Ð¸Ð´|Ð° Ð¸| ÐºÐ¸|Ð½ Ñ‚|Ð½Ð´Ð°|Ðº Ð±|ÐµÑ€Ð°|Ð¾ÑˆÒ›|ÑÐ¸Ð·|Ð¾Ñ€ |Ð° Ð¼|Ñ€ Ð²|ÐµÐ½Ð³|Ñ‚ÐµÐ½|Ð¼Ð°Ñ‚|Ð¼Ð´Ð°|Ð°Ð¼Ð´|Ð»Ð¸Ð¼|Ð¹ Ñ‚|ÑÑ‚ |Ð¸ Ð°|Ð¸Ð½Ð¾|Ð¸Ð»Ð³| Ñ‚Ð¾|Ñ‚Ð½Ð¸|Ð°Ð½Ð°|Ð°Ñ |ÑÐ¼Ð°| ÑÐ¼|Ð° Ñ‘| ÑˆÐ°|Ð°Ñˆ |Ð° Ð°|Ñ‚Ð°Ñ€|ÐºÐ°Ñ‚|Ð°ÐºÐ°|Ð°Ðº | Ð´Ðµ|Ð°Ð·Ð°|Ð¸Ð»Ð»|ÑÐ¸Ð¹| ÑÐ¸| ÑÐ¾|ÑƒÒ›Ð»|Ð½ Ò›|Ð¾Ð´Ð°|ÑŠÐ»Ð¸|Ð°ÑŠÐ»|Ð½Ð¸Ðº|Ð°Ð´Ð°| Ð½Ð¸|Ñ‚Ð´Ð°|Ð³Ð¸Ð½|ÑƒÐ½Ð¸|ÑÐ¸Ñ‚|Ð°Ð¹ |Ò›Ð¾Ð½|Ð½ Ð¾| Ð¶Ð°|ÐºÐ¸Ð¼|ÐµÑ‡ |Ò³ÐµÑ‡| Ò³Ðµ|ÑžÐ·Ð¸|Ð»Ð°Ðº|ÐºÐµÑ€|Ð¸ÐºÐ»|Ð»Ð»Ð¸|ÑƒÑ€ |Ð·Ð°Ñ€|ÑˆÐ»Ð°|Ñ€Ð¸Ð³|Ð¸Ñ€Ð»|Ð´Ð°Ð¼|ÐºÐ¾Ò³|Ð¸ÐºÐ¾|Ð° Ð´|Ð°Ð¼ |Ð½ Ð²|Ñ€Ñ‚Ð¸|Ñ‚Ð¸Ð±|Ñ‚Ð°Ð»| Ð¸Ñˆ|Ñ‡ÑƒÐ½|ÑƒÑ‡Ñƒ| ÑƒÑ‡|ÑÐ»Ð°|Ð° Ñƒ|Ñ€Ð¸Ð½|ÑÐ¾Ñ|Ð°ÑÐ¾| ÑƒÐ½|Ð½Ð° | ÐºÐ°|Ð¼ÑƒÒ³|Ð´Ð¸Ð³|Ñ‡ Ðº|Ð°ÑÐ»|Ð»Ð¼Ð°|Ñ€Ð° |Ð±Ñƒ |Ñ…Ð°Ð»|ÑžÐ»Ð³|Ð¸ Ðº|ÐµÐºÐ»|Ñ€ Ð´|Ò›Ð°Ñ‚|Ð°Ð³Ð°|Ð¸ Ò›|Ð¾Ð¸Ð¹|Ð¼Ð¸Ð»| Ð¼Ð¸|Ò›Ð° |Ð¸ Ñ|Ð¶Ð¸Ð½| Ð¶Ð¸|ÑÐ¸Ð½|Ñ€Ð¾Ñ€|Ð° Ð²|Ð»Ð°Ð´|Ð° Ð¾|Ñ‚Ð»Ð¸|Ð¼Ð¸Ñ|Ð½ Ð¸|Ð°Ð± |Ñ‚Ð¸Ñ€|Ð· Ð¼|Ð´Ð°Ð²|Ñ€Ð³Ð°|Ð°Ð³Ð¸|Ð° Ðº|Ð½Ð»Ð°|Ð°Ò›Ñ‚|Ð²Ð°Ò›|Ð°Ñ€Ñ‚|Ð°Ñ‘Ñ‚|Ð»Ð°Ð±',
    azj: ' Ð²Ó™|Ð²Ó™ |Ó™Ñ€ |Ð¸Ñ€ | Ò»Ó™| Ð±Ð¸| Ò»Ò¯| Ð¾Ð»|Ò¯Ð³Ñƒ|Ò»Ò¯Ð³|Ð³ÑƒÐ³|Ð½Ð° |Ð¸Ð½ |Ð»Ð°Ñ€|Ò»Ó™Ñ€|Ð´Ó™ | ÑˆÓ™|Ð±Ð¸Ñ€|Ð»Ó™Ñ€|Ð»Ð¸Ðº|Ð¼Ð°Ð»|Ñ€ Ð±|Ð»Ð¼Ð°|Ñ€ Ò»| Ñ‚Ó™|Ó™Ñ…Ñ|ÑˆÓ™Ñ…|Ó™Ð½ |Ð´Ð¸Ñ€|ÑƒÐ³Ñƒ|ÑƒÐ½Ð°|Ð°Ð½ |Ð°Ð»Ð¸|Ð° Ð¼| Ð¼Ð°|Ð¸ÐºÐ´|Ð¸Ð½Ð¸|Ñ€ Ñˆ|Ð´Ó™Ð½|Ð°Ñ€ |Ð¸Ð»Ó™|Ð³ÑƒÐ½|Ð°Ð³ |Ð°ÑÑ‹| Ñ˜Ð°|Ð¼Ó™Ðº|Ñ˜Ó™Ñ‚| Ð¼Ó™| Ð¼Ò¯|ÐºÐ´Ð¸|Ó™ÑÐ¸|Ó™Ðº |Ð¸Ð»Ð¼|Ð½Ð¸Ð½|Ð½Ð´Ó™|Ð¾Ð»Ð¼|Ó™Ñ‚Ð¸|Ó™ Ñ˜|ÑÐ¸Ð½|Ñ…Ñ |Ð½Ð´Ð°|Ð»Ð¼Ó™|Ñ˜Ñ˜Ó™|Ð¸ Ð²| Ð³Ð°| Ð°Ð·|Ð¾Ð»Ñƒ|Ð¸Ñ˜Ñ˜|Ñ˜Ð° |Ð¸Ð½Ð´|Ð·Ð°Ð´|Ð³Ð»Ð°|Ò¯Ð½ |Ð½Ð¸ |Ð»Ó™ |Ñ‚Ð¸Ð½|Ð½ Ð¼|Ð°Ð·Ð°|Ð°Ñ€Ñ‹|Ó™Ñ‚ |Ð½ Ñ‚|Ð¼Ð°Ð³|Ð»ÑƒÐ½|Ð»Ñ‹Ð³|Ó™ Ð±|ÑƒÐ½ |Ð½ÑƒÐ½|Ð³ Ð²|Ð½ Ò»|Ð´Ð°Ð½|Ñ‹Ð½ | ÐµÑ‚|Ñ‚Ð¼Ó™|Ó™Ñ€Ó™| Ó©Ð·|Ð´Ð° |Ó™ Ð²| Ð¾Ð½|Ó™ Ð°|Ñ‹Ð½Ð°|Ñ‹Ð½Ñ‹|Ð±Ð¸Ð»|Ð° Ð±|ÑÑ‹ |Ð¸Ð» |Ó™Ð¼Ð¸|Ð°Ñ€Ð°|ÑÐ¸ | Ð´Ð¸|Ó™ Ð¼|Ó™Ñ€Ð¸|Ñ€Ð»Ó™| Ð²Ð°|Ó™ Ò»|ÐµÑ‚Ð¼|Ñ‹Ò“Ñ‹|Ð°Ð¼Ð°|Ð´Ð»Ñ‹|Ð°Ð´Ð»|Ñ€Ð¸Ð½|Ð±Ó™Ñ€|Ñ€Ñ‹Ð½|Ð½ Ð¸|Ð¼Ò¯Ð´|Ð½Ñ‹Ð½| Ò»Ðµ|Ð¼Ð°Ñ|Ð¸Ðº |Ð½ Ð°|Ð´Ð¸Ð»|Ð°Ð»Ñ‹|Ð¸Ñ€Ð»|Ó™Ð»Ó™|Ò¯Ð´Ð°|ÑÑ‹Ð½|Ñ‹Ð½Ð´|Ñ…ÑÐ¸|Ð»Ð¸ |Ó™ Ð´|Ð½Ó™ | Ð±Ó™|Ó™Ñ˜Ð°| Ð¸Ð½|Ó™ Ð¸|Ð»Ó™Ñ‚| ÑÓ™|Ð½Ñ‹ | Ð¸Ñˆ|Ð°Ð½Ñ‹|ÐµÑ‡ |Ò»ÐµÑ‡|Ð³ Ò»|ÐµÑ˜Ð½|Ó™ Ðµ|Ð´Ñ‹Ñ€| Ð´Ð°|Ð°ÑÐ¸|Ñ€Ñ‹ |Ð¸Ñˆ |Ð¸Ñ„Ð°|Ð»Ñ‹Ò“|Ð¸ Ñ|Ñ„Ð¸Ó™|Ð°Ñ„Ð¸|Ð´Ð°Ñ„| ÐµÐ´|Ð¼Ó™Ð·|Ñƒ Ð²|ÐºÐ¸Ð»| Ò»Ð°|Ð¾Ð»Ð°|Ð½ Ð²|Ó™Ð½Ð¸|Ñ‹Ñ€ |ÑƒÐ³ |ÑƒÐ½Ð¼| Ð±Ñƒ| Ð°Ñ|ÑÐ¸Ð°|Ð¾ÑÐ¸|ÑÐ¾Ñ|Ð¸Ð»Ð¸|Ñ‹Ð´Ñ‹|Ð»Ñ‹Ð´|Ð½Ð¼Ð°|Ñ‹Ð³ |Ð¸Ð½Ó™|Ó™Ñ€Ð°|ÑÐ¸Ð»|Ñ…Ð¸Ð»|Ð°Ñ…Ð¸|Ð´Ð°Ñ…|Ð°Ð´Ó™|Ð¼Ð°Ð½|Ð° Ò»|Ó™ Ð¾|Ð¾Ð½Ñƒ|Ð° Ð³|Ó™Ð· | ÐºÐ¸|ÑÐµÑ‡| ÑÐµ|Ñ‹ Ò»|Ð¼Ð¸Ð½|Ð»Ð°Ð½|Ó™Ð´Ó™|Ð±Ñƒ |Ñ€Ð°Ð³|Ð»Ñ‹ |Ñ‹Ð»Ñ‹|Ð°Ð» |Ó™ Ð³|Ñ€ Ð²|Ð½Ð»Ð°|Ò»ÑÐ¸|Ó™Ò»Ñ|Ñ‚Ó™Ò»|Ó©Ð· |Ð¸ÑÑ‚| Ð¸Ñ|Ð¼Ó™Ñ| Ó™Ñ|Ð¸Ð½Ð°|Ó™ Ñ‚|Ó™Ñ‚Ð»|Ð° Ð²|Ð¸Ó™ |Ð½ Ð±|Ñ‚Ó™Ñ€| Ñ‚Ð°| Ò¹Ó™|ÐµÐ´Ð¸|Ð°Ð»Ð°|ÐºÐ¸Ð¼|Ð³Ñƒ |Ð¸ Ñ‚|ÑƒÐ»Ð¼|Ð¼Ó™Ò»|Ð½ Ð¾|Ð°Ñ˜Ð°|Ñ‹ Ð¾|Ð¸Ð°Ð»| ÑÐ¾|Ð¸Ð»Ð»|ÑÐ¸Ñ˜| Ð´Ó™|Ð²Ð°Ñ€|Ð¸Ð½Ñ|Ð¼Ð¸ |Ò“Ñ‹ |Ð½Ð¸Ðº|Ñ€ Ð¸|Ð°Ð³Ð»|Ðº Ò»|Ñ‚Ó™Ð¼|Ñ‚Ð°Ð¼|Ñ‡Ò¯Ð½|Ò¯Ñ‡Ò¯| Ò¯Ñ‡|Ò“Ñ‹Ð½|ÑÐ°Ñ|Ó™ÑÐ°|Ð· Ò»|Ó™Ð¼Ó™|Ð·Ð°Ð¼| Ð·Ð°|ÑÑ‚Ð¸|Ñ€Ó™Ñ„|Ð½ Ðµ|Ñ€ Ð°|Ð¸Ð»Ð´|Ò»Ó™Ð¼|Ñ‹Ð³Ð»|Ñ˜Ð°Ð½|Ð¼Ð°Ñ˜|Ð½ Ó™|Ð¼Ó™Ð½|Ð¼Ð¸Ð»| Ð¼Ð¸|Ó™Ð³Ð¸|Ð´Ð¸Ð½|Ð½ Ð´|Ñ‚Ò¯Ð½| Ð´Ó©|Ð¼Ð¸Ñ˜|ÐºÐ°Ò»|Ð¸ÐºÐ°| Ð½Ð¸|Ñ„Ð°Ð´|Ñ‚Ð¸Ñ„|Ð» Ð¾|ÑÓ™Ñ€|Ñ˜Ð½Ð¸| ÐµÑ˜|Ð°Ð½Ð°|Ð»Ó™Ð½|Ð°Ð¼ |Ñ€Ð¸Ð»|Ð°Ñ˜Ó™|Ð°ÑˆÑ‹',
    koi: 'Ð½Ñ‹ |Ó§Ð½ | Ð±Ñ‹|Ð´Ð° | Ð¿Ñ€|Ð»Ó§Ð½|Ñ€Ð°Ð²| Ð¼Ð¾|Ð¿Ñ€Ð°| Ð´Ð°|Ð±Ñ‹Ð´| Ð²Ðµ|Ð¾Ñ€Ñ‚|Ð»Ó§ |Ó§Ð¹ |Ð¼Ð¾Ñ€|Ó§Ð¼ |Ð°Ð²Ð¾| Ð½Ðµ|Ð²Ð¾ |Ñ‹Ð´ |Ñ‹Ñ |Ð½Ó§Ð¹|Ñ‹Ð½ |Ð¼ Ð¿|Ð´ Ð¼|Ñ‹Ð½Ñ‹|Ñ‚Ð½Ñ‹| Ð°Ñ|Ñ‚Ó§Ð¼|Ð»ÑŒÐ½| ÑÐ¼|Ð²ÐµÑ€|ÑÑŒ |ÑŒÐ½Ó§|ÑÐ¼ |Ð½ Ñ|Ñ‚Ð»Ó§| ÐºÑ‹|ÑÓ§ | Ð¿Ð¾|ÐµÑ€Ð¼|ÑÑŒÓ§|Ñ€Ñ‚Ð»|Ð°Ð»ÑŒ| ÐºÓ§|ÑÐ· | Ó§Ñ‚|Ó§ Ð²|Ñ‚Ð¾ |ÐµÑ‚Ð¾|Ð½ÐµÑ‚|Ñ‹Ð»Ó§| ÐºÐ¾|Ñ‚ÑˆÓ§| Ð¾Ñ‚| Ð¸ |Ñ‹ Ñ|Ð±Ñ‹ |Ó§ Ð±|ÑÑ‚Ð²|ÐºÓ§Ñ€| Ð²Ó§|ÑˆÓ§Ð¼|ÐºÑ‹Ñ‚|Ñ‚Ð° |Ð½Ð° |Ð· Ð²| ÑÐµ| Ð´Ð¾|Ð²Ð¾Ð»|Ó§Ñ | ÑÑ‹|Ñ‹ Ð°|Ð¾Ð»Ð°|Ñ€Ð¼Ó§|Ð°Ñ |Ð¾Ð· | Ð¾Ð·| ÑÑ–|Ð° Ñ|Ñ‚Ð²Ð¾|Ñ Ð¾| Ð²Ñ‹|Ð»Ñ–Ñ|Ó§ Ðº|Ñ‹Ñ‚Ñˆ|Ó§ Ð´|Ð¸Ñ |Ñ–ÑÑŒ|Ó§Ñ‚Ð½|Ð°ÑÑŒ| Ð¾Ð»| Ð½Ð°|Ð°Ñ†Ð¸| ÑÑ‚|Ð° Ð²|Ð·Ð»Ó§|ÑÐµÑ‚| Ð²Ð¾| Ñ‡Ñƒ|Ð»Ð°Ñ|Ð»Ð°Ð½|Ð¼Ó§ |Ñ‚Ñ‹Ñ|Ñ€Ñ‚Ñ‹|Ó§Ñ€Ñ‚|Ñ‹ Ð¿|Ó§Ñ‚Ð»|Ð¾ Ñ|ÑÑ‚Ð°|Ð´Ð· |ÐºÓ§Ñ‚|Ó§Ð´Ð½|Ð²Ð½Ñ‹| Ð¼Ñ‹|Ð½ Ð½|ÑƒÐ´Ð¶| ÑƒÐ´|Ð²Ñ‹Ð»|Ó§ Ð¼|Ñ€Ñ‚Ñ–|Ð¾Ñ€Ð¹|Ð¸ÑÑŒ| ÑÐ¾|Ð²Ð¾Ñ|Ñ‹Ð´Ó§|Ð¹ Ð¾|ÐºÐ¾Ð»| Ð³Ð¾|Ñ Ñ|ÑÑÐ¸|ÑÑ‹Ð»|Ñ‹ÑÐ»|Ð¹Ñ‹Ð½|ÐºÐ¸Ð½|Ð¾Ð»Ó§|Ñ‚Ó§Ð½| ÑÑŒ|Ð°Ð½Ð°|Ó§Ñ€ |Ñ†Ð¸Ñ|Ð° Ð´|Ó§Ð¼Ó§| Ð²Ð¸|Ð· Ðº| ÑÐ·|Ñ‹ Ð±|Ñ‚Ó§Ð³|Ó§Ñ‚ |Ð¼Ó§Ð´|ÐµÑÑ‚|Ð¾ÑÑ‚|Ó§Ð½Ñ‹|Ñ‚Ð¸Ñ€|Ð¾Ñ‚Ð¸|ÑƒÐºÓ§|Ñ‡ÑƒÐº|Ð½ Ð¿|Ð¾Ð½Ð´|Ð¿Ð¾Ð½|ÑÐ»Ó§|ÐºÐµÑ€| ÐºÐµ| Ð¾Ð±|ÑÐ¸Ñ|ÑÑƒÐ´|Ð° Ð½|Ð´Ð¾Ñ€|ÐºÐ¾Ð½|Ð½ÐµÐº|Ð½ Ð±|Ð»Ó§Ñ‚|Ñ Ð²|Ñ‚Ñ– |ÑŒÓ§Ñ€|Ñ‚Ñ€Ð°| ÑÑ‚|Ð½Ð°Ð»|Ð¾Ð½Ð°|Ð½Ð°Ñ†|Ð½ Ðº|ÐºÓ§Ð´|Ó§Ð³ |ÑÐºÓ§|Ñ‚ÑŒ |ÐµÑ‚Ó§|Ð´Ó§Ñ|Ð±Ñ‹Ñ‚|Ñ€Ð½Ñ‹|Ó§ Ð½|Ñ‚ÑÓ§|Ñ€Ñ€Ðµ|Ð° Ð±|Ð½Ð´Ð°|Ñ Ð´|Ð°ÑÑ|Ñ‹ Ðº|Ð°ÑÐ»| Ð»Ð¾|ÑŒÐ½Ñ‹|ÑÑŒÐ½|Ñ‹ Ð¼|ÐµÐºÐ¸|Ñ‹ Ð´| Ð¼Ó§|ÑŒ Ð¼|Ñ‹ Ð½|Ñ‹Ñ‚Ó§| Ð¼Ðµ|Ñ€Ð¹Ó§|Ð¸Ð°Ð»|Ð¹ Ð´|Ð¸Ñ‚Ó§|Ð° Ðº|Ó§ÑÑŒ|Ð¼Ó§Ñ|Ð¾Ð²Ð½|Ð·Ñ‹Ð½|Ð° Ð¿|Ð¾Ñ‚Ñ| Ð»Ð¸|Ð¾Ð»Ñ|Ó§ Ð°|Ð¾ÑÑƒ|Ó§Ñ |Ð½Ó§Ñ|ÐµÐ·Ð»|Ñ€ÐµÐ·|Ð¼ÐµÐ´|Ñ Ð¼| ÑÑ|ÑŒ Ðº|Ñ€Ð¹Ñ‹|Ð°ÐºÐ¾|Ð·Ð°Ðº| Ð·Ð°|ÑŒÑ‹Ð½|Ð½Ð½Ñ‘|Ð¼Ó§Ð»|ÑƒÐ¼Ó§| ÑƒÐ¼|Ñ‹ Ñƒ|Ð½ Ð²|Ð¼ Ð´|Ð½ Ñ| Ð´Ð·|Ð½ Ð¾|Ñ€Ð°Ð½|ÑÑ‚Ñ€|Ð¾Ð·ÑŒ|Ð¿Ð¾Ð·|Ð· Ð¿|Ð¾ Ð´|Ñ†Ð¸Ð°|Ð¾Ñ†Ð¸|ÑÐ¾Ñ†|Ð¸Ð¾Ð½|Ð° Ð¼|ÐµÑÐº|Ñ‡ÐµÑ|Ð½Ó§ |Ð· Ð´|Ñ‚ÑÑŒ|Ð±Ó§Ñ€| Ð±Ó§| Ð¾Ð²|Ð²ÐµÑ|ÐºÑ‹Ð´|Ó§ Ñ|Ð²Ð¾Ñ‹|ÐºÐ¾Ð´|Ñ‚ÐºÐ¾|Ó§Ñ‚Ðº|Ð¾Ð»ÑŒ|Ð´Ð±Ñ‹|ÐµÐ´Ð±|ÑÑŒÑ‹|Ñ‡Ñ‹Ð½|Ñ‚Ñ‡Ñ‹|Ó§Ñ‚Ñ‡|Ñ‚Ð»Ð°|Ð¼Ó§Ð½|ÑÐ»Ð°|Ð¹Ó§Ð·| Ð¹Ó§|Ñ‚ Ð²|Ñ‹ Ð¸|ÐµÐ· |Ð¾ Ð²|Ð¾Ð½Ñ‹|Ð¹Ó§ |Ð°Ð½Ð½|Ó§Ð»ÑŒ| Ð¿Ñ‹|Ð°Ð½ |Ð½Ó§Ñ|Ð½Ð¸Ñ‚| ÑÑƒ|Ð¼ Ñ',
    bel: ' Ð¿Ñ€|Ð¿Ñ€Ð°| Ñ– |Ð°Ð²Ð°|Ð½Ð° |Ñ€Ð°Ð²| Ð½Ð°| Ð¿Ð°|Ð½Ñ‹ |Ð²Ð° |Ð°Ð±Ð¾|Ñ†ÑŒ | Ð°Ð±|Ð°Ðµ | Ð¼Ð°|Ð°Ð²Ðµ|Ð°Ð½Ð½|Ð°Ñ†Ñ‹|ÑÐ²Ð°| ÑÐ²|Ðµ Ð¿|Ð»ÑŒÐ½| Ñ‡Ð°|Ð½Ðµ |Ð½Ð½Ñ|Ð°Ð»Ð°|Ð° Ð½|Ð°Ð¹ |Ð»Ð°Ð²|Ñ‡Ð°Ð»| ÐºÐ¾| Ð°Ð´| Ð½Ðµ|Ð³Ð° |Ð¾Ð¶Ð½|ÐºÐ¾Ð¶|Ð²ÐµÐº|Ð½Ñ | ÑÐº|Ð¶Ð½Ñ‹|Ñ‹ Ñ‡|Ð¼Ð°Ðµ|Ð° Ð¿|Ð°Ð³Ð°|Ð±Ð¾ |ÐµÐº |Ð° Ð°|Ñ†Ð° |Ñ†Ñ†Ð°| Ñž | Ð·Ð°|Ñ‹Ñ… |Ð¿Ð°Ð²|Ð° Ñ|Ð³Ð¾ |Ð²Ñ–Ð½|Ð´Ð½Ð°|Ð±Ð¾Ð´|Ð¼Ñ– |Ð²Ð°Ð±|Ð²Ð°Ð½|Ð°Ð¼ | Ð²Ñ‹| ÑÐ°| Ð´Ð°|ÑÑ‚Ð°|Ð°Ð²Ñ–|Ð½Ð½Ðµ|Ð°ÑÑ†|Ð½Ð°Ð¹|Ñ†Ñ‹Ñ|Ð½Ð°Ð³|Ð°Ñ€Ð°|Ñ– Ð½|Ðº Ð¼|ÑÐ³Ð¾| ÑÐ³|ÑŒÐ½Ð°|Ð¿Ñ€Ñ‹|Ð°Ñ†ÑŒ|Ñ– Ð¿|Ð¾Ð´Ð½|ÑÑ‚Ð²|Ð°Ð¼Ð°|Ð½Ñ‹Ñ…| Ð±Ñ‹|Ñ‚Ð²Ð°|Ð´Ð·Ðµ|Ð°Ð»ÑŒ| Ñ€Ð°|Ð½Ñ– |Ñ– Ñ|Ñ– Ð°|Ñ‹Ñ†ÑŒ|Ð° Ð±|ÐµÐ½Ð½|Ð»ÐµÐ½|Ñ†Ñ– |Ð¾ÑžÐ½|Ñ‹Ð¼ |Ñ€Ð°Ñ†|Ñ–Ð½Ð½|Ñ–Ñ… | Ð°Ñ| Ñ‚Ð°|Ñ‚Ð¾ |Ð½Ð°Ñ|ÑÐºÑ–| Ð´Ð·|Ñ‡Ñ‹Ð½|Ð¾Ð»ÑŒ|Ñ– Ð´|Ð°Ð²Ð¾|Ð°Ð´ | Ð½Ñ–|ÑÑ†Ñ–|Ñ‹Ð¼Ñ–|Ð½Ñ‹Ð¼|Ð±Ñ‹Ñ†|Ñ Ð¿|ÑŒÐ½Ñ‹|Ñ‹Ñ |Ð°Ñ€Ð¾|Ð°Ð½Ð°|Ñ–Ð½Ð°|Ñ– Ñ–|Ñ€Ð°Ð´| Ð³Ñ€|Ð»Ñ |ÑžÐ»Ðµ|Ð¾ Ð¿|Ð° Ñž|Ñ€Ñ‹Ð¼|Ð¿Ð°Ð´|Ñ‹Ñ– | Ñ–Ð½|Ð°Ð¼Ñ–|Ð´Ð·Ñ|Ñ€Ð°Ð¼|Ñ†Ñ‹Ñ–|Ð°Ð±Ð°|Ð° Ñ–|Ð´Ñƒ |Ð¶Ð½Ð°|ÑžÐ½Ð°|Ð½Ð°Ð»|Ð½Ð°Ñ†|Ñ€Ñ‹ |ÑÑ‚Ð°|Ð³ÑÑ‚| Ð³Ñ|Ð½ÐµÐ½|Ð´Ð° |Ð°Ñ… |Ð³Ñ€Ð°|ÐºÐ°Ñ†|ÑƒÐºÐ°|Ð° Ð·|ÐºÑ– |Ð°Ð´Ñ|Ñž Ñ–|Ð½ÑÑ‚|ÑÐ½Ð½|Ñ Ð°|Ð½Ð½Ñ–|Ð¾Ð´Ñƒ|Ð° Ñ€|Ð½Ð½Ð°|Ñ…Ð¾Ð´|Ð½Ð°Ð½|Ð¿ÐµÑ€|Ñ… Ð¿| Ñƒ |Ð°Ð´Ð·|Ñ– Ñ€|Ð¼Ð°Ð´|Ð¼ Ð¿|Ðµ Ð¼|Ð°Ð´Ñƒ|Ð´ÑÑ‚|Ð´Ð»Ñ| Ð´Ð»|Ð¾Ñž |Ð½Ð°Ðµ|Ñ– Ð¼|Ð°ÐºÐ¾| ÐºÐ°|Ñ‹ Ñž|Ð±Ð°Ñ€|Ðµ Ð°|Ð°Ñ†Ñ†|ÑƒÑŽ |Ñ‹Ñ†Ñ†|ÑÐ°Ð¼|ÑÑžÐ»|Ð°Ð»Ðµ|Ñ€Ð¾Ð´|Ñ€Ð°Ð±| Ð¿Ðµ|ÑˆÑ‚Ð¾| ÑžÑ|Ð°Ð´Ð½| ÑÑƒ|Ñ€Ð¾Ñž| Ñ€Ð¾|Ð´ÑƒÐº|Ð»ÑŽÐ±|ÑŒ Ñ| ÑˆÐ»|Ñ€Ð°Ð·|Ð½Ð°Ð²|Ð·Ð½Ð°|Ð²Ð¾Ð»|ÑƒÐ´Ð·|Ð°Ð´Ð°|Ð¶Ñ‹Ñ†|Ñ‡Ð½Ð°|Ð²Ðµ |Ð° Ñ‚|Ð°ÑÐ½|ÑÐ°Ñ†|ÐµÑ€Ð°| Ñ€Ñ|ÑÐºÐ¾|ÐºÐ»Ð°|Ð°Ð½Ñ‹| ÑˆÑ‚|ÑŒ Ñƒ|Ð°ÑŽÑ†|Ð½Ð°Ñ€| ÑƒÑ|ÑÐ¾Ð±|Ð°ÑÐ¾|Ð¿Ð°Ð¼|Ñ Ñž|Ð°Ð²Ñ|Ñ‡ÑÐ½|Ð²Ð¾Ñž|Ñ‚Ð°Ðº|Ð½Ñƒ |ÑŽ Ð°|ÑŒ Ð¿|Ð·Ð°Ðº|ÐºÐ°Ñ€|Ðµ Ñ–|ÑŒ Ð°|Ð±ÐµÑ|Ñ–Ñ |ÐºÑ–Ñ|Ñ… Ñ–|Ð·Ð°Ð±|Ð°ÑÐ°|Ñ–Ð¼ |Ð¶Ð°Ð²|Ñ– Ð·|Ð»ÐµÐ¶|Ñ‚Ð°Ð½|Ð°Ñ…Ð¾|ÑÐ»ÑŒ|Ñ‹ÑÐ»|Ð¾ Ñ|ÑÐ½Ð°|ÐºÐ°Ð½|Ð°ÐºÐ°|Ñ–Ð½Ñˆ|Ð°Ð»Ñ–|Ð²Ñ‹ | Ð¼Ð¾|Ð½Ð°Ñ…|Ñ Ñ|Ð¼ Ð½|Ð¾Ð³Ð°| Ð±Ðµ|Ð¹ Ð´|Ð¾ Ð°| ÑÑ‚|ÐµÐ½Ñ‹|Ñ– Ñž|Ð° Ð´|ÐµÑÐ¿|ÑˆÐ»ÑŽ|Ñ†Ñ†Ñ|Ñ‹ Ñ–|Ñ‹ÑÑ‚|Ñ€Ñ‹Ñ|Ð»ÑŽÑ‡|ÐºÐ»ÑŽ|Ñ‚Ð°Ñ†|ÑƒÐ»ÑŒ|Ñ‹Ð½Ñ|Ð°Ñ‡Ñ‹|ÑÐ¿Ñ€| ÑÐ¿|Ð°Ñž |Ñ‹Ð¼Ð°|Ð°Ñ€Ñ‹|ÐºÐ°Ð¼|Ðµ Ñž|Ñ– Ðº|ÐºÐ¾Ð½',
    bul: ' Ð½Ð°|Ð½Ð° | Ð¿Ñ€|Ñ‚Ð¾ | Ð¸ |Ñ€Ð°Ð²|Ð´Ð° | Ð´Ð°|Ð¿Ñ€Ð°|ÑÑ‚Ð²|Ð²Ð° |Ð° Ñ|Ð° Ð¿|Ð²Ð¾ |Ð½Ð¾ |Ð¸Ñ‚Ðµ|Ñ‚Ð° |Ð¾ Ð¸|ÐµÐ½Ð¸| Ð·Ð°|Ð½Ðµ | Ð½Ðµ|Ð° Ð½| Ð²Ñ|Ð²Ð°Ð½|Ð°Ð²Ð¾|Ð¾Ñ‚Ð¾|Ðµ Ð½|Ð¾ Ð½|Ð° Ð¸|ÐºÐ¸ |Ð¸Ðµ |Ñ‚Ðµ |Ð½Ð¸ |Ð¸Ð¼Ð°| Ð¸Ð¼|Ð»Ð¸ |Ð¸Ð»Ð¸|Ð¸Ñ | Ð¿Ð¾|Ð¾Ð²Ðµ|Ð°Ð½Ðµ|Ñ‡Ð¾Ð²|Ð¼Ð° | Ñ‡Ð¾|Ð¸ Ñ‡|Ð° Ð´|Ð½Ð¸Ðµ|Ð¸ Ð´|ÐµÑÑ‚| Ð¸Ð»|Ð°Ð½Ð¸|Ð²ÐµÐº|Ð²ÑÐµ| Ð¾Ð±|ÐµÐº |ÐµÐºÐ¸|ÑÐµÐº|Ð°Ð²Ð°|Ñ‚Ð²Ð¾|ÑÐ²Ð¾| ÑÐ²|Ð²Ð¾Ñ‚|Ð° Ð²|Ð¸ Ñ|Ð¾ÑÑ‚| Ñ€Ð°|Ð¾Ð²Ð°|Ð° Ð¾|Ðµ Ð¸|Ð²Ð°Ñ‚|Ð¸ Ð½|Ðµ Ð¿|Ðº Ð¸|Ð° Ð±| Ð² |Ð¸ Ð¿|Ð»Ð½Ð¾|Ð¾ Ð´| ÑÐµ|Ñ€Ð°Ð·|ÐµÑ‚Ð¾|ÑŠÐ´Ðµ|Ð±ÑŠÐ´| Ð±ÑŠ|Ð¿Ñ€Ð¸|Ð°Ñ‚Ð°| ÐºÐ¾| Ñ‚Ñ€| Ð¾Ñ| ÑÑŠ|Ð±Ð¾Ð´|Ð¾Ð±Ð¾|Ð²Ð¾Ð±|Ð°Ñ‚ |Ð·Ð° |Ñ‚ÐµÐ»| Ðµ |Ð°Ñ†Ð¸|Ð¾ Ñ|Ð´Ðµ |Ð¾ Ð¿|ÐµÐ½ |Ð±Ñ€Ð°|Ð¸ Ð²| Ð¾Ñ‚|ÑÐµ |Ð½Ð¸Ñ|Ð°Ð»Ð½| Ð´Ðµ|ÐµÐ³Ð¾|Ð½ÐµÐ³| Ð¸Ð·|Ð¾Ñ‚ |Ñ€Ð°Ð½|ÑÑ‚Ð°|ÐºÐ°Ðº|Ð¾Ð´Ð¸|Ðµ Ñ|Ð¸ Ð¸|Ð´ÐµÐ½|Ð¿Ñ€Ðµ|Ð±Ð²Ð°|ÑÐ±Ð²|Ñ€ÑÐ±|Ñ‚Ñ€Ñ|Ð½Ð¸Ñ‚| ÐºÐ°|ÑÐ²Ð°|Ð¿Ñ€Ð¾|ÑÑ‚ |Ð° Ð·|Ð³Ð¾Ð²|Ð²ÐµÐ½|Ñ‚Ð²Ðµ|Ð¾ Ð¾|Ð° Ñ€|Ð°ÐºÐ²|Ð¾ Ð²|Ð¸ Ð·|Ñ€ÐµÐ´|Ð½Ð¾Ñ|Ð¸ÑÑ‚|Ðµ Ð´|Ñ‰ÐµÑ|Ð½Ð¾Ð²| Ð½Ð¸|Ñ†Ð¸Ñ| Ð´Ð¾|Ð¹ÑÑ‚|Ð¾ Ñ‚|Ðµ Ñ‚|Ñ€Ð¶Ð°|ÑŠÑ€Ð¶|Ð´ÑŠÑ€|ÐµÐ½Ð¾|Ð¿Ð¾Ð»| Ñ |Ð¾Ð±Ñ€|Ñ‚Ð²Ð°|Ð½Ð¾Ñ‚|Ñ€ÐµÑ|ÐµÐ¹Ñ|Ð¸ Ð¾|Ðµ Ð²|ÐºÐ¾Ð¹|Ð¾Ð±Ñ‰|Ð»ÐµÐ½|Ð¾Ð½Ð°|Ð½Ð°Ñ†|Ð¸Ñ‡Ðµ|ÐµÐ· |Ð±ÐµÐ·| Ð±Ðµ|ÐµÐ¶Ð´|ÑƒÐ²Ð°|Ð²Ð¸Ñ‚|Ñ€Ð¸ |Ð·Ð°Ðº|Ð¸ Ðº| Ð»Ð¸|Ð° Ðµ|Ð¿Ð¾Ð´|ÐµÐ»Ð¸|Ð½Ð¸Ðº|ÑÐ¸ |Ðµ Ð¾|Ð° Ñ‚|Ð°Ð²Ð½|Ð¸ Ñ€|Ñ‚ Ñ|ÐºÐ° |Ð¾ÐµÑ‚|ÐµÐ»Ð½|Ð½ÐµÐ½|Ð¾Ð¹ |Ð³Ñ€Ð°|Ð¶ÐµÐ½|Ð´Ñ€Ñƒ| Ñ€Ðµ|Ð° Ðº|ÑÐ½Ð¾|Ð¾ÑÐ½|Ð»Ð¸Ñ‡|Ð·Ð¸ | Ñ‚Ð°|ÑÐ° |Ð½ÑÑ‚|Ð²Ð½Ð¸|Ñ‡ÐºÐ¸|Ð¸Ñ‡Ðº|ÑÐ¸Ñ‡|Ð²ÑÐ¸|Ð»ÑŽÑ‡|ÐºÐ»ÑŽ|Ð´Ð½Ð¾| Ð¼Ð¾|ÐµÐ¼Ðµ|Ð° Ñƒ|Ð¸Ð·Ð²|Ñ‚Ð²Ð¸|Ð´ÐµÐ¹|Ñ Ð½|ÐºÑ€Ð¸|Ð°Ñ‚Ð¾|Ð¾ Ñ€|Ð¹ Ð½|Ð¸ÐºÐ¾|Ð¸Ñ‡Ð½|Ð¶Ð°Ð²| Ð´ÑŠ| Ñ‚Ð¾|Ð±Ñ‰Ðµ|Ð¸Ð°Ð»| ÑÐ¾|Ð»Ð¸Ñ‚|Ñ‚ Ð½| ÑÐ¸|Ñ‚ Ð¸|Ð¾Ð´Ð½|Ð¶Ð´Ð°|Ð·Ð¾Ð²|Ð°Ð·Ð¾|ÑƒÑ‡Ð°| Ð³Ñ€|ÐºÐ¾Ðµ|Ñ‚ÑŠÐ¿|ÑÑ‚ÑŠ|Ð²Ð¾Ð»|Ð»Ð½Ð¸|ÑÑ€Ðµ| ÑÑ€|ÐºÐ²Ð°|ÐºÐ¾Ð½|Ñ‚Ð½Ð¾|Ð°ÐºÐ°|Ð¸ Ñƒ|ÐºÐ¾ |Ð³Ð°Ð½|Ð¾Ð´Ð°|Ñ‡ÐµÐ½|Ð»ÑÑ‚|ÐµÐ»Ñ|ÑÑ‚Ñ€| ÐºÑŠ|ÑÑ‚Ð°|Ñ€Ð¾Ð´|Ð½Ð°Ñ€|Ð¸ Ð¼|Ð½Ð°Ð»|Ñ€ÑƒÐ³| Ð´Ñ€|Ñ‡ÐµÑ|Ð²ÑŠÐ·|Ð´Ð¸ | ÑÐ°| Ñ‚Ðµ|ÑÑ‚Ð¾|Ð´Ð¾Ñ|Ñ€Ð°Ð¶|Ñ€ÐµÐ·|Ñ‡Ñ€Ðµ|Ð³Ð°Ñ‚|ÐµÐ¾Ð±|Ð° Ð¼|Ð¾ Ðµ|Ð¸Ð½Ðµ|Ð°ÑÑ‚|Ð¾Ð²Ð¾|Ñ‡Ð½Ð¾|Ð°Ð²Ðµ|Ð¼Ñƒ | Ð¼Ñƒ|Ð°Ð½Ð¾|Ð¸Ñ‚Ð°|Ð¸Ð¼Ð¸|Ð°ÐºÐ¾|Ð½Ð°Ðº|Ð»Ð°Ð³|Ð¾Ð²Ð¸',
    kaz: 'Ð½Ðµ | Ò›Ò±|ÐµÐ½ |Ò±Ò›Ñ‹| Ð±Ð°| Ò›Ð°|Ò›Ò±Ò›|Ñ‹Ò› |Ò“Ð° | Ð¶Ó™|Ó™Ð½Ðµ|Ð¶Ó™Ð½| Ð½Ðµ| Ð±Ð¾|Ð´Ðµ |Ð´Ð°Ð¼|Ð°Ð´Ð°|Ð° Ò›|Ñ‚Ð°Ñ€|Ñ‹Ð½Ð°| Ð°Ð´|Ñ‹Ð»Ñ‹| Ó™Ñ€|Ñ‹Ò£ |Ð°Ð½ |Ñ–Ð½ |Ò›Ñ‹Ð»|Ð°Ñ€ |ÐµÐ¼Ðµ|Ð½Ð° |Ñ€ Ð°|Ð»Ñ‹Ò›|ÑƒÒ“Ð°|Ð°Ð»Ð°|Ñ‹Ò›Ñ‚| Ó©Ð·|Ð¼ÐµÑ|Ó™Ñ€ | Ð¶Ð°|Ð¼ÐµÐ½|Ñ‹Ò“Ñ‹|Ð»Ñ‹ | Ð´Ðµ|Ò›Ñ‚Ð°|Ð½Ñ‹Ò£|Ð½ Ò›|Ò“Ð°Ð½|Ñ–Ð½Ðµ|Ð±Ð°Ñ|Ð°Ñ€Ñ‹| Ð¼Ðµ| Ò›Ð¾|ÐµÐºÐµ|Ñ‹Ð½ |Ð´Ð° |Ðµ Ò›|Ð´Ñ‹ |Ð°ÑÑ‹|ÑÐµ |ÐµÑÐµ|Ð°Ð¼ |Ð±Ð¾Ð»|Ð°Ð½Ð´|Ð½ÐµÐ¼| Ð±Ñ–|Ð°Ñ€Ð°|Ñ‹ Ð±|ÑÑ‚Ð°|Ñ‚Ð°Ð½|Ð½Ð´Ñ‹|Ð½ Ð±|Ñ–Ò£ |Ðµ Ð±|Ñ–Ð»Ñ–|Ñ‚Ð¸Ñ–| Ñ‚Ð¸|Ð±Ð°Ñ€|Ò“Ñ‹ |Ð½Ð´Ðµ|ÐµÑ‚Ñ‚|Ð¸Ñ–Ñ|Ò›Ñ‹Ò“|Ñ–Ñ |Ð»Ð°Ñ€|Ð³Ðµ |Ñ‹ Ñ‚|Ñ–Ð½Ð´|Ñ–Ðº |Ð±Ñ–Ñ€| Ð±Ðµ| ÐºÐµ|Ð°Ð»Ñƒ|Ðµ Ð°|Ð°Ð»Ñ‹|Ð»ÑƒÑ‹|Ð° Ð¶|ÐµÑ€Ñ–|Ð¾Ð»Ñ‹| Ñ‚Ðµ|Ò›Ñ‹Ò›|Ð½ Ðº| Ñ‚Ð°|Ð½ Ð¶|Ò“Ñ‹Ð½|Ñ‚Ñ‚Ñ–|Ñ–Ð½Ñ–|Ñ‚Ñ‹Ð½| ÐµÑ€|Ð½Ð´Ð°|Ñ–Ð¼ | ÑÐ°|Ðµ Ð¶|Ð°Ñ‚Ñ‹| Ð°Ñ€|Ñ€Ò“Ð°|ÐµÑ‚Ñ–|Ð°Ð½Ð°|Ñ‹ Ó™|ÑƒÑ‹Ð½|Ð»Ò“Ð°|Ó©Ð·Ñ–|Ð¾ÑÑ‚|ÐµÐ³Ñ–|Ñ‚Ñ–Ðº|Ò›Ð° |ÑÒ›Ð°|Ñ€Ñ‹Ð½|ÐºÑ–Ð½|Ð»ÑƒÒ“|Ò£ Ò›|Ð½Ñ–Ò£|ÑƒÑ‹ |Ð±Ð¾Ñ|Ð°ÑÒ›|Ò›Ð°Ñ€|Ð´Ñ‹Ò›|Ð½Ð°Ð½|Ð¼Ñ‹Ñ|Ð¼Ð½Ñ‹|Ð°Ð¼Ð½|Ñ‹ Ð¼|Ð°Ð¹Ð´|ÐºÐµ | Ð¶Ðµ|Ð·Ñ–Ð½|Ñ€Ð´Ðµ|Ñ€Ñ–Ð½|Ðµ Ñ‚|Ð³ÐµÐ½|Ñ‹Ð¿ |Ñ€Ñ‹ |Ñ‚Ñ– |ÑÑ‹Ð½|Ò›Ð°Ð¼|Ð´ÐµÐ½|Ñ– Ð±|Ð³Ñ–Ð·|Ñ€Ð°Ð»|Ðµ Ó©|Ð»Ð°Ð½|ÑÑ‹ |Ð°Ð¼Ð°|Ñ‚Ñ‚Ð°|Ñ‚Ñ‹Ò›|Ð±ÐµÑ€|Ð´Ñ– |Ð±Ñ–Ð»|Ñ€ÐºÑ–|Ó©Ð· |Ð·Ð´Ðµ|ÐºÐµÑ‚|Ò›Ð¾Ñ€|Ð´Ð°Ð¹|ÑƒÐ³Ðµ|Ñ‹ Ðµ|Ñ‹Ð½Ð´|Ð½ÐµÐ³|Ð¾Ð½Ñ‹|ÐµÐ¹ |Ð¼ÐµÑ‚|Ð°Ð½Ñ‹|Ð° Ñ‚|Ð¶Ð°Ñ|Ð°ÑƒÑ‹|Ð»Ð³Ðµ|Ð°ÑÐ°|ÐµÐ³Ðµ|Ð´Ð°Ñ€|Ñ€Ñƒ |Ð°Ñƒ |ÐµÑ€Ðº|Ñ‹ Ð¶|Ñ€Ñ‹Ð»| Ñ‚Ð¾|Ð½ Ð½|Ðµ Ð½|Ñ‚Ñ–Ð½|Ñ–Ñ€ |ÑÑ–Ð·|Ñ‚ÐµÑ€|Ð»Ð¼Ð°|Ñ– Ñ‚|ÐºÑ–Ð¼| Ð°Ð»|Ñ€ Ð¼|Ð»Ñ–Ðº| Ð¼Ò¯|Ðµ Ð¼|Ñ‚Ò¯Ñ€| Ñ‚Ò¯|ÐºÐµÐ»|Ð»Ñ‹Ð¿|ÐµÒ£ |Ñ‚ÐµÒ£|Ñ€Ð»Ñ‹|Ð»Ñ–Ð¼|Ñ€Ð´Ñ‹|Ð°Ñ€Ð´|Ð°Ñ‚Ñ‚|Ñ Ð±|Ñ‹Ñ€Ñ‹|ÑÑ‹Ð·|Ñ‹Ñ |ÐµÐ»Ð³|Ð´Ð°Ð»|Ð¹Ð´Ð°|Ð¾Ñ€Ò“|Ñ€Ò›Ñ‹|Ð°Ñ€Ò›| Ð¶Ò¯|Ñ‚Ð°Ð»|Ñ‹Ð»Ð¼|Ð° Ð±|Ñ–Ð³Ñ–|Ð»Ð´Ðµ|Ñ–Ð· |Ò›Ñ‚Ñ‹| ÐµÑˆ|Ð´ÐµÐ¹|Ð°Ð¹ |Ð¶Ð°Ò“|ÐºÑ‚Ñ–|Ñ–ÐºÑ‚|Ð³Ñ–Ð½| Ó™Ð»|Ñ‚Ñ‚Ñ‹|Ò±Ð»Ñ‚| Ò±Ð»|Ðµ Ð´|Ñ‹Ð½Ñ‹|Ð»Ñ–Ð½|Ñ€ Ð±|ÐµÐ»Ðµ|ÐºÒ±Ò›| ÐºÒ±|Ð°Ð¼Ð´|Ð¼ Ð±| ÐµÑ‚|Ð¾Ò“Ð°|Ò›Ò±Ñ€| ÐºÓ©|Ð°Ò“Ð°|Ñ‚Ð¾Ð»|ÑˆÑ–Ð½|Ð°Ð¹Ñ‹| Ò›Ñ‹|Ò›Ð°Ð»|Ð¶ÐµÐº|Ñ– Ð½|ÐµÑ |Ð°Ò“Ñ‹|Ðµ Ð¾|ÐµÐ»Ñ–| ÐµÐ»|Ð½ Ðµ|Ð·Ñ– |ÑˆÐºÑ–|ÐµÑˆÐº|Ð¾Ð»Ñƒ|Ñ†Ð¸Ñ|Ð¼Ð°Ñ|Ò“Ð´Ð°|Ð°Ò“Ð´|Ð»Ñ‚Ñ‚|Ñ–Ð¼Ð´|Ð½Ñ‹Ð¼| Ð´Ð°|Ð° Ð´|Ó™ÑÑ–|Ñ Ó™|Ò›Ð°Ñ‚|Ñ–Ñ€Ñ–| ÑÐ¾|Ò£ Ð±|Ð°Ð·Ð°|Ð¼Ð´Ð°|Ð°Ð¹Ð»| Ð°Ñ|Ò“Ð°Ð¼|Ò›Ð¾Ò“'
  },
  Arabic: {
    arb: ' Ø§Ù„|ÙŠØ© |ÙÙŠ | ÙÙŠ|Ø§Ù„Ø­| Ø£Ùˆ|Ø£Ùˆ | ÙˆØ§|ÙˆØ§Ù„|Ø­Ù‚ |Ø© Ø§|Ù„Ø­Ù‚|Ø§Ù„Øª|ÙƒÙ„ |Ø§Ù„Ù…|Ù„ÙƒÙ„| Ù„Ùƒ|Ù„Ù‰ |Ù‚ Ù|ØªÙ‡ |Ùˆ Ø§|Ø© Ùˆ|Ø´Ø®Øµ|Ø© Ù„|Ø§Øª |Ø§Ù„Ø£|ÙŠ Ø£|ÙˆÙ† | Ø´Ø®|Ù… Ø§|Ø£ÙŠ | Ø£ÙŠ|Ø§Ù† |Ø£Ù† |Ù…Ø© |ÙŠ Ø§|Ø§Ù„Ø§|Ù„Ø§ |Ù‡Ø§ |Ø§Ø¡ | Ø£Ù†| Ø¹Ù„|Ø®Øµ |Ù† Ø§| Ù„Ù„|Ø¯ Ø§|Ù…Ù† |ÙØ±Ø¯|Ù…Ø§ |Ø§Ù„Ø¹|Øª Ø§|Ø­Ø±ÙŠ|Ø¹Ù„Ù‰|Ù„ Ù|Ø±Ø¯ |Ù„ Ø´| Ù„Ø§|Ø±ÙŠØ©| Ø¥Ù„|Ø© Ø£|Ø§ Ø§|Ù† ÙŠ| ÙˆÙ„|Ø§ Ù„|Ø§ ÙŠ| ÙØ±| Ù…Ù†|Ø© Ù…|Ø§Ù„Ù‚|Ø¬ØªÙ…|Ù† Ø£|Ù‚ Ø§|Ø§Ù„Ø¥| Ø­Ø±|Ù„Ù‡ |Ù‡ Ù„|Ø§ÙŠØ©|Ù„Ùƒ |Ù‡ Ø§| Ø¯Ùˆ|Ø¯Ø© |Ø§Ù‹ |ÙŠÙ† |Ù‡ Ùˆ|Ù„Ø© |ÙŠ Ø­| Ø¹Ù†|Ù…Ø§Ø¹|ÙŠ Øª|Ø°Ø§ | Ø­Ù‚|Ù‚ÙˆÙ‚|Ø­Ù‚Ùˆ|ØŒ Ùˆ|Ù† Øª|Ù…Ø¹ |Øµ Ø§|Ø§Ù… |Ø¯ Ø£| ÙƒØ§|Ù‡Ø°Ø§|Ø§Ù„Ùˆ| Ø¥Ù†|Ù…Ù„ |Ø§Ù…Ø©|Ø¹ Ø§|Ø¥Ù„Ù‰|Ø© Ø¹|Ù…Ø§ÙŠ|Ø­Ù…Ø§|Ù† Ùˆ|Ù„ØªØ¹| ÙˆÙŠ|ÙŠØ± |Ù†ÙˆÙ†|ÙŠ Ùˆ|Ø§Ø³ÙŠ|Ø§Ù„Ø¬| Ù‡Ø°|Ù†Ø³Ø§|ÙˆÙ‚ |ØªØ±Ø§|Ø¹ÙŠØ©|Ù‡ Ø£| Ù„Ù‡|Ø³ÙŠØ©| ÙŠØ¬| Ø¨Ø§|Ø¯ÙˆÙ„|Ø§Ù†Ùˆ|Ù‚Ø§Ù†|Ù„Ù‚Ø§|Ø© Ø¨|Ø© Øª|ØªÙ…Ø§|Ø§Ù„Ø¯|ÙŠØ§Øª|Ø¹ Ø¨|Ø³Ø§Ù†|Ø¥Ù†Ø³|Ù‡Ù… |Ø¹Ù„ÙŠ| Ù…Øª|Ù„Ù…Ø¬|Ø°Ù„Ùƒ|Ø¹Ù…Ù„|Ù„Ø£Ø³|ÙˆØ² |Ø¬ÙˆØ²|ÙŠØ¬Ùˆ|Ø¨Ø§Ù„|ØºÙŠØ±|Ùƒ Ø§|ÙƒØ§Ù†|Ø³Ø§Ø³|Ø£Ø³Ø§|Ø¯Ù… |Ù„Ø§Ø¯|Ø§Ø¹ÙŠ|Ø§Ù„Ø±|ØªÙ…ÙŠ|Ø¯ÙˆÙ†|ØªÙ…Øª|Ù„ØªÙ…| ÙŠØ¹|Ù„ÙŠÙ‡|Ø³Ø§Ùˆ|Ø§Ø¬Øª|ÙŠ Ù…|Ù„Ø¹Ø§|Ù„Ø¬Ù…|ØªØ¹Ù„|Ø± Ùˆ|ØªÙ…Ø¹|Ù…Ø¬Øª| Ù…Ø¹|ÙŠÙ‡ |Ù‰ Ø£|ÙÙŠÙ‡|Ù‰ Ø§| ÙƒÙ„|Ù„Ø§Øª|Ù…Ù„Ø§|ÙˆØ¯ |Ø§Ù†Øª|Ø§Ù„Ù|ÙŠÙ‡Ø§|ÙŠ Ø¥|ØªÙŠ |Ø§Ù„Ø¨|Ù„ÙŠ |Ù‚Ø¯Ù…|Ø§Ù„ |Ø§Ø¯ |Ù„ Ø§|ÙŠØ² |ÙŠÙŠØ²|Ù…ÙŠÙŠ| ØªÙ…|Ù„Ø­Ø±|ØªØ¹ |Ù…ØªØ¹|Ø§ Ø¨|Ø¹Ø§Ù…|Ø§ Ùˆ|Ù‚ Ùˆ|Ø±Ø§Ù…|Ù„ Ù„|Ù„Ø§Ø¬|Ø±Ø§ |Ø§Ù„Ø´| ÙˆØ¥|ÙŠÙ… |Ù„ÙŠÙ…|Ø´ØªØ±|Ø§ Ø­|ÙˆØ§Ø¬|Ù„Ø²Ùˆ|ÙˆÙ„ |Ø§ Ù|ÙˆÙ„Ø©|Ù„Ø­Ù…|Ø£Ø³Ø±| Ø°Ù„|Ù‡ Ù|Ø§ØªÙ‡|Ù…Ø³Ø§|Ù„Ù…Ø³| ØªØ¹|Ø¹Ù† |Ù‡ Ø¹|ÙˆÙ„Ù‡|ÙŠØªÙ‡|Ù† Ù„|Ø±Ø© | ÙˆØ³|Ø§Ø© |ÙŠØ¯ | ØªØ­| Ù…Ø³|ÙŠ ÙŠ|Ù„ØªÙŠ|Ø¹Ø© |ÙˆÙ„ÙŠ|Ù„Ø¯Ùˆ| Ø£Ø³| ÙˆÙ|Ù„ Ùˆ|Ø£ÙŠØ©|Ù†ÙŠ |Ø§Ù„Ø³|Ù„Ø§Ù†|Ù„Ø¥Ø¹|Ø© Ù|Ø±ÙŠØ§|Ù„ Ø¥|Ù… Ø¨|Ø§Ù…Ù„|ÙƒØ±Ø§|ØªØ³Ø§|Ù…ÙŠØ¹|Ø¬Ù…ÙŠ| Ø¬Ù…|Ø£ÙˆÙ„|Ø¨ÙŠØ©|Ø¹ÙŠØ´|ØªØ­Ù‚|Ø§Ø¯Ø©|Ø³ Ø§| Ù…Ù…|Ù…Ø¹ÙŠ|Ø¬Ù…Ø§|Ø¹Ø§Øª|Ø§Ø¹Ø§|Ø§Ø±Ø³|Ù…Ø§Ø±|Ù…Ù…Ø§|Ù… Ùˆ|Ø±Ø§Ùƒ|Ø§Ø´Øª|Ø§Ù„Ø·|Ø§Ø¬ |Ø²ÙˆØ§|Ø§Ù„Ø²| ÙˆÙ…|Ø­Ø¯Ø©|ØªØ­Ø¯|Ù„Ù…Øª|Ù…Ù… |Ù„Ø£Ù…|Ø¯Ù‡ |Ø¨Ù„Ø§| Ø¨Ù„|Ø§Ø± |ÙŠØ§Ø±|ØªÙŠØ§|Ø®ØªÙŠ|Ø§Ø®Øª|Ù† Ù…| Ù…Ø±',
    urd: 'ÙˆØ± | Ø§Ùˆ|Ø§ÙˆØ±|Ú©Û’ | Ú©Û’| Ú©ÛŒ| Ú©Ø§|ÛŒÚº | Ø­Ù‚|Ú©ÛŒ |Ú©Ø§ | Ú©Ùˆ|Ø¦Û’ |Û’ Ú©|ÛŒØ§ |Ø³Û’ |Ú©Ùˆ |Ø´Ø®Øµ| Ø´Ø®|Ù†Û’ | Ø§Ø³| ÛÛ’|Ù…ÛŒÚº|Ø­Ù‚ | ÛÙˆ| Ù…ÛŒ|Ø®Øµ |Û’ Ø§| Ø¬Ø§|Ø§Ø³ | Ø³Û’| ÛŒØ§|ÛØ± |ÛŒ Ø§| Ú©Ø±| ÛØ±|Û’Û” |Ø³ÛŒ |ÛÛŒÚº|Ø§ Ø­|Øµ Ú©|ÙˆÚº |Û’ Ù…| Ø§Ù†|Ø± Ø´|Û” Û|Ø§Ø¦Û’|Ø²Ø§Ø¯|Ø¢Ø²Ø§| Ø¢Ø²|Ø§Ù… |Ø± Ø§|Ù‚ Û|Ø§Ø¯ÛŒ|Ø¬Ø§Ø¦|Úº Ú©|ÛÛ’Û”|Ù… Ú©| Ú©Ø³|Ø§ Ø¬|ÛŒ Ú©|Ø³ Ú©|Ú©Ø³ÛŒ| Ù¾Ø±|Û’ Ú¯|ÛÛ’ |Ø§Ø± |Øª Ú©|Ø¯ÛŒ |Ù¾Ø± |Ùˆ Ø§| Ø­Ø§| Ø¬Ùˆ| ÛÛŒ|Ø§Ù† |ÛŒ Ø¬|Ø±ÛŒ | Ù†Û| Ù…Ø¹|Ø¬Ùˆ |Ù„ Ú©|ÛŒ Øª|Ù† Ú©|Ú©Ø±Ù†|Ø¦ÛŒ |Ù„ Û|ØªÛŒ |ÛÙˆ |Û Ø§| Ø§ÛŒ|ØµÙ„ |Ø§ØµÙ„|Ø­Ø§Øµ|Ø±Ù†Û’|ÛŒ Ø´|Ù†Û |Û” Ø§|ÚºÛ” |ÛŒÚºÛ”|Ø± Ú©|Ø± Ù…| Ù…Ù„|ÙˆÛ |Ù…Ø¹Ø§|Ø±Û’ |Úº Ø§|Ù†ÛÛŒ|Û’ Û|Û’ Ø¨|Ø§ÛŒØ³|Û’ Ù„| ØªØ¹| Ú¯Ø§|ÛŒØª |ÛŒ Ø­|Ø§ Ø§|ÛŒ Ù…|Ø§Ù¾Ù†| Ø§Ù¾|Ú©ÛŒØ§|Ù…ÛŒ |ÛŒ Ø³| Ø¬Ø³|Û Ú©|Ù†ÛŒ |Ø§Ø´Ø±|Ø¹Ø§Ø´| Ø¯Ùˆ|Ù„Ø¦Û’| Ù„Ø¦|Ø§Ù†Û|ÙˆÙ‚ |Ù‚ÙˆÙ‚|Ø­Ù‚Ùˆ|Ù…Ù„ | Ù‚Ø§|Ú©Û | Ú¯ÛŒ|Ø± Ø¨|Û Ù…| ÙˆÛ| Ø¨Ù†|ÛŒ Ø¨|Ù…Ù„Ú©|Ø¬Ø³ |Ø§Û” |Ø±ÛŒÙ‚|Ø± Ù†|Û’ Ø¬|Ø§Ø¯ |Ø§Øª |Ú¯ÛŒ |Ø¯ Ú©|Û’ Ø­|Ø¯Ø§Ø±|Ø± Û|Ú¯Ø§Û”|Ù‚ÙˆÙ…| Ù‚Ùˆ|Û’ØŒ |Ø§ Ø³|Ø¯ÙˆØ³|Ø± Ù¾| Ùˆ | Ø´Ø§|ÛŒ Ø¢|Úº Ù…|Ù‚ Ø­| Ù¾Ùˆ| Ø¨Ø§|Ø®Ù„Ø§|Ø§Ù†Û’|ÛŒÙ… |Ù„ÛŒÙ…|Ùˆ Øª|ÙˆÙ† | Ú©Û|ÛŒØŒ |Û” Ú©|Ø§ Ù¾|Ù† Ø§|Ù„Ú© |Ø¹Ù„Ø§|Ø§ Ù…|Ù‚ Ú©|Ø§Ø¦ÛŒ|ÙˆØ³Ø±|ÛŒ Û|ÙˆØ¦ÛŒ|ÛŒØ± |Ø§ Û|Ø¹Ù„ÛŒ|Ùˆ Ú¯|ÙˆØ±ÛŒ|Ø¯Ú¯ÛŒ|Ù†Ø¯Ú¯|Ùˆ Ú©|ÛŒØ³Û’| Ù…Ù†|Ø§Ø¦Ø¯|Ø±Ø§Ø¦| Ù…Ø±|Ù¾ÙˆØ±| Ø·Ø±|ÙˆÙ…ÛŒ|Û’ Ø®|Ø³Ø¨ |Ù†ÙˆÙ†|Ø§Ù†Ùˆ|Ù‚Ø§Ù†| Ø³Ú©|ÙˆØ§Ù…|ÛŒÙ† | Ø±Ú©|ØªØ¹Ù„|Ù„Ø§Ù‚|ØºÛŒØ±|Ø¯Ø§Ù†|ØŒ Ø§| Ø¨ÛŒ| Ù…Ø³|ÛŒÙˆÚº|Ù†Ø§ | Ø¨Ú¾| Ø¨Ø±|Ø±ØªÛŒ|Ø§Ø¯Ø§|Ø§Ù…Ù„|ÛŒÛ | ÛŒÛ|Û Ùˆ| Ø¹Ø§|ÛŒ Ù¾| Ø¨Ú†|Ø§Ù |Ù„Ø§Ù| Ø®Ù„|ÛŒÛ” |Ú¯ÛŒÛ”| Ø¯ÛŒ|Ú¾ÛŒ |Ø¨Ú¾ÛŒ|Ø¯Û |Ø¬Ø§ |Ù¾Ù†ÛŒ|Ù‚ÙˆØ§|Ø§Ù‚Ùˆ|Ø±Ú©Ú¾|Û’ ÛŒ| Ø¹Ù„|Ú©ÙˆØ¦|ØŒ Ù…| Ú†Ø§|Û’ Ø³|Ø± Ø¹| Ù¾ÛŒ|Ø¨Ø±Ø§|Ø± Ø³|Ø± Ø­|Ø³Ø§Ù†|Ù… Ø§|Ú©Ø§Ù…|Ø´Ø±Øª| Ø±Ø§|Ø´Ø§Ù…|Ù…Ù† |Ø²Ù†Ø¯| Ø²Ù†|Ø¨ Ú©|Øª Ù…|Ø§Û |Ø§Ø±ÛŒ|Ø³ Ù…|Ø± Ø¬| Ù…Ø­|ÙˆØ±Ø§|Û’ Ù¾|Ø·Ø±ÛŒ|ÛÙˆÚº|Ø§Ù„ |Úº Ø³|ÛŒ Ù†|Ú©Ø±Û’| Ù…Ù‚|Øª Ø³|ØªØ­Ù| ØªØ­|ÙˆÛ” |ÛÙˆÛ”|Ø¨Ù†Ø¯| Ø§Ù‚|Ø¯ Û| Ø§Ù…|Ø§Ù…ÛŒ|Ø§Ù„Ø§|Ù„Øª |Ø´Ø±Û’|Û’ Ø¹|Ø§ Ú©|ÙØ±ÛŒ',
    pes: ' Ùˆ | Ø­Ù‚| Ø¨Ø§|Ù†Ø¯ |Ø±Ø¯ |Ø¯Ø§Ø±| Ø¯Ø§|Ú©Ù‡ |Ù‡Ø± | Ø¯Ø±| Ú©Ù‡|Ø¯Ø± | Ù‡Ø±|Ø± Ú©|Ø­Ù‚ |Ø¯ Ù‡|Ø§Ø² |ÛŒØª | Ø§Ø²|ÛŒØ§ |Ú©Ø³ |ÙˆØ¯ |Ø§Ø±Ø¯| ÛŒØ§| Ú©Ø³|Ø§ÛŒ |Ø¯ Ùˆ| Ø¨Ø±| Ø®Ùˆ|Ù‚ Ø¯|Ø¨Ø§Ø´|Ø´Ø¯ |Ø¯ Ú©|Ø§Ø± |Ø¯ Ø¨| Ø±Ø§|Ù‡ Ø¨|Ø§Ù† |Ø¢Ø²Ø§| Ø¢Ø²|Ø±Ø§ |Ø§Ø´Ø¯|ÛŒ Ùˆ|Ù‡ Ø§|ÛŒÙ† |ÛŒØ¯ |Ø²Ø§Ø¯|Ø³ Ø­|Ø®ÙˆØ¯|ÛŒ Ø¨| Ø§Ø³|Ø¯Ù‡ |Ø¯ÛŒ |ÙˆØ± |Ø§ÛŒØ¯|Ù‡ Ø¯|Ø±ÛŒ |Ùˆ Ø§|ØªÙ…Ø§|Ø§Øª | Ù†Ù…|ÛŒ Ú©|Ø§Ø¯ÛŒ|Ù†Ù‡ |Ø±Ø§ÛŒ|Ø¯ Ø§| Ø¢Ù†|Ø§Ø³Øª|Ø± Ø§|Ø± Ù…| Ø§Ø¬|Ù…Ø§ÛŒ|ÙˆÙ† |Ù‚ÙˆÙ‚|Ø­Ù‚Ùˆ|Ùˆ Ù…| Ø§Ù†|Ø§Ù†Ù‡| Ù‡Ù…|ÙˆÙ‚ |Ø§ÛŒØª| Ø´Ùˆ|ÛŒ Ø§| Ù…Ùˆ| Ø¨ÛŒ|Ø¨Ø§ | ØªØ§|ÙˆØ±Ø¯|Ø§Ù†Ùˆ|Ø³Øª |ÙˆØ§Ù†|Ø¨Ø±Ø§|Ø§Ù… |Ø´ÙˆØ¯|Ø¢Ù† |Ø¬ØªÙ…|ÛŒ ÛŒ| Ú©Ù†|Ø± Ø¨|Ú©Ù†Ø¯| Ù…Ø±|Øª Ù…|Ù‡Ø§ÛŒ|Øª Ø§| Ù…Ø³|ÛŒØŒ |Ù…Ø§Ø¹|Ø§Ø¬Øª|ØªÙˆØ§|ÛŒÚ¯Ø±|Ùˆ Ø¨|Ø¯Ø§Ù†|Øª Ùˆ|Ø§ Ù…| Ø¨Ø¯|Ø¹ÛŒ |Ú©Ø§Ø±| Ù…Ù†|Ù…ÙˆØ±| Ù…Ù‚|ÛŒ Ø¯| Ø²Ù†|ÛŒ Ù…|Ù† Ø¨|Ø± Ø®|Ø§Ù‡ |Ø§ Ø¨|Ø§Ø±ÛŒ|Ø¯ Ø¢|Ù…Ù„ | Ø¨Ù‡|Ø§Ø¹ÛŒ|Ø¯ØŒ |Ø¯ÛŒÚ¯|Øª Ø¨|Ø¨Ø§ÛŒ|Ø§ÛŒÙ†| Ù…ÛŒ|Ù† Ùˆ|Ù‚ Ù…| Ø¹Ù…| Ú©Ø§|Ù† Ø§|Ùˆ Ø¢| Ø­Ù…|Ù†ÙˆÙ†|Ù‡ Ùˆ|Ùˆ Ø¯|Ø¯ Ø´| Ø§ÛŒ|Ø´ÙˆØ±|Ú©Ø´Ùˆ| Ú©Ø´|Ù„ÛŒ |Ù†ÛŒ |Ù‡ Ù…|Ø¨Ø¹ÛŒ|Ø± Ø´|ÛŒÙ‡ | Ù…Ù„|Ù…ÛŒØª|ÛŒ Ø±|Ø±Ù†Ø¯| Ø´Ø±|Ù…ÛŒ |ÙˆÛŒ |Ø³Ø§Ùˆ|Ù‚Ø§Ù†| Ù‚Ø§|Ù…Ù‚Ø§|Ø§Ùˆ | Ø§Ùˆ|Ø¯ Ù…|Ú¯ÛŒ |Ù†Ù…ÛŒ| Ø§Ø­| Ù…Ø­|Ù…ÛŒÙ†|Ø¦ÛŒ |Ø§Ø¯Ø§| Ø¢Ù…|Ø®ÙˆØ§|Ú¯Ø±Ø¯| Ú¯Ø±|Ù…Ù†Ø¯| Ø´Ø¯|Ø§Ø¦ÛŒ| Ø¯ÛŒ|Ø² Ø­|Ù‡ÛŒÚ†| Ù‡ÛŒ|Ø§Ø¯Ù‡| Ù…Øª|Ù†Ù…Ø§|Øª Ú©|Ø±Ø§Ù†| Ø¨Ù…|Ù† Ø­|Ø± Øª|Ø­Ù…Ø§|Ø§Ø±Ù†|Ù…Ø³Ø§|Ø¯Ú¯ÛŒ|ÙˆÙ…ÛŒ|Ù† Øª|Ù…Ù„Ù„|Ø¨Ø± |Ù‡Ø¯ |ÙˆØ§Ù‡|Ø¨Ù‡Ø±| Ø§Ø¹|â€ŒÙ‡Ø§|Ù‚ Ùˆ|ØŒ Ø§|Ø¹ÛŒØª|ÛŒØªÙˆ|Ø§ Ø±|Ù† Ù…| Ø¹Ù‚|Ù‡Ù…Ù‡|Ø§ Ù‡|Ø²Ø´ |ÙˆØ²Ø´|Ù…ÙˆØ²|Ø¢Ù…Ùˆ|Ø§Ù†Øª|ØªÛŒ |Ø¬Ø§Ù…|Ù…ÙˆÙ…|Ø¹Ù…Ùˆ|ØªØ®Ø§| ÙØ±|Ø·ÙˆØ±|Ø¯ Ø¯|Ù‡ Ø­|Ø±Ø¯Ø§|Ø§ÙˆÛŒ|Ù†ÙˆØ§|Ø§Ù†ÛŒ|Ø±Ø§Ø±| Ù…Ø¬|ÛŒ Ù†|Ø­Ø¯ÛŒ|Ø§Ø­Ø¯|Ù†Ø¯Ú¯|Ø²Ù†Ø¯|Ø´Ø®Øµ| Ø´Ø®|â€ŒÙ…Ù†|Ù‡â€ŒÙ…|Ø±Ù‡â€Œ|Ù‡Ø±Ù‡|Ø´Ø¯Ù‡|Ø¹ Ø§|Ùˆ Ù‡|Ø§Ø³ÛŒ|Ù‡Ù” |ÛŒØ¯Ù‡|Ø¹Ù‚ÛŒ|Ø§ Ø§|Ù…Ù‡ | Ø¨Ø´|Ø§Ø¯ |Ø¯ÛŒÙ‡|Ø§ Ø¯|Ø¯ÙˆØ§|ÛŒ Ø­|Ø§Ø¨Ø¹|ÛŒ Øª|Ø®Ø§Ø¨|Ù†ØªØ®|Ø±ÙˆØ±|Ùˆ Ø±|Ø´Ø±Ø§| Ø®Ø§|Ù”Ù…ÛŒ|Ø§Ù”Ù…|ØªØ§Ù”|Ø§Ù‹ |Ø§Ù…Ù„|Ù„Ù‡ |Ø¯ Ø±|Ø§Ø³Ø§|Ø®ÙˆØ±|Ø¨Ù„ |Ø§Ø¨Ù„|Ù‚Ø§Ø¨|ÛŒÚ© |Ø³Ø§Ù†|Ù‚Ø±Ø§|Ø§ Ù†|Ø®ØµÛŒ| Ø§Ù…| Ø¨Ùˆ|ÛŒØ± |Ø§Ù„Ù…|Ø¨ÛŒÙ†|Ø§Ù‡Ø¯|ØªØ¨Ø¹| ØªØ¨',
    zlm: ' Ø¯Ø§|Ø§Ù† |Ø¯Ø§Ù†| Ø¨Ø±| Ø§Ùˆ|Ù† Ø³|Ø±Ú  |Ø¯Ø§Ù„| Ú¤Ø±|Ù„Ù‡ |ÙƒÙ† | ÙƒÚ¤|Ù† Ø§|Ù† Ùƒ|Ù† Ø¯|ÙŠÚ  | ÙŠÚ |Ú¤Ø¯ |Ø­Ù‚ |ÙˆØ±Ú |ØªÙŠØ§|ÙŠØ§Ú¤|Ø§Ø±Ø§|ÙƒÚ¤Ø¯|Ø§ÙˆØ±|Ø±Ø­Ù‚|Ø¨Ø±Ø­|Ø§Ù„Ù‡|Ø£Ù† |ÙˆÙ„ÙŠ| Ø§Øª|Ø§ØªØ§|Ú Ù† |ØªØ§Ùˆ|Ø§Ú¤ |Ø³ØªÙŠ|Ù„ÙŠÙ‡|Ø§Ùˆ | Ø³Øª|Ú¤ Ø§|ÙŠÙ‡ |Ø±Ø§ |Ù‡ Ø¨|Ù‡ Ø¯|Ø¹Ø¯Ø§| Ø¹Ø¯|Ù† Ú¤|Ù† Ø¨|ÙŠÙ† | ØªØ±|Ù‚ Ùƒ|Ù† ÙŠ|ÙŠØ¨Ø³|Ø¨ÙŠØ¨| ØªÙŠ| Ø³Ùˆ| ÙƒØ¨| Ø³Ø§|Ù† Ù…|Ù† Øª|Ù„Ù… |Ø§Ù„Ù…|Ø¯ Ø³|Ú  Ø¹| Ù…Ù†|Ú†Ø§Ø±|Ø¯ Ú¤|Ø±Ù† |Ø³Ø§Ù…| Ù…Ø§|Ú½ Ø³|Ù†ØŒ | Ø¨Ùˆ| Ø§ÙŠ|Ù†Ø¯Ù‚| Ø­Ù‚|Ú¬Ø§Ø±|Ù†Ú¬Ø§|Ø¨ÙˆÙ„|Ø³Ø¨Ø§| Ø³Ø¨|Ø§ØªÙˆ|Ø§ Ø³|Ù‚Ù„Ù‡| Ú¤Ù…| Ù…Ù…|ÙˆØ§Ù†|Ø³Ú†Ø§| Ø³Ú†| ÙƒØ³|Ø§ Ø¨|Ø³Ù† | Ø³Ù…|Ú¤Ø±Ù„|Ø§ÙˆÙ†|Ù†Ú½ |ØªÙ† | Ø¨Ø§|Ù‡Ù† |Ø³ÙŠØ§|Ø§ Ú¤|Ø§Ø±Ú |Ø¨Ø§Ø±|Ú¤Ø§ |Ø¨Ø³Ù†|ÙƒØ¨ÙŠ|Ø§Ù… |ÙŠÙ†Ø¯|ÙŠ Ø¯|Ø§Ú¬ÙŠ|Ú  Ø¨|Ø¨Ø§Ú¬|ÙŠ Ø§|Ù…Ø§Ù†| Ù„Ø§| Ø¯ |Ø¯Ù‚Ù„|Ù‡Ù†Ø¯| Ù‡Ù†|Øª Ø¯|Ø§Ø¯ÙŠ|ÙˆÙŠÙ†|ÙŠÙƒÙ†| Ù†Ú¬|ØŒ Ùƒ|Ù†Ù¢ | Ú¤Ùˆ|Ø¨Ú Ø³|Ù‚Ù¢ |Ø§Øª |Ø§ÙˆÙ„|Ø§ÙƒÙ†|Ø§Ú½ | Ø³Ø³|ÙˆÙ† |Ø§Ø¯ | ÙƒÙˆ|Ø§ÙŠÙ†|Ø¯Ú Ù†| Ø¯Ú |Ø§Ø¦Ù†|ØªÙˆ |ØªÙŠ |Ù† Ù‡|Ú¬ÙŠ |Ø³ÙŠ |Ù‚ Ù…|ÙˆÚ Ù†|Ø¯ÙˆÚ |Ù†Ø¯Ùˆ|Ù„ÙŠÙ†|Ø±Ù„ÙŠ|Ù†ØªÙˆ|Ú¤ÙˆÙ†|ÙˆØ§Øª|ÙŠØ§Ø¯|ØªÙŠÙƒ|Ú Ø³Ø§|Ú¤Ù…Ø¨|ØªØ±Ù…|Ù¢ Ø¯|Ø­Ù‚Ù¢|ÙˆØ§ |Ù„ÙˆØ§|Ù…Ø§Ø³|ÙˆÙ‚ |Ù‡ Ù…|Ù„ Ø¯| Ù…Ù„|ÙˆÙ†Ø¯| Ú¤Ú |Ø§ØŒ |ØŒ Øª|Ù„Ø§Ø¦|Ø§ÙŠ |Ù…Ú¤Ùˆ|ÙŠÙƒ |ÙŠ Ùƒ|Ø±Ø§Øª|Ù…Ø±Ø§| Ø¨ÙŠ|Ø³Ù…Ùˆ|Ùˆ Ùƒ|ØŒ Ø¯|Ø³ÙˆØ§|Ú  Ù…|Ú  Ø³|Ú Ù¢ |Ú¤Ø±ÙŠ|ÙŠØ±ÙŠ|Ø¯ÙŠØ±|Ø§ Ø§|Ø§Ø³Ø§|Ú¤Ù¢ |ØªØ§ |Ø³ÙˆØ³|ØŒ Ø³|Ø¬ÙˆØ§|Ú  Øª|Ø±Ø£Ù†| Ø§Ù†|Ø³Ø£Ù†|Ø±ÙŠÙƒ|ÙŠØ£Ù†|Ø±ÙŠ | Ø¯Ø±|Ø§Ù…Ø±|ÙƒØ±Ø¬| Ú¤Ù„|Ø§ Ø¯|Ø¬Ø±Ù†|Ø§Ø¬Ø±|Ø§Ø±Ùƒ|Ù„Ø§Ø¬|Ø¯ Ùƒ|ÙˆØ§Ø±|Ø¨Ø±Ø³|ÙˆÙ†Øª|Ù…Ù†Ùˆ|Ø³Ø§Ù„|ÙŠÙ†Ú |Ø¯Ú Ù¢|Ù†Ø¯Ú | Ù…Ú |Ø§Ú¤Ø§|Ø³Ø³ÙŠ|Ø³Ø§Ø³|Ù†Ù† |Ú¤ÙˆÙ„|Ø§Ú¬Ø§| Ø¨Ú | Ø³Ú¤|Ù…Ø¨ÙŠ| Ø§Ú¤|Ú  Ø§|Ø§Ø±Ø£|Ú¤Ø±Ø§|ÙŠ Ø³|Ø¨Ø³ | Ø¯Ù„|Ø§ Ù…|Ù…ÙˆØ§|Ú¤Ù„Ø§|Ù…Ù„Ø§|Ú¤Ø±Ùƒ|ÙƒÙˆØ±|ÙˆØ¨Ùˆ| ÙƒØ£|ÙˆÙƒÙ†|Ø£Ù†Ú½|ÙƒØ³Ø§|Ú Ú¬Ùˆ|Ø§Ø¯Ú¤|Ù‡Ø§Ø¯|Ø±Ù‡Ø§|ØªØ±Ù‡|ÙƒÙˆÙ…|ØªÙˆÙ‚|Ù… Ø³|Ú  Ø¯|Ø¯ÙŠ | Ø¯ÙŠ|Ù¢ Ø³|Ù†Ø¯ÙŠ|Ø§Ø³ |Ø§Ø¯Ø§|Ø¨ÙˆØ§| Ø¯Ø¨|Ú  Ú¤|Ú½ØŒ |Ø§Ú¤Ù¢|Ø±ØªØ§|Ø§Ù„ |ÙŠØ§Ù„|ÙˆØ³ÙŠ| ÙƒØª|Ø£Ù†ØŒ|Ù†Ú¤Ø§|ØªÙ†Ú¤| ØªÙ†|Ù… Ú¤|Ø±Ø³Ø§|Ù…Ù…Ú¤| Ù…Ø±|Ù† Ø­| ÙƒÙ…|Ù†Ø³ÙŠ|Ø¬Ø£Ù†|Ø¤ÙŠ |Ù„Ø¤ÙŠ|Ø§Ù„Ø¤|Ù„Ø§Ù„|ÙƒÚ¤Ø±|ÙƒØª |Ø±ÙƒØª|Ø´Ø§Ø±|Ù…Ø´Ø§| Ù…Ø´|Ø¬Ø§Ø¯|Ø±Ú¬Ø§',
    skr: 'ØªÛ’ |Ø§Úº |Ø¯ÛŒ |Ø¯Û’ | Û” |ÙˆÚº | ØªÛ’| Ø¯Ø§| Ú©Ùˆ|Ú©ÙˆÚº| Ø­Ù‚|Ø¯Ø§ | Ø¯ÛŒ|ÛŒØ§Úº| Ø¯Û’|ÛŒÚº |Û’ Ø§|Ø´Ø®Øµ| Ø´Ø®|ÛØ± |Û’ Û”|Ø§ØµÙ„| Ø­Ø§|Ø­Ù‚ |Ø®Øµ | ÛØ±|ØµÙ„ |Ø­Ø§Øµ|ÛÛ’ | ÛÛ’|Ø§Ù„ |Ù‚ Ø­|Ù„ Û| Ù†Ø§| Ú©ÛŒ| ÙˆÚ†|Û” Û|ÛŒØ§ |Ø³ÛŒ |Û’ Ù…| Ø§Ùˆ|ÙˆÚ† |Ø§ØªÛ’|Ú©ÛŒØª|Ø§ Ø­|Ø§Ø¯ÛŒ|Ù†Ø§Ù„|Øµ Ú©| Ø§Øª|Ø± Ø´|ÛÛŒÚº| ÛŒØ§|Úº Ø¯| Ø§ÛŒ|ÛŒØ³ÛŒ| Ù…Ù„|ÙˆÙ†Ø¯|Ú©ÛÛŒ| Ú©Û|ÛŒ Øª|Ø²Ø§Ø¯|Ø§Ø²Ø§| Ø§Ø²|Ù†Ø¯Û’|Úº Ú©|Ø§Ø± | ÙˆÛŒ|Û’ Ú©|Ø¦Û’ | Ø§Ù†|Ú» Ø¯|Ù†Û | Ú©Ø±|Ø§ÙˆÙ†|Û’ Ùˆ|Ø¯ÛŒØ§|ÛŒ Ø¯|Úº Ø§|Û’ Ø¨|ÙˆÛŒØ³|ÙˆÚ» |ÛŒ Ù†| ÛÙˆ|ØªÛŒ |ÛŒ Û”| Ù†Û|ÛŒ Ø§|ÛŒÙ†Ø¯|Ùˆ Ú„|Ø¢Ù¾Ú»| Ø¢Ù¾|Ø§ Ùˆ|Û’ Ø¬| Ú©Ù†|Û’ Ù†|Ù†Ø¯ÛŒ|Øª Ø¯|Û’ Ø­|ÛŒ Ú©|Ø¦ÛŒ |Ù…Ù„Ú©|ÛŒØªÛ’|Ù† Û”|ØªÚ¾ÛŒ| ØªÚ¾|ÙˆÙ† |Úº Ù…| Ø¨Ú†|Û” Ø§|Ù†ÙˆÚº|Ú©Ù†Ùˆ|Ú»Û’ |Ø§Ø±ÛŒ|Ø§ Ø§|Û’ Û|Ù„ Øª| Ú„Ø¦|ÙˆÙ‚ |Ù‚ÙˆÙ‚|Ø­Ù‚Ùˆ|Ù„ Ú©|Ø®Ù„Ø§| Ø¬ÛŒ|Ù„Ú© |Ø¯Ø§Ø±|ÛŒØª |Ú©Ø±Ú»|Ø§Ù†Û|Ú©Ùˆ |ÛÚ©Ùˆ| ÛÚ©|Ù† Ø§|Ù…Ù„ | ÙˆØ³|Úº Ùˆ|Ù¾Ú»Û’| ØªØ¹|ÛŒ Ù…|Ø§Ù |Û’ Ø®|Ù†ÙˆÙ†|Ù‚Ù†Ùˆ| Ù‚Ù†| Ù„Ùˆ|Û” Ú©|Ø±ÛŒ |Ù„Û’ |ØªØ§ |ÛŒØªØ§| Ù‚Ùˆ| Ú†Ø§|ÛØ§Úº|Ú„Ø¦Û’|Ù‚ Øª|Ø§ÛŒÛ|Ø±Ú» |Û’ Ø¯|Ø± Ú©| Ùˆ |Ù„Ø§Ù| Ø®Ù„| Ø¬Ùˆ|ÛŒ Ùˆ|Ø§Ùˆ |ÛÙˆ |Ø¦Ùˆ |Ú†Ø¦Ùˆ|Ø¨Ú†Ø¦|ÛŒØ± |ÛÙˆÙˆ|Ø§ Ù…|ÛŒ Ø¬|Ø§Ù„Ø§|ÛŒÙ† | Ø¬Ø§|Ù…ÛŒ |Ù†ÛØ§|Ø§Ù† |Ø§Øª |Ø³Ú±Ø¯| Ø³Ú±|ÛŒØ¨ |Ø³ÛŒØ¨|ÙˆØ³ÛŒ| Ø´Ø§|Ø¨ Ø¯|ÛŒÙˆÚ»|Ø§Ù… |Ø§ÙˆÚ»|Û’ Øª|Ú» Ú©| Ù…Ø·|Úº Øª| ÙˆÙ†| Ú©Ù…|Ù† Ø¯|Ø±Ú©Ú¾| Ø±Ú©|Ú»ÛŒ |Úº Ø¢|Ø±ÛŒØ§|ÛŒ Û|Ø§Ø¯ |ÛŒØ§Ø¯|Ø¹Ù„Ø§|Ø± Û|Úº Ø³|ÛŒ Ø­|Ø¬Ú¾ÛŒ|Ø§Ø¦Ø¯|ÛÛŒ |Ù„ÙˆÚ©| Ú‹Ùˆ| Ø³Ù…| Ø³Ø§| Ù…Ù†| Ù…Ø¹|Ø¨Ù‚ |Ø§Ø¨Ù‚|Ø·Ø§Ø¨|Ù…Ø·Ø§|Ú¾ÛŒÙˆ|Úº Ù|ÛÙ† | ÛÙ†|Ø¬Ùˆ |Ùˆ Ú©|Úº Ø´|Ø± Øª|Ú©Ø§Ø±|Ù… Ø¯|Ú¾ÛŒØ§| Ù»Ø§|ØºÛŒØ±|Ùˆ Ù„|ÙˆØ¦ÛŒ|Ø¬ÛŒØ§|ÙˆØ§Ù…|Ù‚ÙˆØ§|ÛŒ Ø³| Ø¬Ú¾|Ù„ Ø§|Ù‚ÙˆÙ…| Ø³ÛŒ|Ø°ÛØ¨|Ù…Ø°Û| Ù…Ø°|Ø§Û’ | Ø§Û’|Ø¯Ù† |Ø§ Øª|Ø³Ø§Ù†|Ù†Ø³Ø§|Ø§Ù†Ø³|Ø±Û’ |Ù„ÛŒÙ…|Ø¹Ù„ÛŒ|ØªØ¹Ù„|Ø§Ù…Ù„|Û Ø¯|Û’ Ø±|Ø¯ Ø§|Ú©Ù… |ÛŒÛÙˆ|ÙØ§Ø¦|Ú† Ø§| Ú©Ú¾|Ù… Øª|Ø±Ø§ |ÙˆØ±Ø§|Ù¾ÙˆØ±|Úº Ø¨|Ù‚ Ø¯|Û’ Ù‚|ÙˆÚ©Ùˆ|Ú©Ú¾ÛŒ|Ø§ Ú©|Ùˆ Ø¯|Û’ Ø°|Ù¾Ú»ÛŒ|Ø¨Ù†Ø¯| ÙØ±|Ú©ÙˆØ¦|Ø§Ù…ÛŒ|ÛŒ ÛŒ|Ø§Ø¦ÛŒ|Ù„Ø§Ù‚|Ø§ÛŒÚº|Û Ø§| Ù†Ø¸|Ø³Ù…Ø§|ÙˆÙ…ÛŒ|ÛŒØŒ |Û’ Ø³|Øª Ùˆ|Ú¾ÛŒÙ†|Û’ Ø¹|ÛŒÙ… |Ø³ÛÙˆ| Ø³Û',
    pbu: ' Ø¯ | Ø§Ùˆ|Ø§Ùˆ |Ù¾Ù‡ | Ù¾Ù‡|ÙŠÛ” | Ø­Ù‚|Ú†Û | Ú†Û|Ø±Ù‡ |ÙŠ Ø§|Û Ø¯| Ù‡Ø±|Ù†Ù‡ |Ù‡Ø± |Ø­Ù‚ | Ú…Ùˆ|ÙˆÚ© |Ú…ÙˆÚ©|Ùˆ Ø§|Ù‡ Ø¯|Ù‡ Ø§|Û” Ù‡|Ù‡ Ùˆ| Ø´ÙŠ| Ù„Ø±|ÙŠ Ú†|Ùˆ Ø¯|Ø±ÙŠ |Ù„Ø±ÙŠ|Ù‚ Ù„| Ú©Úš|ÙˆÙŠ |ÚšÛ |Ú©ÚšÛ|Ù‡ Ú©|ØºÙ‡ |Ù„Ùˆ |Ø± Ú…|Ø³Ø±Ù‡| Ø³Ø±|Ù‡ Ù¾| Ù¼Ùˆ|Ùˆ Ù¾|Ù„Ù‡ |ÙŠØª |Ù¼ÙˆÙ„|ÙŠØ§ |Ú©Ú“ÙŠ| Ú©Ùˆ|Ø®Ù‡ |ÙŠØŒ |Ø¯ÙŠ | Ù„Ù‡| Ø§Ø²|Ø¯ Ù…| Ù‡ÙŠ| ÙˆØ§| ÙŠØ§| Ú…Ø®|Ø§Ø²Ø§|Ø¯ Ø§|ÙˆÙ„Ùˆ|Ù‡ Øª|Ú…Ø®Ù‡| Ú©Ú“|ÙˆÙ„ |Ù‡ØºÙ‡|Ù‡ Ø´|ÙŠ Ø¯| Ù‡Øº|Ú©ÙˆÙ„|Ø²Ø§Ø¯|Ù†Ùˆ | ÙˆÙŠ|Ùˆ ÙŠ|Ù‡ Ø¨|Ø´ÙŠÛ”|Ø¯Û |ÙŠÙˆ | Ø¯ÙŠ|ØªÙ‡ |Ø®Ù¾Ù„| Ù¾Ø±|Ø§Ø¯ |Ø¯ Ø¯|Ú© Ø­| ØªÙˆ|Ù‡ Ù…|Ú«Ù‡ |Ù‡ Ù‡|Ù‚ÙˆÙ‚|Ø­Ù‚Ùˆ|Ùˆ Ù…|Ù‡ Ø­|Ø¯ Ù‡| ØªØ±| Ù…Ø³|Ø´ÙŠ | Ù†Ù‡|Ú“ÙŠÛ”|Ù†ÙŠ |Ø¯ Ù¾|ÙˆØ§Ø¯|Û Ù¾|Ø§Ø¯ÙŠ|ÙˆÙ„Ù†| ÙŠÙˆ|Ø¯ Øª|ÙˆÙ†Ùˆ|ÙˆÚ«Ù‡|ÙŠ Ùˆ|Ù„ÙŠ | Ø¯Ø§|ÙŠØ¯ | Ø¨Ø§|ØªÙˆÙ†| Ø®Ù¾|ÙŠ Ù¾|ØªÙˆÚ«|Ø§Ø± |Ø§Ù†Ø¯|ÙŠÙˆØ§|Û Ùˆ|Ø¯Ø§Ù†| Ø¨Ø±|Ú“ÙŠ | Ø¹Ù…|Ø§Ù†Ù‡| Ø¯Ù‡|ÙŠÚ… |Ù‡ÙŠÚ…|Ø§Ù…ÙŠ|Ù„Ù†ÙŠ|Ø¨Ø¹ÙŠ|Ú‰ÙˆÙ„| Ú‰Ùˆ|Ù‡ Ù„|Ø§ÙŠØ¯|Ø¨Ø§ÙŠ|Ø§ØªÙˆ|Ù‡ Ú«| ØªØ§|Ù¾Ù„ | Ù…Ù„|Ø§ÙŠØª|ÙˆÙ… |ÙˆÙ† | Ù„Ø§|Ù‡ÙŠÙˆ| Ø´Ùˆ| Ø¯Øº|Ù… Ø¯|Ø¯Ù‡ |Û Ø§|Ø§Ù† | ØªÙ‡|Ú©Ø§Ø±|ØªÙˆ |Ù…ÙŠ |Ø§Ø±Ù‡|Ø§ÙˆÙŠ|Ø³Ø§Ùˆ|Ù…Ø³Ø§|Ù†ÙˆÙ†|Ø¯Ù‡Øº|Ùˆ Øª|ÙŠ Ø´|Ø§Ù†Ùˆ| Ù…Ø­|ÙŠÙ† |Ø§Ø®Ù„| Ú«Ù¼|Ø´ÙˆÙŠ|Ø¯ØºÙ‡|Ùˆ Ø­|ÙˆÙŠØŒ|Ù†ÙŠØ²|Ø³ÙŠ |Ø§Ø³ÙŠ|ÙˆÙ†Ø¯|Ù‚Ùˆ |ÙˆÙ‚Ùˆ|Ùˆ Ú©|ÙˆÙ†Ù‡|ÙˆÙ…ÙŠ| ÙˆÚ©|ÙŠ Øª| Ø§Ù†|Ù‚Ø§Ù†|Ù†Ø¯Û|Ùˆ Ø±|Ú© Ø¯|Ù‡ ÙŠ|Ù…ÙŠÙ†|Ù¾Ø± |Ù¼Ù‡ |Ù„Ø§Ù…|ØºÙˆ |Ù‡ØºÙˆ|Ø¯ Ù¼|Ùˆ Ù‡|Ù„ Øª|Ù„Û’ |ÙˆÙ„Û’|ÙˆÙˆÙ†|Ú©ÙŠ |Ø±Ùˆ |Ù† Ú©|Ù…ÙˆÙ…|ÙˆÚ©Ú“|Ù¾Ø§Ø±|Ù† Ø´|Ù…Ù† | Ù†Ùˆ| ÙˆÚ“| Ù‚Ø§|Û Ú†| ÙˆØ³|Ú… Ú…|Ø´Ø®Øµ| Ø´Ø®|Ú˜ÙˆÙ†| Ú˜Ùˆ|ØªØ± |Ú«Ù¼Ù‡|Ùˆ Ú…|Ù‡Ù… |Ø¹Ù‚ÙŠ|Ø±ØªÙ‡| ÙˆØ±|Ø¨Ù„ | Ø¨Ù„|Ùˆ Ø¨|Ù‡ Ø³|ÚšÙˆÙˆ| ÚšÙˆ| Ú©Ø§|Û Ú©|Ùˆ Ø³|Ø§Ø¯Ù‡|ÙˆÙ†Ú©| ØºÙˆ|Ø¯Ùˆ |Ùˆ Ù†|Øª Ú©|Ù…Ù„ |Ø¹Ù…Ùˆ|Ù„ Ù‡| Ù¾ÙŠ|ÙˆØ³ÙŠ|Ú“Ø§Ù†|ÙˆÚ“Ø§|ÙŠØ² |Ø®ØµÙŠ|ÙŠ Ù…|Ø§ Ø¨|Ø§Ø¯Ø§|Ù‡ Ù†|Ø®Ù„ÙŠ|ÙˆØ§Ø®|Ø¯ÙŠÙˆ|ØŒ Ø¯|Ø¯ Ù‚| Ù‡Ù…|Ø§ Ø¯| Ø¨ÙŠ|ØªØ¨Ø¹| ØªØ¨|Ù‡ Ú†| Ø¹Ù‚|Ù¾Ù„Ùˆ|Ùˆ Ù„| Ø±Ø§|Ø¯ Ø¨|Ø±Ø§ÙŠ| Ø¯Ø®|Ù†Û |Ù†Ú©ÙŠ|Øª Ø¯|Ø§Ø¨Ø¹| Ù…Ù‚|Ø¯ Ø®|ÙˆØ±Ù‡|Ø´Ø±Ø§| Ø´Ø±|Ø± Ù…|Ø±Ø³Ø±|ØªØ§Ù…|Ù‡ Ù¼| Ù…Ù†|Ø·Ù‡ |Ø³Ø·Ù‡|Ø§Ø³Ø·|ÙˆØ§Ø³|Ù„Û | Ø§Ø³|Û” Ø¯|Ø¨Ø±Ø®|Û Ù†'
  },
  Devanagari: {
    hin: 'à¤•à¥‡ |à¤ªà¥à¤°| à¤ªà¥| à¤•à¤¾| à¤•à¥‡| à¥¤ |à¤”à¤° | à¤”à¤°|à¤•à¤¾ | à¤•à¥‹|à¤•à¤¾à¤°|à¤¾à¤° |à¤¤à¤¿ |à¤¯à¤¾ |à¤•à¥‹ |à¤¨à¥‡ |à¥‹à¤‚ |à¤¿à¤•à¤¾|à¥à¤°à¤¤| à¤¹à¥ˆ| à¤•à¤¿|à¤‚ à¤•|à¤¹à¥ˆ |à¤§à¤¿à¤•|à¤µà¥à¤¯|à¤…à¤§à¤¿| à¤…à¤§|à¥à¤¤à¤¿| à¤¸à¤®|à¥à¤¯à¤•|à¤¿ à¤•|à¤•à¥à¤¤|à¤¾ à¤…|à¤•à¥€ |à¤¾ à¤•| à¤µà¥|à¥‡à¤‚ | à¤¹à¥‹|à¤¯à¤•à¥|à¤¸à¥€ |à¤¸à¥‡ |à¥‡ à¤•| à¤¯à¤¾| à¤•à¥€|à¤®à¥‡à¤‚|à¤¨à¥à¤¤| à¤®à¥‡|à¤¤à¥à¤¯|à¥ˆ à¥¤|à¤¤à¤¾ |à¤°à¤¤à¥|à¤•à¥à¤·|à¥‡à¤• |à¤¯à¥‡à¤•|à¥à¤¯à¥‡|à¤¿à¤• |à¤° à¤¹|à¤­à¥€ |à¤•à¤¿à¤¸| à¤œà¤¾| à¤¸à¥|à¤• à¤µ|à¤¾ à¤œ|à¤¿à¤¸à¥€|à¤®à¤¾à¤¨| à¤µà¤¿|à¤° à¤¸|à¤¤à¥à¤°|à¥€ à¤¸|à¥¤ à¤ª| à¤•à¤°|à¥à¤°à¤¾|à¤—à¤¾ |à¤¿à¤¤ | à¤…à¤ª| à¤ªà¤°|à¤¸à¥à¤µ|à¥€ à¤•| à¤¸à¥‡|à¤¾ à¤¸|à¥à¤¯ | à¤…à¤¨|à¥à¤¤à¥|à¤¿à¤¯à¤¾|à¤¾ à¤¹| à¤¸à¤¾|à¤¨à¤¾ |à¥à¤¤ |à¤ªà¥à¤¤|à¤¸à¤®à¤¾|à¤¾à¤¨ |à¤° à¤•|à¤¾à¤ªà¥|à¤¤à¤¨à¥| à¤­à¥€| à¤‰à¤¸|à¤°à¤¾à¤ª|à¤µà¤¤à¤¨|à¥à¤µà¤¤|à¤°à¥‹à¤‚|à¤µà¤¾à¤°|à¥‡ à¤¸|à¤¥à¤¾ |à¤¹à¥‹ |à¥‡ à¤…|à¤¾ à¥¤|à¤¨ à¤•| à¤¨ |à¤¦à¥‡à¤¶| à¤°à¤¾|à¤·à¤¾ |à¤…à¤¨à¥|à¤¤ à¤¹|à¥à¤·à¤¾|à¥à¤µà¤¾|à¤œà¤¾à¤|à¥€ à¤ª|à¤•à¤°à¤¨|à¤¾ à¤ª|à¤…à¤ªà¤¨|à¤·à¥à¤Ÿ| à¤¸à¤‚|à¥‡ à¤µ|à¤¹à¥‹à¤—|à¤¿à¤µà¤¾|à¤Ÿà¥à¤°|à¥à¤Ÿà¥|à¤¾à¤·à¥|à¤°à¤¾à¤·|à¤¸à¤•à¥‡| à¤®à¤¾|à¤“à¤‚ |à¤¾à¤“à¤‚|à¤°à¥€ |à¤• à¤¸|à¥‡ à¤ª| à¤¨à¤¿|à¥€à¤¯ |à¤°à¤•à¥|à¥‹ à¤¸|à¤¾à¤à¤—|à¤°à¤¨à¥‡| à¤‡à¤¸|à¤µ à¤•|à¤ªà¤° |à¤°à¤¤à¤¾|à¤° à¤…| à¤¸à¤­|à¤¤à¤¥à¤¾| à¤¤à¤¥| à¤à¤¸|à¤°à¤¾ |à¤ªà¤¨à¥‡|à¥à¤°à¥€|à¤¿à¤•à¥|à¤•à¤¿à¤¯|à¤¾ à¤µ|à¤®à¤¾à¤œ|à¤‚ à¤”|à¤° à¤‰|à¤¦à¥à¤§|à¤¸à¤­à¥€|à¤¶à¥à¤¯| à¤œà¤¿|à¤¾à¤¨à¥‡|à¤¾à¤°à¥|à¤¾à¤°à¤¾|à¤¦à¥à¤µ| à¤¦à¥|à¤à¤—à¤¾|à¤¸à¤®à¥|à¥‡à¤¶ |à¤¿à¤ |à¤¾à¤µ |à¤° à¤ª| à¤¦à¥‡|à¥à¤¤à¤°|à¤¾ à¤”|à¤¾à¤°à¥‹|à¤¯à¥‹à¤‚|à¤ªà¤°à¤¾|à¤ªà¥‚à¤°|à¤šà¤¿à¤¤|à¥à¤§ |à¤°à¥‚à¤ª| à¤°à¥‚| à¤¸à¥| à¤²à¤¿|à¤¤ à¤•|à¥‹ à¤ª|à¤‚ à¤¸|à¥‡ à¤²|à¤¶à¤¿à¤•| à¤¶à¤¿|à¤µà¤¾à¤¹|à¥‡ à¤”|à¤œà¥‹ |à¤°à¤¾à¤§|à¤œà¤¿à¤¸|à¥‚à¤°à¥|à¥€ à¤­|à¥‚à¤ª |à¥‹à¤—à¤¾|à¤¸à¥à¤¥|à¤°à¥€à¤¯|à¤¤à¤¿à¤•|à¥à¤° |à¥¤ à¤‡|à¤‡à¤¸ | à¤‰à¤¨|à¤²à¥‡ |à¥‡ à¤®|à¤²à¤¿à¤|à¤® à¤•|à¤•à¤¤à¤¾|à¥‡ à¤¯| à¤œà¥‹|à¤¨ à¤®|à¤…à¤ªà¤°| à¤ªà¥‚|à¥‹ à¤•|à¤¾ à¤‰|à¤¾à¤¹ |à¤¨à¥‚à¤¨|à¤¾à¤¨à¥‚|à¤—à¥€ |à¤¦à¥€ |à¤¾à¤°à¥€|à¤‚ à¤®|à¥¤ à¤•|à¤¤à¤°à¥|à¥€ à¤°|à¤¶ à¤•|à¤ªà¤°à¤¿|à¤¸à¥à¤¤|à¥‹à¤ˆ |à¤•à¥‹à¤ˆ|à¤°à¥à¤¯|à¥€ à¤…|à¤¹à¤¿à¤¤|à¤­à¤¾à¤µ| à¤­à¤¾|à¤¤à¤¾à¤“|à¤¾à¤¸ |à¤¸à¤¾à¤®|à¤µà¤¿à¤•|à¤µà¤¿à¤µ|à¤®à¥à¤®| à¤¸à¤•|à¤•à¤° |à¤¾à¤¨à¤¾|à¤§ à¤•|à¤¨à¤¿à¤•|à¤¯ à¤•|à¤‰à¤¸à¤•|à¤•à¥ƒà¤¤| à¥˜à¤¾|à¤¨ à¤¸|à¤œà¥€à¤µ|à¥à¤¯à¤¾|à¤°à¤•à¤¾|à¥à¤°à¤•|à¤¾à¤œ |à¤¨à¥à¤¯|à¥à¤® |à¤°à¥à¤£|à¥˜ à¤¹|à¤¹à¥˜ | à¤¹à¥˜|à¥€ à¤®|à¤œà¤¿à¤•|à¤¾à¤œà¤¿|à¤¾à¤®à¤¾|à¤• à¤”|à¤®à¤¿à¤²|à¥‡à¤¨à¥‡|à¤²à¥‡à¤¨| à¤²à¥‡|à¤¯à¥‡ |à¥‹ à¤…|à¥‡ à¤œ|à¤°à¤¿à¤µ|à¤®à¤¯ |à¤¸à¤®à¤¯|à¤µà¤¶à¥|à¤†à¤µà¤¶| à¤†à¤µ|à¤à¤¸à¥€|à¤¾à¤§ |à¤° à¤¦|à¤°à¥à¤µ|à¤¸à¤¾à¤°|à¤ª à¤¸|à¤¬à¤¨à¥| à¤¸à¤¹|à¤¿à¤§à¤¾|à¤µà¤¿à¤§|à¥€ à¤¨|à¥‚à¤¨ |à¥˜à¤¾à¤¨',
    mar: 'à¥à¤¯à¤¾|à¤¯à¤¾ |à¤¤à¥à¤¯|à¤¯à¤¾à¤š|à¤šà¤¾ |à¤£à¥à¤¯|à¤¾à¤šà¤¾| à¤µ |à¤•à¤¾à¤°|à¤ªà¥à¤°| à¤ªà¥|à¤¿à¤•à¤¾|à¤§à¤¿à¤•|à¤¾à¤° | à¤…à¤§|à¤…à¤§à¤¿|à¤šà¥à¤¯|à¤†à¤¹à¥‡| à¤†à¤¹|à¤¾ à¤…|à¤¹à¥‡ |à¤¾ à¤•|à¤¾à¤¸ |à¤µà¤¾ |à¥à¤¯à¥‡|à¥à¤°à¤¤| à¤¸à¥|à¤¤à¤¾ |à¤¾ à¤¸| à¤…à¤¸| à¤•à¤°|à¤¸à¥à¤µ| à¤•à¤¾|à¤²à¥à¤¯|à¤°à¤¤à¥|à¤¾à¤¹à¤¿|à¤•à¥‹à¤£| à¤•à¥‹|à¤¿à¤• |à¤¯à¥‡à¤•|à¥à¤µà¤¾|à¤¾ à¤µ| à¤¤à¥|à¤° à¤†|à¥à¤¯ |à¤¤à¥à¤°|à¥‡à¤•à¤¾|à¤•à¥à¤·|à¤¾ à¤¨| à¤¸à¤‚|à¤¾à¤®à¤¾|à¤¾à¤šà¥|à¤‚à¤µà¤¾|à¤¿à¤‚à¤µ|à¤•à¤¿à¤‚| à¤•à¤¿|à¤¾à¤¤ |à¤·à¥à¤Ÿ|à¤•à¤¾à¤¸| à¤¯à¤¾|à¤¯à¤¾à¤‚|à¤¾à¤‚à¤š|à¤°à¥à¤¯|à¤®à¤¿à¤³| à¤®à¤¿| à¤¸à¤¾|à¤µà¥à¤¯|à¥‹à¤£à¤¤|à¤¨à¥‡ |à¥‡ à¤ª|à¤•à¤¾à¤®| à¤¸à¤®|à¤‚à¤¤à¥|à¤¯à¥‡ | à¤°à¤¾|à¤¸à¤®à¤¾|à¤¤à¤‚à¤¤|à¤•à¤°à¤£|à¤¾ à¤†|à¥‡ à¤•|à¤¹à¤¿ |à¥‡ à¤¸|à¤¨à¤¾ |à¤¿à¤³à¤£|à¥‚à¤¨ |à¤¾ à¤ª|à¤Ÿà¥à¤°|à¥à¤Ÿà¥|à¤¾à¤·à¥|à¤°à¤¾à¤·|à¥€à¤¯ |à¤µ à¤¸|à¤•à¥à¤¤|à¤®à¤¾à¤¨|à¤°à¥à¤µ| à¤†à¤ª|à¤³à¤£à¥|à¥à¤°à¥|à¤¾à¤¤à¤‚|à¤µà¤¾à¤¤|à¤šà¥‡ | à¤µà¤¿|à¥à¤·à¤£|à¤°à¤£à¥| à¤¦à¥‡| à¤µà¥|à¤†à¤ªà¤²|à¤¹à¥€ |à¤¾à¤°à¥|à¤¨à¤¯à¥‡| à¤¨à¤¯|à¤®à¤¾ |à¤¯à¤¾à¤¸| à¤œà¤¾|à¤²à¥‡à¤²| à¤¨à¤¿|à¥‡ à¤…| à¤ªà¤¾|à¤¾ à¤®|à¤²à¥‡ |à¤¾à¤¹à¥€|à¤¬à¤‚à¤§|à¥‡ à¤µ|à¥à¤¯à¤•| à¤®à¤¾|à¤¶à¤¿à¤•| à¤¶à¤¿|à¤¦à¥‡à¤¶|à¤¾ à¤¦|à¤®à¤¾à¤œ|à¥à¤°à¥€|à¤²à¥€ |à¤¾à¤¨ |à¤¾à¤‚à¤¨|à¤ªà¤²à¥| à¤¹à¥‹|à¤¾ à¤¹|à¤·à¤£ |à¤œà¥‡ |à¤¿à¤œà¥‡|à¤¹à¤¿à¤œ|à¤ªà¤¾à¤¹|à¤¾à¤°à¤¾|à¤¯à¤¾à¤¤|à¤¸à¤°à¥| à¤¸à¤°|à¤°à¤¾à¤‚|à¤…à¤¸à¤²|à¤‚à¤¬à¤‚|à¤¸à¤‚à¤¬|à¤¿à¤•à¥|à¥€ à¤ª|à¤‚à¤šà¥|à¤°à¤•à¥|à¤£à¤¤à¥| à¤†à¤£|à¤²à¤¾ |à¤¸à¥à¤¥|à¤°à¥€à¤¯|à¥€à¤¤ |à¤‚à¤¨à¤¾|à¤¤ à¤µ|à¥à¤µ |à¤• à¤µ|à¤£à¥‡ |à¤¾à¤šà¥‡|à¤¨ à¤•|à¤¤ à¤•|à¤°à¤¤à¤¾|à¥à¤°à¤¾|à¤¯à¤¾à¤¹|à¥à¤¤ |à¤šà¥€ |à¤¯ à¤•|à¤¦à¥à¤§|à¥à¤µà¤¤|à¤¯à¤•à¥|à¤£à¤¿ |à¤†à¤£à¤¿|à¤¸ à¤¸|à¤‚à¤§à¤¾|à¤• à¤¸|à¤šà¥à¤›|à¤¯ à¤…|à¤¤ à¤¸|à¥€à¤¨à¥‡|à¥‹à¤£à¤¾|à¤•à¤°à¤¤|à¤¤à¥à¤µ|à¥€à¤² |à¥€ à¤…|à¤¸à¤¾à¤°|à¤° à¤µ|à¤­à¤¾à¤µ|à¤µ à¤¤|à¤¥à¤µà¤¾|à¤…à¤¥à¤µ| à¤…à¤¥|à¥‡ à¤¤|à¥‡ à¤œ|à¤¯à¤¾à¤¯|à¤‚à¤šà¤¾|à¥‡à¤²à¥|à¤¾à¤¨à¥‡|à¥‡à¤£à¥|à¤• à¤†|à¤•à¥à¤•|à¤¹à¤•à¥| à¤¹à¤•|à¤£ à¤®|à¤‚à¤°à¤•|à¤¸à¤‚à¤°|à¤¨à¥à¤¯|à¤¾à¤¯à¤¦|à¤¾ à¤¤|à¤¤ à¤†| à¤‰à¤ª|à¤µà¤¸à¥|à¤¿à¤µà¤¾|à¥‡à¤¶à¤¾|à¤¸à¤¾à¤®|à¥‡ à¤¯|à¥‡ à¤†|à¥€ à¤µ|à¤µ à¤®|à¤¤à¥€à¤¨|à¤µ à¤†|à¤§à¥à¤¯| à¤…à¤¶|à¤§à¤¾à¤¤|à¤•à¥ƒà¤¤|à¥à¤• |à¤¦à¥à¤¯|à¤¿à¤¤ |à¤¸à¤²à¥‡|à¥‡à¤¶ |à¤¤à¥‹ |à¥‡à¤² |à¤¤à¥€ |à¥à¤¤à¥€|à¤…à¤¸à¥‡|à¤‡à¤¤à¤°| à¤‡à¤¤|à¤¸à¥à¤¤|à¤°à¥à¤£|à¤¾ à¤¬|à¥‡à¤²à¥‡| à¤•à¥‡|à¤¹à¥€à¤°|à¤œà¤¾à¤¹|à¤¾ à¤œ|à¥‡à¤¤ |à¥‚à¤°à¥|à¤ªà¥‚à¤°|à¥‡à¤š | à¤µà¤¾|à¤¾à¤œà¤¾|à¥€ à¤¸|à¤¶à¤¾ |à¤¯ à¤µ| à¤¨à¥|à¤¯à¤¾à¤µ|à¤¦à¥à¤¦|à¥à¤§ |à¤°à¥‚à¤¨|à¤¯à¤¦à¥|à¤•à¤¾à¤¯|à¤¾ à¤¶|à¤—à¤£à¥|à¤• à¤•|à¤°à¤¾à¤§| à¤¶à¤¾|à¤¯à¤¤à¥|à¤² à¤…|à¥à¤¯à¤µ|à¥€ à¤•|à¤¾à¤µ |à¤¾ à¤¯|à¤¤à¥à¤¤|à¤œà¤¿à¤•|à¤¾à¤œà¤¿|à¤°à¤£à¤¾| à¤§à¤°|à¤¾ à¤§|à¤­à¥‡à¤¦| à¤¬à¤¾|à¤°à¤•à¤¾|à¥à¤°à¤•|à¤•à¥‡à¤²|à¤¿ à¤µ|à¤¿à¤·à¥|à¤¤à¥€à¤²|à¤¯à¥‹à¤—|à¤¸à¤¾à¤§|à¤¾à¤‚à¤¤|à¤µà¤¿à¤µ|à¤¶à¥à¤°| à¤§à¥‡| à¤®à¥|à¤µà¤¤à¤ƒ',
    mai: 'à¤¾à¤• |à¤ªà¥à¤°|à¤•à¤¾à¤°| à¤ªà¥|à¤¾à¤° |à¤¿à¤•à¤¾|à¥à¤¯à¤•|à¤§à¤¿à¤•|à¤• à¤…|à¥à¤°à¤¤|à¥à¤¤à¤¿|à¤µà¥à¤¯| à¤…à¤§|à¥‡à¤ |à¤…à¤§à¤¿|à¤¿à¤• | à¤µà¥|à¤†Ê¼ | à¤†Ê¼|à¤•à¥à¤¤|à¤¯à¤•à¥|à¤¤à¤¿à¤•|à¤•à¥‡à¤|à¤• à¤µ|à¤¬à¤¾à¤•|à¤• à¤¸|à¤›à¥ˆà¤•| à¤›à¥ˆ|à¤¤à¥à¤¯|à¤®à¥‡ |à¥‡à¤• | à¤¸à¤®|à¤•à¥à¤·|à¤¹à¤¿ |à¤°à¤¤à¥|à¤° à¤›|à¤¯à¥‡à¤•|à¥à¤¯à¥‡|à¤¨à¥à¤¤|à¤µà¤¾ |à¤¿à¤•à¥‡|à¤•à¥¤ |à¥ˆà¤•à¥¤|à¥¤ à¤ª| à¤…à¤ª| à¤¸à¥| à¤µà¤¿| à¤œà¤¾|à¤¿à¤¤ |à¤¸à¤ | à¤¹à¥‹|à¤•à¥‹à¤¨| à¤•à¥‹|à¤¤à¥à¤°|à¤¸à¥à¤µ| à¤µà¤¾|à¤• à¤†|à¤·à¥à¤Ÿ| à¤•à¤°|à¤…à¤ªà¤¨|à¤®à¤¾à¤¨| à¤•à¤¾| à¤…à¤¨|à¤¤à¤¿ |à¥à¤¤à¥|à¤¨à¥‹ |à¤¨à¤¹à¤¿| à¤ªà¤°|à¤Ÿà¥à¤°|à¥à¤¯ | à¤à¤¹|à¤¿ à¤•|à¥à¤Ÿà¥|à¤¾à¤·à¥|à¤°à¤¾à¤·| à¤°à¤¾|à¤¸à¤®à¤¾|à¥‹à¤¨à¥‹|à¤² à¤œ| à¤¨à¤¹|à¤¤à¤¾à¤•|à¤¾à¤°à¥|à¤ªà¤¨ |à¤¤à¤¨à¥|à¤µà¤¤à¤¨|à¥à¤µà¤¤|à¥à¤·à¤¾| à¤•à¤| à¤¸à¤¾|à¥à¤°à¥€| à¤¨à¤¿|à¤¾ à¤†|à¤¿à¤µà¤¾| à¤¸à¤‚| à¤¦à¥‡|à¤œà¤¾à¤|à¥€à¤¯ |à¤•à¤°à¤¬|à¤¥à¤¾ |à¤à¤¬à¤¾|à¤¾ à¤ª|à¤¨à¤¾ |à¥à¤µà¤¾|à¤¦à¥‡à¤¶|à¤¤à¥¤ |à¤°à¤• |à¤• à¤¹|à¤ à¤…| à¤¸à¤­| à¤† |à¤¤ à¤•|à¤šà¤¿à¤¤|à¥à¤¤ |à¤µà¤¾à¤°|à¤¤à¤¾ |à¤¾à¤°à¤•|à¤®à¤¾à¤œ|à¤¾ à¤¸|à¤°à¥€à¤¯|à¤¨à¥à¤¯|à¤°à¤¤à¤¾|à¤¾à¤¨ |à¥à¤°à¤¾|à¥à¤¯à¤¾|à¤°à¤•à¥|à¤¾à¤°à¤£|à¤ªà¤°à¤¿|à¤à¤² |à¤•à¤à¤²|à¤…à¤¨à¥|à¤°à¤¬à¤¾|à¤• à¤ª|à¤“à¤° |à¤†à¤“à¤°| à¤†à¤“|à¤…à¤›à¤¿| à¤…à¤›|à¤¿à¤°à¥|à¤¾à¤¨à¥|à¤¨à¤• |à¤¹à¥‹à¤|à¤•à¤° |à¤§à¤¾à¤°|à¤¸à¥à¤¥|à¤¾ à¤…|à¤¿à¤®à¥‡|à¤° à¤†|à¤à¤¹à¤¿| à¤à¤•|à¥‡ à¤¸|à¤¤à¤¥à¤¾| à¤¤à¤¥| à¤®à¤¾|à¤¿à¤•à¥|à¤¶à¤¿à¤•| à¤¶à¤¿|à¤ªà¥à¤¤|à¤°à¥à¤µ|à¤¨à¤¿à¤°|à¤šà¥à¤›|à¤°à¥à¤¯|à¤ à¤¸|à¤• à¤•|à¤¹à¥‹ |à¤¾à¤¹à¤¿|à¤à¤¤à¥¤|à¤° à¤ª|à¤¾à¤®à¤¾|à¤¸à¤¾à¤®|à¤·à¤¾ |Ê¼ à¤¸|à¤ à¤|à¥ˆà¤• |à¤¦à¥à¤§|à¤° à¤…|à¤• à¤œ|à¤¸à¥à¤¤|à¤¾à¤ªà¥|à¤ à¤•| à¤¸à¤•|à¤¯à¤• |à¤•à¤¾à¤¨|à¤¹à¤¨ |à¤à¤¹à¤¨|à¥‡à¤² |à¥‹à¤à¤¤|à¤¤ à¤†|à¤¾ à¤µ|à¥¤ à¤•|à¥à¤¤à¤°|à¤¾à¤à¤¤|à¥à¤°à¤•|à¤¹à¥ |à¤• à¤‰|à¤ªà¥‚à¤°|à¤µà¤¿à¤µ|Ê¼ à¤…|à¤›à¤¿ | à¤²à¥‡|à¤¨ à¤ª|à¤¾à¤¸ |à¤°à¤¾à¤ª|à¤§à¤• |à¤ªà¤à¤¬| à¤ªà¤|à¤°à¤¾ |à¤¯à¤¤à¤¾|à¤°à¥‚à¤ª|à¤¨ à¤µ| à¤•à¥‡|à¤·à¤¾à¤•|à¤¯ à¤ª|à¤¤ à¤¹|à¤œà¤¾à¤¹| à¤“ |à¤­à¤¾à¤µ|à¤ªà¤° |à¤¥à¤µà¤¾|à¤…à¤¥à¤µ| à¤…à¤¥|à¤¸à¤®à¥|à¤œà¤¿à¤•|à¤¾à¤œà¤¿|à¥‚à¤°à¥|à¤°à¤¤à¤¿| à¤¦à¥‹|à¤¸à¤­à¤•|à¥¤ à¤¸| à¤œà¤¨|à¤¸à¤­ |à¤¬à¤¾à¤§|à¤…à¤¨à¥|à¤¿à¤¸à¤| à¤¸à¤¹|à¤ à¤µ|à¤ à¤¸|à¤°à¤¿à¤µ|à¤¤à¥ |à¥‡à¤¤à¥|à¤¹à¥‡à¤¤| à¤¹à¥‡|à¤¾à¤§ |à¥‡à¤¬à¤¾|à¤¨ à¤¸|à¤¿à¤·à¥|à¤°à¤¾à¤§| à¤…à¤µ|à¤¿à¤¤à¥|à¤µà¤¾à¤¸|à¤šà¤¾à¤°| à¤‰à¤š|à¤¾à¤°à¤¾|à¤¨ à¤•|à¤µà¤• |à¤¾ à¤•|à¤¨à¥‚à¤¨|à¤¾à¤¨à¥‚|à¤à¤¤ |à¤°à¥€ |à¥‡à¤“ |à¤•à¥‡à¤“|à¤°à¤£ |à¥à¤°à¤¸|à¤¿ à¤¦|à¤“ à¤µ| à¤­à¥‡|à¤¨à¤¹à¥|à¥‹à¤¨à¤¹|à¥à¤¥à¤¿|à¤ªà¤¤à¥|à¤®à¥à¤ª|à¤°à¤¾à¤œ| à¤­à¤¾|à¤¹à¤¿à¤®| à¤¹à¤•|à¤¾à¤®à¥‡|à¥à¤£ |à¤°à¥à¤£|à¤¹à¤¾à¤°|à¤¿ à¤¸|à¤• à¤¦|à¤¨ à¤…|à¤¤ à¤…|à¤²à¥‡à¤¬| à¤…à¤­|à¤¿à¤¶à¥|à¤œà¤• |à¤¾à¤œà¤•|à¤¨ à¤†|à¤µà¤¾à¤¹|à¤•à¤¾à¤œ|à¤¶à¥à¤¯|à¤µà¤¸à¥|à¤“à¤¹à¤¿| à¤“à¤¹|à¤¯à¥‹à¤—|à¥¤ à¤|à¤•à¤ |à¥‡ à¤“|à¤…à¤ªà¤°',
    bho: ' à¤•à¥‡|à¤•à¥‡ |à¥‡ à¤•|à¤¾à¤° |à¤•à¤¾à¤°|à¤¿à¤•à¤¾|à¤§à¤¿à¤•|à¤…à¤§à¤¿| à¤…à¤§|à¤“à¤° |à¤†à¤“à¤°| à¤†à¤“|à¥‡ à¤…|à¥‡ à¤¸|à¤¾ à¤•| à¤¸à¤‚|à¤¿à¤• |à¤° à¤¹|à¤¾ à¤¸| à¤¹à¥‹|à¤° à¤¸|à¥‡à¤‚ |à¤®à¥‡à¤‚| à¤®à¥‡| à¤•à¤°| à¤¸à¥‡|à¤¨à¥‹ |à¤•à¥à¤·|à¤¸à¥‡ | à¤•à¤¾|à¥¤ à¤¸|à¤–à¥‡ |à¤¾à¥¤ |à¤°à¤¾ | à¤¸à¤®| à¤¸à¤¬|à¥à¤°à¤¾| à¤¸à¤•|à¤° à¤•|à¤¨ à¤•|à¤µà¥‡ |à¥Œà¤¨à¥‹|à¤•à¥Œà¤¨| à¤•à¥Œ|à¤šà¤¾à¤¹| à¤šà¤¾| à¤¬à¤¾|à¤ªà¥à¤°| à¤ªà¥|à¤¥à¤¾ |à¤¿ à¤•|à¤¤à¤¿ | à¤œà¤¾| à¤¸à¤¾|à¥‡ à¤†|à¤ªà¤¨ |à¤•à¤°à¥‡|à¤¤à¤¾ |à¤¹à¥‹à¤–|à¤¤ à¤•|à¥‡à¥¤ |à¥‡ à¤¬|à¤¤à¤¥à¤¾| à¤¤à¤¥| à¤†à¤ª|à¤•à¥‡à¤²|à¤¸à¤•à¥‡| à¤¸à¥|à¤°à¥‡ |à¤¸à¤¬à¤¹|à¤•à¤° |à¤†à¤ªà¤¨|à¥‡ à¤“|à¤œà¤¾ | à¤ªà¤°|à¤·à¥à¤Ÿ| à¤°à¤¾|à¤¨à¤¾ |à¤¹à¤µà¥‡| à¤¹à¤µ|à¤²à¤¾ |à¥‡à¤²à¤¾|à¤¬à¤¹à¤¿| à¤“à¤•|à¥‹à¤–à¥‡|à¤° à¤¬|à¤¹à¥¤ | à¤¹à¥¤|à¤¨ à¤¸|à¤¾à¤·à¥|à¤°à¤¾à¤·|à¥à¤¤ | à¤”à¤°|à¥‡ à¤š|à¥¤ à¤•|à¤¸à¤‚à¤—|à¤° à¤†|à¤Ÿà¥à¤°|à¥à¤Ÿà¥|à¤·à¤¾ |à¤®à¤¾à¤¨|à¤¾ à¤†|à¤‚ à¤•|à¤¾ à¤ª|à¥à¤·à¤¾|à¤°à¤•à¥|à¤¹à¥‡ |à¤¾à¤¹à¥‡|à¤¾à¤¤à¤¿|à¤¾à¤µà¥‡| à¤œà¥‡|à¤¹à¥€ |à¤“à¤•à¤°|à¤®à¤¿à¤²|à¤¿à¤¤ |à¥‹ à¤¸|à¤² à¤œ|à¤‡à¤–à¥‡|à¤¨à¤‡à¤–| à¤¨à¤‡|à¤¤à¥à¤°|à¤®à¤¾à¤œ| à¤¬à¤¿|à¤µà¥‡à¥¤|à¥‡ à¤œ|à¤• à¤¸|à¤¿à¤‚ |à¤¹à¤¿à¤‚|à¤•à¤°à¤¾|à¤”à¤° |à¥‡ à¤®|à¤¸à¤®à¤¾|à¤¹à¥ | à¤“ |à¤ªà¤° |à¥‡ à¤¨|à¤¸à¥à¤¥|à¤°à¥€à¤¯|à¥à¤°à¥€|à¤²à¤¾à¥¤|à¤¾à¤œ |à¤¾à¤¨ |à¤•à¤¾à¤¨|à¥‡ à¤¤|à¤¿à¤° |à¤¤à¤¿à¤°|à¤–à¤¾à¤¤| à¤–à¤¾|à¥‡ à¤‰|à¤¨à¥‚à¤¨|à¤¾à¤¨à¥‚|à¤¾à¤® | à¤¸à¥| à¤¦à¥‡|à¥€ à¤•| à¤®à¤¾|à¤° à¤®|à¤ªà¥à¤¤|à¤¿à¤¯à¤¾|à¤¾à¤¹à¥€|à¤¬à¤¾à¥¤|à¤¯à¥‹à¤—|à¥€ à¤¸|à¤² à¤¹|à¥‚à¤¨ |à¤µà¥à¤¯|à¥ à¤•|à¤ à¤•|à¥‡ à¤µ|à¤‚à¤¤à¥|à¤¸à¥à¤µ|à¤•à¥‡à¤¹|à¥€à¤¯ |à¤–à¤² |à¤¸à¤¾à¤®|à¤¯à¤¤à¤¾|à¤¤à¤¿à¤•|à¥‡ à¤¹|à¤¾à¤ªà¥|à¤°à¤¾à¤ª|à¤° à¤ª|à¤° à¤…| à¤²à¥‹| à¤¸à¤¹|à¤œà¥‡ |à¥‹à¤— |à¤® à¤•|à¤²à¥‡ | à¤¨à¤¿|à¥‡à¤•à¤°|à¤¾ à¤¹|à¤ªà¥‚à¤°|à¤° à¤¨|à¥‡à¤¹à¥|à¥à¤¯ |à¤¯à¤¾ | à¤¯à¤¾|à¤¦à¥‡à¤¶|à¤¦à¥€ |à¤¾ à¤®|à¤¾à¤µ | à¤¦à¥‹|à¥‡ à¤¦| à¤ªà¤¾|à¤¹à¤¿ |à¤¿à¤•à¥|à¤¶à¤¿à¤•| à¤¶à¤¿|à¤¬à¤¾ |à¤¿à¤² | à¤‰à¤ª|à¥à¤°à¤¤| à¤µà¤¿| à¤¹à¥€| à¤²à¥‡|à¤°à¥‹ |à¥‡ à¤–|à¤ à¤¨ |à¤—à¤ à¤¨|à¤‚à¤—à¤ | à¤®à¤¿|à¤·à¤£ |à¥à¤·à¤£|à¤‚à¤°à¤•|à¤¸à¤‚à¤°| à¤†à¤¦| à¤à¤•|à¤¨à¥‡ | à¤…à¤ª|à¤¤à¤‚à¤¤|à¤µà¤¤à¤‚|à¥à¤µà¤¤|à¥à¤¤à¤°|à¥à¤¯à¤¾|à¥‡à¤¶ |à¤¾à¤¦à¥€|à¥à¤¤à¤¿|à¤œà¤¿à¤•|à¤¾à¤œà¤¿|à¤• à¤†|à¥à¤® |à¤šà¤¾à¤°| à¤‰à¤š| à¤¶à¤¾|à¤°à¥€ |à¤¾à¤¹ |à¤¯à¤¾à¤¹|à¤¬à¤¿à¤¯|à¤šà¤¿à¤¤|à¤•à¥à¤¤|à¤ªà¤¯à¥‹|à¤‰à¤ªà¤¯|à¤°à¤¤à¤¾|à¤° à¤µ|à¤¨ à¤®|à¤²à¥‹à¤—|à¤¹ à¤•|à¤¨ à¤ª|à¤•à¤¾à¤®| à¤ªà¥‚| à¤‡ |à¤†à¤¦à¤¿|à¤ˆà¤² | à¤•à¤ˆ| à¤µà¥|à¤®à¥€ |à¥à¤°à¤•|à¤¸à¥à¤°| à¤œà¥€|à¤§à¤¾à¤°|à¤¯ à¤¸|à¤¤à¤°à¥|à¤­à¥‡ |à¤¸à¤­à¥‡| à¤¸à¤­|à¤­à¤¾à¤µ|à¥à¤¥à¤¿|à¤¾à¤®à¤¾|à¤¸à¤° |à¤°à¥à¤®| à¤•à¥‹| à¤¬à¥‡|à¥‹à¤¸à¤°|à¤¦à¥‹à¤¸|à¤£ à¤•|à¤¾à¤¸ |à¥‡ à¤ª|à¤œà¤¾à¤¦|à¤†à¤œà¤¾| à¤†à¤œ|à¤‰à¤šà¤¿|à¤— à¤•|à¤¾à¤°à¥€| à¤œà¤°|à¤—à¥‡ |à¤œ à¤•|à¥€ à¤¬|à¤¸à¤¨ |à¤¹à¥‹ |à¤¾ à¤¤',
    npi: 'à¤•à¥‹ |à¤¨à¥‡ | à¤° |à¤¾à¤° |à¤•à¥à¤¤|à¤•à¤¾à¤°|à¤ªà¥à¤°| à¤ªà¥|à¥à¤¯à¤•|à¤µà¥à¤¯| à¤—à¤°|à¤¿à¤•à¤¾| à¤µà¥|à¥à¤°à¤¤|à¤§à¤¿à¤•|à¥à¤¤à¤¿|à¤¯à¤•à¥|à¤…à¤§à¤¿| à¤…à¤§|à¤¾à¤ˆ |à¤®à¤¾ |à¤²à¤¾à¤ˆ|à¤¤à¥à¤¯|à¤¿à¤• | à¥¤ | à¤¸à¤®|à¤µà¤¾ | à¤µà¤¾|à¤• à¤µ|à¥à¤¨à¥‡|à¤°à¥à¤¨|à¤—à¤°à¥|à¤¨à¥à¤¤|à¤› à¥¤|à¤¤à¤¿à¤²|à¤°à¤¤à¥|à¤¤à¥à¤°|à¥‡à¤• |à¤¯à¥‡à¤•|à¥à¤¯à¥‡|à¤¿à¤²à¤¾|à¤° à¤¸|à¥‹ à¤¸| à¤¸à¥|à¤®à¤¾à¤¨|à¤•à¥à¤·| à¤µà¤¿|à¤¹à¥à¤¨|à¤¾ à¤¸| à¤¹à¥| à¤› |à¤° à¤›|à¥à¤¤à¥|à¤¸à¤®à¤¾|à¤¸à¥à¤µ|à¥¤ à¤ª| à¤¸à¤‚|à¤¨à¥‡à¤›|à¥à¤¨à¥‡|à¤¹à¤°à¥|à¤¤à¤¨à¥|à¤µà¤¤à¤¨|à¥‡ à¤…|à¤¿à¤¨à¥‡|à¥‹ à¤…|à¥à¤µà¤¤| à¤•à¤¾|à¥‡ à¤›|à¤—à¤°à¤¿| à¤°à¤¾|à¥à¤° |à¤¤à¤¿ |à¤¾à¤•à¥‹| à¤•à¥|à¤·à¥à¤Ÿ|à¤¨à¤¾ |à¤¸à¥à¤¤|à¤• à¤¸|à¥à¤¨à¥ˆ|à¤•à¥à¤¨|à¤Ÿà¥à¤°|à¤²à¥‡ | à¤¨à¤¿|à¤¾à¤¨ |à¤›à¥ˆà¤¨| à¤›à¥ˆ|à¥à¤Ÿà¥|à¤¾à¤·à¥|à¤°à¤¾à¤·|à¤¤à¤¿à¤•|à¤›à¥¤ |à¤¾à¤°à¥|à¤¤à¤¾ |à¤¿à¤¤ |à¤¨à¥ˆ |à¤¾ à¤…| à¤¸à¤¾|à¤¾ à¤µ|à¤°à¥ | à¤®à¤¾| à¤…à¤¨|à¤¾ à¤°|à¤°à¤¤à¤¾|à¤° à¤°|à¤¹à¤°à¥‚|à¥‡à¤› |à¤¾ à¤ª|à¤°à¤•à¥|à¥à¤¤ | à¤ªà¤°|à¤¥à¤¾ | à¤²à¤¾|à¤ªà¤°à¤¿|à¤¦à¥‡à¤¶|à¤¸à¤•à¥‹| à¤¯à¤¸|à¤®à¤¾à¤œ|à¤¾à¤®à¤¾|à¥à¤°à¤¾|à¤¿à¤µà¤¾|à¤¾à¤¹à¤°|à¥‹ à¤ª|à¥à¤¯ |à¤µà¤¾à¤°|à¤¨ à¤¸|à¥¤ à¤•|à¤¨à¤¿ |à¥à¤·à¤¾| à¤¤à¥|à¤¦à¥à¤§|à¤° à¤¹|à¤¤à¤¥à¤¾| à¤¤à¤¥|à¤¯à¤¸à¥|à¥à¤¯à¤¸|à¤°à¥€ |à¤° à¤µ|à¤ªà¤¨à¤¿|à¤°à¤¿à¤¨|à¤‚à¤°à¤•|à¤¸à¤‚à¤°|à¤­à¤¾à¤µ|à¥ˆ à¤µ|à¤¸à¤¬à¥ˆ| à¤¸à¤¬| à¤¶à¤¿| à¤¸à¤¹|à¤¤à¤¾à¤•|à¥‡ à¤°|à¤¤ à¤°|à¤²à¤¾à¤—| à¤¸à¥|à¥à¤·à¤£|à¤¦à¥à¤¦| à¤…à¤ª|à¥ˆà¤¨ |à¥‹ à¤µ|à¤¿à¤•à¥|à¤¾à¤µ |à¤§à¤¾à¤°|à¥à¤¯à¤¾|à¥à¤°à¤¿|à¤¾ à¤­|à¤à¤•à¥‹|à¤° à¤®|à¤¨ à¤…|à¥‹ à¤²| à¤‰à¤¸|à¤¶à¤¿à¤•|à¤¾à¤¤à¥|à¤¸à¥à¤¥|à¤µà¤¾à¤¹|à¥‚à¤°à¥|à¤¶à¥à¤¯|à¤¿à¤¤à¥|à¤°à¤•à¥‹|à¤¾à¤°à¤•|à¥à¤¦à¥|à¤¤à¥‹ |à¥à¤¤à¥‹|à¤¾à¤‰à¤¨|à¤•à¤¾à¤¨|à¤¿à¤à¤•|à¤¾ à¤¨| à¤ªà¤¨|à¤¨à¥¤ |à¥ˆà¤¨à¥¤|à¤•à¤¾ |à¥‡à¤›à¥¤| à¤­à¥‡|à¤°à¥à¤¯|à¤¸à¤®à¥|à¤¤à¥à¤ª|à¤¸à¤¾à¤®|à¤°à¤¿à¤¯|à¤šà¤¾à¤°|à¤¨à¤¿à¤œ|à¥à¤¨ |à¤—à¤¿ |à¤¾à¤—à¤¿|à¤‰à¤¸à¤•| à¤®à¤¤| à¤…à¤­|à¤ªà¥‚à¤°|à¤° à¤¤| à¤¸à¤•|à¤¸à¤¾à¤°|à¤°à¤¾à¤§|à¤ªà¤°à¤¾|à¤…à¤ªà¤°|à¥à¤•à¥|à¤œà¤•à¥‹| à¤‰à¤ª|à¤°à¤¾ |à¤¾à¤°à¤¾|à¥à¤µà¤¾|à¤µà¤¿à¤§|à¥à¤¨ |à¤¾ à¤¤|à¤¨ à¤—|à¤£à¤•à¥‹| à¤ªà¤¾| à¤¦à¤¿|à¤• à¤°|à¤° à¤ª|à¤…à¤¨à¥|à¤­à¥‡à¤¦|à¤¾à¤°à¤®|à¥‹ à¤†| à¤…à¤°|à¤œà¤¿à¤•|à¤¾à¤œà¤¿|à¤¿à¤¯ |à¤·à¤¾ |à¤¾à¤Ÿ |à¤¬à¤¾à¤Ÿ| à¤¬à¤¾|à¤¿ à¤°| à¤›à¥¤|à¤¤à¥à¤µ|à¤¤ à¤¸|à¤°à¥‚ |à¤› à¤°|à¤°à¤•à¤¾|à¤µà¤¿à¤•|à¤° à¤‰|à¥‹à¤— |à¥à¤¦à¥‡|à¤°à¤¿à¤µ|à¤¸à¤•à¤¿|à¥ˆ à¤ª|à¤°à¤¤à¤¿|à¤…à¤¨à¥| à¤†à¤µ|à¤¯à¥à¤•|à¤¾ à¤—|à¤¨à¤®à¤¾|à¤¯à¥‹à¤—|à¤— à¤—|à¤• à¤…|à¤¦à¥à¤µ|à¥à¤§ |à¤°à¥à¤¦| à¤¬à¤¿|à¥¤ à¤¸|à¤‰à¤¨à¥‡|à¤¾à¤¨à¥|à¤¾ à¤®|à¤¿à¤•à¥‹|à¤°à¥à¤¦|à¤¾à¤°à¥€|à¥à¤¤à¤°|à¥‹ à¤¹|à¤¹à¤¿à¤¤| à¤¦à¥‡|à¤°à¤¿à¤•|à¤¾ à¤•| à¤†à¤§|à¤°à¤¾à¤œ|à¤°à¥à¤®|à¥à¤£ |à¤°à¥à¤£|à¤¿ à¤µ|à¥à¤¯à¤µ|à¤µà¤¿à¤š|à¤¬à¥ˆ |à¤¸à¤¹à¤¿|à¤°à¥‹à¤œ|à¤°à¥à¤¸|à¤ˆ à¤‰|à¥à¤ª |à¤°à¤¾à¤¤|à¤¨à¤¿à¤•|à¤®à¤¿à¤•|à¤šà¥à¤›|à¥à¤¥à¤¾|à¤µà¤¿à¤µ|à¤•à¤¤à¤¾|à¤…à¤­à¤¿|à¥à¤§à¤¾',
    mag: ' à¤•à¥‡|à¤•à¥‡ |à¤¾à¤° | à¤¹à¤ˆ|à¤•à¤¾à¤°|à¤ˆà¥¤ |à¤¹à¤ˆà¥¤|à¤¿à¤•à¤¾|à¥‡ à¤…|à¤§à¤¿à¤•|à¤…à¤§à¤¿| à¤…à¤§|à¤° à¤¹|à¥‡ à¤•|à¤”à¤° | à¤”à¤°|à¤¾ à¤•|à¥‡ à¤¸|à¤¸à¤¬ | à¤¸à¤¬| à¤•à¤°|à¥‡à¤‚ |à¤¥à¤¾ |à¤®à¥‡à¤‚| à¤®à¥‡|à¤¤à¤¥à¤¾| à¤¤à¤¥|à¤¿à¤• | à¤¹à¥‹| à¤¸à¤®|à¤•à¥à¤·|à¤¨à¤¾ |à¤¬ à¤•|à¤° à¤¸| à¤¸à¤‚|à¤¾ à¤¸|à¤•à¤° | à¤­à¥€|à¥¤ à¤¸| à¤¸à¤¾| à¤¸à¥‡| à¤•à¤¾| à¤…à¤ª|à¥à¤°à¤¾|à¤ªà¥à¤°| à¤ªà¥|à¤¸à¥‡ |à¤­à¥€ | à¤•à¥‹|à¤¤ à¤•| à¤ªà¤°|à¤°à¤¾ |à¤• à¤¹|à¤ªà¤¨ |à¤…à¤ªà¤¨| à¤¸à¤•|à¤¯à¤¾ |à¤¤à¤¿ |à¤° à¤•|à¥€ à¤•| à¤¯à¤¾|à¤•à¤°à¥‡| à¤œà¤¾|à¤°à¥‡ | à¤“à¤•|à¥à¤¤ |à¤¸à¤• |à¤¨à¥‹ |à¤¾à¤¨ |à¤®à¤¾à¤¨|à¤“à¤•à¤°|à¤¾ à¤ª|à¤¨ à¤•|à¥‡à¤² | à¤¨à¤¾|à¥¤ à¤•|à¤°à¤•à¥| à¤¸à¥|à¤¹à¥€ |à¤¹à¥‹à¤| à¤à¤•|à¤ªà¤° |à¤¦à¥€ |à¤Ÿà¥à¤°|à¤¤à¤¾ |à¤µà¥à¤¯|à¤¹à¤ˆ | à¤¶à¤¾|à¥‡ à¤‰| à¤¦à¥‡|à¤¤à¥à¤°|à¤¾à¤¦à¥€| à¤°à¤¾| à¤¹à¥€|à¤•à¤¾à¤¨|à¤¿à¤¤ |à¤® à¤•|à¤² à¤œ|à¤¾à¤® |à¥€ à¤¸|à¥‡ à¤­|à¤¨ à¤¸|à¤®à¤¾à¤œ|à¤·à¥à¤Ÿ|à¤·à¤¾ | à¤²à¥‡|à¤• à¤¸|à¤¬à¥‡ |à¤µà¥‡ |à¤¾à¤µà¥‡|à¤®à¤¿à¤²|à¤° à¤®|à¥à¤¯ |à¤¾ à¤¹|à¤²à¤¾ |à¤ªà¥à¤¤|à¤¨à¥‚à¤¨|à¤¾à¤¨à¥‚|à¤œà¤¾ |à¥‡à¤•à¤°|à¥à¤·à¤¾|à¥à¤°à¤¤|à¤‚à¤¤à¥|à¤° à¤”|à¥‹à¤ˆ |à¤•à¥‹à¤ˆ|à¥à¤Ÿà¥|à¤¾à¤·à¥|à¤°à¤¾à¤·| à¤®à¤¾|à¤°à¥‹ | à¤œà¥‡|à¤•à¤°à¤¾|à¥‹à¤ |à¤¾à¤ªà¥|à¤°à¤¾à¤ª|à¤¸à¤®à¤¾|à¥‚à¤¨ |à¥‹ à¤¸|à¤¸à¥à¤µ|à¥à¤¤à¤¿|à¤¸à¤¾à¤®|à¥‹à¤¨à¥‹|à¤•à¥‹à¤¨| à¤µà¥|à¤° à¤…|à¥à¤® | à¤µà¤¿| à¤¸à¤¹|à¥‡ à¤®|à¤•à¥à¤¤|à¤¯à¥‹à¤—|à¤° à¤µ|à¤•à¤¾à¤®|à¤² à¤¹| à¤¨à¤¿|à¤¦à¥‡à¤¶|à¤ªà¥‚à¤°|à¤µà¤¾à¤°| à¤‡ |à¤‚à¤°à¤•|à¤¸à¤‚à¤°|à¤ à¤•|à¤° à¤ª| à¤¸à¥|à¤¤à¤‚à¤¤|à¤µà¤¤à¤‚|à¥à¤µà¤¤|à¤¾ à¤®|à¤µ à¤•|à¥‡ à¤µ|à¤¾à¤¥ |à¤¸à¤¾à¤¥| à¤¦à¥‹|à¤¹à¥‹à¤¬| à¤ªà¤¾|à¥‹ à¤•|à¥‡ à¤¬|à¥‹à¤— | à¤‰à¤ª|à¤¸à¥à¤¤|à¤ªà¤°à¤¿|à¤¨ à¤ª|à¥‡ à¤¤|à¥à¤¤à¤°|à¤²à¥‡à¤²|à¥‡ à¤“|à¤šà¤¾à¤¹| à¤šà¤¾|à¤¯ à¤•|à¤µà¤¾ |à¥‡à¤¶ |à¤¯ à¤¸|à¤¨ à¤¹|à¤·à¤£ |à¤¾ à¤¬|à¥¤ à¤¤|à¤à¤• |à¤à¤² |à¥€à¤¯ |à¤•à¥‡à¤•|à¥‡ à¤¹|à¤° à¤†|à¤¿ à¤•|à¤¸à¥à¤¥|à¤œà¤¿à¤•|à¤¾à¤œà¤¿|à¤¾à¤®à¤¾|à¤°à¥€à¤¯|à¥à¤°à¥€|à¤¤à¤¿à¤•|à¤¾à¤¤à¤¿| à¤¬à¤¿|à¤šà¤¾à¤°|à¥‡ à¤†|à¤¾à¤¸ | à¤‰à¤š|à¤¾ à¤¤|à¤¯à¤•à¥|à¥à¤¯à¤•|à¤¿à¤² |à¤®à¤¯ |à¤¸à¤®à¤¯|à¤¶à¤¾à¤¦|à¤ªà¤¯à¥‹|à¤‰à¤ªà¤¯|à¥‡ à¤–|à¤°à¤¿à¤µ| à¤ªà¥‚|à¥‡ à¤²|à¥‡ à¤š|à¥Œà¤¨à¥‹|à¤•à¥Œà¤¨| à¤•à¥Œ|à¤‚ à¤•|à¤¸à¤‚à¤—|à¤¨ à¤¦|à¤‚ à¤¸|à¤£ à¤ª|à¥à¤·à¤£|à¤° à¤¨|à¥‡ à¤¨|à¥‹ à¤­|à¤•à¤°à¥‹|à¤¾ à¤”|à¤°à¤¤à¤¾|à¤¾à¤µ |à¤­à¤¾à¤µ|à¤• à¤”|à¤°à¥à¤®|à¥‹à¤¸à¤°|à¤¦à¥‹à¤¸|à¤£ à¤•|à¥‡ à¤ª|à¤¨ à¤”|à¤¬ à¤¹|à¤¿à¤•à¥|à¤¶à¤¿à¤•| à¤¶à¤¿|à¤¾à¤¬à¥‡|à¤¨à¤¿à¤¯|à¤šà¤¿à¤¤|à¤‰à¤šà¤¿|à¤¿à¤¤à¥|à¤— à¤•|à¥‡à¥¤ |à¤¤ à¤¸|à¥€ à¤¶|à¤‚ à¤¶|à¤à¤•à¤°|à¥¤ à¤|à¤¤à¤¨ | à¤“ |à¤°à¥€ |à¥à¤° |à¤œà¥‡ |à¤• à¤•| à¤¸à¥€|à¤¸à¤¨ |à¤¿à¤µà¤¾| à¤…à¤¨|à¥‚à¤°à¤¾| à¤¬à¤š|à¤à¥¤ | à¤¬à¥‡|à¤¤ à¤¹| à¤¤à¤•| à¤®à¤¿|à¤§à¤¾à¤°|à¤¥à¤µà¤¾|à¤…à¤¥à¤µ| à¤…à¤¥|à¤¿à¤²à¤¾|à¥à¤µà¤¾|à¤¿ à¤®| à¤†à¤¦|à¤¨à¥‡ |à¤•à¤à¤²| à¤•à¤|à¥à¤¯à¤¾'
  }
}

  // franc-min index
// This file is generated by `build.js`
/**
 * @typedef {import('trigram-utils').TrigramTuple} TrigramTuple
 *
 * @typedef Options
 * @property {Array<string>} [only]
 *   Languages to allow.
 * @property {Array<string>} [ignore]
 *   Languages to ignore.
 * @property {number} [minLength=10]
 *   Minimum length to accept.
 */

/* Load `trigram-utils`. */

/* Load `expressions` (regular expressions matching
 * scripts). */

/* Load `data` (trigram information per language,
 * per script). */


/* Maximum sample length. */
const MAX_LENGTH = 2048

/* Minimum sample length. */
const MIN_LENGTH = 10

/* The maximum distance to add when a given trigram does
 * not exist in a trigram dictionary. */
const MAX_DIFFERENCE = 300

var own = {}.hasOwnProperty

/* Construct trigram dictionaries. */

let script

const numericData = {}

for (script in data) {
  if (own.call(data, script)) {
    const languages = data[script]
        let name

    numericData[script] = {}

    for (name in languages) {
      if (own.call(languages, name)) {
        const model = languages[name].split('|')
                const trigrams = {}
        let weight = model.length

        while (weight--) {
          trigrams[model[weight]] = weight
        }

        numericData[script][name] = trigrams
      }
    }
  }
}

/**
 * Get the most probable language for the given value.
 *
 * @param {string} [value]
 *   The value to test.
 * @param {Options} [options]
 *   Configuration.
 * @return {string}
 *  The most probable language.
 */
function franc(value, options) {
  return francAll(value, options)[0][0]
}

/**
 * Get a list of probable languages the given value is
 * written in.
 *
 * @param {string} [value]
 *   The value to test.
 * @param {Options} [options]
 *   Configuration.
 * @return {Array<TrigramTuple>}
 *   An array containing languageâ€”distance tuples.
 */
function francAll(value, options = {}) {
    // @ts-expect-error: `whitelist` is from long ago.
  const only = [...(options.whitelist || []), ...(options.only || [])]
    // @ts-expect-error: `blacklist` is from long ago.
  const ignore = [...(options.blacklist || []), ...(options.ignore || [])]
  const minLength =
    options.minLength !== null && options.minLength !== undefined
      ? options.minLength
      : MIN_LENGTH

  if (!value || value.length < minLength) {
    return und()
  }

  value = value.slice(0, MAX_LENGTH)

  /* Get the script which characters occur the most
   * in `value`. */
  const script = getTopScript(value, expressions)

  /* One languages exists for the most-used script. */
  if (!script[0] || !(script[0] in numericData)) {
    /* If no matches occured, such as a digit only string,
     * or because the language is ignored, exit with `und`. */
    if (!script[0] || script[1] === 0 || !allow(script[0], only, ignore)) {
      return und()
    }

    return singleLanguageTuples(script[0])
  }

  /* Get all distances for a given script, and
   * normalize the distance values. */
  return normalize(
    value,
    getDistances(asTuples(value), numericData[script[0]], only, ignore)
  )
}

/**
 * Normalize the difference for each tuple in
 * `distances`.
 *
 * @param {string} value
 *   Value to normalize.
 * @param {Array<TrigramTuple>} distances
 *   List of distances.
 * @return {Array<TrigramTuple>}
 *   Normalized distances.
 */
function normalize(value, distances) {
  const min = distances[0][1]
  const max = value.length * MAX_DIFFERENCE - min
  let index = -1

  while (++index < distances.length) {
    distances[index][1] = 1 - (distances[index][1] - min) / max || 0
  }

  return distances
}

/**
 * From `scripts`, get the most occurring expression for
 * `value`.
 *
 * @param {string} value
 *   Value to check.
 * @param {Record<string, RegExp>} scripts
 *   Top-Scripts.
 * @return {[string|undefined, number]}
 *   Top script and its occurrence percentage.
 */
function getTopScript(value, scripts) {
  let topCount = -1
    let topScript
    let script

  for (script in scripts) {
    if (own.call(scripts, script)) {
      const count = getOccurrence(value, scripts[script])

      if (count > topCount) {
        topCount = count
        topScript = script
      }
    }
  }

  return [topScript, topCount]
}

/**
 * Get the occurrence ratio of `expression` for `value`.
 *
 * @param {string} value
 *   Value to check.
 * @param {RegExp} expression
 *   Code-point expression.
 * @return {number}
 *   Float between 0 and 1.
 */
function getOccurrence(value, expression) {
  const count = value.match(expression)

  return (count ? count.length : 0) / value.length || 0
}

/**
 * Get the distance between an array of trigramâ€”count
 * tuples, and multiple trigram dictionaries.
 *
 * @param {Array<TrigramTuple>} trigrams
 *   An array containing trigramâ€”count tuples.
 * @param {Record<string, Record<string, number>>} languages
 *   Multiple trigrams to test against.
 * @param {Array<string>} only
 *   Allowed languages; if non-empty, only included languages are kept.
 * @param {Array<string>} ignore
 *   Disallowed languages; included languages are ignored.
 * @return {Array<TrigramTuple>} An array
 *   containing languageâ€”distance tuples.
 */
function getDistances(trigrams, languages, only, ignore) {
  languages = filterLanguages(languages, only, ignore)

    const distances = []
    let language

  if (languages) {
    for (language in languages) {
      if (own.call(languages, language)) {
        distances.push([language, getDistance(trigrams, languages[language])])
      }
    }
  }

  return distances.length === 0 ? und() : distances.sort(sort)
}

/**
 * Get the distance between an array of trigramâ€”count
 * tuples, and a language dictionary.
 *
 * @param {Array<TrigramTuple>} trigrams
 *   An array containing trigramâ€”count tuples.
 * @param {Record<string, number>} model
 *   Object containing weighted trigrams.
 * @return {number}
 *   The distance between the two.
 */
function getDistance(trigrams, model) {
  let distance = 0
  let index = -1

  while (++index < trigrams.length) {
    const trigram = trigrams[index]
    let difference = MAX_DIFFERENCE

    if (trigram[0] in model) {
      difference = trigram[1] - model[trigram[0]] - 1

      if (difference < 0) {
        difference = -difference
      }
    }

    distance += difference
  }

  return distance
}

/**
 * Filter `languages` by removing languages in
 * `ignore`, or including languages in `only`.
 *
 * @param {Record<string, Record<string, number>>} languages
 *   Languages to filter
 * @param {Array<string>} only
 *   Allowed languages; if non-empty, only included languages are kept.
 * @param {Array<string>} ignore
 *   Disallowed languages; included languages are ignored.
 * @return {Record<string, Record<string, number>>}
 *   Filtered array of languages.
 */
function filterLanguages(languages, only, ignore) {
  if (only.length === 0 && ignore.length === 0) {
    return languages
  }

    const filteredLanguages = {}
    let language

  for (language in languages) {
    if (allow(language, only, ignore)) {
      filteredLanguages[language] = languages[language]
    }
  }

  return filteredLanguages
}

/**
 * Check if `language` can match according to settings.
 *
 * @param {string} language
 *   Languages to filter
 * @param {Array<string>} only
 *   Allowed languages; if non-empty, only included languages are kept.
 * @param {Array<string>} ignore
 *   Disallowed languages; included languages are ignored.
 * @return {boolean}
 *   Whether `language` can match
 */
function allow(language, only, ignore) {
  if (only.length === 0 && ignore.length === 0) {
    return true
  }

  return (
    (only.length === 0 || only.includes(language)) && !ignore.includes(language)
  )
}

/**
 * Create a single `und` tuple.
 */
function und() {
  return singleLanguageTuples('und')
}

/**
 * Create a single tuple as a list of tuples from a given language code.
 *
 * @param {string} language
 * @returns {Array<TrigramTuple>}
 */
function singleLanguageTuples(language) {
  return [[language, 1]]
}

/**
 * Deep regular sort on the number at `1` in both objects.
 *
 * @param {TrigramTuple} a
 * @param {TrigramTuple} b
 */
function sort(a, b) {
  return a[1] - b[1]
}

  window.franc = franc;

  window.francPredominant = function(texts, options) {
    var only = (options && options.only) ? options.only : null;
    var ignore = (options && options.ignore) ? options.ignore : null;
    var minLength = (options && options.minLength) ? options.minLength : 10;
    var votes = {};
    var best = null;
    var bestCount = 0;
    for (var i = 0; i < texts.length; i++) {
      var result = franc(texts[i], { only: only, ignore: ignore, minLength: minLength });
      if (result === 'und') continue;
      votes[result] = (votes[result] || 0) + 1;
      if (votes[result] > bestCount) {
        bestCount = votes[result];
        best = result;
      }
    }
    return best || 'und';
  };
})();
