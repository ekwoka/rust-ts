import { exec } from 'child_process';
import { readFile } from 'fs/promises';

const execShellCommand = (cmd) =>
  new Promise((res) =>
    exec(cmd, (_, stdout, stderr) => res(stdout ? stdout : stderr))
  );

const npmVersion = (
  await execShellCommand('npm info @ekwoka/spotify-api version')
).trim();
const ourPackage = JSON.parse(await readFile('package.json', 'utf8'));
const localVersion = ourPackage.version;

const isOutdated = npmVersion !== localVersion;
if (isOutdated) console.log(true);
