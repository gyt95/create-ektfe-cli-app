#!/usr/bin/env node

import consola from 'consola'
import inquirer from 'inquirer'
import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'
import glob from 'fast-glob'
import color from 'picocolors'
import boxen, { Options } from 'boxen'
import gradientString from 'gradient-string'

const cwd = process.cwd()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface Inputs {
  title: string
  platformName: string
  projectName: string
  htmlName: string
  viewName: string
  viewTitle: string
}

async function run() {
  const welcomeMessage = gradientString('cyan', 'magenta').multiline(
    ['Hello! 欢迎使用EKTFE脚手架~', '😀🎉🚀'].join('')
  )

  const boxenOptions: Options = {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: 'cyan',
    backgroundColor: '#000',
  }

  console.log(boxen(welcomeMessage, boxenOptions))

  // 问答环节开始
  const { title } = await inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: '新项目标题叫什么？如：食材计划',
    },
  ])

  if (!title) return

  // 获取当前所有目录名称，过滤掉特殊目录如 dist node_modules 等，动态生成选项数组
  const currentPlatforms = []
  const currentDirFiles = fs.readdirSync(cwd, { withFileTypes: true })
  const BAN = ['packages', 'dist', 'node_modules']
  currentDirFiles.forEach(file => {
    if (
      file.isDirectory() &&
      !file.name.startsWith('.') &&
      !BAN.includes(file.name)
    ) {
      currentPlatforms.push({
        name: file.name,
        value: file.name,
      })
    }
  })
  currentPlatforms.push({ name: '其它', value: 'others' })

  const { type } = await inquirer.prompt([
    {
      type: 'list',
      name: 'type',
      choices: currentPlatforms,
      message: '当前项目属于哪个平台的？请选择：',
    },
  ])

  if (!type) return

  let platformName = ''
  while (!platformName) {
    if (type === 'others') {
      const { newType } = await inquirer.prompt([
        {
          type: 'input',
          name: 'newType',
          message: '新平台的英文名称叫什么？',
        },
      ])

      const lastName = newType.toLowerCase()
      const allPlatformsName = currentPlatforms.map(v => v.value)

      if (BAN.includes(lastName)) {
        consola.error('不能填写以下名称：packages, dist, node_modules！重来！')
        continue
      } else if (
        allPlatformsName
          .slice(0, allPlatformsName.length - 1)
          .includes(lastName)
      ) {
        consola.error('这个名字已经存在！重来！')
        continue
      } else if (!lastName) {
        continue
      }
      consola.info(`正在为你创建新的平台目录 ${lastName}...`)
      consola.info(`为了统一命名规范，会自动转为小写...`)
      fs.ensureDir(lastName)
      platformName = lastName
    } else {
      platformName = type
    }
  }

  const { projectName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: '新项目的英文名称叫什么？如：food-plan',
    },
  ])

  if (!projectName) return

  const { viewName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'viewName',
      message: '新项目页面的首个模块的英文名称叫什么？如：CreateView',
    },
  ])
  const { viewTitle } = await inquirer.prompt([
    {
      type: 'input',
      name: 'viewTitle',
      message: '新项目页面的首个模块的中文名称叫什么？如：创建计划',
    },
  ])

  if (!projectName) return

  const htmlName = projectName.replace(/-/g, '')

  // 如果是已有平台里创建新的版块，则检测重名
  const json = fs.readFileSync('data.json', 'utf-8') // 直接用 fs.readFileSync
  const { PORT } = JSON.parse(json)
  console.log(platformName)
  if (type !== 'others') {
    try {
      if (PORT[type][htmlName]) {
        consola.error(`创建失败！当前所选择的 ${type} 平台存在同名的 html 名称`)
      } else {
        const currentMaxPort = Math.max(
          ...(Object.values(PORT[type]) as number[])
        )
        PORT[type][htmlName] = currentMaxPort + 2
        fs.writeFileSync(
          'data.json',
          JSON.stringify(
            {
              PORT: PORT,
            },
            null,
            2
          )
        )
      }
    } catch (error) {
      consola.error('错误：', error)
    }
  } else {
    // 找到最后一个 key 的最后一个 value 的 PORT ，拼接后转 number
    let lastMaxPort = 0
    Object.keys(PORT).forEach(plaftform => {
      const max = Math.max(...(Object.values(PORT[plaftform]) as number[]))
      if (lastMaxPort < max) {
        lastMaxPort = max
      }
    })
    PORT[platformName] = {
      [htmlName]: Math.floor(lastMaxPort / 1000) * 1000 + 1000,
    }
    fs.writeFileSync(
      'data.json',
      JSON.stringify(
        {
          PORT: PORT,
        },
        null,
        2
      )
    )
  }

  // 进入 projectName 目录，检查 src 目录，进入
  const TEMPLATE_DIR = path.join(__dirname, '../template')
  const inputs = {
    title: title,
    platformName: platformName,
    projectName: projectName,
    htmlName: htmlName,
    platformCapitalized:
      platformName.charAt(0).toLocaleUpperCase() + platformName.slice(1),
    viewName: viewName || 'XxxView',
    viewTitle: viewTitle || '模块标题',
  }

  // 目标目录的路径 C:\xxx\next\nsft
  const outputDir = path.join(cwd, inputs.platformName, projectName)
  // 1.获取模板路径
  const templatePath = TEMPLATE_DIR.replace(/\\/g, '/')

  // 2.获取模板里的所有目录文件，模式匹配
  const templateFiles = glob.sync(
    path.join(templatePath, '**', '*').replace(/\\/g, '/'),
    {
      dot: true,
    }
  )

  // 3.遍历所有模板文件
  templateFiles.forEach(filePath => {
    // 去掉 .tpl 后缀，把当前文件路径替换为目标路径
    const outputPath = filePath
      .replace('.tpl', '')
      .replace(templatePath, outputDir)

    // 4.复制模板
    copyTpl(filePath, outputPath, outputDir, inputs)
  })

  if (inputs.viewName && inputs.viewName !== 'XxxView') {
    const oldPath = path.join(outputDir, 'src/containers/XxxView')
    const newViewPath = path.join(
      outputDir,
      'src/containers/' + inputs.viewName
    )
    fs.renameSync(oldPath, newViewPath)
  }

  // 初始化项目成功后提示
  end(inputs)
}

