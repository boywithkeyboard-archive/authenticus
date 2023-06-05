import { copy, walk } from 'https://deno.land/std@0.190.0/fs/mod.ts'

await copy('./client', './cache')

for await (const { isFile, path } of walk('./cache')) {
  if (!isFile)
    continue

  const content = await Deno.readTextFile(path)

  await Deno.writeTextFile(path, content.replaceAll('.ts', ''))
}

await Deno.writeTextFile('./cache/package.json', (await Deno.readTextFile('./cache/package.json')).replace('"version": "0.0.0"', `"version": "${Deno.env.get('VERSION')?.slice(1)}"`))
