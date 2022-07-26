import { test} from '@playwright/test';
import '../lib/appServiceLibrary';
import { MenuOptions } from '../lib/appServiceLibrary';
import { AzurePortalPage, SearchType } from '../lib/AzurePortalPage';
import { DocsPageBase } from '../lib/DocsPageBase';
import { GitHubPage } from '../lib/GitHubPage';

var appName = "msdocs-laravel-mysql-234";
var resourceGroupName = "msdocs-laravel-mysql-tutorial";
var region = "West Europe";
var runtime = "PHP 8.0";
var screenshotCreate1 = "azure-portal-create-app-mysql-1";
var screenshotCreate2 = "azure-portal-create-app-mysql-2";
var screenshotCreate3 = "azure-portal-create-app-mysql-3";
var screenshotConnect1 = "azure-portal-get-connection-string-1";
var screenshotConnect2 = "azure-portal-get-connection-string-2";
var screenshotConnect3 = "azure-portal-get-connection-string-3";
var screenshotConnect4 = "azure-portal-get-connection-string-4";
var screenshotDeploy1 = "azure-portal-deploy-sample-code-1";
var screenshotDeploy2 = "azure-portal-deploy-sample-code-2";
var screenshotDeploy3 = "azure-portal-deploy-sample-code-3";
var screenshotDeploy4 = "azure-portal-deploy-sample-code-4";
var screenshotDeploy5 = "azure-portal-deploy-sample-code-5";
var screenshotDeploy6 = "azure-portal-deploy-sample-code-6";
var screenshotDeploy7 = "azure-portal-deploy-sample-code-7";
var screenshotMigrate1 = "azure-portal-generate-db-schema-1";
var screenshotMigrate2 = "azure-portal-generate-db-schema-2";
var screenshotPublic1 = "azure-portal-change-site-root-1";
var screenshotPublic2 = "azure-portal-change-site-root-2";
var screenshotBrowse1 = "azure-portal-browse-app-1";
var screenshotBrowse2 = "azure-portal-browse-app-2";
var screenshotLogs1 = "azure-portal-stream-diagnostic-logs-1";
var screenshotLogs2 = "azure-portal-stream-diagnostic-logs-2";
var screenshotClean = "azure-portal-clean-up-resources";
var screenshotClean1 = "azure-portal-clean-up-resources-1";
var screenshotClean2 = "azure-portal-clean-up-resources-2";
var screenshotClean3 = "azure-portal-clean-up-resources-3";

test.use({ viewport: { width: 780, height: 900 } });

