const fs = require('fs');
const path = require('path');
var electron_notarize = require('electron-notarize');

module.exports = async function(params) {
	// Only notarize the app on Mac OS only.
	for (var key of params.platformToTargets.keys()) {
		if (key.name !== 'mac') {
			return;
		}
	}

  console.log('afterSign hook triggered');

  if (!process.env.CIRCLE_TAG || process.env.CIRCLE_TAG.length === 0) {
    console.log('Not on a tag. Skipping notarization');
    return;
  }

  // Same appId in electron-builder.
  let appId = 'com.automattic.wordpress';

  let appPath = path.join(
		params.outDir,
		`mac/WordPress.com.app`
	)

	if (!fs.existsSync(appPath)) {
    throw new Error(`Cannot find application at: ${appPath}`);
  }

	console.log(`Notarizing ${appId} found at ${appPath}`);

  try {
    await electron_notarize.notarize({
      appBundleId: appId,
      appPath: appPath,
      appleId: process.env.NOTARIZATION_ID,
      appleIdPassword: process.env.NOTARIZATION_PWD,
      ascProvider: 'AutomatticInc',
    });
  } catch (error) {
    console.error(error);
  }

  console.log(`Done notarizing ${appPath}`);
};
