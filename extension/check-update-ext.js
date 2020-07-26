/* eslint-disable */
const fs = require('fs');
const semver = require('semver');
const request = require('request');

module.exports = function (nodecg, name, repo) {
  const manifestPath = `bundles/${name}/package.json`;
  let manifest;

  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  } catch (e) {
    // probably shouldn't happen if the extension was loaded, but just in case
    nodecg.log.error(e);
  }

  var { name } = manifest;
  const currentVer = manifest.version;

  const repoManifestPath = `https://api.github.com/repos/${repo}/contents/package.json`;

  const requestOptions = {
    url: repoManifestPath,
    headers: {
      'User-Agent': 'NodeCG bundle update checker'
    }
  };

  request(requestOptions, (err, res, body) => {
    if (!err && res.statusCode === 200) {
      const manifestDownloadUrl = JSON.parse(body).download_url;
      downloadManifest(manifestDownloadUrl, name);
    } else {
      nodecg.log.warn(`Failed to get repository info for ${repo}. (Status code ${res.statusCode})`);
    }
  });

  function downloadManifest(url, bundleName) {
    request(url, (err, res, body) => {
      if (!err && res.statusCode === 200) {
        repoManifest = JSON.parse(body);
        const repoVersion = repoManifest.version;

        if (semver.gt(repoVersion, currentVer)) {
          nodecg.log.info(`Bundle ${name} has an update available. (Curr: ${currentVer}, New: ${repoVersion}) Exit NodeCG and enter 'nodecg update ${name}'.`);
        } else {
          nodecg.log.info(`Bundle ${name} is up-to-date. (Curr: ${currentVer})`);
        }
      } else {
        nodecg.log.warn(`Failed to download manifest for ${bundleName}. (Status code ${res.statusCode})`);
      }
    });
  }
};
