const fs = require('fs');
const join = require('path').join;

const INPUT_PATH = join(__dirname, '/input/');
const OUTPUT_PATH = join(__dirname, '/output/');

try {
  if (!fs.existsSync(INPUT_PATH)){
    fs.mkdirSync(INPUT_PATH);
  }
  if (!fs.existsSync(OUTPUT_PATH)){
    fs.mkdirSync(OUTPUT_PATH);
  }
} catch(err) {
  console.log(err);
}

const Helper = require('dxf').Helper;

fs.readdirSync(INPUT_PATH).forEach(file => {
  const filenameDXF = file;
  const filenameSVG = filenameDXF.substring(
    0, filenameDXF.length - 4) + '.svg';
  console.log(`Processing file: ${filenameDXF} ...`);
  // console.log(join(INPUT_PATH, filenameDXF));
  const helper = new Helper(fs.readFileSync(join(INPUT_PATH, filenameDXF), 'utf-8'));
    
  // The parsed entities
  const { blocks, entities } = helper.parsed
  console.log(`parsed: ${blocks.length} blocks, ${entities.length} entities`)

  // Denormalised blocks inserted with transforms applied
  console.log(`denormalised: ${helper.denormalised.length} entities`)

  // Group entities by layer. Returns an object with layer names as
  // keys to arrays of entities.
  const groups = helper.groups
  console.log('grouped entities:')
  Object.keys(groups).forEach(layer => {
    console.log(`${layer}: ${groups[layer].length}`)
  })
  
  // Write the SVG
  const svg = helper.toSVG()
  fs.writeFileSync(join(OUTPUT_PATH, filenameSVG), svg, 'utf-8')
  console.log('SVG written!\n')
});
