import { copy, emptyDir, walk } from 'https://deno.land/std@0.193.0/fs/mod.ts'

await emptyDir('out')

await copy('presets', 'out/presets')

await Deno.copyFile('readme.md', 'out/readme.md')
await Deno.copyFile('license', 'out/license')
await Deno.copyFile('package.json', 'out/package.json')

await Deno.copyFile('_utils.ts', 'out/_utils.ts')
await Deno.copyFile('createAuthorizeUrl.ts', 'out/createAuthorizeUrl.ts')
await Deno.copyFile('createPreset.ts', 'out/createPreset.ts')
await Deno.copyFile('getNormalizedUser.ts', 'out/getNormalizedUser.ts')
await Deno.copyFile('getToken.ts', 'out/getToken.ts')
await Deno.copyFile('getUser.ts', 'out/getUser.ts')
await Deno.copyFile('mod.ts', 'out/mod.ts')
await Deno.copyFile('preset.ts', 'out/preset.ts')
await Deno.copyFile('refreshToken.ts', 'out/refreshToken.ts')

for await (const { isFile, path } of walk('out')) {
  if (!isFile) {
    continue
  }

  const content = await Deno.readTextFile(path)

  await Deno.writeTextFile(path, content.replaceAll('.ts', ''))
}

await Deno.writeTextFile(
  'out/package.json',
  (await Deno.readTextFile('out/package.json')).replace(
    '"version": "0.0.0"',
    `"version": "${Deno.env.get('VERSION')?.slice(1)}"`,
  ),
)
