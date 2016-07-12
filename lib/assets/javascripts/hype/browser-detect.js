const detectBrowser = require('detect-browser')

console.log(detectBrowser.name)
console.log(detectBrowser.version)

//  [ 'edge', /Edge\/([0-9\._]+)/ ],
//  [ 'chrome', /Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/ ],
//  [ 'firefox', /Firefox\/([0-9\.]+)(?:\s|$)/ ],
//  [ 'opera', /Opera\/([0-9\.]+)(?:\s|$)/ ],
//  [ 'ie', /Trident\/7\.0.*rv\:([0-9\.]+)\).*Gecko$/ ],
//  [ 'ie', /MSIE\s([0-9\.]+);.*Trident\/[4-7].0/ ],
//  [ 'ie', /MSIE\s(7\.0)/ ],
//  [ 'bb10', /BB10;\sTouch.*Version\/([0-9\.]+)/ ],
//  [ 'android', /Android\s([0-9\.]+)/ ],
//  [ 'ios', /iPad\;\sCPU\sOS\s([0-9\._]+)/ ],
//  [ 'ios',  /iPhone\;\sCPU\siPhone\sOS\s([0-9\._]+)/ ],
//  [ 'safari', /Safari\/([0-9\._]+)/ ]


const browser = {
  detector: detectBrowser,
  isIe() {
    return this.detector.name === 'ie'
  },
  matchIe(version) {
    return this.isIe && this.detector.version.split('.')[0] <= version
  },
}


module.exports = browser
