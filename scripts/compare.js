const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const { exit } = require('process');
const Jimp = require("jimp");
const {compare, compareSync, Options} = require('dir-compare');
require('dotenv').config();
const spawn = require('await-spawn');
const open = require('open');

if (!process.env.DOCS_PATH) {
    console.error("Please supply DOCS_PATH in .env");
    exit(1);
}

if (!process.env.MEDIADIR) {
    console.error("Please run: MEDIADIR=<folder-name> npm run compare");
    exit(1);
}

var sourcerepo = `${process.env.DOCS_PATH}/media/${process.env.MEDIADIR}`;;
var outputdir = `${process.env.PWD}/screenshots/${process.env.MEDIADIR}`;
var gifdirname = 'compare_gifs'
if (!fs.existsSync(sourcerepo)) {
    console.error(`Directory '${sourcerepo}' not found.`);
    exit(1);
} else {
    console.log(`Repo image directory: '${sourcerepo}'`)
}

if (!fs.existsSync(outputdir)) {
    console.error(`Directory '${outputdir}' not found.`);
    exit(1);
} else {
    console.log(`Test output directory: '${outputdir}'`)
}

async function generateResult(tr, file1, file2) {

    try {
        if(file1 && file2) {
            const filename = path.basename(file1);
            const jimp1 = await Jimp.read(file1);
            const jimp2 = await Jimp.read(file2);
            const diff = Jimp.diff(jimp1, jimp2).percent;
            const distance = Jimp.distance(jimp1, jimp2);
            try {
                await spawn('magick', ['-delay', '50', file1, file2, '-loop', '0', `${outputdir}/${gifdirname}/${filename}.gif`]);
            } catch (e) {
                console.log(e.stderr.toString());
            }
    
            tr.append(`<td style="width: 10%;">${filename}</td>`);
            tr.append(`<td class="text-center" style="width: 30%;"><img src="${file1}" class="img-fluid" alt=""></td>`);
            tr.append(`<td class="text-center" style="width: 30%;"><img src="${file2}" class="img-fluid" alt=""></td>`);
            tr.append(`<td class="text-center" style="width: 20%;"><img src="${outputdir}/${gifdirname}/${filename}.gif" class="img-fluid" alt=""></td>`);
            tr.append(`<td class="table-success text-center" style="width: 10%;">${diff}</td>`);
            // tr.append(`<td class="table-success text-center" style="width: 10%;">${distance}</td>`);
        } 
        else if (file1) {
            tr.append(`<td style="width: 10%;">${path.basename(file1)}</td>`);
            tr.append(`<td class="text-center" style="width: 30%;"><img src="${file1}" class="img-fluid" alt=""></td>`);
            tr.append(`<td class="text-center" style="width: 30%;"></td>`);
            tr.append(`<td class="text-center" style="width: 20%;"></td>`);
            tr.append(`<td class="text-center" style="width: 10%;"></td>`);
            // tr.append(`<td class="text-center" style="width: 10%;"></td>`);
        }
        else if (file2) {
            tr.append(`<td style="width: 10%;">${path.basename(file2)}</td>`);
            tr.append(`<td class="text-center" style="width: 30%;"></td>`);
            tr.append(`<td class="text-center" style="width: 30%;"><img src="${file2}" class="img-fluid" alt=""></td>`);
            tr.append(`<td class="text-center" style="width: 20%;"></td>`);
            tr.append(`<td class="text-center" style="width: 10%;"></td>`);
            // tr.append(`<td class="text-center" style="width: 10%;"></td>`);
        } else {
            console.log('abnormal state');
            process.exit(1);
        }    
    } catch (e) {
        console.log('Exception:' + e);
    }
}

const $ = cheerio.load('');
$('head').append('<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/5.1.3/css/bootstrap.min.css"/>');
$('head').append('<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/v/bs5/jq-3.6.0/dt-1.12.1/b-2.2.3/b-colvis-2.2.3/cr-1.5.6/sl-1.4.0/datatables.min.css"/>');
$('head').append('<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/5.1.3/js/bootstrap.bundle.min.js"></script>');
$('head').append('<script type="text/javascript" src="https://cdn.datatables.net/v/bs5/jq-3.6.0/dt-1.12.1/b-2.2.3/b-colvis-2.2.3/cr-1.5.6/sl-1.4.0/datatables.min.js"></script>');
$('head').append(`<script type="text/javascript" class="init">$(document).ready(function () { $('#sortTable').DataTable({
    "pageLength": 50,
    select: {
        style: 'multi'
    },
    dom: 'BRlfrtip',
    buttons: ['copy','csv'],
    }); });</script>`);
$('body').append('<table id="sortTable" class="table table-hover"></table>');
$('table').append('<thead class="thead-dark"></thead>');
$('thead').append('<tr></tr>');
$('tr').append('<th>Filename</th>');
$('tr').append('<th>From Script</th>');
$('tr').append('<th>From Repo</th>');
$('tr').append('<th>Compare GIF</th>');
$('tr').append('<th>diff%</th>');
$('tr').append('<th>distance</th>');
$('table').append('<tbody></tbody>');

var promises = [];

try {
    const options = { compareSize: false, compareContent: false, compareDate: false, skipSubdirs: true};
    var res = compareSync(outputdir, sourcerepo, options);    
    if (res.diffSet.length > 0) {
        const dir = `${outputdir}/${gifdirname}`;
        if (fs.existsSync(dir)){
            fs.rmSync(dir, { recursive: true, force: true });
        }
        fs.mkdirSync(dir);
    }

    res.diffSet.forEach(dif => {

        $('tbody').append('<tr></tr>');
        const tr = $('tbody > tr:last-child').first();
        promises.push(generateResult(
            tr, 
            dif.path1 ? `${dif.path1}/${dif.name1}` : undefined, 
            dif.path2 ? `${dif.path2}/${dif.name2}` : undefined, 
        ));
    });    
} catch (e) {
    console.log('Exception: ' + e);
}

Promise.all(promises).then(() => {
    fs.writeFile('test.html', $.html(), function (err) {
        if (err) {
          return console.log(err);
        }
    });
    open('test.html', {app: {name: 'Google Chrome'}});
}).catch(res => {
    console.log("Exception: " + res);
    process.exit(1);
});
