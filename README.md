WIP
# DSTS Save Converter

> **Note**: This is a "vibe coded" project, created dynamically through an AI pair programming session.

This application converts save files for Digimon Story: Time Stranger between the PC (Steam) and Nintendo Switch versions.

**⚠️ IMPORTANT WARNING ⚠️**  
PC to Switch save conversion is **untested** because not all DLC has been released for the Switch version of the game yet. Please proceed with caution and always back up your original saves!

## How to Use

Launch the application (run the executable, or `npm start` from source). The app walks you through three steps and explains each field on screen.

1. **Choose a direction**
   - **Switch ➔ PC**: continue your Switch game on Steam.
   - **PC ➔ Switch** *(untested)*: continue your Steam game on Switch.
2. **Choose your files**

   | Field | Switch ➔ PC | PC ➔ Switch |
   |---|---|---|
   | Input folder | Your JKSV backup folder for the game (if the backup is a ZIP, extract it first) | The game's `gamedata\savedata` folder on PC, or a copy of it |
   | Original Switch backup ZIP | Not needed | An unmodified JKSV ZIP backup of the game from your Switch, used as a template |
   | Output folder | An empty folder for the converted PC saves | Where `DSTS_Switch_Converted.zip` is created |

   After you pick the input folder, the app shows which save files it found. It looks for `0000.bin`-style saves and `slot_0000.bin`-style slot files directly inside the folder; subfolders are not searched.
3. **Convert and install**
   - **Switch ➔ PC**: back up the game's existing `gamedata\savedata` folder, then copy the converted files into it.
   - **PC ➔ Switch**: copy `DSTS_Switch_Converted.zip` to `sd:/JKSV/Digimon Story Time Stranger/` on your SD card and restore it with JKSV.

### Where are my saves?

- **PC (Steam)**: in Steam, right-click the game ➔ *Manage* ➔ *Browse local files*, then open `gamedata\savedata`. Typically:
  `C:\Program Files (x86)\Steam\steamapps\common\Digimon Story Time Stranger\gamedata\savedata`
- **Nintendo Switch**: back up the game with the [JKSV](https://github.com/J-D-K/JKSV) homebrew app. Backups are stored at `sd:/JKSV/Digimon Story Time Stranger/<backup name>/`. To get a ZIP backup (needed as the template for PC ➔ Switch), enable *Export to ZIP* in JKSV's settings before backing up.

Close the game before copying save files.

## Build from Source

You need [Node.js](https://nodejs.org/) installed.

### Setup
1. Clone or download this repository.
2. Open a terminal in the project directory.
3. Install the dependencies:
   ```bash
   npm install
   ```

### Running Locally
To start the app without building:
```bash
npm start
```

### Building Executables
To build standalone executables for Windows and Linux:
```bash
npm run build
```

The compiled executables are generated in the `dist` folder.
