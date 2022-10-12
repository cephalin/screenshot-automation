import { test } from '../lib/docsFixtures';
import '../lib/appServiceLibrary';
import { MenuOptions } from '../lib/appServiceLibrary';
import { DocsPageBase } from '../lib/DocsPageBase';
import { SearchType } from '../lib/AzurePortalPage';

var subscription = "Antares-Demo"
var appName = "msdocs-python-postgres-234";
var resourceGroupName = "msdocs-python-postgres-tutorial";
var region = "West Europe";
var runtime = "Python 3.9";
var screenshotCreate1 = "azure-portal-create-app-postgres-1";
var screenshotCreate2 = "azure-portal-create-app-postgres-2";
var screenshotCreate3 = "azure-portal-create-app-postgres-3";
var screenshotConnect1 = "azure-portal-get-connection-string-1";
var screenshotConnect2 = "azure-portal-get-connection-string-2";
var screenshotDeployFlask1 = "azure-portal-deploy-sample-code-flask-1";
var screenshotDeployFlask2 = "azure-portal-deploy-sample-code-flask-2";
var screenshotDeployFlask3 = "azure-portal-deploy-sample-code-flask-3";
var screenshotDeployFlask4 = "azure-portal-deploy-sample-code-flask-4";
var screenshotDeployFlask5 = "azure-portal-deploy-sample-code-flask-5";
var screenshotDeployFlask6 = "azure-portal-deploy-sample-code-flask-6";
var screenshotDeployFlask7 = "azure-portal-deploy-sample-code-flask-7";
var screenshotMigrateFlask1 = "azure-portal-generate-db-schema-flask-1";
var screenshotMigrateFlask2 = "azure-portal-generate-db-schema-flask-2";
var screenshotBrowse1 = "azure-portal-browse-app-1";
var screenshotBrowse2 = "azure-portal-browse-app-2";
var screenshotLogs1 = "azure-portal-stream-diagnostic-logs-1";
var screenshotLogs2 = "azure-portal-stream-diagnostic-logs-2";
var screenshotClean = "azure-portal-clean-up-resources";

test.use({ 
    viewport: { width: 780, height: 900 }, 
    storageState: "auth.json", 
    locale: "en-us", 
    video: 'on',
    headless: false
});
test.setTimeout( 120 * 60000);

