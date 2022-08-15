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
var screenshotVnet1 = "tutorial-azure-python-recommendation-system-portal-1";
var screenshotVnet2 = "tutorial-azure-python-recommendation-system-portal-2";
var screenshotVnet3 = "tutorial-azure-python-recommendation-system-portal-3";
var screenshotVnet4 = "tutorial-azure-python-recommendation-system-portal-4";
var screenshotVnet5 = "tutorial-azure-python-recommendation-system-portal-4b";
var screenshotStorage1 = "tutorial-azure-python-recommendation-system-portal-5";
var screenshotStorage2 = "tutorial-azure-python-recommendation-system-portal-6";
var screenshotStorage3 = "tutorial-azure-python-recommendation-system-portal-7a";
var screenshotStorage4 = "tutorial-azure-python-recommendation-system-portal-7b";
var screenshotStorage5 = "tutorial-azure-python-recommendation-system-portal-8";
var screenshotStorage6 = "tutorial-azure-python-recommendation-system-portal-9";
var screenshotStorage7 = "tutorial-azure-python-recommendation-system-portal-10a";
var screenshotStorage8 = "tutorial-azure-python-recommendation-system-portal-10b";
var screenshotCosmosDb1 = "tutorial-azure-python-recommendation-system-portal-10";
var screenshotCosmosDb2 = "tutorial-azure-python-recommendation-system-portal-11";
var screenshotCosmosDb3 = "tutorial-azure-python-recommendation-system-portal-12a";
var screenshotCosmosDb4 = "tutorial-azure-python-recommendation-system-portal-12b";
var screenshotCosmosDb5 = "tutorial-azure-python-recommendation-system-portal-12c";
var screenshotCosmosDb6 = "tutorial-azure-python-recommendation-system-portal-12d";
var screenshotCosmosDb7 = "tutorial-azure-python-recommendation-system-portal-12e";
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
    //         screenshotName: screenshotVnet1,
    //         otherHighlights: [azPage.page.locator('.fxs-commandBar .azc-toolbar-item[title="Create"]')],
    //         dontGo: true,
    //         clean: false
    //     }
    // );

    // await azPage.page.locator('.fxs-commandBar .azc-toolbar-item[title="Create"]').click();
    // await azPage.page.waitForTimeout(3000);

    // await azPage.page.locator('.fxc-weave-pccontrol:has(:text("Subscription")) > .azc-formElementSubLabelContainer').click();
    // await azPage.page.locator(`div[role="treeitem"]:has-text("${subscriptionName}")`).click();
    // await azPage.page.locator('[aria-label="Resource group\: Create new"]').click();
    // await azPage.page.locator('[aria-label="Name of new Resource group"]').click();
    // await azPage.page.locator('[aria-label="Name of new Resource group"]').fill(resourceGroupName);
    // await azPage.page.locator('div[role="button"]:has-text("OK")').click();
    // await azPage.page.locator('.fxc-weave-pccontrol:has(.azc-form-label:text("Name")) > .azc-formElementSubLabelContainer input').first().click();
    // await azPage.page.locator('.fxc-weave-pccontrol:has(.azc-form-label:text("Name")) > .azc-formElementSubLabelContainer input').first().fill(vnetName);
    // await azPage.page.locator('.fxc-weave-pccontrol:has(:text("Region")) > .azc-formElementSubLabelContainer').scrollIntoViewIfNeeded();
    // await azPage.page.waitForTimeout(1000);
    // await azPage.page.locator('.fxc-weave-pccontrol:has(:text("Region")) > .azc-formElementSubLabelContainer').click();
    // await azPage.page.locator(`div[role="treeitem"]:has(:text-is("${region}"))`).waitFor({state: 'visible', timeout: 10000});
    // await azPage.page.locator(`div[role="treeitem"]:has(:text-is("${region}"))`).click();
    // await expect(azPage.page.locator('.fxc-validation')).toHaveCount(0, {timeout: 10000}); // wait for validation warnings to disappear

    // var highlighted = [
    //     azPage.page.locator('.fxc-weave-pccontrol:has(:text("Subscription")) > .azc-formElementSubLabelContainer'),
    //     azPage.page.locator('[aria-label="Resource group\: Create new"]'),
    //     azPage.page.locator('.fxc-weave-pccontrol:has(.azc-form-label:text("Name")) > .azc-formElementSubLabelContainer input').first(),
    //     azPage.page.locator('.fxc-weave-pccontrol:has(:text("Region")) > .azc-formElementSubLabelContainer').first(),
    //     azPage.page.locator('div[title="Next : IP Addresses >"]')
    // ];

    // // DEBUG: manually blur
    // let width = await azPage.page.viewportSize()?.width;
    // if(width) {
    //     await azPage.page.mouse.click(width / 2, 0);
    // }

    // await azPage.screenshot({
    //     locator: azPage.page.locator('.fxs-journey-layout'),
    //     height: 700,
    //     highlightobjects: highlighted, 
    //     name: screenshotVnet2
    // });

    // await azPage.page.locator('div[title="Next : IP Addresses >"]').click();

    // await azPage.page.locator('.fxc-gc-row.azc-br-muted.fxs-portal-hover:has-text("default") .fxc-gc-selectioncheckbox.azc-fill-text').click();

    // await azPage.screenshot({
    //     locator: azPage.page.locator('.fxs-journey-layout'),
    //     height: 600,
    //     highlightobjects: [
    //         azPage.page.locator('.fxc-gc-row.azc-br-muted.fxs-portal-hover:has-text("default") .fxc-gc-selectioncheckbox.azc-fill-text'),
    //         azPage.page.locator('[title="Review + create"]')
    //     ], 
    //     name: screenshotVnet3
    // });

    // await azPage.page.locator('[title="Review + create"]').click();

    // await azPage.page.locator('.fxs-button[title="Create"]').click({trial: true});

    // await azPage.screenshot({
    //     locator: azPage.page.locator('.fxs-journey-layout'),
    //     height: 900,
    //     highlightobjects: [
    //         azPage.page.locator('.fxs-button[title="Create"]')
    //     ], 
    //     name: screenshotVnet4
    // });

    // await azPage.page.locator('.fxs-button[title="Create"]').click();

    // await azPage.goToCreatedResource(screenshotVnet5);

    // // Create Storage
    // await azPage.searchAndGo(SearchType.services, "Storage accounts", { itemText: "Storage accounts" });
    // await azPage.searchAndGo(
    //     SearchType.services, 
    //     "Storage accounts", 
    //     { 
    //         itemText: "Storage accounts", 
    //         screenshotName: screenshotStorage1,
    //         otherHighlights: [azPage.page.locator('.fxs-commandBar .azc-toolbar-item[title="Create"]')],
    //         dontGo: true,
    //         clean: false
    //     }
    // );

    // await azPage.page.locator('.fxs-commandBar .azc-toolbar-item[title="Create"]').click();
    
    // let frame = azPage.page.frameLocator('iframe[name="StorageAccountCreate\\.ReactView"]');

    // await frame.locator('[aria-label="Subscription"]').click();
    // await frame.locator(`button[role="option"]:has-text("${subscriptionName}")`).click();
    // await frame.locator('.ms-Dropdown[aria-label="Resource group"]').click();
    // await frame.locator(`button[role="option"]:has-text("${resourceGroupName}")`).click();
    // await frame.locator('input[aria-label="Storage account name"]').click();
    // await frame.locator('input[aria-label="Storage account name"]').fill(storageAccountName);
    // await expect(frame.locator('.fxc-validation')).toHaveCount(0, {timeout: 10000}); // wait for validation warnings to disappear

    // var highlighted = [
    //     frame.locator('[aria-label="Subscription"] span:first-child'),
    //     frame.locator('.ms-Dropdown[aria-label="Resource group"] span:first-child'),
    //     frame.locator('[aria-label="Storage account name"]'),
    //     frame.locator('[aria-label="Region"] span:first-child'),
    //     frame.locator('[aria-label="Performance Standard: Recommended for most scenarios (general-purpose v2 account)"]'),
    //     frame.locator('[aria-label="Redundancy"] span:first-child'),
    // ];

    // // DEBUG: manually blur
    // width = azPage.page.viewportSize()?.width;
    // if(width) {
    //     await azPage.page.mouse.click(width / 2, 0);
    // }

    // await azPage.screenshot({
    //     locator: frame.locator('html'),
    //     height: 900,
    //     highlightobjects: highlighted, 
    //     name: screenshotStorage2
    // });

    // await frame.locator('button[role="tab"]:has-text("Networking")').click();
    // await frame.locator('text=Disable public access and use private access').click();

    // await azPage.screenshot({
    //     locator: frame.locator('html'),
    //     height: 900,
    //     highlightobjects: [
    //         frame.locator('button[name="Networking"] :text("Networking")'),
    //         frame.locator('.ms-ChoiceField-wrapper:has(:text("Disable public access and use private access"))'),
    //         frame.locator('.ms-Button-flexContainer:has(:text("Add private endpoint")) span:first-child')
    //     ], 
    //     name: screenshotStorage3
    // });

    // await frame.locator('[aria-label="Add a private endpoint\\."]').click();

    // await azPage.page.locator('.fxc-weave-pccontrol:has(.azc-form-label:text("Name")) > .azc-formElementSubLabelContainer input').click();
    // await azPage.page.locator('.fxc-weave-pccontrol:has(.azc-form-label:text("Name")) > .azc-formElementSubLabelContainer input').fill(storagePEName);
    // await azPage.page.locator('li[role="radio"]:has-text("No")').click();
    // await azPage.page.waitForTimeout(3000);
    // await expect(azPage.page.locator('.fxc-validation')).toHaveCount(0, {timeout: 10000}); // wait for validation warnings to disappear


    // // DEBUG: manually blur
    // width = azPage.page.viewportSize()?.width;
    // if(width) {
    //     await azPage.page.mouse.click(width / 2, 0);
    // }

    // await azPage.screenshot({
    //     height: 900,
    //     highlightobjects: [
    //         azPage.page.locator(`:text("${subscriptionName}")`),
    //         azPage.page.locator('.fxc-weave-pccontrol:has(.azc-form-label:text("Resource group")) > .azc-formElementSubLabelContainer .azc-formElementContainer').first(),
    //         //azPage.page.locator(`:text("${resourceGroupName}")`),
    //         azPage.page.locator(`:text("${region}")`),
    //         azPage.page.locator('.fxc-weave-pccontrol:has(.azc-form-label:text("Name")) > .azc-formElementSubLabelContainer input'),
    //         azPage.page.locator('.fxc-weave-pccontrol:has(.azc-form-label:text("Storage sub-resource")) > .azc-formElementSubLabelContainer'),
    //         azPage.page.locator(`.fxc-weave-pccontrol:has(.azc-form-label:text("Virtual network")) > .azc-formElementSubLabelContainer`),
    //         azPage.page.locator(`.fxc-weave-pccontrol:has(.azc-form-label:text("Subnet")) .azc-formElementContainer`).first(),
    //         azPage.page.locator('li:has(input[value="false"])'),
    //         azPage.page.locator('.fxs-button[title="OK"]')        
    //     ], 
    //     name: screenshotStorage4
    // });

    // await azPage.page.locator('div[role="button"]:has-text("OK")').click();

    // await azPage.page.waitForTimeout(2000);
    // await frame.locator('button:has-text("Review")').first().click();

    // await frame.locator('button:has-text("Create") >> nth=1').click({trial: true});     

    // await azPage.screenshot({
    //     height: 900,
    //     highlightobjects: [
    //         frame.locator('button:has-text("Create") >> nth=1')        
    //     ], 
    //     name: screenshotStorage5
    // });

    // await frame.locator('button:has-text("Create") >> nth=1').click();        

    // await azPage.goToCreatedResource(screenshotStorage6);

    // //DEBUG
    // // await azPage.searchAndGo(SearchType.resources, storageAccountName, {resourceType: 'Storage account'});    

    // var menuItem = azPage.page.locator('a[href$="containersList"]');
    // await expect (menuItem).toBeEnabled({timeout: 10000});
    // await azPage.page.waitForTimeout(3000);

    // await azPage.screenshot({
    //     locator: azPage.page.locator('.fxs-blade-display-in-journey .fxs-blade-content-container-default'),
    //     height: 600, 
    //     highlightobjects: [menuItem], 
    //     name: screenshotStorage7
    // });

    // await menuItem.click();

    // await azPage.page.locator('.azc-toolbar-item[title="New container"]').click();
    // await azPage.page.locator('.fxc-weave-pccontrol:has(:text("Name")) > .azc-formElementSubLabelContainer input').click();
    // await azPage.page.locator('.fxc-weave-pccontrol:has(:text("Name")) > .azc-formElementSubLabelContainer input').type(containerName, {delay: 50});

    // // DEBUG: manually blur
    // width = azPage.page.viewportSize()?.width;
    // if(width) {
    //     await azPage.page.mouse.click(width / 2, 0);
    // }

    // await azPage.screenshot({
    //     height: 500, 
    //     highlightobjects: [
    //         azPage.page.locator('.azc-toolbar-item[title="New container"]'),
    //         azPage.page.locator('.fxc-weave-pccontrol:has(:text("Name")) > .azc-formElementSubLabelContainer'),
    //         azPage.page.locator('div[title="Create"]')
    //     ], 
    //     name: screenshotStorage8
    // });

    // await azPage.page.locator('div[title="Create"]').click();
    // await azPage.clearNotification('Successfully created storage container');

    // Create Cosmos DB
    await azPage.searchAndGo(SearchType.services, "Cosmos DB", { itemText: "Azure Cosmos DB API for MongoDB" });
    await azPage.searchAndGo(
        SearchType.services, 
        "Cosmos DB", 
        { 
            itemText: "Azure Cosmos DB API for MongoDB", 
            screenshotName: screenshotCosmosDb1,
            otherHighlights: [azPage.page.locator('.fxs-commandBar .azc-toolbar-item[title="Create"]')],
            dontGo: true,
            clean: false
        }
    );
    
    await azPage.page.locator('.fxs-commandBar .azc-toolbar-item[title="Create"]').click();
    await azPage.page.waitForTimeout(3000);
    await azPage.page.locator('.fxc-weave-pccontrol:has(:text-is("Subscription")) > .azc-formElementSubLabelContainer').click();
    await azPage.page.locator(`div[role="treeitem"]:has-text("${subscriptionName}")`).click();
    await azPage.page.waitForTimeout(1000);
    await azPage.page.locator('.fxc-weave-pccontrol:has(:text("Resource Group")) > .azc-formElementSubLabelContainer').click();
    await azPage.page.locator(`div[role="treeitem"]:has-text("${resourceGroupName}")`).click();
    await azPage.page.locator('.fxc-weave-pccontrol:has(:text("Account Name")) > .azc-formElementSubLabelContainer input').click();
    await azPage.page.locator('.fxc-weave-pccontrol:has(:text("Account Name")) > .azc-formElementSubLabelContainer input').type(cosmosDbName);
    await azPage.page.locator('.fxc-weave-pccontrol:has(:text("Location")) > .azc-formElementSubLabelContainer').first().click();
    await azPage.page.locator(`div[role="treeitem"]:has(:text-is("${regionStorage}"))`).waitFor({state: 'visible', timeout: 10000});
    await azPage.page.locator(`div[role="treeitem"]:has(:text-is("${regionStorage}"))`).click();
    await azPage.page.locator('li:has(:text("Serverless"))').click();
    await expect(azPage.page.locator('.fxc-validation')).toHaveCount(0, {timeout: 10000}); // wait for validation warnings to disappear

    var highlighted = [
        azPage.page.locator('.fxc-weave-pccontrol:has(:text("Subscription")) > .azc-formElementSubLabelContainer .azc-formElementContainer').first(),
        azPage.page.locator('.fxc-weave-pccontrol:has(:text("Resource Group")) > .azc-formElementSubLabelContainer .azc-formElementContainer.azc-validatableControl-valid-validated'),
        azPage.page.locator('.fxc-weave-pccontrol:has(:text("Account Name")) > .azc-formElementSubLabelContainer .azc-formElementContainer'),
        azPage.page.locator('.fxc-weave-pccontrol:has(.azc-form-label:text-is("Location")) > .azc-formElementSubLabelContainer .azc-formElementContainer.azc-validatableControl-valid-validated'),
        azPage.page.locator('li:has(:text("Serverless"))'),
        azPage.page.locator('.fxc-weave-pccontrol:has(:text("Version")) > .azc-formElementSubLabelContainer .azc-formElementContainer'),
    ];


    // DEBUG: manually blur
    let width = await azPage.page.viewportSize()?.width;
    if(width) {
        await azPage.page.mouse.click(width / 2, 0);
    }

    await azPage.screenshot({
        locator: azPage.page.locator('.fxs-journey-layout'),
        height: 900,
        highlightobjects: highlighted, 
        name: screenshotCosmosDb2
    });

    await azPage.page.locator('.fxc-section-tab-item[role="tab"]:has-text("Networking")').first().click();
    await azPage.page.locator('li:has(:text("Private endpoint"))').click();
    await azPage.page.locator('.fxc-weave-pccontrol:has(:text("Allow access from Azure Portal")) > .azc-formElementSubLabelContainer li:has(:text("Allow"))').click();
    await azPage.page.locator('.fxc-weave-pccontrol:has(:text("Allow access from my IP")) > .azc-formElementSubLabelContainer li:has(:text("Allow"))').click();

    var highlighted = [
        azPage.page.locator('.fxc-section-tab-item[role="tab"]:has-text("Networking")').first(),
        azPage.page.locator('li:has(:text("Private endpoint"))'),
        azPage.page.locator('.fxc-weave-pccontrol:has(:text("Allow access from Azure Portal")) > .azc-formElementSubLabelContainer li:has(:text("Allow"))'),
        azPage.page.locator('.fxc-weave-pccontrol:has(:text("Allow access from my IP")) > .azc-formElementSubLabelContainer li:has(:text("Allow"))'),
        azPage.page.locator('li:has(:text("Add"))')
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
        name: screenshotCosmosDb3
    });

    await azPage.page.locator('li:has(:text("Add"))').click();

    let endpointPane = azPage.page.locator('.fxs-contextpane.fxs-portal-bg-txt-br.fxs-contextpane-visible');

    await azPage.page.waitForTimeout(3000);
    await endpointPane.locator('.fxc-weave-pccontrol:has(:text("Location")) > .azc-formElementSubLabelContainer .azc-formElementContainer').first().click();
    await azPage.page.locator(`div[role="treeitem"]:has(:text-is("${region}"))`).click();
    await endpointPane.locator('.fxc-weave-pccontrol:has(:text("Name")) > .azc-formElementSubLabelContainer input').click();
    await endpointPane.locator('.fxc-weave-pccontrol:has(:text("Name")) > .azc-formElementSubLabelContainer input').type(cosmosPEName);
    await endpointPane.locator('li:has(:text("No"))').click();


    // DEBUG: manually blur
    width = await azPage.page.viewportSize()?.width;
    if(width) {
        await azPage.page.mouse.click(width / 2, 0);
    }

    await azPage.screenshot({
        locator: endpointPane,
        height: 900,
        highlightobjects: [
            // endpointPane.locator(`:text("${subscriptionName}")`),
            endpointPane.locator('.fxc-weave-pccontrol:has(:text("Subscription")) > .azc-formElementSubLabelContainer'),
            // endpointPane.locator(`:text("${resourceGroupName}")`),
            endpointPane.locator('.fxc-weave-pccontrol:has(:text("Resource Group")) > .azc-formElementSubLabelContainer > .azc-formElementContainer').first(),
            // endpointPane.locator(`:text("${region}")`),
            endpointPane.locator('.fxc-weave-pccontrol:has(:text("Location")) > .azc-formElementSubLabelContainer > .azc-formElementContainer').first(),
            endpointPane.locator('.fxc-weave-pccontrol:has(:text("Name")) > .azc-formElementSubLabelContainer'),
            endpointPane.locator('.fxc-weave-pccontrol:has(:text("CosmosDb sub-resource")) > .azc-formElementSubLabelContainer'),
            endpointPane.locator(`.fxc-weave-pccontrol:has(:text("Virtual network")) > .azc-formElementSubLabelContainer`),
            endpointPane.locator(`.fxc-weave-pccontrol:has(:text("Subnet")) > .azc-formElementSubLabelContainer > .azc-formElementContainer`).first(),
            endpointPane.locator('li:has(:text("No"))'),
            endpointPane.locator('.fxs-button[title="OK"]')        
        ], 
        name: screenshotCosmosDb4
    });

    await endpointPane.locator('.fxs-button[title="OK"]').click();

    await azPage.page.pause();
    await azPage.page.locator('.fxs-button[title="Review + create"]').click();
    await azPage.page.locator('.fxs-button[title="Create"]').click({trial: true});
    await azPage.page.waitForTimeout(1000);

    await azPage.page.locator('.fxs-button[title="Create"]').click({trial: true});

    await azPage.screenshot({
        height: 900,
        highlightobjects: [
            azPage.page.locator('.fxs-button[title="Create"]')
        ], 
        name: screenshotCosmosDb5
    });

    await azPage.page.locator('.fxs-button[title="Create"]').click();

    await azPage.goToCreatedResource(screenshotCosmosDb4);

    await azPage.screenshot({
        height: 500,
        highlightobjects: [
            azPage.page.locator('[data-telemetryname="Command-Add Collection"]')
        ], 
        name: screenshotCosmosDb6
    });

    await azPage.page.locator('[data-telemetryname="Command-Add Collection"]').click();

    let frame = azPage.page.frameLocator('iframe.fxc-iframe-window');

    await azPage.page.waitForTimeout(3000);
    await frame.locator('[name="newDatabaseId"]').click();
    await frame.locator('input[name="newDatabaseId"]').fill(dbName);
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
        name: screenshotCosmosDb7
    });
    
    await frame.locator('[aria-label="OK"]').click();

    // Delete resources
    await azPage.deleteResourceGroup(resourceGroupName, screenshotClean);
});