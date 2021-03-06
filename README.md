## gwas-credible-sets
A package for calculating Bayes factors and credible sets from genome-wide association study (GWAS) results. 

[![Travis build status](http://img.shields.io/travis/statgen/gwas-credible-sets.svg?style=flat)](https://travis-ci.org/statgen/gwas-credible-sets)
[![Dependency Status](https://david-dm.org/statgen/gwas-credible-sets.svg)](https://david-dm.org/statgen/gwas-credible-sets)
[![devDependency Status](https://david-dm.org/statgen/gwas-credible-sets/dev-status.svg)](https://david-dm.org/statgen/gwas-credible-sets#info=devDependencies)

## Synopsis

This package provides functions for calculating Bayes factors and credible sets using p-values from GWAS results. 
These functions can be used separately, or combined with [locuszoom.js] for interactive credible set visualization. 

Credible sets are currently calculated using the following procedure: 

1. For each variant, calculate a Bayes factor from the p-value (or -log10 p-value). 
2. Normalize each Bayes factor to the sum of all Bayes factors in a region to calculate the posterior probability 
  that a variant is causal. 
3. Identify which variants belong to a X% credible set given their posterior probabilities. 

In the future, additional scoring or annotation methods may be provided.


## Usage
### How to include in your project
This package may be directly incorporated into other javascript projects as a module, or by including 
`dist/gwas-credible-sets.min.js` directly into your page (as a standalone file, or via a CDN option such as unpkg). 

`gwas-credible-sets` also supports several packaging environments and may be used in both client and server side 
applications, including Node.js, ES6 modules, and Webpack. It may be installed from NPM:

`npm install --save gwas-credible-sets`

For information about performance impacts of client-side computation, 
  see [timing and performance estimates](tests/timings/timings.md).

### Sample credible set calculation
The instructions below assume that the module is being sourced directly into a page:

`<script src="https://cdn.example/gwas-credible-sets.min.js" type="application/javascript"></script>`

The example below assumes that you are given an array of p-values, each representing a different data point. It 
returns a set of booleans saying whether each data point is a member of the 95% credible set. 

```javascript
    var scores = gwasCredibleSets.scoring.bayesFactors(nlogpvals);
    var posteriorProbabilities = gwasCredibleSets.scoring.posteriorProbabilities(scores);
    var credibleSetBoolean = gwasCredibleSets.marking.findCredibleSet(posteriorProbabilities, 0.95);
```

The `marking` module contains several helper functions to control how the credible set is returned. Return values 
can be posterior probabilities, or booleans indicating set members, or normalizing the output values to a pre-computed 
range for visualization. See full documentation for details. 

## Development
### Requirements
This package has been developed and tested using Node.js 8 LTS (Carbon).

If you would like to make changes to the core functionality within this module for development, install package 
requirements as follows:

`npm install` 

### Useful Commands

The following commands are particularly useful during development 
- `npm test`: run unit tests and exit
- `npm run watch`: auto-run tests whenever code changes
- `npm run build`: build `dist/` files and update documentation

[locuszoom.js]: https://github.com/statgen/locuszoom