test('tutorial-python-postgresql-app-flask', async ({ azPage, githubPage }) => {

    // add to sensitive text list
    azPage.sensitiveStrings.push({searchString: 'lcephas', replacement: '&lt;github-alias&gt;'});
    githubPage.sensitiveStrings.push({searchString: 'vmagelo', replacement: 'somebody'});
    githubPage.sensitiveStrings.push({searchString: 'lcephas', replacement: '&lt;github-alias&gt;'});

    // Create App+DB
    await azPage.searchAndGo(SearchType.marketplace, "web app database", { itemText: "Web App + Database", screenshotName: screenshotCreate1});
    await azPage.runAppDbCreateWizard(subscription, resourceGroupName, region, appName, runtime, {sku: "Basic", screenshotName: screenshotCreate2});
    await azPage.goToCreatedResource(screenshotCreate3);

    // // debug
    // await azPage.searchAndGo(SearchType.resources, appName, {resourceType: 'App Service'});

    // Connection string
    await azPage.goToAppServicePageByMenu(MenuOptions.configuration, screenshotConnect1);
    await azPage.viewAppServiceAppSettings(screenshotConnect2);

    // Deploy
    await githubPage.createFork('https://github.com/Azure-Samples/msdocs-flask-postgresql-sample-app', screenshotDeployFlask1);
    await githubPage.page.waitForLoadState();
    githubPage.repoUrl = 'https://github.com/lcephas/msdocs-flask-postgresql-sample-app';
    await githubPage.openVSCode({screenshotName: screenshotDeployFlask2});
    await githubPage.viewFileInVSC({
        filepath: 'azureproject/production.py', 
        regex: `(?<=\\[')DBUSER|(?<=\\[')DBPASS|(?<=\\[')DBHOST|(?<=\\[')DBNAME|(?<=os.environ\\[')WEBSITE_HOSTNAME`,
        screenshotName: screenshotDeployFlask3
    });

    await azPage.goToAppServicePageByMenu(MenuOptions.deploymentcenter, screenshotDeployFlask4);
    if(process.env.GITHUB_USER) {
        await azPage.configureGitHubActionsDeploy(
            process.env.GITHUB_USER, 
            'msdocs-flask-postgresql-sample-app', 
            'dev', // 'main', 
            screenshotDeployFlask5);
    }

    const popupPage = await azPage.goToGitHubActionsLogs(screenshotDeployFlask6);
    popupPage.sensitiveStrings.push({searchString: 'vmagelo', replacement: 'somebody'});
    popupPage.sensitiveStrings.push({searchString: 'lcephas', replacement: '&lt;github-alias&gt;'});
    await popupPage.waitForActionRun({screenshotName: screenshotDeployFlask7});
    await popupPage.page.close();

    // Run DB migration in SSH
    const sshPage = await azPage.openSshShellToContainer({clickMenu: true, screenshotName: screenshotMigrateFlask1});
    await sshPage.runSshShellCommands(
        [
            {command: 'flask db upgrade', timeout: 10000}
        ],
        {
            width: 780,
            height: 500,
            screenshotName: screenshotMigrateFlask2
        }
    );
    sshPage.page.close();
        
    // app needs time to restart
    //await azPage.page.waitForTimeout(5000);

    // Stream logs 01
    await azPage.enableAppServiceLinuxLogs(screenshotLogs1);

    // Browse to web app
    const [browse] = await azPage.browseAppServiceUrl(screenshotBrowse1);
    await browse.setViewportSize({ width: 780, height: 600 });
    await browse.locator('a[href="/create"]').click();
    await browse.locator('input#restaurant_name').fill('Contoso Restaurant');
    await browse.locator('button:text("Submit")').click();
    await browse.locator('button:text("Add new review")').click();
    await browse.locator('input[value="4"]').click();
    await browse.locator('button:text("Save changes")').click();
    await browse.locator('button:text("Add new review")').click();
    await browse.locator('input[value="4"]').click();
    await browse.locator('button:text("Save changes")').click();
    await browse.locator('button:text("Add new review")').click();
    await browse.locator('input[value="4"]').click();
    await browse.locator('button:text("Save changes")').click();
    await browse.locator('a[href="/"]').click();
    await browse.locator('a[href="/create"]').click();
    await browse.locator('input#restaurant_name').fill('Fourth Coffee');
    await browse.locator('button:text("Submit")').click();
    await browse.locator('button:text("Add new review")').click();
    await browse.locator('input[value="2"]').click();
    await browse.locator('button:text("Save changes")').click();
    await browse.locator('button:text("Add new review")').click();
    await browse.locator('input[value="2"]').click();
    await browse.locator('button:text("Save changes")').click();
    await browse.locator('a[href="/"]').click();
    await DocsPageBase.screenshotBigSmall (browse, azPage.screenshotDir, screenshotBrowse2);
    await browse.close();

    // Stream logs 02
    await azPage.streamAppServiceLogs({
        searchStrings: ['Request for index page received'], 
        screenshotName: screenshotLogs2
    });

    // Delete resources
    await azPage.deleteResourceGroup(resourceGroupName, screenshotClean);
    //await githubPage.deleteFork();
});

var screenshotDeployDjango1 = "azure-portal-deploy-sample-code-django-1";
var screenshotDeployDjango2 = "azure-portal-deploy-sample-code-django-2";
var screenshotDeployDjango3 = "azure-portal-deploy-sample-code-django-3";
var screenshotDeployDjango4 = "azure-portal-deploy-sample-code-django-4";
var screenshotDeployDjango5 = "azure-portal-deploy-sample-code-django-5";
var screenshotDeployDjango6 = "azure-portal-deploy-sample-code-django-6";
var screenshotDeployDjango7 = "azure-portal-deploy-sample-code-django-7";
var screenshotMigrateDjango1 = "azure-portal-generate-db-schema-django-1";
var screenshotMigrateDjango2 = "azure-portal-generate-db-schema-django-2";

