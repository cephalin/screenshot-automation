import { Locator, Page, TestInfo } from "@playwright/test";
import path from 'path';
import sharp from 'sharp';

/*****************************************************************************
 * DocsPageBase class
 * - Base class for domain-specific pages
 * - Contains common screenshot routines
 *****************************************************************************/
 export class DocsPageBase {
    page: Page;
    screenshotDir: string;

    constructor(page: Page, testInfo?: TestInfo ){
        this.page = page;
        if(testInfo) {
            this.screenshotDir = "screenshots/" + path.basename(testInfo.title, '.spec.js') + '/';
        } else {
            this.screenshotDir = '';
        }
    }

    /**
     * Augmented from (Page|Locator).screenshot to do the following:
     * - Capture both regular size and 240px wide images, optimized for the lightbox in docs
     * - Highlight objects in the viewport with an array of Locators
     * - Add the "Press ." image for GitHub scenario.
     *  
     * @param options 
     */
    async screenshot(options?: { 
		locator?: Locator | undefined,
		name?: string | undefined,
		width?: number | undefined,
		height?: number | undefined,
		highlightobjects?: Locator[] | undefined,
		blurAll?: boolean | undefined,
		pressenter?: boolean | undefined,
	} | undefined): Promise<void> {

		// set defaults
		options = options ? options : {};
		options.name = options.name ? options.name : "screenshot";
		options.width = options.width ? options.width : 780;
		options.height = options.height ? options.height : 700;
		options.blurAll = options.blurAll === undefined ? true : options.blurAll;
		options.pressenter = options.pressenter ? options.pressenter : false;

        await this.page.setViewportSize({ width: options.width, height: options.height });
                
        if(options.highlightobjects) {
            for (const obj of options.highlightobjects) {
                await obj.evaluate(el => {
					el.style.setProperty('border', '3px solid red', 'important');
				});
                await obj.scrollIntoViewIfNeeded();
            }
        }

        // // buggy
        // if (options.blurAll) {
        //     // click out of any focused element
        //     await this.page.locator(':focus').evaluate(el => {
        //         el.blur();
        //     }, undefined, {timeout: 1000});
        // }

        await DocsPageBase.screenshotBigSmall (
            options.locator ? options.locator : this.page,
            this.screenshotDir,
            options.name,
            options.pressenter
        );
    
        if(options.highlightobjects){
            for (const obj of options.highlightobjects) {
                await obj.evaluate(el => el.style.removeProperty('border'));
            }
        }
    }

    static async screenshotBigSmall(
        root: Page | Locator,
        screenshotDir: string,
        screenshotName: string,
        pressenter?: boolean
    ): Promise<void> {

		var pathandname = screenshotDir + screenshotName;

        if (pressenter) {
            var buffer = await root.screenshot();
            await sharp(buffer)
                .composite([{input: 'press-period.png', gravity: 'centre' }])
                .toFile(pathandname + '.png');    
        } else {
            await root.screenshot({path: pathandname + '.png'});
        }
        
        await sharp(pathandname + '.png')
              .resize({width: 240})
              .toFile(pathandname + '-240px.png');
    }
}
