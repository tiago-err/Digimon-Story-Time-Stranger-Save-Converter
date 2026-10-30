let inputFolder = null;
let outputFolder = null;
let templateZip = null;

const btnInput = document.getElementById('btn-input');
const btnOutput = document.getElementById('btn-output');
const btnTemplate = document.getElementById('btn-template');
const btnConvert = document.getElementById('btn-convert');
const btnOpenOutput = document.getElementById('btn-open-output');
const pathInput = document.getElementById('input-path');
const pathOutput = document.getElementById('output-path');
const pathTemplate = document.getElementById('template-path');
const inputLabel = document.getElementById('input-label');
const inputHint = document.getElementById('input-hint');
const inputScan = document.getElementById('input-scan');
const outputHint = document.getElementById('output-hint');
const afterSteps = document.getElementById('after-steps');
const statusMessage = document.getElementById('status-message');
const templateSection = document.getElementById('template-zip-section');

// Direction-specific help text (HTML, static, no user input)
const GUIDE = {
  'switch-to-pc': {
    inputLabel: 'Switch save folder (JKSV backup)',
    inputHint: 'The JKSV backup folder for this game, e.g. <code>sd:/JKSV/Digimon Story Time Stranger/&lt;backup name&gt;/</code>, copied from your SD card. If your backup is a ZIP, extract it first and pick the extracted folder.',
    outputHint: 'Pick an empty folder. The converted PC saves are written here, so you can review them before installing.',
    afterSteps: [
      'Click <strong>Convert Saves</strong>.',
      'Back up the game\'s existing <code>gamedata\\savedata</code> folder on PC (see "Where do I find my saves?" below).',
      'Copy the converted files from the output folder into <code>gamedata\\savedata</code>, replacing existing files.',
      'Launch the game on Steam and load your save.'
    ]
  },
  'pc-to-switch': {
    inputLabel: 'PC save folder',
    inputHint: 'The game\'s <code>gamedata\\savedata</code> folder on PC (Steam ➔ right-click the game ➔ Manage ➔ Browse local files), or a copy of it.',
    outputHint: 'Where <code>DSTS_Switch_Converted.zip</code> is created. Your template ZIP is not modified.',
    afterSteps: [
      'Click <strong>Convert Saves</strong>.',
      'Copy <code>DSTS_Switch_Converted.zip</code> to <code>sd:/JKSV/Digimon Story Time Stranger/</code> on your SD card.',
      'Open JKSV on the Switch, select the converted backup for this game, and restore it.',
      'Launch the game and load your save. This direction is untested, so keep your original backup.'
    ]
  }
};

function getDirection() {
  return document.querySelector('input[name="direction"]:checked').value;
}

function renderGuide() {
  const direction = getDirection();
  const guide = GUIDE[direction];
  inputLabel.textContent = guide.inputLabel;
  inputHint.innerHTML = guide.inputHint;
  outputHint.innerHTML = guide.outputHint;
  afterSteps.innerHTML = guide.afterSteps.map(s => `<li>${s}</li>`).join('');
  templateSection.hidden = direction !== 'pc-to-switch';
  checkReady();
}

function checkReady() {
  const ready = inputFolder && outputFolder && (getDirection() !== 'pc-to-switch' || templateZip);
  btnConvert.disabled = !ready;
}

function setPath(el, value) {
  el.textContent = value;
  el.title = value;
  el.classList.add('selected');
}

// Tell the user right away whether the folder they picked contains saves
async function scanInput() {
  const { mainFiles, slotFiles } = await window.api.scanFolder(inputFolder);
  const found = [...mainFiles, ...slotFiles];
  if (found.length === 0) {
    inputScan.textContent = 'No save files found here. Expected files like 0000.bin and slot_0000.bin directly in this folder.';
    inputScan.className = 'scan error';
  } else {
    inputScan.textContent = `Found ${mainFiles.length} save file(s) and ${slotFiles.length} slot file(s): ${found.join(', ')}`;
    inputScan.className = 'scan success';
  }
}

document.querySelectorAll('input[name="direction"]').forEach(radio => {
  radio.addEventListener('change', renderGuide);
});

btnInput.addEventListener('click', async () => {
  const folder = await window.api.selectFolder();
  if (folder) {
    inputFolder = folder;
    setPath(pathInput, folder);
    await scanInput();
    checkReady();
  }
});

btnOutput.addEventListener('click', async () => {
  const folder = await window.api.selectFolder();
  if (folder) {
    outputFolder = folder;
    setPath(pathOutput, folder);
    checkReady();
  }
});

btnTemplate.addEventListener('click', async () => {
  const file = await window.api.selectZip();
  if (file) {
    templateZip = file;
    setPath(pathTemplate, file);
    checkReady();
  }
});

btnOpenOutput.addEventListener('click', () => window.api.openFolder(outputFolder));

btnConvert.addEventListener('click', async () => {
  btnConvert.disabled = true;
  btnConvert.textContent = 'Converting...';
  btnOpenOutput.hidden = true;
  statusMessage.textContent = '';
  statusMessage.className = 'status-message';

  const result = await window.api.convert({
    inputFolder,
    outputFolder,
    templateZip,
    direction: getDirection()
  });

  if (result.success) {
    statusMessage.textContent = `Done! Converted ${result.processed} file(s). ${result.message || 'Now copy them into the game\'s savedata folder.'}`;
    statusMessage.classList.add('success');
    btnOpenOutput.hidden = false;
  } else {
    statusMessage.textContent = 'Error: ' + result.error;
    statusMessage.classList.add('error');
  }

  btnConvert.textContent = 'Convert Saves';
  checkReady();
});

renderGuide();
