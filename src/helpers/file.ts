import * as fs from 'node:fs'
import path = require('path');
import {GenerateOption} from '../commands/generate'

const ROOT_DIR = path.join(__dirname, '..', '..')
const TEMPLATE_DIR =
  process.env.NODE_ENV === 'development' ? 'skeleton' : 'dist/skeleton'
const TEMPLATE_PATH = path.join(ROOT_DIR, TEMPLATE_DIR)

const getTargetPath = (file: string, options: GenerateOption): string => {
  const {projectName} = options
  const targetPath = path.join(process.cwd(), projectName)

  return path.join(targetPath, file)
}

const appendToFile = (
  target: string,
  content: string,
  options: GenerateOption,
): void => {
  const targetPath = getTargetPath(target, options)

  fs.appendFileSync(targetPath, content)
}

const copyFile = (
  source: string,
  target: string,
  options: GenerateOption,
): void => {
  const sourcePath = path.join(TEMPLATE_PATH, source)
  const targetPath = getTargetPath(target, options)
  const targetDir = path.dirname(targetPath)
  const targetExists = fs.existsSync(targetPath)
  if (!targetExists) {
    fs.mkdirSync(targetDir, {recursive: true})
  }

  fs.copyFileSync(sourcePath, targetPath)
}

const copyDir = (
  source: string,
  target: string,
  options: GenerateOption,
): void => {
  const sourcePath = path.join(TEMPLATE_PATH, source)
  const targetPath = getTargetPath(target, options)
  const targetExists = fs.existsSync(targetPath)
  if (!targetExists) {
    fs.mkdirSync(targetPath, {recursive: true})
  }

  const files = fs.readdirSync(sourcePath)
  for (const file of files) {
    const sourceFile = path.join(source, file)
    const targetFile = path.join(target, file)
    if (fs.lstatSync(path.join(TEMPLATE_PATH, sourceFile)).isDirectory()) {
      copyDir(sourceFile, targetFile, options)
    } else {
      copyFile(sourceFile, targetFile, options)
    }
  }
}

const createFile = (
  target: string,
  content: string,
  options: GenerateOption,
): void => {
  const targetPath = getTargetPath(target, options)
  const targetExists = fs.existsSync(targetPath)

  if (!targetExists) {
    fs.writeFileSync(targetPath, content)
  }
}

const deleteFile = (target: string, options: GenerateOption): void => {
  const targetPath = getTargetPath(target, options)
  const targetExists = fs.existsSync(targetPath)

  if (targetExists) {
    fs.unlinkSync(targetPath)
  }
}

const deleteDir = (target: string, options: GenerateOption): void => {
  const targetPath = getTargetPath(target, options)
  const targetExists = fs.existsSync(targetPath)

  if (targetExists) {
    fs.rmdirSync(targetPath, {recursive: true})
  }
}

interface InjectToFileOptions {
  options?: GenerateOption;
  insertBefore?: string;
  insertAfter?: string;
}

const injectToFile = (
  target: string,
  content: string,
  {insertBefore = '', insertAfter = '', options}: InjectToFileOptions = {},
): void => {
  const targetPath = options ? getTargetPath(target, options) : target

  const data = fs.readFileSync(targetPath, 'utf8')
  const lines = data.toString().split('\n')

  if (insertBefore) {
    const index = lines.findIndex(line => line.includes(insertBefore))
    if (index !== -1) {
      lines.splice(index, 0, content)
    }
  }

  if (insertAfter) {
    const index = lines.findIndex(line => line.includes(insertAfter))
    if (index !== -1) {
      lines.splice(index + 1, 0, content)
    }
  }

  const newContent = lines.join('\n')
  fs.writeFileSync(targetPath, newContent)
}

const renameFile = (
  source: string,
  target: string,
  options: GenerateOption,
): void => {
  const sourcePath = getTargetPath(source, options)
  const targetPath = getTargetPath(target, options)
  fs.renameSync(sourcePath, targetPath)
}

export {
  appendToFile,
  copyDir,
  copyFile,
  deleteDir,
  deleteFile,
  createFile,
  injectToFile,
  renameFile,
}
