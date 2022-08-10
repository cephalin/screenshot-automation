import { test, expect } from '../lib/docsFixtures';
import { SearchType } from '../lib/AzurePortalPage';

var subscriptionName = "Visual Studio Enterprise Subscription";
var resourceGroupName = "msdocs-recommender-tutorial-rg";
var vnetName = "msdocs-recommender-vnet";
var storageAccountName = 'msdocsrecommenderstor234';
var storagePEName = 'msdocs-recommender-storagepe';
var containerName = 'src-data';
var cosmosDbName = 'msdocs-recommender-mongodb';
var cosmosPEName = 'msdocs-recommender-mongodbpe';
var dbName = 'myDB';
var collectionName = 'Collection1';
var region = "East US";
var regionStorage = '(US) East US';
var screenshotCreate1 = "tutorial-azure-python-recommendation-system-portal-1";
var screenshotCreate2 = "tutorial-azure-python-recommendation-system-portal-2";
var screenshotCreate3 = "tutorial-azure-python-recommendation-system-portal-3";
var screenshotCreate4 = "tutorial-azure-python-recommendation-system-portal-4";
var screenshotCreate5 = "tutorial-azure-python-recommendation-system-portal-4b";
var screenshotCreate6 = "tutorial-azure-python-recommendation-system-portal-5";
var screenshotCreate7 = "tutorial-azure-python-recommendation-system-portal-6";
var screenshotCreate8 = "tutorial-azure-python-recommendation-system-portal-7a";
var screenshotCreate9 = "tutorial-azure-python-recommendation-system-portal-7b";
var screenshotCreate10 = "tutorial-azure-python-recommendation-system-portal-8";
var screenshotCreate11 = "tutorial-azure-python-recommendation-system-portal-9";
var screenshotCreate12 = "tutorial-azure-python-recommendation-system-portal-10a";
var screenshotCreate13 = "tutorial-azure-python-recommendation-system-portal-10b";
var screenshotCreate14 = "tutorial-azure-python-recommendation-system-portal-10";
var screenshotCreate15 = "tutorial-azure-python-recommendation-system-portal-11";
var screenshotCreate16 = "tutorial-azure-python-recommendation-system-portal-12a";
var screenshotCreate17 = "tutorial-azure-python-recommendation-system-portal-12b";
var screenshotCreate18 = "tutorial-azure-python-recommendation-system-portal-12c";
var screenshotCreate19 = "tutorial-azure-python-recommendation-system-portal-12d";
var screenshotCreate20 = "tutorial-azure-python-recommendation-system-portal-12e";
var screenshotClean = "azure-portal-clean-up-resources";

test.use({ viewport: { width: 780, height: 900 } });

