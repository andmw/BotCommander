import Orchestrator from 'uipath-orchestrator'
import { Exception } from '../../lib/Exception'
import { UiPathArgument, UiPathBotInfo } from '../models/types'
import { UiPathJobInfo } from '../models/UiPathJob'

export default class UiPathAPI {
  findJob (jobKey: string): object | PromiseLike<object> {
    throw new Error(`Method not implemented on yet - Jobkey ${jobKey}`)
  }

  api: Orchestrator

  constructor (source: object) {
    this.api = new Orchestrator(source)
  }

  async start (startData: object) {
    return new Promise((resolve, reject) => {
      const url = '/odata/Jobs/UiPath.Server.Configuration.OData.StartJobs'
      this.api.post(url, startData, (err: Error, data: any) => {
        if (err) {
          return reject(err)
        }
        resolve(data)
      })
    })
  }

  async status (jobId: string): Promise<UiPathJobInfo> {
    return new Promise((resolve, reject) => {
      const url = '/odata/Jobs'
      const query = {
        $filter: `Id eq ${jobId}`,
      }
      this.api.get(url, query, (err: Error, data: {value: any[]}) => {
        if (err) {
          return reject(err)
        }
        if (data.value && data.value.length > 0) {
          resolve(data.value[0])
        } else {
          reject(new Exception('No Results', { _result: data }))
        }
      })
    })
  }

  async findByProcessKey (processKey: string): Promise<UiPathBotInfo> {
    return new Promise((resolve, reject) => {
      const url = '/odata/Releases'
      const query = {
        $filter: `ProcessKey eq '${processKey}'`,
      }
      this.api.get(url, query, (err: Error, data: {value: any[]}) => {
        if (err) {
          return reject(err)
        }
        if (data.value && data.value.length > 0) {
          resolve(data.value[0])
        } else {
          reject(new Exception('No Results', { _result: data }))
        }
      })
    })
  }
}

export function deserializeArguments (args: string): UiPathArgument[] {
  const argsObj = JSON.parse(args)
  for (const argument of argsObj) {
    if (/^System.Int32/.test(argument.type)) {
      argument.type = 'integer'
    } else if (/^System.String/.test(argument.type)) {
      argument.type = 'string'
    }
  }
  return argsObj
}