test('tutorial-python-postgresql-app-django', async ({ azPage, githubPage }) => {

    // add to sensitive text list
    azPage.sensitiveStrings.push({searchString: 'lcephas', replacement: '&lt;github-alias&gt;'});
    githubPage.sensitiveStrings.push({searchString: 'vmagelo', replacement: 'somebody'});
    githubPage.sensitiveStrings.push({searchString: 'lcephas', replacement: '&lt;github-alias&gt;'});

    // Create App+DB
    await azPage.searchAndGo(SearchType.marketplace, "web app database", { itemText: "Web App + Database", screenshotName: screenshotCreate1});
    await azPage.runAppDbCreateWizard(subscription, resourceGroupName, region, appName, runtime, {sku: "Basic", screenshotName: screenshotCreate2});
    await azPage.goToCreatedResource(screenshotCreate3);

    // // debug
    // await azPage.searchAndGo(SearchType.resources, appName, {resourceType: 'App Service'});

    // Connection string
    await azPage.goToAppServicePageByMenu(MenuOptions.configuration, screenshotConnect1);
    await azPage.viewAppServiceAppSettings(screenshotConnect2);

    // Deploy
    await githubPage.createFork('https://github.com/Azure-Samples/msdocs-django-postgresql-sample-app', screenshotDeployDjango1);
    await githubPage.page.waitForLoadState();
    githubPage.repoUrl = 'https://github.com/lcephas/msdocs-django-postgresql-sample-app';
    await githubPage.openVSCode({screenshotName: screenshotDeployDjango2});
    await githubPage.viewFileInVSC({
        filepath: 'azureproject/production.py', 
        regex: `(?<=\\[')DBUSER|(?<=\\[')DBPASS|(?<=\\[')DBHOST|(?<=\\[')DBNAME|(?<=os.environ\\[')WEBSITE_HOSTNAME`,
        screenshotName: screenshotDeployDjango3
    });

    await azPage.goToAppServicePageByMenu(MenuOptions.deploymentcenter, screenshotDeployDjango4);
    if(process.env.GITHUB_USER) {
        await azPage.configureGitHubActionsDeploy(
            process.env.GITHUB_USER, 
            'msdocs-django-postgresql-sample-app', 
            'main', 
            screenshotDeployDjango5);
    }

    const popupPage = await azPage.goToGitHubActionsLogs(screenshotDeployDjango6);
    //popupPage.sensitiveStrings.push({searchString: 'vmagelo', replacement: 'somebody'});
    popupPage.sensitiveStrings.push({searchString: 'lcephas', replacement: '&lt;github-alias&gt;'});
    await popupPage.waitForActionRun({screenshotName: screenshotDeployDjango7});
    await popupPage.page.close();

    // Run DB migration in SSH
    const sshPage = await azPage.openSshShellToContainer({clickMenu: true, screenshotName: screenshotMigrateDjango1});
    await sshPage.runSshShellCommands(
        [
            {command: 'python manage.py migrate', timeout: 10000}
        ],
        {
            width: 780,
            height: 500,
            screenshotName: screenshotMigrateDjango2
        }
    );
    sshPage.page.close();
        
    // app needs time to restart
    //await azPage.page.waitForTimeout(5000);

    // Stream logs 01
    await azPage.enableAppServiceLinuxLogs(screenshotLogs1);

    // Browse to web app
    const [browse] = await azPage.browseAppServiceUrl(screenshotBrowse1);
    await browse.setViewportSize({ width: 780, height: 600 });
    await browse.locator('a[href="/create"]').click();
    await browse.locator('input#restaurant_name').fill('Contoso Restaurant');
    await browse.locator('button:text("Submit")').click();
    await browse.locator('button:text("Add new review")').click();
    await browse.locator('input[value="4"]').click();
    await browse.locator('button:text("Save changes")').click();
    await browse.locator('button:text("Add new review")').click();
    await browse.locator('input[value="4"]').click();
    await browse.locator('button:text("Save changes")').click();
    await browse.locator('button:text("Add new review")').click();
    await browse.locator('input[value="4"]').click();
    await browse.locator('button:text("Save changes")').click();
    await browse.locator('a[href="/"]').click();
    await browse.locator('a[href="/create"]').click();
    await browse.locator('input#restaurant_name').fill('Fourth Coffee');
    await browse.locator('button:text("Submit")').click();
    await browse.locator('button:text("Add new review")').click();
    await browse.locator('input[value="2"]').click();
    await browse.locator('button:text("Save changes")').click();
    await browse.locator('button:text("Add new review")').click();
    await browse.locator('input[value="2"]').click();
    await browse.locator('button:text("Save changes")').click();
    await browse.locator('a[href="/"]').click();
    await DocsPageBase.screenshotBigSmall (browse, azPage.screenshotDir, screenshotBrowse2);
    await browse.close();

    // Stream logs 02
    await azPage.streamAppServiceLogs({
        searchStrings: ['Request for index page received'], 
        screenshotName: screenshotLogs2
    });

    // Delete resources
    await azPage.deleteResourceGroup(resourceGroupName, screenshotClean);
    //await githubPage.deleteFork();
});