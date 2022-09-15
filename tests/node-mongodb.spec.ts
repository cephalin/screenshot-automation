import { test } from '../lib/docsFixtures';
import '../lib/appServiceLibrary';
import { MenuOptions } from '../lib/appServiceLibrary';
import { DocsPageBase } from '../lib/DocsPageBase';
import { SearchType } from '../lib/AzurePortalPage';

var appName = "msdocs-expressjs-mongodb-234";
var resourceGroupName = "msdocs-expressjs-mongodb-tutorial";
var region = "UK West";
var runtime = "Node 16 LTS";
var screenshotCreate1 = "azure-portal-create-app-cosmos-1";
var screenshotCreate2 = "azure-portal-create-app-cosmos-2";
var screenshotCreate3 = "azure-portal-create-app-cosmos-3";
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
var screenshotBrowse1 = "azure-portal-browse-app-1";
var screenshotBrowse2 = "azure-portal-browse-app-2";
var screenshotLogs1 = "azure-portal-stream-diagnostic-logs-1";
var screenshotLogs2 = "azure-portal-stream-diagnostic-logs-2";
var screenshotKudu1 = "azure-portal-inspect-kudu-1";
var screenshotKudu2 = "azure-portal-inspect-kudu-2";
var screenshotKudu3 = "azure-portal-inspect-kudu-3";
var screenshotKudu4 = "azure-portal-inspect-kudu-4";
var screenshotKudu5 = "azure-portal-inspect-kudu-5";
var screenshotClean = "azure-portal-clean-up-resources";

test.use({ viewport: { width: 780, height: 900 } });

test('tutorial-nodejs-mongodb-app', async ({ azPage, githubPage }) => {

    // Create App+DB
    await azPage.searchAndGo(SearchType.marketplace, "web app database", { itemText: "Web App + Database", screenshotName: screenshotCreate1});
    await azPage.runAppDbCreateWizard('Visual Studio Enterprise Subscription', resourceGroupName, region, appName, runtime, {sku: "Basic", screenshotName: screenshotCreate2});
    await azPage.goToCreatedResource(screenshotCreate3);

    // Connection string
    await azPage.goToAppServicePageByMenu(MenuOptions.configuration, screenshotConnect1);
    var result = await azPage.getAppServiceConnectionString('MONGODB_URI', screenshotConnect2);
    await azPage.newAppServiceSettingNoSave('DATABASE_URL', result.value, screenshotConnect3);
    await azPage.newAppServiceSettingNoSave('DATABASE_NAME', `${appName}-database`);
    await azPage.saveAppServiceConfigurationPage(screenshotConnect4);

    // Deploy
    await githubPage.createFork('https://github.com/Azure-Samples/msdocs-nodejs-mongodb-azure-sample-app', screenshotDeploy1);
    await githubPage.page.waitForLoadState();
    await githubPage.openVSCode({screenshotName: screenshotDeploy2});
    await githubPage.viewFileInVSC({
        filepath: 'config/connection.js', 
        regex: `(?<=DATABASE_URL: (.|\\n)*?\\.)(DATABASE_URL|DATABASE_NAME)(?=(.|\\n)*?\\})`,
        screenshotName: screenshotDeploy3
    });

    await azPage.goToAppServicePageByMenu(MenuOptions.deploymentcenter, screenshotDeploy4);
    if(process.env.GITHUB_USER) {
        await azPage.configureGitHubActionsDeploy(process.env.GITHUB_USER, 'msdocs-nodejs-mongodb-azure-sample-app', 'main', screenshotDeploy5);
    }

    const popupPage = await azPage.goToGitHubActionsLogs(screenshotDeploy6);
    await popupPage.waitForActionRun({screenshotName: screenshotDeploy7});
    await popupPage.page.close();

    // // app needs time to restart
    // await azPage.page.waitForTimeout(5000);

    // Stream logs 01
    await azPage.enableAppServiceLinuxLogs(screenshotLogs1);

    // // debug
    // await azPage.searchAndGo(SearchType.resources, appName, {resourceType: 'App Service'});

    // // Browse to web app
    const [browse] = await azPage.browseAppServiceUrl(screenshotBrowse1);
    await browse.setViewportSize({ width: 780, height: 600 });
    await browse.locator('input[name="taskName"]').fill('Plan weekend getaway');
    await browse.locator('button:has-text("Add Task")').click();
    await browse.locator('input[name="taskName"]').fill('Buy groceries');
    await browse.locator('button:has-text("Add Task")').click();
    await browse.locator('input[name="taskName"]').fill('Go for bike ride');
    await browse.locator('button:has-text("Add Task")').click();
    await DocsPageBase.screenshotBigSmall (browse, azPage.screenshotDir, screenshotBrowse2);
    await browse.close();

    // Stream logs 02
    await azPage.streamAppServiceLogs({searchStrings: ["Total tasks: "], screenshotName: screenshotLogs2});

    // Inspect Kudu
    const kuduPage = await azPage.openAppServiceKudu({clickMenu: true, screenshotName: screenshotKudu1});
    await kuduPage.goToDeployments({screenshotBefore: screenshotKudu2, screenshotAfter: screenshotKudu3});
    await kuduPage.browseFilesLinux({screenshotBefore: screenshotKudu4, screenshotAfter: screenshotKudu5});
    
    // Delete resources
    await azPage.deleteResourceGroup(resourceGroupName, screenshotClean);
    await githubPage.deleteFork();
});