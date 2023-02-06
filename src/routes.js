import {randomUUID} from 'node:crypto'

import { Database } from './database.js'
import {buildRoutePath} from './utils/build-route-path.js'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req,res)=>{
      const {search} = req.query

      const tasks = database.select('tasks', search ? {
        title: search,
        description: search
      } : null)

      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res)=>{
      const {title, description} = req.body;

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      }

      database.insert('tasks', task)

      return res.writeHead(201).end()
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req,res)=>{
      const {id} = req.params
      const {title, description} = req.body

      const checkIfTaskExist = database.selectById('tasks', id)

      if(!checkIfTaskExist){
        return res.writeHead(404).end('Task not found')
      }

      database.update('tasks', id,{
        ...checkIfTaskExist,
        updated_at: new Date(),
        title: title ?? checkIfTaskExist.title,
        description: description ?? checkIfTaskExist.description
      })

      return res.writeHead(204).end()
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler:(req, res)=>{
      const {id} = req.params

      const checkIfTaskExist = database.selectById('tasks', id)

      if(!checkIfTaskExist){
        return res.writeHead(404).end('Task not found')
      }

      database.delete('tasks', id)

      return res.writeHead(204).end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res)=>{
      const {id} = req.params

      const checkIfTaskExist = database.selectById('tasks', id)

      if(!checkIfTaskExist){
        return res.writeHead(404).end('Task not found')
      }

      database.update('tasks', id, {
        ...checkIfTaskExist, 
        updated_at: new Date(), 
        completed_at: new Date()
      })

      return res.writeHead(204).end()
    }
  }
]