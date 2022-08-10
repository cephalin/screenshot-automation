const { test, expect, FrameLocator } = require('@playwright/test');
const sharp = require('sharp');

// Variables
var appName = "msdocs-laravel-mysql-234";
//var appName = "asdfasdfasfe";
var resourceGroupName = "msdocs-laravel-mysql-tutorial";
//var resourceGroupName = "msdocs-laravel-mysql-402_group";
var region = "West Europe";
var runtime = "8.0";
var screenshotFolder = "screenshots/php/";
var screenshot1 = screenshotFolder + "azure-portal-create-app-mysql-1";
var screenshot2 = screenshotFolder + "azure-portal-create-app-mysql-2";
var screenshot3 = screenshotFolder + "azure-portal-create-app-mysql-3";
var screenshot4 = screenshotFolder + "azure-portal-get-connection-string-1";
var screenshot5 = screenshotFolder + "azure-portal-get-connection-string-2";
var screenshot6 = screenshotFolder + "azure-portal-get-connection-string-3";
var screenshot7 = screenshotFolder + "azure-portal-get-connection-string-4";
var screenshotDeploy1 = screenshotFolder + "azure-portal-deploy-sample-code-1";
var screenshotDeploy2 = screenshotFolder + "azure-portal-deploy-sample-code-2";
var screenshotDeploy3 = screenshotFolder + "azure-portal-deploy-sample-code-3";
var screenshotDeploy4 = screenshotFolder + "azure-portal-deploy-sample-code-4";
var screenshotDeploy5 = screenshotFolder + "azure-portal-deploy-sample-code-5";
var screenshotDeploy6 = screenshotFolder + "azure-portal-deploy-sample-code-6";
var screenshotDeploy7 = screenshotFolder + "azure-portal-deploy-sample-code-7";
var screenshotMigrate1 = screenshotFolder + "azure-portal-generate-db-schema-1";
var screenshotMigrate2 = screenshotFolder + "azure-portal-generate-db-schema-2";
var screenshotPublic1 = screenshotFolder + "azure-portal-change-site-root-1";
var screenshotPublic2 = screenshotFolder + "azure-portal-change-site-root-2";
var screenshotBrowse1 = screenshotFolder + "azure-portal-browse-app-1";
var screenshotBrowse2 = screenshotFolder + "azure-portal-browse-app-2";
var screenshotLogs1 = screenshotFolder + "azure-portal-stream-diagnostic-logs-1";
var screenshotLogs2 = screenshotFolder + "azure-portal-stream-diagnostic-logs-2";
var screenshotClean1 = screenshotFolder + "azure-portal-clean-up-resources-1";
var screenshotClean2 = screenshotFolder + "azure-portal-clean-up-resources-2";
var screenshotClean3 = screenshotFolder + "azure-portal-clean-up-resources-3";

// Utilities
async function getCloudShell(page) {
  await page.goto('https://shell.azure.com/');
  await page.waitForTimeout(10000);
  return await page.frameLocator('.fxs-console-iframe').locator('.xterm-helper-textarea');
}

async function executeInShell(shell, command) {
  for (var i = 0; i < command.length; i++) {
    await shell.press(command.charAt(i));
  }
  await shell.press("Enter");
}

async function typeInCodeEditor(page, code) {
  for (var i = 0; i < code.length; i++) {
    await page.keyboard.press(code.charAt(i));
  }
}


test.use({ viewport: { width: 780, height: 900 } });
test.setTimeout(40*60*1000);