test('tutorial-azure-python-recommendation-system-02', async ({ azPage }) => {

    // // Create VNET
    // await azPage.searchAndGo(SearchType.services, "Virtual Network", { itemText: "Virtual networks" });
    // await azPage.searchAndGo(
    //     SearchType.services, 
    //     "Virtual Network", 
    //     { 
    //         itemText: "Virtual networks", 
    //         screenshotName: screenshotCreate1,
    //         otherHighlights: [azPage.page.locator('.azc-toolbar-item[title="Create"]')],
    //         dontGo: true,
    //         clean: false
    //     }
    // );

    // await azPage.page.locator('.azc-toolbar-item[title="Create"]').click();

    // await azPage.page.locator('.fxc-weave-pccontrol:has-text("Subscription") > .azc-formElementSubLabelContainer').click();
    // await azPage.page.locator(`div[role="treeitem"]:has-text("${subscriptionName}")`).click();
    // await azPage.page.locator('[aria-label="Resource group\: Create new"]').click();
    // await azPage.page.locator('[aria-label="Name of new Resource group"]').click();
    // await azPage.page.locator('[aria-label="Name of new Resource group"]').fill(resourceGroupName);
    // await azPage.page.locator('div[role="button"]:has-text("OK")').click();
    // await azPage.page.locator('.fxc-weave-pccontrol:has(.azc-form-label:text("Name")) > .azc-formElementSubLabelContainer input').first().click();
    // await azPage.page.locator('.fxc-weave-pccontrol:has(.azc-form-label:text("Name")) > .azc-formElementSubLabelContainer input').first().fill(vnetName);
    // await azPage.page.locator('.fxc-weave-pccontrol:has-text("Region") > .azc-formElementSubLabelContainer .azc-formElementContainer').first().click();
    // await azPage.page.locator(`div[role="treeitem"]:has(:text-is("${region}"))`).waitFor({state: 'visible', timeout: 10000});
    // await azPage.page.locator(`div[role="treeitem"]:has(:text-is("${region}"))`).click();
    // await expect(azPage.page.locator('.fxc-validation')).toHaveCount(0, {timeout: 10000}); // wait for validation warnings to disappear

    // var highlighted = [
    //     azPage.page.locator('.fxc-weave-pccontrol:has-text("Subscription") > .azc-formElementSubLabelContainer'),
    //     azPage.page.locator('[aria-label="Resource group\: Create new"]'),
    //     azPage.page.locator('.fxc-weave-pccontrol:has(.azc-form-label:text("Name")) > .azc-formElementSubLabelContainer input').first(),
    //     azPage.page.locator('.fxc-weave-pccontrol:has-text("Region") > .azc-formElementSubLabelContainer').first(),
    //     azPage.page.locator('div[title="Next : IP Addresses >"]')
    // ];

    // // DEBUG: manually blur
    // let width = await azPage.page.viewportSize()?.width;
    // if(width) {
    //     await azPage.page.mouse.click(width / 2, 0);
    // }

    // await azPage.screenshot({
    //     locator: azPage.page.locator('.fxs-journey-layout'),
    //     height: 900,
    //     highlightobjects: highlighted, 
    //     name: screenshotCreate2
    // });

    // await azPage.page.locator('div[title="Next : IP Addresses >"]').click();

    // await azPage.page.pause();
    // await azPage.page.locator('.fxc-gc-row.azc-br-muted.fxs-portal-hover:has-text("default") .fxc-gc-selectioncheckbox.azc-fill-text').click();

    // await azPage.screenshot({
    //     locator: azPage.page.locator('.fxs-journey-layout'),
    //     height: 900,
    //     highlightobjects: [
    //         azPage.page.locator('.fxc-gc-row.azc-br-muted.fxs-portal-hover:has-text("default") .fxc-gc-selectioncheckbox.azc-fill-text'),
    //         azPage.page.locator('[title="Review + create"]')
    //     ], 
    //     name: screenshotCreate3
    // });

    // await azPage.page.locator('[title="Review + create"]').click();
    // await azPage.page.locator('.fxs-button[title="Create"]').click();

    // await azPage.goToCreatedResource(screenshotCreate4);

    // Create Storage
    await azPage.searchAndGo(SearchType.services, "Storage accounts", { itemText: "Storage accounts" });
    await azPage.searchAndGo(
        SearchType.services, 
        "Storage accounts", 
        { 
            itemText: "Storage accounts", 
            screenshotName: screenshotCreate5,
            otherHighlights: [azPage.page.locator('.azc-toolbar-item[title="Create"]')],
            dontGo: true,
            clean: false
        }
    );

    await azPage.page.locator('.azc-toolbar-item[title="Create"]').click();
    
    let frame = azPage.page.frameLocator('iframe.fxs-blade-floated-frame');

    await frame.locator('[aria-label="Subscription"]').click();
    await frame.locator(`button[title="${subscriptionName}"]`).click();
    await frame.locator('.ms-Dropdown[aria-label="Resource group"]').click();
    await frame.locator(`button[title="${resourceGroupName}"]`).click();
    await frame.locator('[aria-label="Storage account name"]').click();
    await frame.locator('[aria-label="Storage account name"]').fill(storageAccountName);
    await frame.locator('[aria-label="Region"]').click();
    await frame.locator(`button[title="${regionStorage}"]`).waitFor({state: 'visible', timeout: 10000});
    await frame.locator(`button[title="${regionStorage}"]`).click();
    await expect(frame.locator('.fxc-validation')).toHaveCount(0, {timeout: 10000}); // wait for validation warnings to disappear

    var highlighted = [
        frame.locator('[aria-label="Subscription"] span:first-child'),
        frame.locator('.ms-Dropdown[aria-label="Resource group"] span:first-child'),
        frame.locator('[aria-label="Storage account name"]'),
        frame.locator('[aria-label="Region"] span:first-child'),
    ];

    // DEBUG: manually blur
    let width = await azPage.page.viewportSize()?.width;
    if(width) {
        await azPage.page.mouse.click(width / 2, 0);
    }

    await azPage.screenshot({
        locator: frame.locator('html'),
        height: 900,
        highlightobjects: highlighted, 
        name: screenshotCreate6
    });

    await frame.locator('button[name="Networking"] :text("Networking")').click();
    await frame.locator('.ms-ChoiceField-wrapper:has(:text("Disable public access and use private access"))').click();

    await azPage.screenshot({
        locator: frame.locator('html'),
        height: 900,
        highlightobjects: [
            frame.locator('button[name="Networking"] :text("Networking")'),
            frame.locator('.ms-ChoiceField-wrapper:has(:text("Disable public access and use private access"))'),
            frame.locator('.ms-Button-flexContainer:has(:text("Add private endpoint")) span:first-child')
        ], 
        name: screenshotCreate7
    });

    await frame.locator('.ms-Button-flexContainer:has(:text("Add private endpoint"))').click();

    await azPage.page.pause();
    await azPage.page.locator('.fxc-weave-pccontrol:has(.azc-form-label:text("Name")) > .azc-formElementSubLabelContainer input').click();
    await azPage.page.locator('.fxc-weave-pccontrol:has(.azc-form-label:text("Name")) > .azc-formElementSubLabelContainer input').fill(storagePEName);
    await azPage.page.locator('li:has(input[value="false"])').click();


    // DEBUG: manually blur
    width = await azPage.page.viewportSize()?.width;
    if(width) {
        await azPage.page.mouse.click(width / 2, 0);
    }

    await azPage.screenshot({
        height: 900,
        highlightobjects: [
            azPage.page.locator(`:text("${subscriptionName}")`),
            azPage.page.locator(`:text("${resourceGroupName}")`),
            azPage.page.locator(`:text("${region}")`),
            azPage.page.locator('.fxc-weave-pccontrol:has(.azc-form-label:text("Name")) > .azc-formElementSubLabelContainer input'),
            azPage.page.locator('.fxc-weave-pccontrol:has(.azc-form-label:text("Storage sub-resource")) > .azc-formElementSubLabelContainer'),
            azPage.page.locator(`.fxc-weave-pccontrol:has(.azc-form-label:text("Virtual network")) > .azc-formElementSubLabelContainer`),
            azPage.page.locator(`.fxc-weave-pccontrol:has(.azc-form-label:text("Subnet")) .azc-formElementContainer`).first(),
            azPage.page.locator('li:has(input[value="false"])'),
            azPage.page.locator('.fxs-button[title="OK"]')        
        ], 
        name: screenshotCreate8
    });

    await azPage.page.locator('.fxs-button[title="OK"]').click();

    await azPage.page.pause();
    await frame.locator('button:has-text("Review")').first().click();

    //////////////////// DEBUGGED THUS FAR
    await frame.locator('button[title="Create"]');        

    await azPage.screenshot({
        height: 900,
        highlightobjects: [
            azPage.page.locator('button[title="Create"]')        
        ], 
        name: screenshotCreate9
    });

    await frame.locator('button[title="Create"]').click();        

    await azPage.goToCreatedResource(screenshotCreate9);

    var menuItem = azPage.page.locator('a[href$="containersList"]');
    await expect (menuItem).toBeEnabled({timeout: 10000});
    await azPage.page.waitForTimeout(3000);

    await azPage.screenshot({
        locator: azPage.page.locator('.fxs-blade-display-in-journey .fxs-blade-content-container-default'),
        height: 500, 
        highlightobjects: [menuItem], 
        name: screenshotCreate10
    });

    await menuItem.click();

    await azPage.page.locator('[aria-label="New container"]').click();
    await azPage.page.locator('.fxc-weave-pccontrol:has-text("Name") > .azc-formElementSubLabelContainer input').click();
    await azPage.page.locator('.fxc-weave-pccontrol:has-text("Name") > .azc-formElementSubLabelContainer input').fill(containerName);

    await azPage.screenshot({
        height: 500, 
        highlightobjects: [
            azPage.page.locator('[aria-label="New container"]'),
            azPage.page.locator('.fxc-weave-pccontrol:has-text("Name") > .azc-formElementSubLabelContainer'),
            azPage.page.locator('div[title="Create"]')
        ], 
        name: screenshotCreate11
    });

    await azPage.page.locator('div[title="Create"]').click();

    await azPage.searchAndGo(SearchType.services, `Cosmos DB`, {itemText: `Azure Cosmos DB API for MongoDB`, screenshotName: screenshotCreate12 });

    // Create Cosmos DB
    await azPage.searchAndGo(SearchType.services, "Cosmos DB", { itemText: "Azure Cosmos DB API for MongoDB" });
    await azPage.searchAndGo(
        SearchType.services, 
        "Cosmos DB", 
        { 
            itemText: "Azure Cosmos DB API for MongoDB", 
            screenshotName: screenshotCreate12,
            otherHighlights: [azPage.page.locator('.azc-toolbar-item[title="Create"]')],
            dontGo: true,
            clean: false
        }
    );
    
    await azPage.page.locator('.azc-toolbar-item[title="Create"]').click();
    
    await azPage.page.locator('.fxc-weave-pccontrol:has-text("Subscription") > .azc-formElementSubLabelContainer .azc-formElementContainer').click();
    await azPage.page.locator(`div[role="treeitem"]:has-text("${subscriptionName}")`).click();
    await azPage.page.locator('.fxc-weave-pccontrol:has-text("Resource Group") > .azc-formElementSubLabelContainer').click();
    await azPage.page.locator(`div[role="treeitem"]:has-text("${resourceGroupName}")`).click();
    await azPage.page.locator('.fxc-weave-pccontrol:has-text("Account Name") > .azc-formElementSubLabelContainer input').click();
    await azPage.page.locator('.fxc-weave-pccontrol:has-text("Account Name") > .azc-formElementSubLabelContainer input').fill(cosmosDbName);
    await azPage.page.locator('.fxc-weave-pccontrol:has-text("Location") > .azc-formElementSubLabelContainer .azc-formElementContainer').click();
    await azPage.page.locator(`div[role="treeitem"]:has(:text-is("${regionStorage}"))`).waitFor({state: 'visible', timeout: 10000});
    await azPage.page.locator(`div[role="treeitem"]:has(:text-is("${regionStorage}"))`).click();
    await azPage.page.locator('li:text("Serverless")').click();
    await expect(azPage.page.locator('.fxc-validation')).toHaveCount(0, {timeout: 10000}); // wait for validation warnings to disappear

    var highlighted = [
        azPage.page.locator('.fxc-weave-pccontrol:has-text("Subscription") > .azc-formElementSubLabelContainer'),
        azPage.page.locator('.fxc-weave-pccontrol:has-text("Resource Group") > .azc-formElementSubLabelContainer'),
        azPage.page.locator('.fxc-weave-pccontrol:has-text("Account Name") > .azc-formElementSubLabelContainer'),
        azPage.page.locator('.fxc-weave-pccontrol:has-text("Location") > .azc-formElementSubLabelContainer'),
        azPage.page.locator('li:text("Serverless")'),
        azPage.page.locator('.fxc-weave-pccontrol:has-text("Version") > .azc-formElementSubLabelContainer'),
        azPage.page.locator('[title="Review + create"]')
    ];


    // DEBUG: manually blur
    width = await azPage.page.viewportSize()?.width;
    if(width) {
        await azPage.page.mouse.click(width / 2, 0);
    }

    await azPage.screenshot({
        locator: azPage.page.locator('.fxs-journey-layout'),
        height: 900,
        highlightobjects: highlighted, 
        name: screenshotCreate13
    });

    await azPage.page.locator('button[name="Networking"] :text("Networking")').click();
    await azPage.page.locator('li:text("Private endpoint")').click();
    await azPage.page.locator('.fxc-weave-pccontrol:has-text("Allow access from Azure Portal") > .azc-formElementSubLabelContainer li:text("Allow")').click();
    await azPage.page.locator('.fxc-weave-pccontrol:has-text("Allow access from my IP") > .azc-formElementSubLabelContainer li:text("Allow")').click();

    var highlighted = [
        azPage.page.locator('button[name="Networking"] :text("Networking")'),
        azPage.page.locator('li:text("Private endpoint")'),
        azPage.page.locator('.fxc-weave-pccontrol:has-text("Allow access from Azure Portal") > .azc-formElementSubLabelContainer li:text("Allow")'),
        azPage.page.locator('.fxc-weave-pccontrol:has-text("Allow access from my IP") > .azc-formElementSubLabelContainer li:text("Allow")'),
        azPage.page.locator('li:text("Add")')
    ];


    // DEBUG: manually blur
    width = await azPage.page.viewportSize()?.width;
    if(width) {
        await azPage.page.mouse.click(width / 2, 0);
    }

    await azPage.screenshot({
        locator: azPage.page.locator('.fxs-journey-layout'),
        height: 900,
        highlightobjects: highlighted, 
        name: screenshotCreate14
    });

    await azPage.page.locator('li:text("Add")').click();

    let endpointPane = azPage.page.locator('.fxs-contextpane.fxs-portal-bg-txt-br.fxs-contextpane-visible');

    await endpointPane.locator('.fxc-weave-pccontrol:has-text("Name") > .azc-formElementSubLabelContainer input').click();
    await endpointPane.locator('.fxc-weave-pccontrol:has-text("Name") > .azc-formElementSubLabelContainer input').fill(cosmosPEName);
    await endpointPane.locator('.fxc-weave-pccontrol:has-text("Location") > .azc-formElementSubLabelContainer').click();
    await azPage.page.locator(`div[role="treeitem"]:has-text("${region}")`).click();
    await endpointPane.locator('li:text("No")').click();


    // DEBUG: manually blur
    width = await azPage.page.viewportSize()?.width;
    if(width) {
        await azPage.page.mouse.click(width / 2, 0);
    }

    await azPage.screenshot({
        locator: endpointPane,
        height: 900,
        highlightobjects: [
            endpointPane.locator(`:text("${subscriptionName}")`),
            endpointPane.locator(`:text("${resourceGroupName}")`),
            endpointPane.locator(`:text("${region}")`),
            endpointPane.locator('.fxc-weave-pccontrol:has-text("Name") > .azc-formElementSubLabelContainer'),
            endpointPane.locator('.fxc-weave-pccontrol:has-text("CosmosDb sub-resource") > .azc-formElementSubLabelContainer'),
            endpointPane.locator(`.fxc-weave-pccontrol:has-text("Virtual network") > .azc-formElementSubLabelContainer`),
            endpointPane.locator(`.fxc-weave-pccontrol:has-text("Subnet") > .azc-formElementSubLabelContainer`),
            endpointPane.locator('li:text("No")'),
            endpointPane.locator('button[title="OK"]')        
        ], 
        name: screenshotCreate15
    });

    await endpointPane.locator('button[title="OK"]').click();

    await azPage.page.locator('[title="Review + create"]');

    await azPage.screenshot({
        height: 900,
        highlightobjects: [
            azPage.page.locator('[title="Create"]')
        ], 
        name: screenshotCreate16
    });

    await azPage.page.locator('[title="Create"]').click();

    await azPage.goToCreatedResource(screenshotCreate17);

    await azPage.screenshot({
        height: 500,
        highlightobjects: [
            azPage.page.locator('[data-telemetryname="Command-Add Collection"]')
        ], 
        name: screenshotCreate17
    });

    await azPage.page.locator('[data-telemetryname="Command-Add Collection"]').click();

    frame = azPage.page.frameLocator('iframe.fxc-iframe-window');

    await frame.locator('[name="newDatabaseId"]').click();
    await frame.locator('[name="newDatabaseId"]').fill(dbName);
    await frame.locator('[name="collectionId"]').click();
    await frame.locator('[name="collectionId"]').fill(collectionName);

    // DEBUG: manually blur
    width = await azPage.page.viewportSize()?.width;
    if(width) {
        await azPage.page.mouse.click(width / 2, 0);
    }

    await azPage.screenshot({
        locator: frame.locator('html'),
        height: 900,
        highlightobjects: [
            frame.locator('[name="newDatabaseId"]'),
            frame.locator('[name="collectionId"]'),
            frame.locator('[aria-label="OK"]')
        ], 
        name: screenshotCreate18
    });
    
    await frame.locator('[aria-label="OK"]').click();

    // Delete resources
    await azPage.deleteResourceGroup(resourceGroupName, screenshotClean);
});