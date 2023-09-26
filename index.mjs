#!/usr/bin/env node

import {spawn} from 'node:child_process'
import {Client, REST, SlashCommandBuilder} from 'discord.js'

let appid = '1156246056019968020'
let token = 'MTE1NjI0NjA1NjAxOTk2ODAyMA.GdLQEj._d' + '_3MSknHdJSmqMhhcvYjUjj29A9t_FYYf0xXQ'

let commands = {
    echo: '/usr/bin/echo',
    outfield: '/root/outfield/index.mjs',
}

let slashcommand = new SlashCommandBuilder()
.setName('sudo')
.setDescription('sudo')
.addStringOption(function (option) {
    option
    .setName('command')
    .setDescription('command')
    .setRequired(true)
    for (let command of Object.keys(commands)) {
        option.addChoices({name: command, value: command})
    }
    return option
})
.addStringOption(function (option) {
    option
    .setName('arguments')
    .setDescription('arguments')
    return option
})

let rest = new REST().setToken(token)
await rest.put(`/applications/${appid}/commands`, {body: [slashcommand]})

let discord = new Client({intents: 1})
discord.login(token)

discord.on('ready', function (client) {
    client.user.setPresence({activities: [{type: 3, name: '/sudo'}]})
    console.info(new Date (), client.user.tag, 'ready!')
})

discord.on('interactionCreate', async function (interaction) {
    if (!interaction.isChatInputCommand()) return
    let cmd = interaction.options.getString('command')
    let args = interaction.options.getString('arguments')
    if (!commands[cmd]) return

    let child
    try {
        child = spawn(commands[cmd], args?.split(' '))
    } catch (error) {
        console.error(error)
        return
    }

    let stdout = ''
    for await (let chunk of child.stderr) stdout += chunk
    for await (let chunk of child.stdout) stdout += chunk

    let reply = '`'
    reply += `$ ${cmd}`
    if (args !== null) reply += ` ${args}`
    reply += '`'
    if (stdout !== '') reply += '\n```' + stdout + '```'

    await interaction.reply(reply)
})