test('app+db', async ({ page }, workerInfo) => {

  // Sign in to https://github.com/
  await page.goto('https://github.com/login');
  await expect(page).toHaveURL('https://github.com/login');
  await page.locator('input[name="login"]').click();
  await page.locator('input[name="login"]').fill(process.env.GITHUB_USER);
  await page.locator('input[name="password"]').click();
  await page.locator('input[name="password"]').fill(process.env.GITHUB_PASSWORD); 
  await page.locator('input:has-text("Sign in")').click();

  // Go to https://portal.azure.com/
  await page.goto('https://portal.azure.com/');

  // Sign-in
  await page.locator('[placeholder="Email\\, phone\\, or Skype"]').click();
  await page.locator('[placeholder="Email\\, phone\\, or Skype"]').fill(process.env.AZURE_USER);
  await page.locator('text=Next').click();
  await page.locator('[placeholder="Password"]').click();
  await page.locator('[placeholder="Password"]').fill(process.env.AZURE_PASSWORD);
  await page.locator('input:has-text("Sign in")').click();
  await page.locator('text=Yes').click();

  // get rid of notification window.
  await page.locator('[aria-label="Dismiss toast notification"]').click();

  // Create web app + database
  await page.locator('[placeholder="Search resources\\, services\\, and docs \\(G\\+\\/\\)"]').click();
  //await page.waitForTimeout(1000);
  await page.locator('[placeholder="Search resources\\, services\\, and docs \\(G\\+\\/\\)"]').type('web app database');
  await page.locator('li[id="Microsoft.AppServiceWebAppDatabaseV3"] .fxs-menu-result-details').waitFor('visible', 10000);

  // screenshot #1
  await page.setViewportSize({ width: 780, height: 400 });
  await page.locator('.fxs-search').evaluateHandle(el => el.setAttribute("style", "border: 3px solid red !important;"));
  await page.locator('li[id="Microsoft.AppServiceWebAppDatabaseV3"] .fxs-menu-result-details').evaluateHandle(el => el.setAttribute("style", "border: 3px solid red !important;"));
  await page.locator('li[id="Microsoft.AppServiceWebAppDatabaseV3"] .fxs-menu-result-details').scrollIntoViewIfNeeded();
  await page.screenshot({ path: screenshot1 + '.png' });
  await sharp(screenshot1 + '.png')
        .resize({width: 240})
        .toFile(screenshot1 + '-240px.png');

  // Start the create wizard
  await page.locator('text=Web App + Database').click();
  await page.locator('[aria-label="Subscription selector"]').click();
  await page.locator('div[role="treeitem"]:has-text("Visual Studio Enterprise Subscription")').click();
  await page.locator('text=Create new').click();
  await page.locator('[placeholder="Create new"]').click();
  await page.locator('[placeholder="Create new"]').fill(resourceGroupName);
  await page.locator('div[role="button"]:has-text("OK")').click();
  await page.locator('[aria-label="Location selector"]').click();
  await page.locator('div[role="treeitem"]:has-text("' + region + '")').waitFor('visible', 10000);
  await page.locator('div[role="treeitem"]:has-text("' + region + '")').click();
  await page.locator('[placeholder="Web App name\\."]').click();
  await page.locator('[placeholder="Web App name\\."]').fill(appName);
  await page.locator('text=Select a runtime stack').click();
  await page.locator('div[role="treeitem"]:has-text("PHP 8.0")').click();
  await expect(page.locator('.fxc-validation')).toHaveCount(0); // wait for validation warnings to disappear
  await page.locator('.azc-formElementContainer', {has: page.locator('[aria-label="Subscription selector"]')}).evaluateHandle(el => el.setAttribute("style", "border: 3px solid red !important;"));
  //await page.locator('div', {has: page.locator('> [aria-label="Subscription selector"]')}).evaluateHandle(el => el.setAttribute("style", "border: 3px solid red !important;"));
  //await page.$eval('[aria-label="Subscription selector"]', el => el.setAttribute("style", "border: 3px solid red !important;"));
  await page.locator('.azc-formElementContainer', {has: page.locator('[aria-label="Create new or use existing Resource group selector"]')}).evaluateHandle(el => el.setAttribute("style", "border: 3px solid red !important;"));
  await page.locator('.azc-formElementContainer', {has: page.locator('[aria-label="Location selector"]')}).evaluateHandle(el => el.setAttribute("style", "border: 3px solid red !important;"));
  await page.locator('.azc-formElementContainer', {has: page.locator('[aria-label="Web App name"]')}).evaluateHandle(el => el.setAttribute("style", "border: 3px solid red !important;"));
  await page.locator('.azc-formElementContainer', {has: page.locator('[aria-label="Runtime stack selector"]')}).evaluateHandle(el => el.setAttribute("style", "border: 3px solid red !important;"));
  await page.locator('.azc-formElementContainer', {has: page.locator('[aria-label="Location selector"]')}).evaluateHandle(el => el.setAttribute("style", "border: 3px solid red !important;"));
  await page.$eval('[aria-label="Review and create"]', el => el.setAttribute("style", "border: 3px solid red !important;"));

  // screenshot #2
  await page.locator('.fxs-blade-title-titleText').click(); // just click somewhere to unhighlight the checkbox
  await page.setViewportSize({ width: 780, height: 900 });

  await page.locator('.fxs-journey-layout').screenshot({ path: screenshot2 + '.png' });
  await sharp(screenshot2 + '.png')
        .resize({width: 240})
        .toFile(screenshot2 + '-240px.png');
  
  // keep going
  var database = await page.locator('input[aria-label="Database name"]').evaluate(el => el.value);

  await page.locator('[aria-label="Review and create"]').click();
  await page.locator('[aria-label="Create"]').click();

  // Go to https://portal.azure.com/#home
  await page.locator('div[role="button"]:has-text("Go to resource")').first().click({trial: true});

  // screenshot #3
  await page.locator('.ext-hubs-deploymentdetails-main-left .fxc-simplebutton', {has: page.locator('div[role="button"]:has-text("Go to resource")')}).evaluateHandle(el => el.setAttribute("style", "border: 3px solid red !important;"));
  await page.setViewportSize({ width: 780, height: 900 });
  await page.locator('.ext-hubs-deploymentdetails-main-left').screenshot({ path: screenshot3 + '.png' });
  await sharp(screenshot3 + '.png')
        .resize({width: 240})
        .toFile(screenshot3 + '-240px.png');

  // Proceed to app management page
  await page.locator('.ext-hubs-deploymentdetails-main-left div[role="button"]:has-text("Go to resource")').click();

  // screenshot #4
  await page.setViewportSize({ width: 780, height: 500 });
  await expect (page.locator('[data-telemetryname="Menu-configuration"]')).toBeEnabled({timeout: 10000});
  await page.waitForTimeout(3000);
  await page.locator('[data-telemetryname="Menu-configuration"]').scrollIntoViewIfNeeded();
  await page.locator('[data-telemetryname="Menu-configuration"]').evaluateHandle(el => el.setAttribute("style", "border: 3px solid red !important;"));
  await page.locator('.fxs-blade-display-in-journey .fxs-blade-content-container-default').screenshot({ path: screenshot4 + '.png' });
  await sharp(screenshot4 + '.png')
        .resize({width: 240})
        .toFile(screenshot4 + '-240px.png');

  // proceed
  await page.locator('[data-telemetryname="Menu-configuration"]').click();

  var configurationFrame = await page.frameLocator('[data-contenttitle="Configuration"] iframe');
  await configurationFrame.locator('#app-settings-connection-strings-table button#app-settings-connection-strings-name-0').evaluateHandle(el => el.setAttribute("style", "border: 3px solid red !important;"));
  await configurationFrame.locator('#app-settings-connection-strings-table button#app-settings-connection-strings-name-0').click();

  //await configurationFrame.locator('.ms-TextField', {has: page.locator('#connection-strings-form-name')}).evaluateHandle(el => el.setAttribute("style", "border: 3px solid red !important;"));
  await configurationFrame.locator('#connection-strings-form-value-copy-button').evaluateHandle(el => el.setAttribute("style", "border: 3px solid red !important;"));
  //await configurationFrame.locator('.ms-Dropdown-container', {has: page.locator('[aria-label="Type"]')}).evaluateHandle(el => el.setAttribute("style", "border: 3px solid red !important;"));
  //await configurationFrame.locator('#connection-string-edit-footer-save').evaluateHandle(el => el.setAttribute("style", "border: 3px solid red !important;"));
  //await page.frameLocator('[data-contenttitle="Configuration"] iframe').locator('#connection-strings-form-name').click();

  // screenshot #5
  //await page.setViewportSize({ width: 780, height: 500 });
  await page.locator('.fxs-blade-firstblade .fxs-blade-content-container-details').screenshot({ path: screenshot5 + '.png' });
  await sharp(screenshot5 + '.png')
        .resize({width: 240})
        .toFile(screenshot5 + '-240px.png');

  var value = await configurationFrame.locator('input#connection-strings-form-value').evaluate(el => el.value);
  var settings = value.split(';');
  //var database = settings[0].split('=')[1];
  var server = settings[1].split('=')[1];
  var user = settings[2].split('=')[1];
  var password = settings[3].split('=')[1];

  await configurationFrame.locator('#connection-string-edit-footer-cancel').click();
  await configurationFrame.locator('#app-settings-connection-strings-table button#app-settings-connection-strings-name-0').evaluateHandle(el => el.setAttribute("style", ''));

  // set app settings
  await configurationFrame.locator('button[name="New application setting"]').evaluateHandle(el => el.setAttribute("style", "border: 3px solid red !important;"));
  await configurationFrame.locator('button[name="New application setting"]').click();
  await configurationFrame.locator('.ms-TextField', {has: page.locator('input#app-settings-edit-name')}).evaluateHandle(el => el.setAttribute("style", "border: 3px solid red !important;"));
  await configurationFrame.locator('input#app-settings-edit-name').fill("DB_DATABASE");
  await configurationFrame.locator('.ms-TextField', {has: page.locator('input#app-settings-edit-value')}).evaluateHandle(el => el.setAttribute("style", "border: 3px solid red !important;"));
  await configurationFrame.locator('input#app-settings-edit-value').fill(appName + "-database");
  await configurationFrame.locator('button#app-settings-edit-footer-save').evaluateHandle(el => el.setAttribute("style", "border: 3px solid red !important;"));

  // screenshot #6
  await page.setViewportSize({ width: 780, height: 500 });
  await page.mouse.click(0,0); // click out of any text field
  await page.locator('.fxs-blade-firstblade.fxs-blade-display-in-journey .fxs-blade-content-container-details').screenshot({ path: screenshot6 + '.png' });
  await sharp(screenshot6 + '.png')
        .resize({width: 240})
        .toFile(screenshot6 + '-240px.png');

  await configurationFrame.locator('button[name="New application setting"]').evaluateHandle(el => el.setAttribute("style", ""));
  await configurationFrame.locator('button#app-settings-edit-footer-save').click();

  await configurationFrame.locator('button[name="New application setting"]').click();
  await configurationFrame.locator('input#app-settings-edit-name').fill("DB_HOST");
  await configurationFrame.locator('input#app-settings-edit-value').fill(server);
  await configurationFrame.locator('button#app-settings-edit-footer-save').click();

  await configurationFrame.locator('button[name="New application setting"]').click();
  await configurationFrame.locator('input#app-settings-edit-name').fill("DB_USERNAME");
  await configurationFrame.locator('input#app-settings-edit-value').fill(user);
  await configurationFrame.locator('button#app-settings-edit-footer-save').click();

  await configurationFrame.locator('button[name="New application setting"]').click();
  await configurationFrame.locator('input#app-settings-edit-name').fill("DB_PASSWORD");
  await configurationFrame.locator('input#app-settings-edit-value').fill(password);
  await configurationFrame.locator('button#app-settings-edit-footer-save').click();

  await configurationFrame.locator('button[name="New application setting"]').click();
  await configurationFrame.locator('input#app-settings-edit-name').fill("APP_DEBUG");
  await configurationFrame.locator('input#app-settings-edit-value').fill('true');
  await configurationFrame.locator('button#app-settings-edit-footer-save').click();

  await configurationFrame.locator('button[name="New application setting"]').click();
  await configurationFrame.locator('input#app-settings-edit-name').fill("APP_KEY");
  await configurationFrame.locator('input#app-settings-edit-value').fill('base64:Dsz40HWwbCqnq0oxMsjq7fItmKIeBfCBGORfspaI1Kw=');
  await configurationFrame.locator('button#app-settings-edit-footer-save').click();

  // screenshot #7
  await page.setViewportSize({ width: 780, height: 700 });
  await configurationFrame.locator('#app-settings-application-settings-table').scrollIntoViewIfNeeded();
  await configurationFrame.locator('button[data-cy="command-button-Save"]').evaluateHandle(el => el.setAttribute("style", "border: 3px solid red !important;"));  
  await page.locator('.fxs-blade-firstblade.fxs-blade-display-in-journey .fxs-blade-content-container-details').screenshot({ path: screenshot7 + '.png' });
  await sharp(screenshot7 + '.png')
        .resize({width: 240})
        .toFile(screenshot7 + '-240px.png');

  await configurationFrame.locator('button[data-cy="command-button-Save"]').click();
  await configurationFrame.locator('button', {has: page.locator('text=Continue')}).click();
  await page.locator('[aria-label="Dismiss toast notification"]').click();
	await page.locator('.fxs-toast-description.fxs-portal-title:has-text("Successfully updated web app settings")').click();

  // Fork
  await page.goto('https://github.com/Azure-Samples/laravel-tasks');

  await page.setViewportSize({ width: 780, height: 500 });
  await page.locator('a[href="/Azure-Samples/laravel-tasks/fork"]').evaluateHandle(el => el.setAttribute("style", "border: 3px solid red !important;"));
  await page.screenshot({ path: screenshotDeploy1 + '.png' });
  await sharp(screenshotDeploy1 + '.png')
        .resize({width: 240})
        .toFile(screenshotDeploy1 + '-240px.png');

  await page.locator('a[href="/Azure-Samples/laravel-tasks/fork"]').click();
  await expect(page).toHaveURL('https://github.com/Azure-Samples/laravel-tasks/fork');
  await page.locator('text=Create fork').click();
  await expect(page).toHaveURL(`https://github.com/${GITHUB_USER}/laravel-tasks`);

  // GitHub Actions deploy
  await page.goto(`https://portal.azure.com/#@cephaslinhotmail.onmicrosoft.com/resource/subscriptions/${process.env.SUBSCRIPTION_ID}/resourcegroups/${resourceGroupName}/providers/Microsoft.Web/sites/${appName}/appServices`);

  //await page.setViewportSize({ width: 780, height: 500 });
  await expect (page.locator('[data-telemetryname="Menu-vstscd"]')).toBeEnabled();
  await page.waitForTimeout(3000);
  await page.locator('[data-telemetryname="Menu-vstscd"]').scrollIntoViewIfNeeded();
  await page.locator('[data-telemetryname="Menu-vstscd"]').evaluateHandle(el => el.setAttribute("style", "border: 3px solid red !important;"));
  await page.locator('.fxs-blade-display-in-journey .fxs-blade-content-container-default').screenshot({ path: screenshotDeploy2 + '.png' });
  await sharp(screenshotDeploy2 + '.png')
        .resize({width: 240})
        .toFile(screenshotDeploy2 + '-240px.png');

	await page.setViewportSize({ width: 780, height: 1000 });
  await page.locator('text=Deployment Center').click();
  await page.locator('[data-telemetryname="Menu-vstscd"]').evaluateHandle(el => el.setAttribute("style", ""));

  var deploymentFrame = await page.frameLocator('[data-contenttitle="Deployment Center"] iframe');
  await deploymentFrame.locator('span:has-text("")').click();
  await deploymentFrame.locator('button[role="option"]:has-text("GitHub")').click();
  await deploymentFrame.locator('text=Organization* >> button[role="presentation"]').click();
  await deploymentFrame.locator(`button[role="option"]:has-text("${GITHUB_USER}")`).click();
  await deploymentFrame.locator('text=Repository* >> button[role="presentation"]').click();
  await deploymentFrame.locator('button[role="option"]:has-text("laravel-tasks")').click();
  await deploymentFrame.locator('text=Branch* >> button[role="presentation"]').click();
  await deploymentFrame.locator('button[role="option"]:has-text("main")').click();

//  await deploymentFrame.locator('[aria-label="Source"]').scrollIntoViewIfNeeded();
	await deploymentFrame.locator('[aria-label="Source"]').evaluateHandle(el => el.setAttribute("style", "border: 3px solid red !important;"));
  await deploymentFrame.locator('#deployment-center-settings-organization-option').evaluateHandle(el => el.setAttribute("style", "border: 3px solid red !important;"));
  await deploymentFrame.locator('#deployment-center-settings-repository-option').evaluateHandle(el => el.setAttribute("style", "border: 3px solid red !important;"));
  await deploymentFrame.locator('#deployment-center-settings-branch-option').evaluateHandle(el => el.setAttribute("style", "border: 3px solid red !important;"));
  await deploymentFrame.locator('[aria-label="Deployment center save command"]').evaluateHandle(el => el.setAttribute("style", "border: 3px solid red !important;"));
  await deploymentFrame.locator('body').screenshot({ path: screenshotDeploy3 + '.png' });
  await page.screenshot({ path: screenshotDeploy3 + '.png' });
  await sharp(screenshotDeploy3 + '.png')
        .resize({width: 240})
        .toFile(screenshotDeploy3 + '-240px.png');
	await deploymentFrame.locator('[aria-label="Deployment center save command"]').evaluateHandle(el => el.setAttribute("style", ""));

	// save changes
  await deploymentFrame.locator('[aria-label="Deployment center save command"]').click();

  // Access deploy logs
	await page.setViewportSize({ width: 780, height: 500 });
  await deploymentFrame.locator('[aria-label="Deployment center logs"]').click();

	await deploymentFrame.locator('[aria-label="Deployment center logs"]').evaluateHandle(el => el.setAttribute("style", "border: 3px solid red !important;"));
	await page.waitForTimeout(10000);
	await deploymentFrame.locator('[aria-label="Deployment center refresh command"]').click();
	await deploymentFrame.locator('button:has-text("Build/Deploy Logs")').first().click({trial: true});
  await deploymentFrame.locator('button:has-text("Build/Deploy Logs")').first().evaluateHandle(el => el.setAttribute("style", "border: 3px solid red !important;"));

  await page.screenshot({ path: screenshotDeploy4 + '.png' });
  await sharp(screenshotDeploy4 + '.png')
        .resize({width: 240})
        .toFile(screenshotDeploy4 + '-240px.png');

	// Go to GitHub now. The button opens a new tab so we need to follow that.
	const [newPage] = await Promise.all([
		page.waitForEvent('popup'),
		deploymentFrame.locator('button:has-text("Build/Deploy Logs")').first().click() // Opens a new tab
	])

	//await newPage.locator('button.btn-danger').click();
	await newPage.locator('button.btn-danger:has-text("Cancel workflow")').click();
  await newPage.locator('#code-tab').click();
  await expect(newPage).toHaveURL(`https://github.com/${GITHUB_USER}/laravel-tasks`);

  await newPage.setViewportSize({ width: 780, height: 700 });
  await newPage.locator('#code-tab').evaluateHandle(el => el.setAttribute("style", "border: 3px solid red !important;"));
  var buffer = await newPage.screenshot();
  await sharp(buffer).composite([{input: 'press-period.png', gravity: 'centre' }]).toFile(screenshotDeploy5 + '.png');
  await sharp(screenshotDeploy5 + '.png')
        .resize({width: 240})
        .toFile(screenshotDeploy5 + '-240px.png');

  // Change code in VSCode in browser
  await newPage.locator('body').press('.');
  await expect(newPage).toHaveURL(`https://github.dev/${GITHUB_USER}/laravel-tasks`);

  await newPage.setViewportSize({ width: 1300, height: 700 });

  await newPage.locator(`[id="workbench.parts.sidebar"] .pane-body .monaco-icon-label.folder-icon[title="${GITHUB_USER}/laravel-tasks/config"]`).click();
  await newPage.locator(`[id="workbench.parts.sidebar"] .pane-body .monaco-icon-label.file-icon[title="${GITHUB_USER}/laravel-tasks/config/database.php"]`).click();
  await newPage.locator('[id="workbench.parts.editor"] .editor-container .view-lines').click();
  await newPage.waitForTimeout(2000); // find fastkey doesn't work without this wait
  await newPage.locator('html').press('Control+f'); //(Window/Linux is Control+f)
  await newPage.locator('[aria-label="Find"]').fill('PDO::MYSQL_ATTR_SSL_CA => env(\'MYSQL_ATTR_SSL_CA\'),');
  await newPage.locator('[aria-label="Find"]').press('Enter');
  await newPage.locator('[aria-label="Close \\(Escape\\)"]').click();
  await typeInCodeEditor(newPage, "PDO::MYSQL_ATTR_SSL_KEY    => '/ssl/BaltimoreCyberTrustRoot.crt.pem',");

  var fileSelectStyle = await newPage.locator('[id="workbench.parts.sidebar"] .pane-body [aria-label="database.php"]').getAttribute("style");
  await newPage.locator('[id="workbench.parts.sidebar"] .pane-body [aria-label="database.php"]').evaluateHandle((el, style) => el.setAttribute("style", style + " border: 3px solid red !important;"), fileSelectStyle);
  var codeStyle = await newPage.locator('div.view-line:has-text("MYSQL_ATTR_SSL_KEY")').getAttribute("style");
  await newPage.locator('div.view-line:has-text("MYSQL_ATTR_SSL_KEY")').evaluateHandle((el, style) => el.setAttribute("style", style + " border: 3px solid red !important;"), codeStyle);
  await newPage.screenshot({ path: screenshotDeploy6 + '.png' });
  await sharp(screenshotDeploy6 + '.png')
        .resize({width: 240})
        .toFile(screenshotDeploy6 + '-240px.png');
  //undo style
  await newPage.locator('div.view-line:has-text("MYSQL_ATTR_SSL_KEY")').evaluateHandle((el, style) => el.setAttribute("style", style), codeStyle);

  // Commit
  await newPage.locator('[id="workbench\.parts\.activitybar"] .action-item[aria-label="Source Control (Ctrl+Shift+G) - 1 pending changes"]').click();
  await newPage.locator('[aria-label="Message \\(Ctrl\\+Enter to commit and push to \\\'main\\\' on GitHub\\)"]').click();
  await newPage.locator('[aria-label="Message \\(Ctrl\\+Enter to commit and push to \\\'main\\\' on GitHub\\)"]').fill('add certificate');
  await newPage.locator('text=Don\'t show again').click();

  //await newPage.setViewportSize({ width: 780, height: 700 });
  await newPage.locator('[id="workbench\.parts\.activitybar"] .action-item[aria-label="Source Control (Ctrl+Shift+G) - 1 pending changes"]').evaluateHandle(el => el.setAttribute("style", "border: 3px solid red !important;"));
  await newPage.locator('[aria-label="Stage Changes"]').evaluateHandle(el => el.setAttribute("style", "border: 3px solid red !important; padding: 0;"));
  var box = await newPage.locator('.monaco-list-row.force-no-hover', {has: newPage.locator('[aria-label="Message \\(Ctrl\\+Enter to commit and push to \\\'main\\\' on GitHub\\)"]')});
  var boxStyle = await box.getAttribute("style");
  await box.evaluateHandle((el, style) => el.setAttribute("style", style + " border: 3px solid red !important;"), boxStyle);
  await newPage.locator('.composite.title [aria-label="Commit and Push"]').evaluateHandle(el => el.setAttribute("style", " border: 3px solid red !important;"));
  await newPage.screenshot({ path: screenshotDeploy7 + '.png' });
  await sharp(screenshotDeploy7 + '.png')
        .resize({width: 240})
        .toFile(screenshotDeploy7 + '-240px.png');

  await newPage.locator('[aria-label="Stage Changes"]').click();
  await newPage.locator('.composite.title [aria-label="Commit and Push"]').click();
  await newPage.waitForTimeout(2000);

	await newPage.goto(`https://github.com/${GITHUB_USER}/laravel-tasks/actions`);
	await newPage.locator('a:has-text("add certificate")').first().click();
  await page.waitForTimeout(3000);
	while(await newPage.locator('button.btn-danger:has-text("Cancel workflow")').isVisible()) {
		await newPage.waitForTimeout(10000);
	};
  await newPage.close();

  await page.goto(`https://portal.azure.com/#@cephaslinhotmail.onmicrosoft.com/resource/subscriptions/${process.env.SUBSCRIPTION_ID}/resourcegroups/${resourceGroupName}/providers/Microsoft.Web/sites/${appName}/appServices`);

  await page.setViewportSize({ width: 780, height: 500 });
  await expect (page.locator('[data-telemetryname="Menu-ssh"]')).toBeEnabled({timeout: 15000});
  await page.waitForTimeout(3000);
  await page.locator('[data-telemetryname="Menu-ssh"]').scrollIntoViewIfNeeded();

	// Go to SSH session now. The button opens a new tab so we need to follow that.
  await page.locator('[data-telemetryname="Menu-ssh"]').click();
  await page.locator('[data-telemetryname="Menu-ssh"]').evaluateHandle(el => el.setAttribute("style", "border: 3px solid red !important;"));
	await page.locator('a:has-text("Go")').evaluateHandle(el => el.setAttribute("style", "border: 3px solid red !important;"));
  await page.screenshot({ path: screenshotMigrate1 + '.png' });
  await sharp(screenshotMigrate1 + '.png')
        .resize({width: 240})
        .toFile(screenshotMigrate1 + '-240px.png');

	const [ssh] = await Promise.all([
		page.waitForEvent('popup'),
		page.locator('a:has-text("Go")').click() // Opens a new tab
	]);

	while((await ssh.locator('div#status').innerText()) != "SSH CONNECTION ESTABLISHED") {
		await ssh.waitForTimeout(5000);
	};

  await ssh.setViewportSize({ width: 780, height: 500 });
	await executeInShell(ssh.locator('textarea.xterm-helper-textarea'), "cd /home/site/wwwroot");
	await executeInShell(ssh.locator('textarea.xterm-helper-textarea'), "php artisan migrate --force");
	await ssh.waitForTimeout(10000); // wait for the output to show

	await ssh.screenshot({ path: screenshotMigrate2 + '.png' });
  await sharp(screenshotMigrate2 + '.png')
        .resize({width: 240})
        .toFile(screenshotMigrate2 + '-240px.png');
  await ssh.close();

  // Change site root
  await page.setViewportSize({ width: 780, height: 500 });
  await page.locator('[data-telemetryname="Menu-configuration"]').waitFor();
  //await page.waitForTimeout(5000);
  await page.locator('[data-telemetryname="Menu-configuration"]').scrollIntoViewIfNeeded();
  await page.locator('[data-telemetryname="Menu-configuration"]').evaluateHandle(el => el.setAttribute("style", "border: 3px solid red !important;"));
  await page.locator('[data-telemetryname="Menu-configuration"]').click();
  configurationFrame = await page.frameLocator('[data-contenttitle="Configuration"] iframe');
  await configurationFrame.locator('button#app-settings-general-settings-tab').evaluateHandle(el => el.setAttribute("style", "border: 3px solid red !important;"));

  await page.screenshot({ path: screenshotPublic1 + '.png' });
  await sharp(screenshotPublic1 + '.png')
        .resize({width: 240})
        .toFile(screenshotPublic1 + '-240px.png');

  await configurationFrame.locator('button#app-settings-general-settings-tab').click();
  await configurationFrame.locator('button#app-settings-general-settings-tab').evaluateHandle(el => el.setAttribute("style", ""));
  await configurationFrame.locator('input#linux-fx-version-appCommandLine').type('cp /home/site/wwwroot/default /etc/nginx/sites-available/default && service nginx reload');
  await configurationFrame.locator('input#linux-fx-version-appCommandLine').evaluateHandle(el => el.setAttribute("style", "border: 3px solid red !important;"));
  await configurationFrame.locator('button[aria-label="Save all settings for your web application"]').evaluateHandle(el => el.setAttribute("style", "border: 3px solid red !important;"));

  await page.locator('.fxs-blade-firstblade.fxs-blade-display-in-journey .fxs-blade-content-container-details').screenshot({ path: screenshotPublic2 + '.png' });
  await sharp(screenshotPublic2 + '.png')
        .resize({width: 240})
        .toFile(screenshotPublic2 + '-240px.png');

  await configurationFrame.locator('button[aria-label="Save all settings for your web application"]').click();
  await configurationFrame.locator('button:has-text("Continue")').click();
  // get rid of notification window.
  await page.locator('.fxs-toast-item.fxs-popup:has-text("Successfully updated web app settings")').waitFor();
  await page.locator('[aria-label="Dismiss toast notification"]').click();
  
  // Browse to app
  await page.setViewportSize({ width: 780, height: 500 });
  await page.locator('[data-telemetryname="Menu-appServices"]').waitFor();
  //await page.waitForTimeout(3000);
  await page.locator('[data-telemetryname="Menu-appServices"]').scrollIntoViewIfNeeded();
  await page.locator('[data-telemetryname="Menu-appServices"]').click();
  await page.locator('[data-telemetryname="Menu-appServices"]').evaluateHandle(el => el.setAttribute("style", "border: 3px solid red !important;"));
  await page.waitForTimeout(10000);
  await page.locator('.fxc-essentials-label-container:has-text("Subscription ID") ~ .fxc-essentials-value-wrapper .fxc-essentials-value.fxs-portal-text').evaluate(el => el.innerText = '00000000-0000-0000-0000-000000000000');
  //await page.locator('.fxc-essentials-label-container:has-text("Subscription ID") + div').locator('.fxc-essentials-value.fxs-portal-text').evaluate(el => el.innerHTML = '00000000-0000-0000-0000-000000000000');
  await page.locator('.fxc-essentials-label-container:has-text("URL") ~ .fxc-essentials-value-wrapper').evaluateHandle(el => el.setAttribute("style", "border: 3px solid red !important;"));

	await page.screenshot({ path: screenshotBrowse1 + '.png' });
  await sharp(screenshotBrowse1 + '.png')
        .resize({width: 240})
        .toFile(screenshotBrowse1 + '-240px.png');

  const [browse] = await Promise.all([
    page.waitForEvent('popup'),
    page.locator('.fxc-essentials-label-container:has-text("URL") ~ .fxc-essentials-value-wrapper').click() // Opens a new tab
  ]);

  await browse.setViewportSize({ width: 780, height: 600 });
  await browse.locator('input#task-name').fill('Create app and database in Azure');
  await browse.locator('button:has-text("Add Task")').click();
  await browse.locator('input#task-name').fill('Deploy data-driven app');
  await browse.locator('button:has-text("Add Task")').click();
  await browse.locator('input#task-name').fill('That\'s it!');
  await browse.locator('button:has-text("Add Task")').click();

  await browse.screenshot({ path: screenshotBrowse2 + '.png' });
  await sharp(screenshotBrowse2 + '.png')
        .resize({width: 240})
        .toFile(screenshotBrowse2 + '-240px.png');

  await browse.close();

	// Stream logs
  await page.locator('[data-telemetryname="Menu-appServices"]').evaluateHandle(el => el.setAttribute("style", ""));
  await page.locator('[data-telemetryname="Menu-appservicelogs"]').scrollIntoViewIfNeeded();
  await page.locator('[data-telemetryname="Menu-appservicelogs"]').click();
  await page.locator('[data-telemetryname="Menu-appservicelogs"]').evaluateHandle(el => el.setAttribute("style", "border: 3px solid red !important;"));
  await page.locator('.fxs-blade-content-container-details .azc-optionPicker-item:has-text("File System")').click();
  await page.locator('.fxs-blade-content-container-details .azc-optionPicker-item:has-text("File System")').evaluateHandle(el => el.setAttribute("style", "border: 3px solid red !important;"));
  await page.locator(':has(> [aria-label="Save"])').evaluateHandle(el => el.setAttribute("style", "border: 3px solid red !important;"));

	await page.screenshot({ path: screenshotLogs1 + '.png' });
  await sharp(screenshotLogs1 + '.png')
        .resize({width: 240})
        .toFile(screenshotLogs1 + '-240px.png');

  await page.locator('[aria-label="Save"]').click();
  // get rid of notification window
  await page.locator('.fxs-toast-item.fxs-popup:has-text("Successfully updated App Service logs settings")').click();
  await page.locator('[aria-label="Dismiss toast notification"]').click();

  await page.locator('[data-telemetryname="Menu-appservicelogs"]').evaluateHandle(el => el.setAttribute("style", ""));
  await page.locator('[data-telemetryname="Menu-logStream"]').scrollIntoViewIfNeeded();
  await page.locator('[data-telemetryname="Menu-logStream"]').click();
  await page.locator('[data-telemetryname="Menu-logStream"]').evaluateHandle(el => el.setAttribute("style", "border: 3px solid red !important;"));
  await page.waitForTimeout(10000);
  await page.screenshot({ path: screenshotLogs2 + '.png' });
  await sharp(screenshotLogs2 + '.png')
        .resize({width: 240})
        .toFile(screenshotLogs2 + '-240px.png');

  // Delete resource group
  await page.locator('[placeholder="Search resources\\, services\\, and docs \\(G\\+\\/\\)"]').click();
  await page.locator('[placeholder="Search resources\\, services\\, and docs \\(G\\+\\/\\)"]').type(resourceGroupName);
  await page.locator('a.fxs-menu-item.fxs-search-menu-content:has-text("' + resourceGroupName + '")').waitFor('visible', 10000);

  await page.setViewportSize({ width: 780, height: 400 });
  await page.locator('.fxs-search').evaluateHandle(el => el.setAttribute("style", "border: 3px solid red !important;"));
  await page.locator('a.fxs-menu-item.fxs-search-menu-content:has-text("' + resourceGroupName + '")').evaluateHandle(el => el.setAttribute("style", "border: 3px solid red !important;"));
  await page.locator('a.fxs-menu-item.fxs-search-menu-content:has-text("' + resourceGroupName + '")').scrollIntoViewIfNeeded();
  await page.screenshot({ path: screenshotClean1 + '.png' });
  await sharp(screenshotClean1 + '.png')
        .resize({width: 240})
        .toFile(screenshotClean1 + '-240px.png');

  await page.locator('a.fxs-menu-item.fxs-search-menu-content:has-text("' + resourceGroupName + '")').click();

  await page.setViewportSize({ width: 780, height: 500 });
  await page.locator('li[title="Delete resource group"]').evaluateHandle(el => el.setAttribute("style", "border: 3px solid red !important;"));
  await page.locator('.fxs-blade-firstblade .fxs-blade-content-container-details').screenshot({ path: screenshotClean2 + '.png' });
  await sharp(screenshotClean2 + '.png')
        .resize({width: 240})
        .toFile(screenshotClean2 + '-240px.png');

  await page.locator('li[title="Delete resource group"]').click();
  await page.locator('[aria-label="Type the resource group name:"]').fill(resourceGroupName);
  await page.locator('[aria-label="Type the resource group name:"]').evaluateHandle(el => el.setAttribute("style", "border: 3px solid red !important;"));
  await page.locator('[title="Delete"]').click({trial: true});
  await page.locator('[title="Delete"]').evaluateHandle(el => el.setAttribute("style", "border: 3px solid red !important;"));
  await page.locator('.fxs-contextpane.fxs-portal-contextpane-right').screenshot({ path: screenshotClean3 + '.png' });
  await sharp(screenshotClean3 + '.png')
        .resize({width: 240})
        .toFile(screenshotClean3 + '-240px.png');
  await page.locator('[title="Delete"]').click();
  await page.waitForTimeout(2000);

  // Delete fork
  await page.goto(`https://github.com/${GITHUB_USER}/laravel-tasks/settings`);
  await page.locator('summary.btn-danger:has-text("Delete this repository")').click();
  await page.locator('[aria-label="Type in the name of the repository to confirm that you want to delete this repository."]').fill(`${GITHUB_USER}/laravel-tasks`);
  await page.locator('button.btn-danger.btn.btn-block:has-text("Delete this repository")').click();

});