// 如果写成 let 或 const copyTpl = (...) => {...} 则由于暂时性死区而报错。要么就把函数提前，要么就在改为 function
function copyTpl(from: string, to: string, outputDir: string, args: Inputs) {
  // 4-5-1 复制文件
  fs.copySync(from, to)

  // 4-5-2 读取文件
  let content = fs.readFileSync(from, 'utf-8') // utf-8 是为了获取非 buffer 类型数据

  // 4-5-2 遍历，替换掉模板语法
  Object.keys(args).forEach(key => {
    // 在正则表达式中，'g'代表全局匹配模式，表示匹配字符串中所有符合条件的子串
    const reg = new RegExp(`<%= ${key} %>`, 'g')
    content = content.replace(reg, args[key as keyof Inputs])
  })

  // 4-5-3 写回到输出目录的对应文件
  fs.writeFileSync(to, content)

  // 4-5-4 动态改名
  if (path.basename(to) === 'template.html') {
    const newToPath = to.replace('template.html', `${args.htmlName}.html`)
    fs.renameSync(to, newToPath)
  }

  // 4-5-5 提示成功
  // 把目标路径的前面部分和平台分隔符去掉，剩下的就是文件名了
  const name = to.replace(outputDir + path.sep, '')
  consola.success(`${color.green('创建')} ${name}`)
}

function end(inputs: Inputs) {
  const { platformName, projectName } = inputs
  console.log()
  consola.success(
    `恭喜你成功在 ${color.yellow(platformName)} 创建 ${color.yellow(
      projectName
    )} 项目！`
  )
  consola.success(
    `尝试执行命令 ${color.yellow(
      `pnpm i && pnpm -F @${platformName}/${projectName} dev`
    )}`
  )
}

run().catch(e => {
  consola.error(e)
})
