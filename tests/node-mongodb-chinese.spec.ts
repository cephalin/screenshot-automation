import { test } from '../lib/docsFixtures';
import '../lib/appServiceLibraryChinese';
import { MenuOptions } from '../lib/appServiceLibraryChinese';
import { DocsPageBase } from '../lib/DocsPageBase';
import { SearchType } from '../lib/AzurePortalPageChinese';

var subscription = "Antares-Demo"
var appName = "msdocs-expressjs-mongodb-2347";
var resourceGroupName = "msdocs-expressjs-mongodb-tutorial7";
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

test.use({ 
    viewport: { width: 780, height: 900 }, 
    storageState: "auth.json", 
    locale: "zh-cn", 
    video: 'on',
    headless: false
});
test.setTimeout( 120 * 60000);

test('tutorial-nodejs-mongodb-app-chinese', async ({ azPageCn, githubPageCn }) => {

    // Create App+DB
    await azPageCn.searchAndGo(SearchType.marketplace, "web app database", { itemText: "Web App + Database", screenshotName: screenshotCreate1});
    await azPageCn.runAppDbCreateWizard(subscription, resourceGroupName, region, appName, runtime, {sku: "Basic", screenshotName: screenshotCreate2});
    await azPageCn.goToCreatedResource(screenshotCreate3);

    // Connection string
    await azPageCn.goToAppServicePageByMenu(MenuOptions.configuration, screenshotConnect1);
    var result = await azPageCn.getAppServiceConnectionString('MONGODB_URI', screenshotConnect2);
    await azPageCn.newAppServiceSettingNoSave('DATABASE_URL', result.value, screenshotConnect3);
    await azPageCn.newAppServiceSettingNoSave('DATABASE_NAME', `${appName}-database`);
    await azPageCn.saveAppServiceConfigurationPage(screenshotConnect4);

    // Deploy
    await githubPageCn.createFork('https://github.com/Azure-Samples/msdocs-nodejs-mongodb-azure-sample-app', screenshotDeploy1);
    await githubPageCn.page.waitForLoadState();
    await githubPageCn.openVSCode({screenshotName: screenshotDeploy2});
    await githubPageCn.viewFileInVSC({
        filepath: 'config/connection.js', 
        regex: `(?<=DATABASE_URL: (.|\\n)*?\\.)(DATABASE_URL|DATABASE_NAME)(?=(.|\\n)*?\\})`,
        screenshotName: screenshotDeploy3
    });

    // debug
    await azPageCn.searchAndGo(SearchType.resources, appName, {resourceType: '应用服务'});

    await azPageCn.goToAppServicePageByMenu(MenuOptions.deploymentcenter, screenshotDeploy4);
    if(process.env.GITHUB_USER) {
        await azPageCn.configureGitHubActionsDeploy(process.env.GITHUB_USER, 'msdocs-nodejs-mongodb-azure-sample-app', 'main', screenshotDeploy5);
    }

    const popupPage = await azPageCn.goToGitHubActionsLogs(screenshotDeploy6);
    await popupPage.waitForActionRun({screenshotName: screenshotDeploy7});
    await popupPage.page.close();

    // // app needs time to restart
    // await azPageCn.page.waitForTimeout(5000);

    // Stream logs 01
    await azPageCn.enableAppServiceLinuxLogs(screenshotLogs1);

    // // Browse to web app
    const [browse] = await azPageCn.browseAppServiceUrl(screenshotBrowse1);
    await browse.setViewportSize({ width: 780, height: 600 });
    await browse.locator('input[name="taskName"]').fill('计划周末度假');
    await browse.locator('button:has-text("Add Task")').click();
    await browse.locator('input[name="taskName"]').fill('买杂货');
    await browse.locator('button:has-text("Add Task")').click();
    await browse.locator('input[name="taskName"]').fill('去骑自行车');
    await browse.locator('button:has-text("Add Task")').click();
    await DocsPageBase.screenshotBigSmall (browse, azPageCn.screenshotDir, screenshotBrowse2);
    await browse.close();

    // Stream logs 02
    await azPageCn.streamAppServiceLogs({searchStrings: ["Total tasks: "], screenshotName: screenshotLogs2});

    // Inspect Kudu
    const kuduPage = await azPageCn.openAppServiceKudu({clickMenu: true, screenshotName: screenshotKudu1});
    await kuduPage.goToDeployments({screenshotBefore: screenshotKudu2, screenshotAfter: screenshotKudu3});
    await kuduPage.browseFilesLinux({screenshotBefore: screenshotKudu4, screenshotAfter: screenshotKudu5});
    
    // Delete resources
    await azPageCn.deleteResourceGroup(resourceGroupName, screenshotClean);
    //await githubPageCn.deleteFork(); can't run this now due to password required
});