test('tutorial-php-mysql-app', async ({ context }, testInfo) => {

    const azPage = new AzurePortalPage(await context.newPage(), testInfo);
    await azPage.signin();
    const githubPage = new GitHubPage(await context.newPage(), {testInfo: testInfo});
    await githubPage.signin();

    // // Create App+DB
    // await azPage.searchAndGo(SearchType.marketplace, "web app database", { itemText: "Web App + Database", screenshotName: screenshotCreate1});
    // await azPage.runAppDbCreateWizard('Visual Studio Ultimate with MSDN', resourceGroupName, region, appName, runtime, screenshotCreate2);
    // await azPage.goToCreatedResource(screenshotCreate3);

    // // Connection string
    // await azPage.goToAppServicePageByMenu(MenuOptions.configuration, screenshotConnect1);
    // await azPage.newAppServiceSettingNoSave('DB_DATABASE', appName + "-database", screenshotConnect2);
    // var result = await azPage.getAppServiceConnectionString('defaultConnection', screenshotConnect3);
    // var settings = result.value.split(';');
    // var database = settings[0].split('=')[1];
    // var server = settings[1].split('=')[1];
    // var user = settings[2].split('=')[1];
    // var password = settings[3].split('=')[1];
    // await azPage.newAppServiceSettingNoSave('DB_HOST', server);
    // await azPage.newAppServiceSettingNoSave('DB_USERNAME', user);
    // await azPage.newAppServiceSettingNoSave('DB_PASSWORD', password);
    // await azPage.newAppServiceSettingNoSave('APP_DEBUG', 'true');
    // await azPage.newAppServiceSettingNoSave('MYSQL_ATTR_SSL_CA', '/home/site/wwwroot/ssl/DigiCertGlobalRootCA.crt.pem');
    // await azPage.newAppServiceSettingNoSave('APP_KEY', 'base64:Dsz40HWwbCqnq0oxMsjq7fItmKIeBfCBGORfspaI1Kw=');
    // await azPage.saveAppServiceConfigurationPage(screenshotConnect4);

    // Deploy
    await githubPage.createFork('https://github.com/Azure-Samples/laravel-tasks', screenshotDeploy1);
    await githubPage.page.goto('https://github.com/lcephas/laravel-tasks');
    githubPage.repoUrl = 'https://github.com/lcephas/laravel-tasks';
    await githubPage.openVSCode({screenshotName: screenshotDeploy2});
    await githubPage.viewFileInVSC({
        filepath: 'config/database.php', 
        regex: `(?<='mysql' =>((.|\\n)*?))(DB_HOST|DB_DATABASE|DB_USERNAME|DB_PASSWORD|(?<=env\\(')MYSQL_ATTR_SSL_CA)(?=(.|\\n)*?'pgsql' =>)`,
        screenshotName: screenshotDeploy3
    });

    await azPage.searchAndGo(SearchType.resources, appName, {resourceType: 'App Service'});
    await azPage.goToAppServicePageByMenu(MenuOptions.deploymentcenter, screenshotDeploy4);
    if(process.env.GITHUB_USER) {
        await azPage.configureGitHubActionsDeploy(process.env.GITHUB_USER, 'laravel-tasks', 'main', screenshotDeploy5);
    }

    const popupPage = await azPage.goToGitHubActionsLogs(screenshotDeploy6);
    await popupPage.waitForActionRun({screenshotName: screenshotDeploy7});
    await popupPage.page.close();

    // Run DB migration in SSH
    const sshPage = await azPage.openSshShellToContainer({clickMenu: true, screenshotName: screenshotMigrate1});
    await sshPage.runSshShellCommands(
        [
            {command: 'cd /home/site/wwwroot', timeout: 0}, 
            {command: 'php artisan migrate --force', timeout: 10000}
        ],
        {
            width: 780,
            height: 500,
            screenshotName: screenshotMigrate2
        }
    );
    sshPage.page.close();

    // Change site root
    await azPage.goToAppServiceConfigurationGeneralSettings(screenshotPublic1);
    const configurationFrame = azPage.page.frameLocator('[data-contenttitle="Configuration"] iframe');
    await configurationFrame.locator('input#linux-fx-version-appCommandLine').type('cp /home/site/wwwroot/default /etc/nginx/sites-available/default && service nginx reload');
    // DEBUG: manually blur
    await azPage.page.mouse.click(0,0);
    await azPage.screenshot({
        locator: azPage.page.locator('.fxs-blade-firstblade .fxs-blade-content-container-details'),
        height: 500, 
        highlightobjects: [
            configurationFrame.locator('input#linux-fx-version-appCommandLine'),
            configurationFrame.locator('button[aria-label="Save all settings for your web application"]')
        ], 
        name: screenshotPublic2
    });
    await azPage.saveAppServiceConfigurationPage();

    // Browse to web app
    const [browse] = await azPage.browseAppServiceUrl(screenshotBrowse1);
    // while((await (browse as Page).locator('h1').innerText()).search('404')) {
    //     await browse.waitForTimeout(5000);
    //     await browse.goto(`https://${appName}.azurewebsites.net`);
    // }
    await browse.setViewportSize({ width: 780, height: 600 });
    await browse.locator('input#task-name').fill('Create app and database in Azure');
    await browse.locator('button:has-text("Add Task")').click();
    await browse.locator('input#task-name').fill('Deploy data-driven app');
    await browse.locator('button:has-text("Add Task")').click();
    await browse.locator('input#task-name').fill('That\'s it!');
    await browse.locator('button:has-text("Add Task")').click();
    await DocsPageBase.screenshotBigSmall (browse, azPage.screenshotDir, screenshotBrowse2);
    await browse.close();

    // Stream logs
    await azPage.enableAppServiceLinuxLogs(screenshotLogs1);
    await azPage.streamAppServiceLogs(screenshotLogs2);

    // Delete resources
    await azPage.deleteResourceGroup(resourceGroupName, screenshotClean);
    await githubPage.deleteFork();
});